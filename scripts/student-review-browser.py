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
 const selectAnswer=(q,code)=>{
   if(q.bankId!=='pmp-bank2-2026'||q.format==='single'){
     document.querySelector(`[data-opt="${code}"]`).click();return;
   }
   const change=(selector,value,checkbox=false)=>{
     const el=document.querySelector(selector);
     if(checkbox)el.checked=value;else el.value=value;
     el.dispatchEvent(new Event('change',{bubbles:true}));
   };
   if(q.format==='multiple')q.choices.forEach(([key],i)=>change(`[data-pmp-choice="${key}"]`,!!(code&(1<<i)),true));
   else if(q.format==='matching'){
     const base=q.choices.length+1;
     q.prompts.forEach(([row])=>{const digit=code%base;code=Math.floor(code/base);change(`[data-pmp-select="${row}"]`,digit?q.choices[digit-1][0]:'');});
   }else if(q.format==='dropdown')change('[data-pmp-select]',q.choices[code][0]);
   else document.querySelector(`[data-pmp-cell="${q.choices[code][0]}"]`).click();
 };
 const s=__TB.getFeedbackSnapshot();
 if(s.records.length<2)throw Error('Expected at least two actual bank questions');
 const small=s.records.length<4;
 s.records.forEach((r,i)=>{
   document.querySelector(`[data-goto="${i}"]`).click();
   if(i!==(small?1:3)){
     const q=r.question,wrong=small?i===0:i===1||i===2;
     let code=wrong?(q.answer+1)%q.options.length:q.answer;
     if(wrong&&q.bankId==='pmp-bank2-2026'&&['multiple','matching'].includes(q.format)&&code===0)code=1;
     selectAnswer(q,code);
   }
   if(i===0||i===1)document.querySelector('[data-flag]').click();
 });
 return s;
}"""

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--url',default='http://127.0.0.1:8765/test-bank')
    parser.add_argument('--browser',choices=['chromium','webkit'],default='chromium')
    parser.add_argument('--executable')
    parser.add_argument('--exam',help='Limit the session matrix to one exam; default checks every exam')
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
        catalog=page.evaluate("()=>Object.entries(__TB.EXAMS).filter(([id,e])=>e.bank?.length).map(([id,e])=>({id,sets:Object.keys(e.sets||{1:e.bank}).filter(set=>(e.sets?.[set]||e.bank).length)}))")
        assert {'cmq','cqe','cssbb','cssgb','mbb'}.issubset({e['id'] for e in catalog})
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
            # A partially released set (e.g. a CRE batch) may not cover the default area; like a
            # learner, choose an area that has questions. The page never switches it silently.
            if mode=='focus' and page.locator('[data-mode="focus"]').is_disabled():
                area=page.locator('#tb-overview [data-focusdom]')
                for value in area.locator('option').evaluate_all('options=>options.map(o=>o.value)'):
                    area.select_option(value)
                    if not page.locator('[data-mode="focus"]').is_disabled():break
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
        def interactive_question(q):
            return q.get('bankId')=='pmp-bank2-2026' and q.get('format')!='single'
        def choose_response(q,code,retry=False):
            root=page.locator('#tb-retry-panel') if retry else page
            if not interactive_question(q):
                button=root.locator(f'[data-{"retry-opt" if retry else "opt"}="{code}"]')
                button.focus();page.keyboard.press('Space')
                expect(button).to_be_focused();expect(button).to_have_attribute('aria-pressed','true')
            elif q['format']=='multiple':
                for i,(key,_) in enumerate(q['choices']):
                    control=root.locator(f'[data-pmp-choice="{key}"]');checked=bool(code & (1<<i))
                    if control.is_checked()!=checked:control.focus();page.keyboard.press('Space')
                    assert control.is_checked()==checked
            elif q['format']=='matching':
                base=len(q['choices'])+1
                for row,_ in q['prompts']:
                    digit=code%base;code//=base;value=q['choices'][digit-1][0] if digit else ''
                    control=root.locator(f'[data-pmp-select="{row}"]');control.select_option(value);expect(control).to_have_value(value)
            elif q['format']=='dropdown':
                value=q['choices'][code][0];control=root.locator('[data-pmp-select]')
                control.select_option(value);expect(control).to_have_value(value)
            else:
                button=root.locator(f'[data-pmp-cell="{q["choices"][code][0]}"]')
                button.focus();page.keyboard.press('Space');expect(button).to_have_attribute('aria-pressed','true')
        def student_flow(exam,bank,mode,timed):
            page.set_viewport_size({'width':390 if timed else 1440,'height':900 if timed else 1000})
            page.evaluate('(theme)=>document.documentElement.dataset.theme=theme','dark' if timed else 'light')
            start(exam,bank,mode,timed);before=page.evaluate(PREPARE);total=len(before['records'])
            small = total < 4
            selected_index, unanswered_index = (0, 1) if small else (1, 3)
            missed_indices = [0, 1] if small else [1, 2, 3]
            missed_count = len(missed_indices)
            selected_question = before['records'][selected_index]['question']
            if timed:
                expect(page.locator('[data-reveal]')).to_have_count(0)
                assert page.evaluate('()=>__TB.revealCurrentAnswer()') is False
            else:
                # Cover reveal in every set/mixed pool and session type, both
                # after a correct selection and before any selection.
                page.locator(f'[data-goto="{selected_index}"]').click()
                choose_response(selected_question,selected_question['answer'])
                page.locator('[data-reveal]').focus();page.keyboard.press('Space')
                expect(page.locator('#tb-revealed-answer')).to_be_focused()
                page.evaluate("()=>window.auditReveal=document.querySelector('#tb-revealed-answer')")
                flag=page.locator('[data-flag]');flag.focus();page.keyboard.press('Enter')
                expect(flag).to_be_focused();expect(flag).to_have_attribute('aria-pressed','false')
                page.keyboard.press('Space');expect(flag).to_have_attribute('aria-pressed','true')
                assert page.evaluate("()=>auditReveal===document.querySelector('#tb-revealed-answer')")
                page.locator(f'[data-goto="{unanswered_index}"]').click();page.locator('[data-reveal]').click()
                expect(page.locator('.tb-navcell.revealed')).to_have_count(2)
                page.locator(f'[data-goto="{selected_index}"]').click()
                assert page.evaluate('(i)=>__TB.getFeedbackSnapshot().records[i].selected',selected_index)==selected_question['answer']
                if interactive_question(selected_question):
                    expect(page.locator('.pmp2-answers :is(input,select,button):not(:disabled)')).to_have_count(0)
                else:expect(page.locator(f'[data-opt="{selected_question["answer"]}"]')).to_have_attribute('aria-pressed','true')
            finish()
            assert before['setId']==bank, (exam,mode,bank,before['setId'])
            valid=page.evaluate("""({exam,bank,mode})=>{const e=__TB.EXAMS[exam],s=__TB.getFeedbackSnapshot();const rows=bank==='mix'?Object.values(e.sets||{1:e.bank}).flat():(e.sets?.[bank]||e.bank);const signature=q=>JSON.stringify([q.qid||q.id||null,q.stem,q.options]);const allowed=new Set(rows.map(signature));return s.records.every(r=>allowed.has(signature(r.question)));}""",{'exam':exam,'bank':bank,'mode':mode})
            assert valid, 'A delivered question is outside the selected test set'
            original=page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')
            score=page.locator('[data-score-result]').inner_text()
            assert f'({total-missed_count}/{total})' in score,score
            page.locator('[data-open-review="all"]').click()
            expect(page.locator('.tb-review-card')).to_have_count(total)
            expect(page.locator('.tb-review-navcell')).to_have_count(total)
            no_overflow()
            expect(page.locator('.tb-review-navcell.revealed')).to_have_count(0 if timed else 2)
            for filt,n in [('incorrect',missed_count-1 if timed else missed_count),('unanswered',1 if timed else 0),('correct',total-missed_count),('flagged',2),('missed',missed_count)]+([] if timed else [('revealed',2)]):
                page.locator(f'[data-review-tab="{filt}"]').click()
                expect(page.locator('.tb-review-card')).to_have_count(n)
                expect(page.locator(f'[data-review-tab="{filt}"]')).to_have_attribute('aria-pressed','true')
            page.locator(f'[data-review-goto="{selected_index}"]').click()
            expect(page.locator('.tb-review-card')).to_have_count(1)
            if interactive_question(selected_question):
                review=page.locator('.tb-review-options')
                if selected_question['format']=='matching':
                    expect(review.get_by_text('Correct response',exact=True)).to_have_count(1)
                    expect(review.locator('table').first.locator('tbody tr')).to_have_count(len(selected_question['prompts']))
                else:assert review.inner_text().count('(Correct answer)')==len(selected_question['correct'])
                for _,text in selected_question['choices']:expect(review).to_contain_text(text)
            else:
                expect(page.locator('.tb-review-option.is-wrong')).to_have_count(1 if timed else 0)
                expect(page.locator('.tb-review-option.is-correct')).to_have_count(1)
            bounds=page.evaluate("()=>({card:document.querySelector('.tb-review-card').getBoundingClientRect().top,header:document.querySelector('header.site').getBoundingClientRect().bottom})")
            assert bounds['card']>=bounds['header']-1,bounds
            links=page.locator('.tb-review-card .tb-review-lesson')
            if selected_question.get('lessonGap'):
                expect(links).to_have_count(0)
                expect(page.locator('.tb-review-card .cre2-source').first).to_contain_text('ASQ CRE Handbook')
            else:
                expect(links).to_have_count(1);expect(links).to_have_attribute('target','_blank')
                assert 'noopener' in links.get_attribute('rel')
            page.locator('[data-retry-missed]').click()
            expect(page.locator('[data-retry-check]')).to_be_disabled()
            expect(page.locator('.tb-retry-feedback')).to_have_count(0)
            for i,r in enumerate([before['records'][index] for index in missed_indices]):
                q=r['question'];option=(q['answer']+1)%len(q['options']) if i==0 else q['answer']
                if i==0 and interactive_question(q) and q['format'] in ['multiple','matching'] and option==0:option=1
                choose_response(q,option,retry=True)
                page.locator('[data-retry-check]').focus();page.keyboard.press('Enter')
                expect(page.locator('.tb-retry-feedback')).to_be_focused()
                expect(page.locator('#tb-retry-panel :is([data-retry-opt],.pmp2-answers input,.pmp2-answers select,.pmp2-answers button):not(:disabled)')).to_have_count(0)
                page.locator('[data-retry-next]').click()
            assert f'{missed_count-1} of {missed_count}' in page.locator('.tb-correction-count').inner_text()
            page.locator('[data-retry-remaining]').click();assert '1 of 1' in page.locator('.tb-retry-head').inner_text()
            choose_response(selected_question,selected_question['answer'],retry=True)
            page.locator('[data-retry-check]').click();page.locator('[data-retry-next]').click()
            expect(page.locator('#tb-retry-panel h3')).to_have_text('All missed questions corrected.')
            page.locator('[data-retry-return]').click();expect(page.locator('.tb-review-card')).to_have_count(missed_count)
            assert page.locator('[data-score-result]').inner_text()==score
            assert page.evaluate('()=>JSON.stringify(__TB.getFeedbackSnapshot())')==original
            storage_clean();page.locator('[data-back]').click();expect(page.locator('#tb-feedback-loop')).to_have_count(0)
        for exam in catalog:
            if args.exam and exam['id']!=args.exam:continue
            banks=exam['sets']+(['mix'] if len(exam['sets'])>1 else [])
            for bank in banks:
                for mode in ['full','quick','focus']:
                    for timed in [False,True]:
                        record(f'{exam["id"]}/set-{bank}/{mode}/{"timed" if timed else "untimed"}',
                               lambda e=exam['id'],s=bank,m=mode,t=timed:student_flow(e,s,m,t))
        def answer_reveal():
            page.set_viewport_size({'width':390,'height':844})
            start('cssgb','1','quick',False)
            q=page.evaluate('()=>__TB.getFeedbackSnapshot().records[0].question')
            reveal=page.locator('[data-reveal]')
            assert page.evaluate("()=>document.querySelector('[data-reveal]').previousElementSibling.hasAttribute('data-flag')")
            reveal.focus();page.keyboard.press('Enter')
            expect(page.locator('#tb-revealed-answer')).to_be_focused()
            expect(reveal).to_be_disabled()
            expect(page.locator('[data-opt]:not(:disabled)')).to_have_count(0)
            assert 'Correct answer:' in page.locator('#tb-revealed-answer').inner_text()
            for width in [320,390,1440]:
                page.set_viewport_size({'width':width,'height':900})
                for theme in ['light','dark']:
                    page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                    colors=page.evaluate("""()=>{const nav=document.querySelector('[data-goto="0"]');return {color:getComputedStyle(nav).color,expected:getComputedStyle(document.querySelector('.tb-quiz')).getPropertyValue('--reveal-blue').trim(),width:innerWidth,doc:document.documentElement.scrollWidth}}""")
                    assert colors['color']=='rgb(255, 255, 255)',colors
                    assert colors['doc']<=colors['width']+2,colors
                    if width==390:page.screenshot(path=str(out/('answer-reveal-mobile-'+theme+'.png')))
            page.locator('[data-goto="1"]').click()
            second=page.evaluate('()=>__TB.getFeedbackSnapshot().records[1].question')
            page.locator(f'[data-opt="{second["answer"]}"]').click()
            page.locator('[data-reveal]').click()
            finish()
            grade=page.evaluate('()=>__TB.getFeedbackSnapshot().grading')
            assert grade['incorrect']==2 and grade['correct']==0 and grade['revealed']==2,grade
            page.locator('[data-open-review="all"]').click()
            expect(page.locator('.tb-review-card.revealed')).to_have_count(2)
            expect(page.locator('.tb-review-navcell.revealed')).to_have_count(2)
            page.locator('[data-review-tab="revealed"]').click()
            expect(page.locator('.tb-review-card')).to_have_count(2)
            no_overflow();storage_clean()
            start('cssgb','1','quick',True)
            expect(page.locator('[data-reveal]')).to_have_count(0)
            assert page.evaluate('()=>__TB.revealCurrentAnswer()') is False
        record('untimed-reveal-blue-mobile-desktop-and-timed-guard',answer_reveal)
        def status_theme():
            start('cssgb','1','quick',False)
            page.evaluate("""()=>{const s=__TB.getFeedbackSnapshot();for(let i=0;i<4;i++){document.querySelector(`[data-goto="${i}"]`).click();document.querySelector('[data-flag]').click();if(i<2)document.querySelector(`[data-opt="${i===0?s.records[i].question.answer:(s.records[i].question.answer+1)%s.records[i].question.options.length}"]`).click();if(i===2)document.querySelector('[data-reveal]').click();}}""")
            for theme in ['light','dark']:
                page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                colors=page.evaluate("""()=>[0,2,3].map(i=>{const e=document.querySelector(`[data-goto="${i}"]`),s=getComputedStyle(e);return [i===3?s.color:s.backgroundColor,getComputedStyle(e,'::after').backgroundColor,s.outlineWidth,e.getBoundingClientRect().width]})""")
                expected=['rgb(14, 116, 144)','rgb(29, 78, 216)','rgb(71, 85, 105)'] if theme=='light' else ['rgb(14, 116, 144)','rgb(29, 78, 216)','rgb(203, 213, 225)']
                assert [c[0] for c in colors]==expected,colors
                assert all(c[1]=='rgb(255, 149, 0)' and c[3]>=44 for c in colors),colors
                assert colors[2][2]=='3px',colors
            finish();page.locator('[data-open-review="all"]').click()
            for width in [320,390,1440]:
                page.set_viewport_size({'width':width,'height':900})
                for theme in ['light','dark']:
                    page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
                    colors=page.evaluate("""()=>['correct','incorrect','revealed','unanswered'].map(state=>{const e=document.querySelector('.tb-review-navcell.'+state);return [state==='unanswered'?getComputedStyle(e).color:getComputedStyle(e).backgroundColor,getComputedStyle(e.querySelector('.tb-rnc-flag')).backgroundColor]})""")
                    expected=['rgb(21, 128, 61)','rgb(220, 38, 38)','rgb(29, 78, 216)','rgb(71, 85, 105)'] if theme=='light' else ['rgb(21, 128, 61)','rgb(220, 38, 38)','rgb(29, 78, 216)','rgb(203, 213, 225)']
                    assert [c[0] for c in colors]==expected,colors
                    assert all(c[1]=='rgb(255, 149, 0)' for c in colors),colors
                    no_overflow()
                    page.locator('#tb-review-grid').scroll_into_view_if_needed()
                    page.screenshot(path=str(out/(f'status-theme-{width}-{theme}.png')))
            grade=page.evaluate('()=>__TB.getFeedbackSnapshot().grading')
            assert grade['correct']==1 and grade['incorrect']==2 and grade['revealed']==1,grade
        record('status-palette-flags-light-dark-mobile-desktop',status_theme)
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
        def interactive_reveal():
            page.set_viewport_size({'width':390,'height':844});start('mbb','2','full',False)
            index=page.evaluate("()=>__TB.getFeedbackSnapshot().records.findIndex(r=>r.question.qid==='mbb:set-2:original-005')")
            assert index>=0;page.locator(f'[data-goto="{index}"]').click()
            slider=page.locator('[data-tb-whatif]');slider.focus();page.keyboard.press('ArrowLeft');value=slider.input_value()
            page.evaluate("()=>window.auditRevealSlider=document.querySelector('[data-tb-whatif]')")
            page.locator('[data-reveal]').click()
            details=page.locator('#tb-revealed-answer .tb-review-rationales');details.locator('summary').click()
            flag=page.locator('[data-flag]');flag.focus();page.keyboard.press('Enter')
            expect(flag).to_be_focused();expect(flag).to_have_attribute('aria-pressed','true')
            expect(details).to_have_attribute('open','')
            assert slider.input_value()==value
            assert page.evaluate("()=>auditRevealSlider===document.querySelector('[data-tb-whatif]')")
            assert page.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+2")
        record('real-interactive-reveal-and-flag-preserve-work',interactive_reveal)
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
