"""NPPE Diagnostic UI regression against the real staged build and local endpoint.

Only the upstream identity/permission decision uses the existing explicit grant
fixture. All external traffic and network writes are blocked. No live users,
Supabase rows, publication states or access grants are changed.
"""
import argparse
import json
import os
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

helpers = runpy.run_path(str(Path(__file__).with_name('exam-practice-browser.py')))


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
        for width in [390, 1440]:
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
                try:
                    page.goto(base + '/test-bank?exam=nppe')
                    page.wait_for_selector('body.exam-access-ready')
                    if page.locator('html').get_attribute('data-theme') != theme:
                        page.get_by_role('switch', name='Switch to ' + theme + ' mode').click()
                    expect(page.locator('html')).to_have_attribute('data-theme', theme)
                    page.locator('[data-nppe-owner="1"]').click()
                    expect(page.locator('#nppe-banks-1')).to_be_visible()
                    expect(page.locator('#nppe-banks-2')).to_be_hidden()
                    expect(page.locator('#nppe-banks-3')).to_be_hidden()
                    expect(page.locator('[data-set="set-1-diagnostic"] .tb-sets')).to_have_text('10')
                    expect(page.locator('#tb-overview')).to_contain_text('10 of 50 planned')
                    # Broken header/footer images in a screenshot must not be dismissed
                    # as a passing visual check: verify the actual served image bytes.
                    page.wait_for_function('''() => {
                      const images=[...document.querySelectorAll('header.site .brand img, footer.site .brand img')];
                      return images.length>=2 && images.every(image=>image.complete && image.naturalWidth>0);
                    }''')
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-banks.png'), full_page=True)
                    page.locator('[data-timing-kind="full"][data-timed="0"]').click()
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('.tb-quiz')).to_be_visible()
                    expect(page.locator('[data-goto]')).to_have_count(10)
                    expect(page.locator('[data-reveal]')).to_have_count(0)
                    expect(page.locator('[data-flag]')).to_be_visible()
                    expect(page.locator('.tb-diag-kick')).not_to_contain_text('Sample diagnostic')
                    if width <= 860:
                        expect(page.locator('header.site')).to_have_css('position', 'static')
                        expect(page.locator('.tb-quiztop')).to_have_css('flex-direction', 'column')
                        assert page.locator('.tb-toolbar').evaluate('''bar=>{
                          const h=document.querySelector('header.site').getBoundingClientRect(),b=bar.getBoundingClientRect();
                          return h.bottom<=b.top+1;
                        }'''), 'Site header covers the assessment toolbar'
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-question.png'), full_page=True)
                    for index in range(10):
                        page.locator(f'[data-goto="{index}"]').click()
                        answer = page.evaluate('i=>window.__TB.getFeedbackSnapshot().records[i].question.answer', index)
                        page.locator(f'[data-opt="{answer}"]').click()
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_contain_text('100% (10/10)')
                    expect(page.locator('.tb-domblock')).to_have_count(6)
                    expect(page.locator('#tb-overview')).to_contain_text('not an official scaled NPPE score')
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(10)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(out / f'{name}-review.png'), full_page=True)
                    assert not errors, errors
                    result = {'case': name, 'result': 'PASS', 'score': '10/10', 'domains': 6,
                              'logosLoaded': True, 'horizontalOverflow': False}
                except Exception as error:
                    result = {'case': name, 'result': 'FAIL', 'error': str(error), 'pageErrors': errors}
                    page.screenshot(path=str(out / f'{name}-failure.png'), full_page=True)
                report['cases'].append(result)
                (out / f'{args.browser}-report.json').write_text(json.dumps(report, indent=2))
                print(json.dumps(result), flush=True)
                context.close()
        browser.close()
    assert all(case['result'] == 'PASS' for case in report['cases']), 'See NPPE visual regression report'


if __name__ == '__main__':
    main()
