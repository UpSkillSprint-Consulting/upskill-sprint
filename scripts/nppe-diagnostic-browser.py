"""Audit the staged NPPE build using isolated identity/permission fixtures.

External traffic and network writes are blocked. This is not a signed-in
production-account test. Viewport screenshots avoid browser image-size limits.
"""
import argparse
import json
import os
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

helpers = runpy.run_path(str(Path(__file__).with_name('exam-practice-browser.py')))
EXPECTED_COUNT = 30
EXPECTED_MINUTES = 41


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
                    page.locator('[data-nppe-owner="1"]').press('ArrowRight')
                    expect(page.locator('#nppe-banks-2')).to_be_visible()
                    expect(page.locator('#nppe-banks-1')).to_be_hidden()
                    page.locator('[data-nppe-owner="2"]').press('ArrowRight')
                    expect(page.locator('#nppe-banks-3')).to_be_visible()
                    page.locator('[data-nppe-owner="3"]').press('Home')
                    expect(page.locator('#nppe-banks-1')).to_be_visible()
                    expect(page.locator('#nppe-banks-2')).to_be_hidden()
                    expect(page.locator('#nppe-banks-3')).to_be_hidden()
                    expect(page.locator('[data-set="set-1-diagnostic"] .tb-sets')).to_have_text(str(EXPECTED_COUNT))
                    expect(page.locator('#tb-overview')).to_contain_text(f'{EXPECTED_COUNT} of 50 planned')
                    expect(page.locator('#tb-overview')).to_contain_text(f'{EXPECTED_MINUTES} minutes')
                    page.wait_for_function('''() => {
                      const images=[...document.querySelectorAll('header.site .brand img, footer.site .brand img')];
                      return images.length>=2 && images.every(image=>image.complete && image.naturalWidth>0);
                    }''')
                    header_images_fit()
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-banks.png'), full_page=False)
                    page.locator('[data-timing-kind="full"][data-timed="0"]').click()
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('.tb-quiz')).to_be_visible()
                    expect(page.locator('[data-goto]')).to_have_count(EXPECTED_COUNT)
                    expect(page.locator('[data-reveal]')).to_have_count(0)
                    assert page.evaluate('window.__TB.revealCurrentAnswer()') is False
                    expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                    expect(page.locator('[data-flag]')).to_be_visible()
                    expect(page.locator('.tb-diag-kick')).not_to_contain_text('Sample diagnostic')
                    page.locator('[data-opt="1"]').click()
                    page.locator('[data-flag]').click()
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
                    for index in range(EXPECTED_COUNT):
                        page.locator(f'[data-goto="{index}"]').click()
                        item = page.evaluate('i=>{const q=window.__TB.getFeedbackSnapshot().records[i].question;return {answer:q.answer,batch:q.batch};}', index)
                        if item['batch'] == 3:
                            header_images_fit()
                            expect(page.locator('[data-reveal]')).to_have_count(0)
                            expect(page.locator('#tb-feedback-loop')).to_have_count(0)
                            batch3_checked += 1
                        page.locator(f'[data-opt="{item["answer"]}"]').click()
                    assert batch3_checked == 10
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
                    assert not errors, errors
                    result = {'case': name, 'result': 'PASS', 'score': f'{EXPECTED_COUNT}/{EXPECTED_COUNT}', 'domains': 6,
                              'batch3Rendered': batch3_checked, 'keyboardTabs': True, 'flagsAndNavigation': True,
                              'revealBlocked': True, 'logosLoaded': True, 'headerOverlap': False, 'horizontalOverflow': False}
                except Exception as error:
                    result = {'case': name, 'result': 'FAIL', 'error': str(error), 'pageErrors': errors}
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
