"""Audit the staged NPPE build using isolated identity/permission fixtures.

External traffic and network writes are blocked. This is not a signed-in
production-account test. Viewport screenshots avoid browser image-size limits.
"""
import argparse
import json
import os
import re
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

helpers = runpy.run_path(str(Path(__file__).with_name('exam-practice-browser.py')))
EXPECTED_COUNT = 50
EXPECTED_MINUTES = 69
LEARNING_COUNT = 120
LEARNING_MINUTES = 164
LEARNING_DOMAINS = [10, 22, 36, 32, 10, 10]
AXE_PATH = Path(__file__).parent / 'student-audit-tools/node_modules/axe-core/axe.min.js'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:8765')
    parser.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    parser.add_argument('--out', default='exam-practice-audit-evidence/nppe')
    args = parser.parse_args()
    base = args.url.rstrip('/')
    origin = urlparse(base).netloc
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'revision': os.environ.get('PR_HEAD_SHA'), 'browser': args.browser,
              'basis': 'Served protected build; upstream permission/identity fixtures; no live account or database changes',
              'cases': []}
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch()
        for width in [320, 390, 1440]:
            for theme in ['light', 'dark']:
                context = browser.new_context(viewport={'width': width, 'height': 950}, reduced_motion='reduce')
                errors = []

                def route(request_route):
                    request = request_route.request
                    parsed = urlparse(request.url)
                    if request.method not in ['GET', 'HEAD'] or parsed.netloc != origin:
                        request_route.abort()
                    elif parsed.path == '/vendor/supabase.js':
                        request_route.fulfill(content_type='application/javascript', body=helpers['account_fixture'](True))
                    else:
                        request_route.continue_()

                context.route('**/*', route)
                page = context.new_page()
                page.set_default_timeout(10000)
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('dialog', lambda dialog: dialog.accept())
                name = f'{args.browser}-{width}-{theme}'
                accessibility = []

                def check_accessibility(phase):
                    page.add_script_tag(path=str(AXE_PATH))
                    audit = page.evaluate('''async () => {
                      const r=await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
                      return {engine:r.testEngine,passes:r.passes.length,
                        incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),
                        violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))};
                    }''')
                    accessibility.append({'phase': phase, **audit})
                    assert audit['passes'] > 0, audit
                    assert not audit['violations'], {'phase': phase, **audit}
                    assert not any(issue['id'] == 'aria-prohibited-attr' for issue in audit['incomplete']), {'phase': phase, **audit}
                    # Axe cannot resolve a collapsed popup's target. Confirm the
                    # relationship directly without suppressing its review flag.
                    menu_target = page.locator('#account-menu-btn').get_attribute('aria-controls')
                    expect(page.locator(f'#{menu_target}')).to_have_count(1)

                def learning_review():
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(LEARNING_COUNT)
                    expect(page.locator('.tb-review-rationales')).to_have_count(LEARNING_COUNT)
                    records = page.evaluate('window.__TB.getFeedbackSnapshot().records')
                    for record in records:
                        q = record['question']
                        card = page.locator(f'.tb-review-card[data-question-id="{q["qid"]}"]')
                        card.locator('.tb-review-rationales summary').click()
                        expect(card.locator('.tb-review-rationales p')).to_have_count(3)
                        for rationale in q['optionRationales']:
                            expect(card).to_contain_text(rationale)
                    header_images_fit()

                def mock_a_release_fixture():
                    # Authorized fixture tests published form behavior; real account grants are independently controlled.
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-a').releaseHold") is False
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-b').releaseHold") is False
                    # Release is configured in the authorized package, not injected in the browser.
                    page.locator('[data-nppe-owner="1"]').click()
                    page.locator('[data-set="set-1-mock-a"]').click()
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-mock-a"]:not([data-nppe-quiz-kind])')).to_contain_text('150 minutes')
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('#tb-timer')).to_have_text(re.compile(r'^2:(?:30:00|29:[0-5][0-9])$'))
                    records = page.evaluate('window.__TB.getFeedbackSnapshot().records')
                    assert len(records) == 110 and len({r['question']['qid'] for r in records}) == 110
                    assert all(r['question']['form'] == 'set-1-mock-a' and r['question']['authorSet'] == 1 for r in records)
                    assert sum(r['question']['scored'] and not r['question']['experimental'] for r in records) == 100
                    expect(page.locator('[data-reveal]')).to_have_count(0)
                    assert page.evaluate('window.__TB.revealCurrentAnswer()') is False
                    assert not re.search(r'experimental|unscored', page.locator('.tb-quiz').inner_text(), re.I)
                    check_accessibility('mock-a-published-active-question')
                    for i, record in enumerate(records):
                        q = record['question']
                        page.locator(f'[data-goto="{i}"]').click()
                        answer = q['answer'] if q['scored'] else (q['answer'] + 1) % 4
                        choice = page.locator(f'[data-opt="{answer}"]')
                        if i == 0:
                            choice.focus()
                            page.keyboard.press('Space')
                            page.locator('[data-flag]').focus()
                            page.keyboard.press('Enter')
                            page.locator('[data-next]').click()
                            page.locator('[data-goto="0"]').click()
                            expect(choice).to_have_attribute('aria-pressed', 'true')
                            expect(page.locator('[data-flag]')).to_have_attribute('aria-pressed', 'true')
                        else:
                            choice.click()
                        expect(page.locator('[data-opt]')).to_have_count(4)
                        header_images_fit()
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text('100% (100/100)')
                    for i, count in enumerate([8, 20, 30, 26, 8, 8]):
                        expect(page.locator('.tb-domblock').nth(i)).to_contain_text(f'({count}/{count})')
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(110)
                    for record in records:
                        q = record['question']
                        card = page.locator(f'.tb-review-card[data-question-id="{q["qid"]}"]')
                        card.locator('.tb-review-rationales summary').click()
                        expect(card.locator('.tb-review-rationales p')).to_have_count(3)
                        for rationale in q['optionRationales']:
                            expect(card).to_contain_text(rationale)
                    check_accessibility('mock-a-published-complete-review')
                    header_images_fit()
                    page.screenshot(path=str(out / f'{name}-mock-a-published-review.png'), full_page=False)
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    expect(page.locator('[data-set="set-1-mock-a"]')).to_be_enabled()
                    expect(page.locator('[data-set="set-1-mock-b"] .tb-sets')).to_have_text('110')
                    expect(page.locator('[data-set="set-1-mock-b"]')).to_be_enabled()
                    expect(page.locator('[data-set="set-1-mock-b"]')).to_have_attribute('aria-label', 'Mock B, 110 questions')
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-a').releaseHold") is False
                    return {'basis': 'published form inside isolated authorized-access fixture', 'questions': 110,
                            'score': '100/100', 'experimentalAnswersWrong': 10, 'minutes': 150,
                            'reviewQuestions': 110, 'optionRationales': 440,
                            'keyboardFlagsPersistence': True, 'revealBlocked': True,
                            'publishedFormAvailableAfterReload': True}

                def header_images_fit():
                    geometry = page.evaluate('''() => {
                      const header=document.querySelector('header.site');
                      const brand=header.querySelector('.brand').getBoundingClientRect();
                      const image=header.querySelector('.brand img').getBoundingClientRect();
                      const controls=header.querySelector('.header-actions').getBoundingClientRect();
                      const overlap=Math.min(image.right,controls.right)-Math.max(image.left,controls.left)>1 &&
                        Math.min(image.bottom,controls.bottom)-Math.max(image.top,controls.top)>1;
                      return {imageWithinBrand:image.left>=brand.left-1 && image.right<=brand.right+1,
                        overlap:overlap,documentWidth:document.documentElement.scrollWidth,width:innerWidth};
                    }''')
                    assert geometry['imageWithinBrand'] and not geometry['overlap'], geometry
                    assert geometry['documentWidth'] <= geometry['width'] + 1, geometry

                def mock_b_release_fixture():
                    # Authorized fixture tests published form behavior; real account grants are independently controlled.
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-b').releaseHold") is False
                    # No in-memory change to publication status is needed.
                    page.locator('[data-nppe-owner="1"]').click()
                    page.locator('[data-set="set-1-mock-b"]').click()
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-mock-b"]:not([data-nppe-quiz-kind])')).to_contain_text('150 minutes')
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('#tb-timer')).to_have_text(re.compile(r'^2:(?:30:00|29:[0-5][0-9])$'))
                    records = page.evaluate('window.__TB.getFeedbackSnapshot().records')
                    assert len(records) == 110 and len({r['question']['qid'] for r in records}) == 110
                    assert all(r['question']['form'] == 'set-1-mock-b' and r['question']['authorSet'] == 1 for r in records)
                    assert sum(r['question']['scored'] and not r['question']['experimental'] for r in records) == 100
                    expect(page.locator('[data-reveal]')).to_have_count(0)
                    assert page.evaluate('window.__TB.revealCurrentAnswer()') is False
                    assert not re.search(r'experimental|unscored', page.locator('.tb-quiz').inner_text(), re.I)
                    check_accessibility('mock-b-published-active-question')
                    for i, record in enumerate(records):
                        q = record['question']
                        page.locator(f'[data-goto="{i}"]').click()
                        answer = q['answer'] if q['scored'] else (q['answer'] + 1) % 4
                        choice = page.locator(f'[data-opt="{answer}"]')
                        if i == 0:
                            choice.focus()
                            page.keyboard.press('Space')
                            page.locator('[data-flag]').focus()
                            page.keyboard.press('Enter')
                            page.locator('[data-next]').click()
                            page.locator('[data-goto="0"]').click()
                            expect(choice).to_have_attribute('aria-pressed', 'true')
                            expect(page.locator('[data-flag]')).to_have_attribute('aria-pressed', 'true')
                        else:
                            choice.click()
                        expect(page.locator('[data-opt]')).to_have_count(4)
                        header_images_fit()
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text('100% (100/100)')
                    for i, count in enumerate([8, 20, 30, 26, 8, 8]):
                        expect(page.locator('.tb-domblock').nth(i)).to_contain_text(f'({count}/{count})')
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(110)
                    for record in records:
                        q = record['question']
                        card = page.locator(f'.tb-review-card[data-question-id="{q["qid"]}"]')
                        card.locator('.tb-review-rationales summary').click()
                        expect(card.locator('.tb-review-rationales p')).to_have_count(3)
                        for rationale in q['optionRationales']:
                            expect(card).to_contain_text(rationale)
                    check_accessibility('mock-b-published-complete-review')
                    header_images_fit()
                    page.screenshot(path=str(out / f'{name}-mock-b-published-review.png'), full_page=False)
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    expect(page.locator('[data-set="set-1-mock-b"]')).to_be_enabled()
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-b').releaseHold") is False
                    return {'basis': 'published form inside isolated authorized-access fixture', 'questions': 110,
                            'score': '100/100', 'experimentalAnswersWrong': 10, 'minutes': 150,
                            'reviewQuestions': 110, 'optionRationales': 440,
                            'keyboardFlagsPersistence': True, 'revealBlocked': True,
                            'publishedFormAvailableAfterReload': True}

                def header_images_fit():
                    geometry = page.evaluate('''() => {
                      const header=document.querySelector('header.site');
                      const brand=header.querySelector('.brand').getBoundingClientRect();
                      const image=header.querySelector('.brand img').getBoundingClientRect();
                      const controls=header.querySelector('.header-actions').getBoundingClientRect();
                      const overlap=Math.min(image.right,controls.right)-Math.max(image.left,controls.left)>1 &&
                        Math.min(image.bottom,controls.bottom)-Math.max(image.top,controls.top)>1;
                      return {imageWithinBrand:image.left>=brand.left-1 && image.right<=brand.right+1,
                        overlap:overlap,documentWidth:document.documentElement.scrollWidth,width:innerWidth};
                    }''')
                    assert geometry['imageWithinBrand'] and not geometry['overlap'], geometry
                    assert geometry['documentWidth'] <= geometry['width'] + 1, geometry

                try:
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    if page.locator('html').get_attribute('data-theme') != theme:
                        page.get_by_role('switch', name='Switch to ' + theme + ' mode').click()
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    page.locator('[data-nppe-owner="1"]').click()
                    # Distinct, responsive bank cards rather than an oversized nested set picker.
                    expect(page.locator('.nppe-hub .nppe-author-tab')).to_have_count(3)
                    expect(page.locator('.nppe-hub .nppe-bank-card')).to_have_count(6)
                    expect(page.locator('.nppe-hub .nppe-mode-card')).to_have_count(3)
                    expect(page.locator('.nppe-hub .nppe-disclosure')).to_have_count(0)
                    request_link=page.locator('.nppe-hub a.tb-requestlink')
                    expect(request_link).to_have_count(1)
                    expect(request_link).to_have_text('Request Certificate Exam')
                    expect(request_link).to_have_attribute('href','/request-topic')
                    expect(page.locator('.nppe-hub')).not_to_contain_text('Mock C · Grok')
                    assert page.evaluate('''() => [...document.querySelectorAll(
                      '.nppe-bank-card,.nppe-author-tab,.nppe-mode-card,.nppe-mode-card .tb-mstart'
                    )].every(el=>{
                      const r=el.getBoundingClientRect();
                      return (!r.width&&!r.height)||(r.left>=-1&&r.right<=innerWidth+1);
                    })'''), 'NPPE chooser overflows the viewport'
                    page.locator('[data-set="set-1-mock-a"]').click()
                    expect(page.locator('[data-set="set-1-mock-a"]')).to_be_focused()
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-mock-a"]:not([data-nppe-quiz-kind]) h4')).to_contain_text('Mock A')
                    expect(page.locator('[data-set="set-1-mock-a"]')).to_have_attribute('aria-pressed','true')
                    for kind in ('quick', 'focus'):
                        expect(page.locator(f'[data-nppe-quiz-kind="{kind}"] .nppe-selected-bank')).to_have_text('Mock A')
                    page.locator('[data-set="set-1-mock-b"]').click()
                    for kind in ('quick', 'focus'):
                        expect(page.locator(f'[data-nppe-quiz-kind="{kind}"] .nppe-selected-bank')).to_have_text('Mock B')
                    page.locator('[data-set="set-1-diagnostic"]').click()
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-diagnostic"]:not([data-nppe-quiz-kind]) h4')).to_contain_text('Diagnostic')
                    page.locator('[data-nppe-owner="1"]').press('ArrowRight')
                    expect(page.locator('#nppe-banks-2')).to_be_visible()
                    expect(page.locator('#nppe-banks-1')).to_be_hidden()
                    expect(page.locator('#nppe-banks-2 .nppe-bank-panel-head strong')).to_have_text('Mock C')
                    for kind in ('quick', 'focus'):
                        expect(page.locator(f'[data-nppe-quiz-kind="{kind}"] .nppe-selected-bank')).to_have_text('Mock C')
                    page.locator('[data-nppe-owner="2"]').press('ArrowRight')
                    expect(page.locator('#nppe-banks-3')).to_be_visible()
                    expect(page.locator('#nppe-banks-3 .nppe-bank-panel-head strong')).to_have_text('Mock D')
                    for kind in ('quick', 'focus'):
                        expect(page.locator(f'[data-nppe-quiz-kind="{kind}"] .nppe-selected-bank')).to_have_text('Mock D')
                    expect(page.locator('#nppe-banks-3 .nppe-bank-panel-head')).not_to_contain_text('Mock E')
                    page.locator('[data-nppe-owner="3"]').press('Home')
                    expect(page.locator('#nppe-banks-1')).to_be_visible()
                    expect(page.locator('#nppe-banks-2')).to_be_hidden()
                    expect(page.locator('#nppe-banks-3')).to_be_hidden()
                    expect(page.locator('[data-set="set-1-diagnostic"] .tb-sets')).to_have_text(str(EXPECTED_COUNT))
                    expect(page.locator('[data-set="set-1-mock-a"] .tb-sets')).to_have_text('110')
                    expect(page.locator('[data-set="set-1-mock-a"]')).to_be_enabled()
                    expect(page.locator('[data-set="set-1-mock-a"]')).to_have_attribute('aria-label', 'Mock A, 110 questions')
                    expect(page.locator('[data-set="set-1-mock-b"]')).to_be_enabled()
                    expect(page.locator('[data-set="mock-c"]')).to_have_count(1)
                    expect(page.locator('[data-set="mock-d"]')).to_have_count(1)
                    expect(page.locator('[data-set="set-1-mock-c"]')).to_have_count(0)
                    expect(page.locator('[data-set="mock-e"]')).to_have_count(0)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='mock-c').authorSet") == 2
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='mock-d').authorSet") == 3
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    assert page.evaluate("window.__TB.EXAMS.nppe.formCatalog.find(f=>f.id==='set-1-mock-a').releaseHold") is False
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-diagnostic"]:not([data-nppe-quiz-kind])')).to_contain_text(f'{EXPECTED_COUNT} questions from Diagnostic only')
                    expect(page.locator('#tb-overview')).to_contain_text(f'{EXPECTED_MINUTES} minutes')
                    page.wait_for_function('''() => {
                      const images=[...document.querySelectorAll('header.site .brand img, footer.site .brand img')];
                      return images.length>=2 && images.every(image=>image.complete && image.naturalWidth>0);
                    }''')
                    header_images_fit()
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-banks.png'), full_page=False)
                    # Match the other exams: three practice cards and native Area selects.
                    expect(page.locator('.nppe-mode-card')).to_have_count(3)
                    quick_area=page.locator('select[data-nppe-area-kind="quick"]')
                    focused_area=page.locator('select[data-nppe-area-kind="focus"]')
                    expect(quick_area.locator('option')).to_have_count(7)
                    expect(focused_area.locator('option')).to_have_count(6)
                    expect(quick_area).to_have_value('all')
                    quick_area.select_option('nppe-law')
                    expect(quick_area).to_have_value('nppe-law')
                    expect(page.locator('[data-nppe-quiz-kind="quick"] .tb-mode-sum')).to_contain_text('IV Law')
                    check_accessibility('nppe-quick-area-selection')
                    focused_area.select_option('nppe-practice')
                    expect(page.locator('[data-nppe-quiz-kind="focus"] .tb-mode-sum')).to_contain_text('III Professional Practice')
                    assert page.evaluate('''() => [...document.querySelectorAll('.nppe-area-select,.nppe-mode-card .tb-mstart')].every(el=>{
                      const r=el.getBoundingClientRect();return (!r.width&&!r.height)||(r.left>=-1&&r.right<=innerWidth+1);
                    })'''), 'NPPE subject and quiz controls overflow the viewport'
                    check_accessibility('nppe-focused-area-selection')
                    page.locator('[data-timing-kind="full"][data-timed="0"]').click()
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('.tb-quiz')).to_be_visible()
                    expect(page.locator('[data-goto]')).to_have_count(EXPECTED_COUNT)
                    expect(page.locator('[data-reveal]')).to_be_visible()
                    expect(page.locator('.tb-status-key')).to_be_visible()
                    for status in ['Slate grey: unanswered','Teal: answered, awaiting grading',
                                   'Blue: revealed (scored questions count as incorrect)','Orange: flagged for review',
                                   'Outline: current question']:
                        expect(page.locator('.tb-status-key')).to_contain_text(status)
                    expect(page.locator('.tb-navcell.cur')).to_have_count(1)
                    expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                    expect(page.locator('[data-flag]')).to_be_visible()
                    expect(page.locator('.tb-diag-kick')).not_to_contain_text('Sample diagnostic')
                    page.locator('[data-opt="1"]').click()
                    expect(page.locator('.tb-navcell.cur')).to_have_class(re.compile(r'\bdone\b'))
                    page.locator('[data-flag]').click()
                    expect(page.locator('.tb-navcell.cur')).to_have_class(re.compile(r'\bflag\b'))
                    page.locator('[data-next]').click()
                    page.locator('[data-goto="0"]').click()
                    expect(page.locator('[data-opt="1"]')).to_have_attribute('aria-pressed', 'true')
                    expect(page.locator('[data-flag]')).to_have_attribute('aria-pressed', 'true')
                    if width <= 860:
                        expect(page.locator('header.site')).to_have_css('position', 'static')
                        expect(page.locator('.tb-quiztop')).to_have_css('flex-direction', 'column')
                        assert page.locator('.tb-toolbar').evaluate('''bar=>{
                          const h=document.querySelector('header.site').getBoundingClientRect(),b=bar.getBoundingClientRect();
                          return h.bottom<=b.top+1;
                        }'''), 'Site header covers the assessment toolbar'
                    header_images_fit()
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-question.png'), full_page=False)
                    batch3_checked = 0
                    batch4_checked = 0
                    batch5_checked = 0
                    for index in range(EXPECTED_COUNT):
                        page.locator(f'[data-goto="{index}"]').click()
                        item = page.evaluate('i=>{const q=window.__TB.getFeedbackSnapshot().records[i].question;return {answer:q.answer,batch:q.batch};}', index)
                        if item['batch'] == 3:
                            header_images_fit()
                            expect(page.locator('[data-reveal]')).to_be_visible()
                            expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                            batch3_checked += 1
                        if item['batch'] == 4:
                            header_images_fit()
                            expect(page.locator('[data-reveal]')).to_be_visible()
                            expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                            batch4_checked += 1
                        if item['batch'] == 5:
                            header_images_fit()
                            expect(page.locator('[data-reveal]')).to_be_visible()
                            expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                            batch5_checked += 1
                        page.locator(f'[data-opt="{item["answer"]}"]').click()
                    assert batch3_checked == 10
                    assert batch4_checked == 10
                    assert batch5_checked == 10
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text(f'100% ({EXPECTED_COUNT}/{EXPECTED_COUNT})')
                    expect(page.locator('.tb-domblock')).to_have_count(6)
                    expect(page.locator('#tb-overview')).to_contain_text('not an official scaled NPPE score')
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(EXPECTED_COUNT)
                    expect(page.locator('#tb-feedback-loop')).to_contain_text('primary-legislation')
                    header_images_fit()
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-review.png'), full_page=False)
                    # Learning stays a separate author-owned pool, not part of the 50-item Diagnostic.
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    page.locator('[data-set="set-1-learning"]').click()
                    expect(page.locator('[data-set="set-1-learning"] .tb-sets')).to_have_text(str(LEARNING_COUNT))
                    expect(page.locator('.nppe-mode-card[data-nppe-bank="set-1-learning"]:not([data-nppe-quiz-kind])')).to_contain_text(f'{LEARNING_COUNT} questions from Learning only')
                    expect(page.locator('#tb-overview')).not_to_contain_text(re.compile('partial learning bank', re.I))
                    expect(page.locator('#tb-overview .tb-soon')).to_contain_text('Available for practice')
                    assert page.evaluate('window.__TB.EXAMS.nppe.learning.complete') is True
                    expect(page.locator('#tb-overview')).to_contain_text(f'{LEARNING_MINUTES} minutes')
                    header_images_fit()
                    check_accessibility('learning-bank-selector')
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('[data-goto]')).to_have_count(LEARNING_COUNT)
                    expect(page.locator('#tb-timer')).to_have_text(re.compile(r'^(2:44:00|2:43:5\d)$'))
                    expect(page.locator('[data-reveal]')).to_have_count(0)
                    assert page.evaluate('window.__TB.revealCurrentAnswer()') is False
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===2).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===3).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===4).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===5).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===6).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===7).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===8).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===9).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===10).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===11).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.filter(r=>r.question.batch===12).length") == 10
                    assert page.evaluate("window.__TB.getFeedbackSnapshot().records.every(r=>r.question.form==='set-1-learning'&&r.question.authorSet===1)")
                    # Keyboard answering, flagging and persistence across navigation in Learning itself.
                    first = page.evaluate('window.__TB.getFeedbackSnapshot().records[0].question')
                    choice = page.locator(f'[data-opt="{first["answer"]}"]')
                    choice.focus()
                    expect(choice).to_be_focused()
                    page.keyboard.press('Space')
                    page.locator('[data-flag]').focus()
                    page.keyboard.press('Enter')
                    page.locator('[data-next]').focus()
                    page.keyboard.press('Enter')
                    page.locator('[data-goto="0"]').focus()
                    page.keyboard.press('Enter')
                    expect(page.locator(f'[data-opt="{first["answer"]}"]')).to_have_attribute('aria-pressed', 'true')
                    expect(page.locator('[data-flag]')).to_have_attribute('aria-pressed', 'true')
                    check_accessibility('learning-active-question')
                    page.screenshot(path=str(out / f'{name}-learning-question.png'), full_page=False)
                    for learning_index in range(LEARNING_COUNT):
                        page.locator(f'[data-goto="{learning_index}"]').click()
                        q = page.evaluate('i=>window.__TB.getFeedbackSnapshot().records[i].question', learning_index)
                        header_images_fit()
                        expect(page.locator('[data-opt]')).to_have_count(4)
                        page.locator(f'[data-opt="{q["answer"]}"]').click()
                    assert page.evaluate('window.__TB.getFeedbackSnapshot().records.every(r=>!r.revealed)')
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text(f'100% ({LEARNING_COUNT}/{LEARNING_COUNT})')
                    expect(page.locator('.tb-domblock')).to_have_count(6)
                    for index, count in enumerate(LEARNING_DOMAINS):
                        domain = page.locator('.tb-domblock').nth(index)
                        expect(domain.locator('.tb-domp')).to_have_text('100%')
                        expect(domain).to_contain_text(f'({count}/{count})')
                    learning_review()
                    check_accessibility('learning-complete-review')
                    page.screenshot(path=str(out / f'{name}-learning-review.png'), full_page=False)
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    page.locator('[data-set="set-1-learning"]').click()
                    page.locator('[data-timing-kind="full"][data-timed="0"]').click()
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('[data-reveal]')).to_be_visible()
                    page.locator('[data-reveal]').click()
                    for option in page.locator('[data-opt]').all():
                        expect(option).to_be_disabled()
                    check_accessibility('learning-revealed-question')
                    assert page.evaluate('window.__TB.getFeedbackSnapshot().records.filter(r=>r.revealed===true).length') == 1
                    assisted_locked = 0
                    for learning_index in range(LEARNING_COUNT):
                        page.locator(f'[data-goto="{learning_index}"]').click()
                        learning_q=page.evaluate('i=>window.__TB.getFeedbackSnapshot().records[i].question',learning_index)
                        answer_button = page.locator(f'[data-opt="{learning_q["answer"]}"]')
                        if answer_button.is_disabled():
                            # Revealing an answer intentionally locks that item's options.
                            # Its assisted status must survive navigation and submission.
                            assert page.evaluate('i=>window.__TB.getFeedbackSnapshot().records[i].revealed===true',learning_index)
                            assisted_locked += 1
                        else:
                            answer_button.click()
                    assert assisted_locked == 1, 'Exactly one intentionally revealed answer must remain locked'
                    assert page.evaluate('window.__TB.getFeedbackSnapshot().records.filter(r=>r.revealed===true).length') == 1
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text(f'({LEARNING_COUNT-1}/{LEARNING_COUNT})')
                    expect(page.locator('[data-score-result]')).to_contain_text('1 revealed (scored questions count as incorrect)')
                    expect(page.locator('#tb-overview')).to_contain_text('Learning scores measure practice accuracy')
                    learning_review()
                    expect(page.locator('.tb-review-card.revealed')).to_have_count(1)
                    check_accessibility('learning-assisted-review')
                    mock_a_fixture = mock_a_release_fixture()
                    mock_b_fixture = mock_b_release_fixture()
                    assert not errors, errors
                    result = {'case': name, 'result': 'PASS', 'score': f'{EXPECTED_COUNT}/{EXPECTED_COUNT}', 'domains': 6,
                              'batch3Rendered': batch3_checked, 'batch4Rendered': batch4_checked, 'batch5Rendered': batch5_checked, 'learningQuestionsRendered': LEARNING_COUNT, 'learningAssistedReveal': True, 'learningReviewQuestions': LEARNING_COUNT, 'keyboardTabs': True, 'flagsAndNavigation': True,
                              'mockAAuthored': 110, 'mockAAvailable': True, 'revealBlocked': True, 'logosLoaded': True, 'headerOverlap': False, 'horizontalOverflow': False}
                    result.update(learningUnassistedScore=f'{LEARNING_COUNT}/{LEARNING_COUNT}', learningAssistedScore=f'{LEARNING_COUNT-1}/{LEARNING_COUNT}',
                                  learningDomainTotals=LEARNING_DOMAINS, learningRationalesVerified=LEARNING_COUNT*4,
                                  learningKeyboardAndPersistence=True, accessibility=accessibility, mockAReleaseFixture=mock_a_fixture, mockBReleaseFixture=mock_b_fixture)
                except Exception as error:
                    result = {'case': name, 'result': 'FAIL', 'error': str(error), 'pageErrors': errors, 'accessibility': accessibility}
                    try:
                        page.screenshot(path=str(out / f'{name}-failure.png'), full_page=False, timeout=5000)
                    except Exception as screenshot_error:
                        result['screenshotError'] = str(screenshot_error)
                report['cases'].append(result)
                (out / f'{args.browser}-report.json').write_text(json.dumps(report, indent=2))
                print(json.dumps(result), flush=True)
                context.close()
        browser.close()
    assert all(case['result'] == 'PASS' for case in report['cases']), 'See NPPE visual regression report'


if __name__ == '__main__':
    main()
