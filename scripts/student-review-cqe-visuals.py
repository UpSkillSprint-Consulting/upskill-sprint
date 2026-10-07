"""Browser checks for exact CQE PDF crops at desktop/mobile sizes in both themes."""
import argparse
import json
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--browser', choices=['chromium', 'webkit'], required=True)
parser.add_argument('--out', default='student-audit-evidence')
args = parser.parse_args()
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
auth = runpy.run_path('scripts/student-review-browser.py')['AUTH']
report = {'browser': args.browser, 'checks': [], 'errors': []}
with sync_playwright() as pw:
    browser = getattr(pw, args.browser).launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.on('pageerror', lambda error: report['errors'].append(str(error)))

    def route(request):
        url = urlparse(request.request.url)
        if url.path == '/auth.js':
            request.fulfill(content_type='application/javascript', body=auth)
        elif url.netloc != '127.0.0.1:8765' or request.request.method not in ['GET', 'HEAD']:
            request.abort()
        else:
            request.continue_()

    page.route('**/*', route)
    try:
        page.goto('http://127.0.0.1:8765/test-bank')
        page.wait_for_selector('body.access-ready')
        numbers = page.evaluate('''() => window.__TB.EXAMS.cqe.sets[3].flatMap((q,i) => q.chart?.type === 'source-image' ? [i+1] : [])''')
        assert len(numbers) == 58
        for width in [1280, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 900})
            for theme in ['light', 'dark']:
                page.evaluate('(theme) => document.documentElement.dataset.theme = theme', theme)
                for number in numbers:
                    # Use the same shared body renderer as the live player and post-exam review.
                    page.evaluate('''n => {
                      const q = window.__TB.EXAMS.cqe.sets[3][n-1];
                      const host = document.querySelector('#tb-overview');
                      host.innerHTML = '<div class="tb-quiz">' + window.__TB.renderQuestionContent(q, false) + '</div>';
                    }''', number)
                    page.locator('.tb-source-image').wait_for(state='visible')
                    page.wait_for_function('''() => { const i=document.querySelector('.tb-source-image'); return i?.complete && i.naturalWidth>0; }''')
                    geometry = page.locator('.tb-source-image').evaluate('''i => {
                      const r=i.getBoundingClientRect(), s=getComputedStyle(i), f=i.closest('figure');
                      return {naturalWidth:i.naturalWidth, expectedWidth:Number(i.getAttribute('width')),
                        width:r.width, left:r.left, right:r.right, viewport:innerWidth,
                        figureClient:f.clientWidth, figureScroll:f.scrollWidth, filter:s.filter,
                        background:s.backgroundColor, src:i.getAttribute('src')};
                    }''')
                    assert geometry['naturalWidth'] == geometry['expectedWidth'], geometry
                    assert geometry['left'] >= -1 and geometry['right'] <= width + 1, geometry
                    assert geometry['figureScroll'] <= geometry['figureClient'] + 2, geometry
                    assert geometry['background'] == 'rgb(255, 255, 255)' and geometry['filter'] == 'none', geometry
                    report['checks'].append({'question': number, 'theme': theme, 'viewport': width, **geometry})
                    if number in [316, 342, 487, 599] and width in [1280, 320]:
                        page.locator('.tb-source-figure').screenshot(path=str(out / f'cqe-{number}-{theme}-{width}.png'))
        # The image link must load the same full-resolution file in a real tab.
        with page.expect_popup() as popup_info:
            page.locator('.tb-source-figure figcaption a').click()
        popup = popup_info.value
        popup.wait_for_load_state()
        assert popup.url.endswith(report['checks'][-1]['src']), popup.url
        popup.close()
        assert not report['errors'], report['errors']
        report['result'] = 'PASS'
    except Exception as error:
        report['result'] = 'FAIL'
        report['failure'] = str(error)
    finally:
        (out / 'cqe-source-visuals.json').write_text(json.dumps(report, indent=2))
        print(f"CQE source figures: {report['result']}; {len(report['checks'])} image/layout checks", flush=True)
        if report.get('failure'):
            print(report['failure'], flush=True)
        browser.close()
raise SystemExit(0 if report['result'] == 'PASS' else 1)
