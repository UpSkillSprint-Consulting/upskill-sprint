"""Responsive homepage and focused certification QA against the protected build.

Uses the existing isolated account fixture and real local delivery endpoint.
No live account mutations or external requests are permitted.
"""
import argparse
import json
import os
import runpy
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

helpers = runpy.run_path(str(Path(__file__).with_name('exam-practice-browser.py')))


class ExamCatalog(HTMLParser):
    """Read expected identities from the delivered static catalog, not a fixed total."""
    def __init__(self):
        super().__init__()
        self.entries = {}

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag != 'article' or 'exam-card' not in values.get('class', '').split():
            return
        key = values.get('data-exam')
        status = values.get('data-publication')
        assert key and key not in self.entries, 'Missing or duplicate exam identity'
        assert status in ['published', 'coming_soon', 'retired'], 'Invalid publication state'
        self.entries[key] = status


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:8765')
    parser.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    parser.add_argument('--out', default='exam-practice-audit-evidence')
    args = parser.parse_args()
    base = args.url.rstrip('/')
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'browser': args.browser, 'revision': os.environ.get('PR_HEAD_SHA'), 'cases': [], 'errors': []}
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch()
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')

        def route(request_route):
            request = request_route.request
            parsed = urlparse(request.url)
            if request.method not in ['GET', 'HEAD'] or parsed.netloc != urlparse(base).netloc:
                request_route.abort()
            elif parsed.path == '/vendor/supabase.js':
                request_route.fulfill(content_type='application/javascript', body=helpers['account_fixture'](True))
            else:
                request_route.continue_()

        context.route('**/*', route)
        page = context.new_page()
        page.set_default_timeout(10000)
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        catalog_response = context.request.get(base + '/exam-practice')
        assert catalog_response.ok, 'Could not read the static exam catalog'
        catalog = ExamCatalog()
        catalog.feed(catalog_response.text())
        published = [key for key, status in catalog.entries.items() if status == 'published']
        visible_keys = {key for key, status in catalog.entries.items() if status != 'retired'}
        assert published, 'The released certification catalog must not be empty'
        report['catalog'] = catalog.entries

        def record(name, action):
            try:
                action()
                assert not report['errors'], report['errors']
                result = {'case': name, 'result': 'PASS'}
            except Exception as error:
                result = {'case': name, 'result': 'FAIL', 'error': str(error)}
                page.screenshot(path=str(out / f'{args.browser}-{name}-failure.png'), full_page=True)
            report['cases'].append(result)
            print(json.dumps(result), flush=True)
            (out / f'homepage-certification-{args.browser}.json').write_text(json.dumps(report, indent=2))

        def set_theme(theme):
            if page.locator('html').get_attribute('data-theme') != theme:
                page.get_by_role('switch', name='Switch to ' + theme + ' mode').click()
            expect(page.locator('html')).to_have_attribute('data-theme', theme)

        def full_width_exam():
            expect(page.locator('.tb-rail')).to_be_hidden()
            expect(page.locator('.tb-tile:visible, #tb-mobile-cert-select')).to_have_count(0)
            geometry = page.locator('.tb-shell').evaluate('''shell => {
              const s=shell.getBoundingClientRect(), m=shell.querySelector('.tb-main').getBoundingClientRect();
              return {shellLeft:s.left,shellRight:s.right,mainLeft:m.left,mainRight:m.right,width:innerWidth};
            }''')
            assert abs(geometry['mainLeft'] - geometry['shellLeft']) <= 1, geometry
            assert abs(geometry['mainRight'] - geometry['shellRight']) <= 1, geometry
            assert geometry['mainLeft'] >= 0 and geometry['mainRight'] <= geometry['width'] + 1, geometry
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')

        page.goto(base + '/')
        labels = page.locator('#hero-distributions text').all_text_contents()
        assert len(labels) == 4
        for theme in ['light', 'dark']:
            set_theme(theme)
            for width in [320, 390, 640, 768, 900, 901, 1440]:
                def homepage(width=width):
                    page.set_viewport_size({'width': width, 'height': 1000})
                    svg = page.locator('#hero-distributions')
                    expect(svg).to_have_attribute('viewBox', '0 0 700 760' if width <= 900 else '0 0 1400 380')
                    expect(svg.locator('animate, animateMotion')).to_have_count(0)
                    assert svg.locator('text').all_text_contents() == labels
                    geometry = svg.evaluate('''svg => {
                      const r=svg.getBoundingClientRect();
                      const groups=[...svg.querySelectorAll(':scope > g')];
                      const labels=groups.map(g=>{
                        const t=g.querySelector('text'), b=t.getBoundingClientRect(), m=t.getScreenCTM();
                        return {text:t.textContent,left:b.left,right:b.right,top:b.top,bottom:b.bottom,
                          size:parseFloat(getComputedStyle(t).fontSize)*Math.hypot(m.a,m.b)};
                      });
                      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,height:r.height,labels,
                        contentBottom:document.querySelector('.home-hero > .wrap').getBoundingClientRect().bottom,
                        documentWidth:document.documentElement.scrollWidth,width:innerWidth};
                    }''')
                    assert geometry['height'] > 0 and geometry['documentWidth'] <= width + 1, geometry
                    assert geometry['contentBottom'] <= geometry['top'], geometry
                    for label in geometry['labels']:
                        assert label['size'] >= 12, label
                        assert label['left'] >= geometry['left'] - 1 and label['right'] <= geometry['right'] + 1, label
                        assert label['top'] >= geometry['top'] and label['bottom'] <= geometry['bottom'] + 1, label
                    for index, first in enumerate(geometry['labels']):
                        for second in geometry['labels'][index+1:]:
                            assert min(first['right'],second['right']) <= max(first['left'],second['left']) or min(first['bottom'],second['bottom']) <= max(first['top'],second['top']), geometry
                    if width in [390, 1440]:
                        page.screenshot(path=str(out / f'homepage-{args.browser}-{width}-{theme}.png'), full_page=True)
                record(f'homepage-{width}-{theme}', homepage)

        def motion_and_counts():
            context.set_default_timeout(10000)
            page.emulate_media(reduced_motion='no-preference')
            expect(page.locator('#hero-distributions animate').first).to_be_attached()
            page.emulate_media(reduced_motion='reduce')
            expect(page.locator('#hero-distributions animate')).to_have_count(0)
            page.locator('#trust-stats').scroll_into_view_if_needed()
            expect(page.locator('[data-stat-key="exams"]')).to_have_text(str(len(published)))
            expect(page.locator('#trust-heading')).to_have_text('Meet the person behind UpSkill Sprint')
            expect(page.locator('#trust-stats')).to_contain_text('Certification exams')
        record('homepage-motion-and-counts', motion_and_counts)

        for theme in ['light', 'dark']:
            for width in [320, 390, 768, 1440]:
                def directory(width=width, theme=theme):
                    page.set_viewport_size({'width': width, 'height': 1000})
                    page.goto(base + '/exam-practice')
                    set_theme(theme)
                    expect(page.locator('#my-exams-grid .exam-card')).to_have_count(len(published))
                    # Wait for the real theme switch to paint before sampling colours.
                    expected_cqe = 'rgb(24, 45, 76)' if theme == 'dark' else 'rgb(233, 241, 255)'
                    expect(page.locator('#exam-cqe')).to_have_css('background-color', expected_cqe)
                    # WebKit may resolve the new card surface before inherited title ink
                    # after a dark-to-light switch. Require the final title palette too;
                    # the unchanged per-card 4.5:1 checks below still validate every colour.
                    expected_title = 'rgb(241, 245, 249)' if theme == 'dark' else 'rgb(28, 36, 48)'
                    for title in page.locator('.exam-card h3').all():
                        expect(title).to_have_css('color', expected_title)
                    cards = page.locator('.exam-card').evaluate_all('''cards=>cards.map(card=>({
                      exam:card.dataset.exam,background:getComputedStyle(card).backgroundColor,
                      text:[...card.querySelectorAll('h3,.exam-acronym,.exam-card-detail,.exam-card-note')].map(e=>getComputedStyle(e).color)
                    }))''')
                    assert len(cards) == len(visible_keys), cards
                    assert {card['exam'] for card in cards} == visible_keys, cards
                    # Every rendered certification needs its own colour, including new additions.
                    assert len({card['background'] for card in cards}) == len(cards), cards
                    for card in cards:
                        for color in card['text']:
                            assert helpers['contrast_ratio'](color, card['background']) >= 4.5, card
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                    before = page.locator('#exam-cqe').evaluate('e=>getComputedStyle(e).backgroundColor')
                    page.locator('#exam-directory-search').fill('CQE')
                    expect(page.locator('.exam-card:visible')).to_have_count(1)
                    expect(page.locator('#exam-cqe')).to_have_css('background-color', before)
                    page.locator('#exam-directory-search').fill('')
                    page.screenshot(path=str(out / f'cards-{args.browser}-{width}-{theme}.png'), full_page=True)
                record(f'cards-{width}-{theme}', directory)

        for exam in published:
            for width in [320, 390, 1440]:
                def focused(exam=exam, width=width):
                    page.set_viewport_size({'width': width, 'height': 1000})
                    page.goto(base + '/test-bank?exam=' + exam)
                    page.wait_for_selector('body.exam-access-ready')
                    tile = page.locator('.tb-tile')
                    expect(tile).to_have_count(1)
                    expect(tile).to_have_attribute('data-exam', exam)
                    full_width_exam()
                    if exam == 'mbb':
                        expect(page.locator('#tb-herotitle')).to_have_text('ASQ Certified Six Sigma Master Black Belt')
                    back = page.locator('.tb-crumb a')
                    expect(back).to_have_text('Back to All Certifications')
                    page.screenshot(path=str(out / f'focused-{exam}-{width}-{args.browser}.png'), full_page=True)
                    # NPPE's explicit bank launch replaces generic quick/mixed-bank practice.
                    launch = '[data-mode="full"]' if exam == 'nppe' else '[data-mode="quick"]'
                    page.locator(launch).click()
                    expect(page.locator('.tb-quiz')).to_be_visible()
                    full_width_exam()
                    page.locator('[data-backsim]').click()
                    expect(page.locator(launch)).to_be_visible()
                    full_width_exam()
                    page.locator(launch).click()
                    expect(page.locator('.tb-quiz')).to_be_visible()
                    page.locator('[data-goto]').last.click()
                    page.locator('[data-submit]').click()
                    expect(page.locator('[data-score-result]')).to_be_visible()
                    full_width_exam()
                    page.locator('[data-back]').click()
                    expect(page.locator(launch)).to_be_visible()
                    full_width_exam()
                    back.click()
                    expect(page.locator('#my-exams-grid .exam-card')).to_have_count(len(published))
                record(f'focused-{exam}-{width}', focused)
        browser.close()
    assert all(case['result'] == 'PASS' for case in report['cases']), 'See browser QA report for failures'


if __name__ == '__main__':
    main()
