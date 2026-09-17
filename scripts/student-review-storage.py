"""Native-browser storage isolation checks. Uses only synthetic values on localhost."""
import argparse
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--browser',choices=['chromium','webkit'],required=True)
parser.add_argument('--url',default='http://127.0.0.1:8765')
parser.add_argument('--out',default='student-audit-evidence')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'browser':args.browser,'revision':os.environ.get('PR_HEAD_SHA','local'),'cases':[],'errors':[]}
with sync_playwright() as pw:
    browser=getattr(pw,args.browser).launch()
    for denied in [False,True]:
        context=browser.new_context()
        if denied:
            context.add_init_script("for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException('Isolated test: denied','SecurityError');}});")
        else:
            context.add_init_script("for(const s of [localStorage,sessionStorage]){s.setItem('tb-adaptive-cssbb','synthetic legacy answer');s.setItem('audit-account-token','synthetic token');s.setItem('audit-theme','dark');}")
        page=context.new_page()
        page.on('pageerror',lambda error:report['errors'].append(str(error)))
        page.route('**/storage-audit',lambda route:route.fulfill(content_type='text/html',body='<!doctype html><html><head><script src="/test-bank-memory-learning.js"></script></head><body>Isolated storage assessment</body></html>'))
        page.goto(args.url+'/storage-audit')
        try:
            assert page.evaluate('()=>__TB_MEMORY_ONLY && __TBLearning.memoryOnly')
            if denied:
                assert page.evaluate("()=>__TBVersions.classify({options:['A','B'],answer:1},1)")=='correct'
            else:
                result=page.evaluate("""()=>[localStorage,sessionStorage].map(s=>{
                  const legacyCleared=!Object.keys(s).includes('tb-adaptive-cssbb');
                  const preserved=s.getItem('audit-account-token')==='synthetic token'&&s.getItem('audit-theme')==='dark';
                  for(const key of ['tb-attempt','test-bank-review','upskill-test-bank-progress'])s.setItem(key,'must not persist');
                  const leaked=Object.keys(s).filter(k=>/^(tb-|test-bank|upskill-test-bank)/i.test(k));
                  s.setItem('audit-theme','light');const updated=s.getItem('audit-theme')==='light';
                  s.removeItem('audit-account-token');const removed=s.getItem('audit-account-token')===null;
                  return {legacyCleared,preserved,leaked,updated,removed};
                })""")
                for entry in result:
                    assert entry['legacyCleared'] and entry['preserved'] and entry['updated'] and entry['removed'] and not entry['leaked'],entry
            assert not report['errors'],report['errors']
            report['cases'].append({'name':'denied-storage-scoring' if denied else 'native-storage-isolation','result':'PASS'})
        except Exception as error:
            report['cases'].append({'name':'denied-storage-scoring' if denied else 'native-storage-isolation','result':'FAIL','error':str(error)})
        finally:
            context.close()
    browser.close()
report['passed']=sum(c['result']=='PASS' for c in report['cases']);report['failed']=len(report['cases'])-report['passed']
(out/'storage-assessment.json').write_text(json.dumps(report,indent=2))
print('STORAGE_AUDIT_SUMMARY '+json.dumps(report),flush=True)
raise SystemExit(1 if report['failed'] else 0)
