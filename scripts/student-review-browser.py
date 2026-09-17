"""Independent student-perspective browser acceptance checks, never real account data.
Run against scripts/student-review-server.mjs. Authentication uses an isolated
premium fixture; exam, scoring, feedback, content renderers and storage are real.
"""
import argparse
import json
import os
import time
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

AUTH = """(() => {
 const user={id:'student-audit-fixture',email:'student@example.invalid',user_metadata:{display_name:'Student assessment'}};
 const profile={user_id:user.id,display_name:'Student assessment',onboarding_completed:true};
 const readQuery={select(){return this},eq(){return this},in(){return this},order(){return this},limit(){return this},
   maybeSingle:async()=>({data:profile,error:null}),single:async()=>({data:profile,error:null}),
   then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};
 window.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>{fn(user);return ()=>{};},
   getClient:()=>({rpc:async(name)=>{if(name!=='can_access_content')throw Error('Unexpected account RPC: '+name);return {data:true,error:null}},
   from:()=>Object.create(readQuery)})};
})();"""
PREPARE = """() => {
 const s=__TB.getFeedbackSnapshot();
 if(s.records.length<4)throw Error('Expected at least four actual bank questions');
 s.records.forEach((r,i)=>{
   document.querySelector(`[data-goto="${i}"]`).click();
   if(i!==3)document.querySelector(`[data-opt="${i===1||i===2?(r.question.answer+1)%r.question.options.length:r.question.answer}"]`).click();
   if(i===0||i===1)document.querySelector('[data-flag]').click();
 });
 return s;
}"""

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--url',default='http://127.0.0.1:8765/test-bank')
    parser.add_argument('--browser',choices=['chromium','webkit'],default='chromium')
    parser.add_argument('--executable')
    parser.add_argument('--out',default='student-audit-evidence')
    args=parser.parse_args()
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    report={'browser':args.browser,'revision':os.environ.get('PR_HEAD_SHA','local'),
            'basis':'Exact edge-delivered repository page; synthetic premium authorization; no real accounts',
            'cases':[],'errors':[],'network_writes':[]}
    origin=urlparse(args.url).netloc
    with sync_playwright() as pw:
        launch={'headless':True}
        if args.executable:launch['executable_path']=args.executable
        browser=getattr(pw,args.browser).launch(**launch)
        context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1)
        def route(request_route):
            req=request_route.request
            if req.method not in ['GET','HEAD']:
                report['network_writes'].append({'method':req.method,'url':req.url});request_route.abort();return
            if urlparse(req.url).path=='/auth.js':
                request_route.fulfill(content_type='application/javascript',body=AUTH);return
            if urlparse(req.url).netloc!=origin:request_route.abort();return
            request_route.continue_()
        context.route('**/*',route)
        page=context.new_page();page.set_default_timeout(8000)
        page.on('pageerror',lambda e:report['errors'].append(str(e)))
        page.goto(args.url,wait_until='domcontentloaded')
        page.wait_for_selector('body.auth-ready.access-ready')
        catalog=page.evaluate("()=>Object.entries(__TB.EXAMS).filter(([id,e])=>e.bank?.length).map(([id,e])=>({id,sets:Object.keys(e.sets||{1:e.bank})}))")
        assert sorted(e['id'] for e in catalog)==['cmq','cqe','cssbb','cssgb','mbb']
        report['catalog']=catalog
        def record(name,fn):
            start=time.monotonic()
            try:
                fn();assert not report['errors'],report['errors'];assert not report['network_writes'],report['network_writes']
                entry={'name':name,'result':'PASS'}
            except Exception as error:
                entry={'name':name,'result':'FAIL','error':str(error)}
                try:page.screenshot(path=str(out/(name.replace('/','-')+'-failure.png')),timeout=3000)
                except Exception:pass
            entry['seconds']=round(time.monotonic()-start,2);report['cases'].append(entry)
            print(json.dumps(entry),flush=True)
            (out/'student-assessment.json').write_text(json.dumps(report,indent=2))
        def select_exam(exam):
            if page.viewport_size['width']<=860:page.locator('#tb-mobile-cert-select').select_option(exam)
            else:page.locator(f'.tb-tile[data-exam="{exam}"]').click()
        def start(exam,bank,mode,timed):
            # The real results layout hides the certification rail. Return through
            # its native Back control before choosing the next independent case.
            back=page.locator('[data-back]')
            if back.count():back.click()
            elif page.locator('[data-backsim]').count():page.locator('[data-backsim]').click()
            select_exam(exam)
            sets=page.locator(f'[data-set="{bank}"]' if mode=='full' else f'[data-quiz-set-kind="{mode}"][data-quiz-set="{bank}"]')
            if sets.count():sets.click()
            if mode!='full':page.locator(f'[data-count="{mode}"][data-n="10"]').click()
            page.locator(f'[data-timing-kind="{mode}"][data-timed="{int(timed)}"]').click()
            page.locator(f'[data-mode="{mode}"]').click();expect(page.locator('.tb-quiz')).to_be_visible()
            expect(page.locator('#tb-feedback-loop')).to_have_count(0)
        def finish():
            page.locator('[data-goto]').last.click();page.locator('[data-submit]').click()
            expect(page.locator('#tb-feedback-loop')).to_have_count(1)
            expect(page.locator('#tb-feedback-loop')).to_be_visible()
        def no_overflow():
            result=page.evaluate("""()=>({width:innerWidth,doc:document.documentElement.scrollWidth,
              bad:[...document.querySelectorAll('#tb-feedback-loop,.tb-review-card')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)})""")
            assert result['doc']<=result['width']+2 and not result['bad'],result
        def storage_clean():
            keys=page.evaluate("()=>[...Object.keys(localStorage),...Object.keys(sessionStorage)].filter(k=>/^(tb-|test-bank|upskill-test-bank)/i.test(k))")
            assert not keys,keys
        def student_flow(exam,bank,mode,timed):
            page.set_viewport_size({'width':390 if timed else 1440,'height':900 if timed else 1000})
            page.evaluate('(theme)=>document.documentElement.dataset.theme=theme','dark' if timed else 'light')
            start(exam,bank,mode,timed);before=page.evaluate(PREPARE);total=len(before['records']);finish()
            assert before['setId']==bank, (exam,mode,bank,before['setId'])
            valid=page.evaluate("""({exam,bank,mode})=>{const e=__TB.EXAMS[exam],s=__TB.getFeedbackSnapshot();const rows=bank==='mix'?Object.values(e.sets||{1:e.bank}).flat():(e.sets?.[bank]||e.bank);const signature=q=>JSON.stringify([q.qid||q.id||null,q.stem,q.options]);const allowed=new Set(rows.map(signature));return s.records.every(r=>allowed.has(signature(r.question)));}""",{'exam':exam,'bank':bank,'mode':mode})
            assert valid, 'A delivered question is outside the selected test set'
            original=page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')
            score=page.locator('[data-score-result]').inner_text()
            assert f'({total-3}/{total})' in score,score
            page.locator('[data-open-review="all"]').click()
            expect(page.locator('.tb-review-card')).to_have_count(total)
            expect(page.locator('.tb-review-navcell')).to_have_count(total)
            no_overflow()
            for filt,n in [('incorrect',2),('unanswered',1),('correct',total-3),('flagged',2),('missed',3)]:
                page.locator(f'[data-review-tab="{filt}"]').click()
                expect(page.locator('.tb-review-card')).to_have_count(n)
                expect(page.locator(f'[data-review-tab="{filt}"]')).to_have_attribute('aria-pressed','true')
            page.locator('[data-review-goto="1"]').click()
            expect(page.locator('.tb-review-card')).to_have_count(1)
            expect(page.locator('.tb-review-option.is-wrong')).to_have_count(1)
            expect(page.locator('.tb-review-option.is-correct')).to_have_count(1)
            bounds=page.evaluate("()=>({card:document.querySelector('.tb-review-card').getBoundingClientRect().top,header:document.querySelector('header.site').getBoundingClientRect().bottom})")
            assert bounds['card']>=bounds['header']-1,bounds
            links=page.locator('.tb-review-card .tb-review-lesson')
            expect(links).to_have_count(1);expect(links).to_have_attribute('target','_blank')
            assert 'noopener' in links.get_attribute('rel')
            page.locator('[data-retry-missed]').click()
            expect(page.locator('[data-retry-check]')).to_be_disabled()
            expect(page.locator('.tb-retry-feedback')).to_have_count(0)
            for i,r in enumerate(before['records'][1:4]):
                q=r['question'];option=(q['answer']+1)%len(q['options']) if i==0 else q['answer']
                button=page.locator(f'[data-retry-opt="{option}"]');button.focus();page.keyboard.press('Space')
                expect(button).to_be_focused();expect(button).to_have_attribute('aria-pressed','true')
                page.locator('[data-retry-check]').focus();page.keyboard.press('Enter')
                expect(page.locator('.tb-retry-feedback')).to_be_focused()
                assert page.locator('[data-retry-opt]:not(:disabled)').count()==0
                page.locator('[data-retry-next]').click()
            assert '2 of 3' in page.locator('.tb-correction-count').inner_text()
            page.locator('[data-retry-remaining]').click();assert '1 of 1' in page.locator('.tb-retry-head').inner_text()
            page.locator(f'[data-retry-opt="{before["records"][1]["question"]["answer"]}"]').click()
            page.locator('[data-retry-check]').click();page.locator('[data-retry-next]').click()
            expect(page.locator('#tb-retry-panel h3')).to_have_text('All missed questions corrected.')
            page.locator('[data-retry-return]').click();expect(page.locator('.tb-review-card')).to_have_count(3)
            assert page.locator('[data-score-result]').inner_text()==score
            assert page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')==original
            storage_clean();page.locator('[data-back]').click();expect(page.locator('#tb-feedback-loop')).to_have_count(0)
        for exam in catalog:
            banks=exam['sets']+(['mix'] if len(exam['sets'])>1 else [])
            for bank in banks:
                for mode in ['full','quick','focus']:
                    for timed in [False,True]:
                        record(f'{exam["id"]}/set-{bank}/{mode}/{"timed" if timed else "untimed"}',
                               lambda e=exam['id'],s=bank,m=mode,t=timed:student_flow(e,s,m,t))
        def interactive():
            page.set_viewport_size({'width':390,'height':844});start('mbb','2','full',False)
            q=page.evaluate("""()=>{const s=__TB.getFeedbackSnapshot();const index=s.records.findIndex(r=>r.question.qid==='mbb:set-2:original-005');if(index<0)throw Error('Missing actual interactive item');s.records.forEach((r,i)=>{document.querySelector(`[data-goto="${i}"]`).click();if(i!==index)document.querySelector(`[data-opt="${r.question.answer}"]`).click();});return s.records[index].question;}""")
            finish();page.locator('[data-retry-missed]').click()
            slider=page.locator('#tb-retry-panel [data-tb-whatif]');expect(slider).to_have_count(1)
            slider.focus();page.keyboard.press('ArrowLeft');value=slider.input_value();assert value=='7',value
            page.evaluate("()=>window.auditSlider=document.querySelector('#tb-retry-panel [data-tb-whatif]')")
            choice=page.locator(f'[data-retry-opt="{q["answer"]}"]');choice.focus();page.keyboard.press('Space')
            assert slider.input_value()==value
            page.locator('[data-retry-check]').click();assert slider.input_value()==value
            assert page.evaluate("()=>auditSlider===document.querySelector('#tb-retry-panel [data-tb-whatif]')")
            expect(page.locator('.tb-review-rationales')).to_have_count(1)
            page.locator('.tb-review-rationales summary').focus();page.keyboard.press('Enter')
            expect(page.locator('.tb-review-rationales')).to_have_attribute('open','')
            authored=q['optionRationales']
            for i,text in (enumerate(authored) if isinstance(authored,list) else authored.items()):
                if int(i)!=q['answer']:assert text in page.locator('.tb-review-rationales').text_content()
            no_overflow();page.screenshot(path=str(out/'interactive-mobile.png'))
        record('interactive-slider-and-authored-rationales',interactive)
        def extremes():
            page.set_viewport_size({'width':1440,'height':1000});start('cssgb','1','quick',False)
            page.evaluate("()=>__TB.getFeedbackSnapshot().records.forEach((r,i)=>{document.querySelector(`[data-goto=\"${i}\"]`).click();document.querySelector(`[data-opt=\"${r.question.answer}\"]`).click();})")
            finish();expect(page.locator('[data-retry-missed]')).to_be_disabled()
            page.locator('[data-open-review="missed"]').click();expect(page.locator('.tb-review-empty')).to_be_visible()
            page.locator('[data-retake]').click();finish();page.locator('[data-open-review="all"]').click()
            n=page.evaluate('()=>__TB.getFeedbackSnapshot().records.length')
            expect(page.locator('.tb-review-card[data-review-status="unanswered"]')).to_have_count(n)
            page.reload(wait_until='domcontentloaded');page.wait_for_selector('body.access-ready');expect(page.locator('#tb-feedback-loop')).to_have_count(0);storage_clean()
        record('perfect-unanswered-retake-and-refresh',extremes)
        def expiry():
            start('cssbb','1','quick',True)
            page.evaluate('()=>{const now=Date.now;Date.now=()=>now()+100000000;}')
            page.wait_for_selector('#tb-feedback-loop',timeout=5000)
            assert 'Time expired' in page.locator('[data-score-result]').inner_text()
            page.locator('[data-open-review="all"]').click()
            expect(page.locator('.tb-review-card[data-review-status="unanswered"]')).to_have_count(10)
            storage_clean();page.reload(wait_until='domcontentloaded');page.wait_for_selector('body.access-ready')
        record('timer-expiry-opens-review',expiry)
        def layouts():
            start('mbb','3','full',False);finish();page.locator('[data-open-review="all"]').click()
            duplicates=page.evaluate("()=>{const a=[...document.querySelectorAll('#tb-feedback-loop [id]')].map(e=>e.id);return a.filter((id,i)=>a.indexOf(id)!==i)}")
            assert not duplicates,duplicates
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':900})
                for theme in ['light','dark']:
                    page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                    page.locator('[data-review-goto="0"]').click();no_overflow()
                    page.screenshot(path=str(out/f'review-{width}-{theme}.png'))
        record('rich-visuals-320-to-1440-light-and-dark',layouts)
        browser.close()
    report['passed']=sum(c['result']=='PASS' for c in report['cases']);report['failed']=len(report['cases'])-report['passed']
    (out/'student-assessment.json').write_text(json.dumps(report,indent=2))
    print('STUDENT_AUDIT_SUMMARY '+json.dumps({k:report[k] for k in ['browser','revision','passed','failed','errors','network_writes']}),flush=True)
    raise SystemExit(1 if report['failed'] else 0)

if __name__=='__main__':main()
