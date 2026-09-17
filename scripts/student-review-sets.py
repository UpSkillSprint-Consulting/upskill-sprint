"""Student acceptance tests for independent Quick/Focused test-set controls.
Uses the same isolated page and synthetic authorization as the review audit.
No real accounts, learner data, or external writes are used.
"""
import argparse
import json
import os
import runpy
import traceback
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--browser',choices=['chromium','webkit'],required=True)
    parser.add_argument('--out',default='student-audit-evidence')
    args=parser.parse_args()
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    auth=runpy.run_path('scripts/student-review-browser.py')['AUTH']
    report={'browser':args.browser,'revision':os.environ.get('PR_HEAD_SHA','local'),
            'basis':'Isolated edge-delivered page, actual banks, synthetic premium student',
            'cases':[],'errors':[],'network_writes':[]}
    with sync_playwright() as pw:
        browser=getattr(pw,args.browser).launch()
        page=browser.new_page(viewport={'width':1440,'height':1000})
        page.set_default_timeout(8000)
        page.on('pageerror',lambda error:report['errors'].append(str(error)))
        def route(r):
            if r.request.method not in ['GET','HEAD']:
                report['network_writes'].append(r.request.url);r.abort()
            elif urlparse(r.request.url).path=='/auth.js':r.fulfill(content_type='application/javascript',body=auth)
            elif urlparse(r.request.url).netloc!='127.0.0.1:8765':r.abort()
            else:r.continue_()
        page.route('**/*',route)
        page.goto('http://127.0.0.1:8765/test-bank',wait_until='domcontentloaded')
        page.wait_for_selector('body.access-ready')
        def record(name,fn):
            try:
                fn();assert not report['errors'],report['errors'];assert not report['network_writes'],report['network_writes']
                result={'name':name,'result':'PASS'}
            except Exception as error:
                result={'name':name,'result':'FAIL','error':str(error),'traceback':traceback.format_exc()}
                page.screenshot(path=str(out/('sets-'+name.replace('/','-')+'-failure.png')),full_page=True)
            report['cases'].append(result)
            (out/'quiz-set-assessment.json').write_text(json.dumps(report,indent=2))
            print(json.dumps(result),flush=True)
        def choose(kind,value):page.locator(f'[data-quiz-set-kind="{kind}"][data-quiz-set="{value}"]').click()
        def selected(kind):return page.locator(f'[data-quiz-set-kind="{kind}"][aria-pressed="true"]').get_attribute('data-quiz-set')
        def reset(exam):
            page.reload(wait_until='domcontentloaded');page.wait_for_selector('body.access-ready')
            if page.viewport_size['width']<=860:page.locator('#tb-mobile-cert-select').select_option(exam)
            else:page.locator(f'.tb-tile[data-exam="{exam}"]').click()
        def verify_attempt(bank,kind):
            actual=page.evaluate("""({bank,kind})=>{
              const s=__TB.getFeedbackSnapshot(),e=__TB.EXAMS[s.examId],signature=q=>JSON.stringify([q.qid||q.id||null,q.stem,q.options]);
              const rows=bank==='mix'?Object.values(e.sets||{1:e.bank}).flat():(e.sets?.[bank]||e.bank),allowed=new Set(rows.map(signature));
              return {set:s.setId,total:s.records.length,allowed:s.records.every(r=>allowed.has(signature(r.question))),
                distinct:new Set(s.records.map(r=>signature(r.question))).size};
            }""",{'bank':bank,'kind':kind})
            assert actual['set']==bank and actual['allowed'] and actual['total']==actual['distinct'] and actual['total']>0,actual
        def full_state():
            # Compare stable learner settings, not transient decorative arrow cleanup.
            return page.locator('.tb-mode').nth(0).evaluate("""card=>({
              title:card.querySelector('h4').textContent,
              description:card.querySelector('.tb-mode-head p').textContent,
              timing:card.querySelector('[data-timing-kind="full"].on').dataset.timed,
              summary:card.querySelector('.tb-mode-sum').textContent,
              set:document.querySelector('[data-set].on')?.dataset.set||'1'
            })""")
        def independence(exam):
            reset(exam)
            choices=page.locator('[data-quiz-set-kind="quick"]').evaluate_all('(buttons)=>buttons.map(b=>b.dataset.quizSet)')
            quick=choices[1] if len(choices)>1 else choices[0]
            focus=choices[-2] if len(choices)>2 else choices[0]
            choose('quick',quick);choose('focus',focus)
            page.locator('[data-count="quick"][data-n="30"]').click()
            page.locator('[data-count="focus"][data-n="10"]').click()
            page.locator('[data-timing-kind="quick"][data-timed="1"]').click()
            if len(choices)>1:page.locator('[data-set="mix"]').click()
            full=full_state()
            assert selected('quick')==quick and selected('focus')==focus
            for kind,bank in [('quick',quick),('focus',focus)]:
                page.locator(f'[data-mode="{kind}"]').click();verify_attempt(bank,kind)
                if kind=='quick':expect(page.locator('#tb-timer')).to_be_visible()
                page.locator('[data-goto]').last.click();page.locator('[data-submit]').click();page.wait_for_selector('#tb-feedback-loop')
                expect(page.locator('[data-score-result]')).to_have_attribute('data-session-set',bank)
                original=page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')
                page.locator('[data-open-review="all"]').click()
                assert page.locator('.tb-review-card').count()>0
                page.locator('[data-retry-missed]').click()
                answer=page.evaluate('()=>__TB.getFeedbackSnapshot().records[0].question.answer')
                page.locator(f'[data-retry-opt="{answer}"]').click();page.locator('[data-retry-check]').click()
                assert page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')==original
                page.locator('[data-retake]').click();verify_attempt(bank,kind)
                page.locator('[data-backsim]').click()
                assert selected('quick')==quick and selected('focus')==focus
                assert full_state()==full, {'before':full,'after':full_state()}
            page.locator('[data-mode="full"]').click();verify_attempt('mix' if len(choices)>1 else '1','full')
            page.locator('[data-backsim]').click()
        for exam in ['cssbb','cssgb','mbb','cqe','cmq']:record(exam+'/independent-start-review-retake',lambda e=exam:independence(e))
        def keyboard():
            reset('cssbb');choose('quick','1')
            for key,value in [('ArrowRight','2'),('End','mix'),('Home','1'),('ArrowLeft','mix')]:
                page.keyboard.press(key)
                expect(page.locator(f'[data-quiz-set-kind="quick"][data-quiz-set="{value}"]')).to_be_focused()
                assert selected('quick')==value and selected('focus')=='1'
            page.locator('[data-quiz-set-kind="focus"][data-quiz-set="3"]').focus();page.keyboard.press('Space')
            assert selected('focus')=='3' and selected('quick')=='mix'
            page.reload(wait_until='domcontentloaded');page.wait_for_selector('body.access-ready')
            assert selected('quick')=='1' and selected('focus')=='1'
            assert page.evaluate("()=>[...Object.keys(localStorage),...Object.keys(sessionStorage)].filter(k=>/^(tb-|test-bank|upskill-test-bank)/i.test(k)).length")==0
        record('keyboard-and-refresh',keyboard)
        def layouts():
            reset('cssbb');choose('quick','2');choose('focus','3')
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                for theme in ['light','dark']:
                    page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
                    for kind in ['quick','focus']:
                        for bank in ['1','2','3','mix']:
                            choose(kind,bank)
                            geometry=page.evaluate("""()=>({width:innerWidth,document:document.documentElement.scrollWidth,
                              overflow:[...document.querySelectorAll('.tb-modes,.tb-mode,.tb-quiz-set-choices')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>{
                                const rect=e.getBoundingClientRect();return {cls:e.className,client:e.clientWidth,scroll:e.scrollWidth,rect:{x:rect.x,width:rect.width,right:rect.right},children:[...e.children].map(child=>{
                                  const r=child.getBoundingClientRect(),s=getComputedStyle(child);return {cls:child.className,client:child.clientWidth,scroll:child.scrollWidth,x:r.x,width:r.width,right:r.right,transform:s.transform,boxSizing:s.boxSizing};
                                })};
                              })})""")
                            assert geometry['document']<=width+2 and not geometry['overflow'],geometry
                    choose('quick','2');choose('focus','3')
                    page.locator('.tb-modes').screenshot(path=str(out/f'set-controls-{width}-{theme}.png'))
        record('control-layouts-320-1440-light-dark',layouts)
        browser.close()
    report['passed']=sum(c['result']=='PASS' for c in report['cases']);report['failed']=len(report['cases'])-report['passed']
    (out/'quiz-set-assessment.json').write_text(json.dumps(report,indent=2))
    print('QUIZ_SET_SUMMARY '+json.dumps({k:report[k] for k in ['browser','passed','failed','errors','network_writes']}),flush=True)
    raise SystemExit(bool(report['failed']))

if __name__=='__main__':main()
