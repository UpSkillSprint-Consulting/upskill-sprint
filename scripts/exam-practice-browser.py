"""Exam-directory learner audit for CI, using isolated account fixtures only.

The repository HTML, styles, navigation, account menu, and access gate remain
real. Only the Supabase transport is replaced with the same Premium fixture
data used by student-review-browser.py. All account writes and external
requests are blocked. Run against scripts/student-review-server.mjs.
"""
import argparse
import json
import os
import re
import time
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import expect, sync_playwright


def account_fixture(premium):
    user = {
        "id": "student-audit-fixture",
        "email": "student@example.invalid",
        "user_metadata": {"display_name": "Student assessment"},
    } if premium else None
    # Exercise the production Account menu as well as the gate. Replacing
    # auth.js itself would omit Account and underestimate the header width.
    return """(() => {
      const user = %s;
      const profile = user && {user_id:user.id,display_name:'Student assessment',onboarding_completed:true};
      const readQuery = {select(){return this},eq(){return this},in(){return this},order(){return this},limit(){return this},
        maybeSingle:async()=>({data:profile,error:null}),single:async()=>({data:profile,error:null}),
        then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};
      const client = {
        auth:{onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
          getSession:async()=>({data:{session:user ? {user} : null},error:null})},
        rpc:async name=>{
          if(name==='can_access_content')return {data:!!user,error:null};
          if(name==='current_access_level')return {data:user?'premium':'public',error:null};
          throw Error('Unexpected account RPC: '+name);
        },
        from:()=>Object.create(readQuery)
      };
      window.supabase={createClient:()=>client};
    })();""" % json.dumps(user)


HEADER_GEOMETRY = """() => {
  const header=document.querySelector('header.site');
  const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'};
  const rect=e=>{const r=e.getBoundingClientRect();return {name:e.className,left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
  const groups=[...header.children].filter(e=>e.matches('.brand,nav.desktop-nav,.header-actions')).filter(visible).map(rect);
  const controls=[...header.querySelector('.header-actions').children].filter(e=>!e.matches('.uss-menu-toggle')).filter(visible).map(rect);
  const overlaps=rows=>rows.flatMap((a,i)=>rows.slice(i+1).filter(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1).map(b=>[a.name,b.name]));
  return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,groups,controls,
    overlaps:[...overlaps(groups),...overlaps(controls)]};
}"""


CTA_COLORS = """element => {
  const style=getComputedStyle(element);
  return {text:style.color,background:style.backgroundColor,fontSize:style.fontSize,label:element.textContent.trim()};
}"""


def contrast_ratio(text, background):
    def luminance(css_color):
        values = [float(value) for value in re.findall(r"[\d.]+", css_color)]
        assert len(values) >= 3, css_color
        assert len(values) < 4 or values[3] == 1, "CTA color must be opaque: " + css_color
        channels = [value / 255 for value in values[:3]]
        channels = [value / 12.92 if value <= .04045 else ((value + .055) / 1.055) ** 2.4 for value in channels]
        return sum(value * weight for value, weight in zip(channels, [.2126, .7152, .0722]))
    light, dark = sorted([luminance(text), luminance(background)], reverse=True)
    return (light + .05) / (dark + .05)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:8765')
    parser.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    parser.add_argument('--out', default='exam-practice-audit-evidence')
    args = parser.parse_args()
    base = args.url.rstrip('/')
    origin = urlparse(base).netloc
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {
        'browser': args.browser,
        'revision': os.environ.get('PR_HEAD_SHA', 'local'),
        'basis': 'Repository pages and real account menu; isolated signed-out/Premium Supabase fixtures; no real accounts',
        'cases': [], 'errors': [], 'network_writes': [],
    }

    def save():
        (out / 'exam-practice-assessment.json').write_text(json.dumps(report, indent=2))

    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch(headless=True)
        for premium in [False, True]:
            tier = 'premium' if premium else 'signed-out'
            context = browser.new_context(viewport={'width': 1536, 'height': 1000}, device_scale_factor=1)

            def route(request_route):
                request = request_route.request
                parsed = urlparse(request.url)
                if request.method not in ['GET', 'HEAD']:
                    report['network_writes'].append({'method': request.method, 'url': request.url})
                    request_route.abort()
                    return
                if parsed.netloc != origin:
                    request_route.abort()
                    return
                if parsed.path == '/vendor/supabase.js':
                    request_route.fulfill(content_type='application/javascript', body=account_fixture(premium))
                    return
                if parsed.path in ['/lessons', '/lessons.html', '/lessons/', '/lessons.html/']:
                    # The read-only server serves extensionless files, while
                    # Netlify also accepts a slash. Keep the browser's original
                    # location and serve the exact repository lessons document.
                    response = request_route.fetch(url=base + '/lessons.html')
                    request_route.fulfill(response=response)
                    return
                request_route.continue_()

            context.route('**/*', route)
            page = context.new_page()
            page.set_default_timeout(8000)
            page.on('pageerror', lambda error: report['errors'].append(str(error)))

            def record(name, operation):
                name = tier + '/' + name
                start = time.monotonic()
                try:
                    operation()
                    assert not report['errors'], report['errors']
                    assert not report['network_writes'], report['network_writes']
                    case = {'name': name, 'result': 'PASS'}
                except Exception as error:
                    case = {'name': name, 'result': 'FAIL', 'error': str(error)}
                    try:
                        page.screenshot(path=str(out / (name.replace('/', '-') + '-failure.png')), full_page=True, timeout=3000)
                    except Exception:
                        pass
                case['seconds'] = round(time.monotonic() - start, 2)
                report['cases'].append(case)
                print(json.dumps(case), flush=True)
                save()

            def directory():
                page.goto(base + '/exam-practice', wait_until='load')
                expect(page.locator('#account-menu-btn')).to_be_visible()
                expect(page.locator('h1')).to_have_text('Simulated Exam Practice & Quizzes')
                assert urlparse(page.url).path == '/exam-practice', 'Public directory must not require sign-in'
                expect(page.locator('#access-notice')).to_have_count(0)

            def nav_state(current):
                for selector in ['nav.desktop-nav', 'nav.mobile-nav']:
                    nav = page.locator(selector)
                    expect(nav).to_have_count(1)
                    links = nav.locator('a').evaluate_all("rows=>rows.map(e=>({text:e.textContent.trim(),href:e.getAttribute('href'),current:e.getAttribute('aria-current')}))")
                    labels = [link['text'] for link in links]
                    position = labels.index('Lessons')
                    assert labels[position + 1:position + 3] == ['Exam Practice & Quizzes', 'Engineering Tools'], links
                    assert labels.count('Exam Practice & Quizzes') == 1, links
                    exam = links[position + 1]
                    assert exam['href'] == '/exam-practice', exam
                    assert [link['text'] for link in links if link['current'] == 'page'] == [current], links

            def no_header_overlap():
                geometry = page.evaluate(HEADER_GEOMETRY)
                assert geometry['documentWidth'] <= geometry['width'] + 2, geometry
                assert not geometry['overlaps'], geometry
                for item in geometry['groups'] + geometry['controls']:
                    assert item['left'] >= -1 and item['right'] <= geometry['width'] + 1, geometry

            def learner_directory():
                directory()
                nav_state('Exam Practice & Quizzes')
                expect(page.locator('.exam-card')).to_have_count(7)
                expect(page.locator('.exam-coming-soon .exam-card')).to_have_count(1)
                expect(page.locator('.exam-card[href="/test-bank?exam=mbb"] h3')).to_have_text('Certified Six Sigma Master Black Belt')
                for certification in ['cqa']:
                    card = page.locator(f'.exam-coming-soon .exam-card[href="/test-bank?exam={certification}"]')
                    expect(card).to_have_count(1)
                    expect(card.locator('.exam-status')).to_have_text('Coming soon')
                    expect(card.locator('.exam-card-action')).to_contain_text('View exam details')
                cre = page.locator('.exam-card[href="/test-bank?exam=cre"]')
                expect(cre.locator('.exam-status')).to_have_text('Sets 1–3: 345 questions available')
                expect(cre.locator('.exam-card-action')).to_contain_text('Start practicing')
                expect(page.locator('.exam-intro')).to_contain_text('untimed')
                expect(page.locator('.exam-actions a[href="/test-bank"]')).to_be_visible()
                expect(page.locator('footer a[href="/exam-practice"]')).to_be_visible()
                for card in page.locator('.exam-card').all():
                    expect(card).to_have_attribute('href', re.compile(r'^/test-bank\?exam=[^&#]+$'))
                # Use the real Account menu to confirm the fixture state.
                page.locator('#account-menu-btn').click()
                if premium:
                    expect(page.locator('#account-menu-name')).to_have_text('Student assessment')
                    expect(page.locator('[data-account-access]')).to_have_text('Access level: Premium member')
                else:
                    expect(page.locator('#account-menu-signin')).to_be_visible()
                page.keyboard.press('Escape')

            record('public-directory-and-availability', learner_directory)

            def layout(width, theme):
                page.set_viewport_size({'width': width, 'height': 900})
                directory()
                page.evaluate('(theme)=>document.documentElement.dataset.theme=theme', theme)
                nav_state('Exam Practice & Quizzes')
                no_header_overlap()
                # Long full names must wrap without clipping at every breakpoint.
                expected_columns = 1 if width <= 640 else 2 if width <= 900 else 3
                columns = page.locator('.exam-grid').first.evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').length")
                assert columns == expected_columns, (width, columns, expected_columns)
                page.keyboard.press('Tab')
                for card in page.locator('.exam-card').all():
                    bounds = card.bounding_box()
                    assert bounds and bounds['height'] >= 44 and bounds['x'] >= 0 and bounds['x'] + bounds['width'] <= width + 1, bounds
                    assert card.evaluate('e=>e.scrollWidth<=e.clientWidth+1'), card.inner_text()
                    for label in card.locator('h3,.exam-acronym,.exam-status,.exam-card-action').all():
                        colors = label.evaluate("""e=>{
                          const style=getComputedStyle(e);
                          let parent=e;
                          while(parent && getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)') parent=parent.parentElement;
                          return {text:style.color,background:getComputedStyle(parent).backgroundColor};
                        }""")
                        assert contrast_ratio(colors['text'], colors['background']) >= 4.5, (theme, label.inner_text(), colors)
                        label_bounds = label.bounding_box()
                        assert label_bounds['x'] >= bounds['x'] and label_bounds['x'] + label_bounds['width'] <= bounds['x'] + bounds['width'] + 1, label_bounds
                    card.focus()
                    expect(card).to_be_focused()
                    outline = card.evaluate("e=>({style:getComputedStyle(e).outlineStyle,width:parseFloat(getComputedStyle(e).outlineWidth)})")
                    assert outline['style'] != 'none' and outline['width'] >= 2, outline
                if width <= 1440:
                    expect(page.locator('nav.desktop-nav')).not_to_be_visible()
                    menu = page.locator('button.uss-menu-toggle')
                    expect(menu).not_to_have_attribute('hidden', '')
                    menu.focus()
                    expect(menu).to_be_focused()
                    page.keyboard.press('Enter')
                    expect(menu).to_have_attribute('aria-expanded', 'true')
                    expect(page.locator('nav.mobile-nav')).to_be_visible()
                    exam = page.locator('nav.mobile-nav a[href="/exam-practice"]')
                    exam.focus()
                    expect(exam).to_be_focused()
                    page.keyboard.press('Escape')
                    expect(menu).to_have_attribute('aria-expanded', 'false')
                    expect(menu).to_be_focused()
                    expect(page.locator('nav.mobile-nav')).not_to_be_visible()
                else:
                    expect(page.locator('nav.desktop-nav')).to_be_visible()
                    expect(page.locator('button.uss-menu-toggle')).to_have_attribute('hidden', '')
                # Check every visible CTA in both resting and hovered states.
                for cta in page.locator('a.btn-teal').all():
                    if not cta.is_visible():
                        continue
                    for hovered in [False, True]:
                        if hovered:
                            cta.hover()
                        else:
                            page.mouse.move(0, 0)
                        # CSS uses a 0.2-second color transition.
                        page.wait_for_timeout(250)
                        colors = cta.evaluate(CTA_COLORS)
                        ratio = contrast_ratio(colors['text'], colors['background'])
                        assert ratio >= 4.5, {'theme': theme, 'width': width, 'hovered': hovered, 'contrast': ratio, **colors}
                        bounds = cta.bounding_box()
                        assert bounds and bounds['x'] >= -1 and bounds['x'] + bounds['width'] <= width + 1, bounds
                # Keyboard/hover checks scroll the page. Reset before capture so
                # the sticky header is shown at the top, not over the cards.
                page.evaluate("()=>{document.activeElement.blur();window.scrollTo({top:0,behavior:'instant'});}")
                page.mouse.move(0, 0)
                page.wait_for_timeout(250)
                page.screenshot(path=str(out / f'{tier}-directory-{width}-{theme}.png'), full_page=True)

            for width in [320, 390, 768, 1440, 1441, 1536]:
                for theme in ['light', 'dark']:
                    record(f'layout-{width}-{theme}', lambda w=width, t=theme: layout(w, t))

            def certification_links():
                page.set_viewport_size({'width': 1536, 'height': 1000})
                directory()
                chips = page.locator('.exam-card').evaluate_all("rows=>rows.map(e=>({label:e.textContent.trim(),href:e.getAttribute('href')}))")
                assert chips, 'The directory must offer certification links'
                for chip in chips:
                    directory()
                    parsed = urlparse(chip['href'])
                    assert parsed.path == '/test-bank', chip
                    query = parse_qs(parsed.query)
                    assert set(query) == {'exam'} and len(query['exam']) == 1, chip
                    exam_id = query['exam'][0]
                    link = page.locator(f'.exam-certifications a[href="{chip["href"]}"]')
                    link.focus()
                    page.keyboard.press('Enter')
                    if not premium:
                        expect(page).to_have_url(re.compile(r'/sign-in(?:\.html)?\?next='))
                        next_path = parse_qs(urlparse(page.url).query)['next'][0]
                        assert next_path == chip['href'], (chip, next_path)
                        continue
                    expect(page).to_have_url(base + chip['href'])
                    page.wait_for_selector('body.auth-ready.access-ready')
                    expect(page.locator('.tb-tile.active')).to_have_attribute('data-exam', exam_id)
                    assert page.evaluate('(id)=>Object.hasOwn(__TB.EXAMS,id)', exam_id), chip
                    expect(page.locator('.tb-quiz')).to_have_count(0)
                    nav_state('Exam Practice & Quizzes')
                    if 'coming soon' in chip['label'].lower():
                        expect(page.locator('#tb-overview .tb-soon')).to_have_text('Coming soon')
                    else:
                        expect(page.locator('#tb-overview [data-mode="full"]')).to_be_visible()

            record('each-certification-link-selects-its-exam', certification_links)

            def simulator_journey():
                page.set_viewport_size({'width': 1536, 'height': 1000})
                directory()
                page.locator('.exam-actions a[href="/test-bank"]').click()
                if not premium:
                    expect(page).to_have_url(re.compile(r'/sign-in(?:\.html)?\?next='))
                    assert 'test-bank' in page.url, page.url
                    expect(page.locator('.tb-quiz')).to_have_count(0)
                    return
                page.wait_for_selector('body.auth-ready.access-ready')
                assert not urlparse(page.url).query, 'Main entry must open the full catalog without an exam query'
                expect(page.locator('#tb-overview')).to_be_visible()
                assert page.locator('.tb-tile[data-exam]').count() == page.evaluate('()=>Object.keys(__TB.EXAMS).length')
                nav_state('Exam Practice & Quizzes')
                no_header_overlap()
                for certification in ['cqa']:
                    page.locator(f'.tb-tile[data-exam="{certification}"]').click()
                    expect(page.locator('#tb-overview .tb-soon')).to_have_text('Coming soon')
                    expect(page.locator('#tb-overview .tb-soonline')).to_be_visible()
                    expect(page.locator('.tb-quiz')).to_have_count(0)
                page.locator('.tb-tile[data-exam="cre"]').click()
                expect(page.locator('#tb-overview [data-mode="full"]')).to_be_visible()
                # CRE Set 1 is released in batches and is now the default; Sets 2 and 3 stay selectable.
                expect(page.locator('[data-set="1"]')).to_have_attribute('aria-pressed', 'true')
                expect(page.locator('[data-set="2"]')).to_be_enabled()
                expect(page.locator('.tb-quiz')).to_have_count(0)
                breadcrumb = page.locator('.tb-crumb a')
                expect(breadcrumb).to_have_attribute('href', '/exam-practice')
                expect(breadcrumb).to_have_text('Exam Practice & Quizzes')
                breadcrumb.click()
                expect(page).to_have_url(base + '/exam-practice')
                nav_state('Exam Practice & Quizzes')

            record('test-bank-entry-access-and-breadcrumb', simulator_journey)

            def cre_set2_review():
                if not premium:
                    return  # Signed-out CRE gating is covered by certification_links.
                for width, theme in [(1536, 'light'), (1536, 'dark'), (390, 'light'), (390, 'dark')]:
                    page.set_viewport_size({'width': width, 'height': 1000})
                    page.goto(base + '/test-bank?exam=cre', wait_until='load')
                    page.wait_for_selector('body.auth-ready.access-ready')
                    page.evaluate('(theme)=>document.documentElement.setAttribute("data-theme",theme)', theme)
                    page.locator('[data-set="2"]').click()
                    expect(page.locator('[data-set="2"]')).to_have_attribute('aria-pressed', 'true')
                    expect(page.locator('#tb-overview')).to_contain_text('150-question Set 2 core is complete')
                    page.locator('[data-timing-kind="full"][data-timed="0"]').click()
                    page.locator('[data-mode="full"]').click()
                    expect(page.locator('[data-goto]')).to_have_count(150)
                    exhibits = 0
                    for i in range(150):
                        page.locator(f'[data-goto="{i}"]').click()
                        expect(page.locator('[data-cre-question]')).to_have_count(1)
                        expect(page.locator('.cre2-explorer')).to_have_count(0)
                        exhibits += page.locator('.cre2-exhibit').count()
                        qid = page.locator('[data-cre-question]').get_attribute('data-cre-question')
                        assert page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth+2'), f'{qid} overflows at {width}px in {theme} theme'
                        clipped_labels = page.locator('.cre2-diagram').evaluate_all('''svgs => svgs.flatMap(svg => {
                            const v = svg.viewBox.baseVal;
                            return [...svg.querySelectorAll('text')].filter(text => {
                                const b = text.getBBox();
                                return b.x < v.x - 2 || b.y < v.y - 2 || b.x + b.width > v.x + v.width + 2 || b.y + b.height > v.y + v.height + 2;
                            }).map(text => text.textContent);
                        })''')
                        assert not clipped_labels, f'{qid} clips SVG labels at {width}px in {theme}: {clipped_labels}'
                    assert exhibits == 88, f'Expected 88 exhibits, found {exhibits}'
                    page.locator('[data-submit]').click()
                    page.locator('[data-open-review="all"]').click()
                    expect(page.locator('.tb-review-card')).to_have_count(150)
                    expect(page.locator('.tb-review-card .cre2-exhibit')).to_have_count(88)
                    expect(page.locator('.cre2-explorer')).to_have_count(30)
                    censoring = page.locator('.tb-review-card').filter(has=page.locator('[data-cre-question="cre:set-2:026"]'))
                    expect(censoring).to_contain_text('That is interval censoring. Recording either')
                    expect(censoring.locator('.tb-explanation')).to_contain_text(r'120\lt T_X\le160')
                    original_score = page.locator('[data-score-result]').text_content()
                    sample = page.locator('[data-cre-explorer="sample-size"]')
                    sample.locator('summary').click()
                    sample.locator('select').select_option('0.99')
                    expect(sample.locator('output')).to_contain_text('44 independent units')
                    sample.locator('[data-cre-reset]').click()
                    expect(sample.locator('select')).to_have_value('0.95')
                    curve = page.locator('[data-cre-explorer="weibull"]')
                    curve.locator('summary').click()
                    slider = curve.locator('input')
                    slider.focus()
                    slider.press('Home')
                    for _ in range(14):
                        slider.press('ArrowRight')
                    expect(curve.locator('output')).to_contain_text('1500 hours')
                    expect(curve.locator('output')).to_contain_text('A has higher reliability')
                    alarms = page.locator('[data-cre-explorer="alarm-prevalence"]')
                    alarms.locator('summary').click()
                    alarms.locator('select').select_option('0.10')
                    expect(alarms.locator('output')).to_contain_text('66.7%')
                    alarms.locator('[data-cre-reset]').click()
                    expect(alarms.locator('select')).to_have_value('0.02')
                    expect(alarms.locator('output')).to_contain_text('26.9%')
                    risk = page.locator('[data-cre-explorer="acceptance-risk"]')
                    risk.locator('summary').click()
                    risk.locator('select').select_option('2')
                    expect(risk.locator('output')).to_contain_text('92.5%')
                    expect(risk.locator('output')).to_contain_text('7.5%')
                    risk.locator('[data-cre-reset]').click()
                    expect(risk.locator('select')).to_have_value('1')
                    expect(risk.locator('output')).to_contain_text('26.4%')
                    pchart = page.locator('[data-cre-explorer="p-chart-sample"]')
                    pchart.locator('summary').click()
                    pchart.locator('select').select_option('200')
                    expect(pchart.locator('output')).to_contain_text('4.97%')
                    expect(pchart.locator('output')).to_contain_text('Within the upper limit')
                    pchart.locator('select').select_option('800')
                    expect(pchart.locator('output')).to_contain_text('Above the upper limit')
                    pchart.locator('[data-cre-reset]').click()
                    expect(pchart.locator('select')).to_have_value('400')
                    arrhenius = page.locator('[data-cre-explorer="arrhenius-temperature"]')
                    arrhenius.locator('summary').click()
                    temperature = arrhenius.locator('input')
                    temperature.focus()
                    temperature.press('End')
                    expect(arrhenius.locator('output')).to_contain_text('110 °C = 383.15 K')
                    arrhenius.locator('[data-cre-reset]').click()
                    expect(arrhenius.locator('input')).to_have_value('85')
                    expect(arrhenius.locator('output')).to_contain_text('factor: 7.95')
                    sequential = page.locator('[data-cre-explorer="sequential-failures"]')
                    sequential.locator('summary').click()
                    failures = sequential.locator('input')
                    failures.focus()
                    failures.press('Home')
                    expect(sequential.locator('output')).to_contain_text('0.0821')
                    expect(sequential.locator('output')).to_contain_text('Accept')
                    failures.press('End')
                    expect(sequential.locator('output')).to_contain_text('Reject')
                    sequential.locator('[data-cre-reset]').click()
                    expect(failures).to_have_value('4')
                    expect(sequential.locator('output')).to_contain_text('Continue')
                    derating = page.locator('[data-cre-explorer="derating-temperature"]')
                    derating.locator('summary').click()
                    ambient = derating.locator('input')
                    ambient.focus()
                    ambient.press('Home')
                    expect(derating.locator('output')).to_contain_text('10.00 V')
                    expect(derating.locator('output')).to_contain_text('independent')
                    ambient.press('End')
                    expect(derating.locator('output')).to_contain_text('2.66 V')
                    derating.locator('[data-cre-reset]').click()
                    expect(ambient).to_have_value('100')
                    expect(derating.locator('output')).to_contain_text('8.81 V')
                    mission = page.locator('[data-cre-explorer="mission-high-duration"]')
                    expect(mission).not_to_have_attribute('open', '')
                    mission.locator('summary').click()
                    high = mission.locator('input')
                    high.focus()
                    high.press('Home')
                    expect(mission.locator('output')).to_contain_text('0.99501')
                    high.press('End')
                    expect(mission.locator('output')).to_contain_text('0.97045')
                    mission.locator('[data-cre-reset]').click()
                    expect(high).to_have_value('2')
                    expect(mission.locator('output')).to_contain_text('0.99005')
                    replacement = page.locator('[data-cre-explorer="replacement-failure-cost"]')
                    expect(replacement).not_to_have_attribute('open', '')
                    replacement.locator('summary').click()
                    cost = replacement.locator('input')
                    cost.focus()
                    cost.press('Home')
                    expect(replacement.locator('output')).to_contain_text('Lowest among these candidates: Failure only.')
                    cost.press('ArrowRight')
                    expect(replacement.locator('output')).to_contain_text('Lowest among these candidates: 300 h or failure.')
                    cost.press('End')
                    expect(replacement.locator('output')).to_contain_text('Lowest among these candidates: 100 h or failure.')
                    replacement.locator('[data-cre-reset]').click()
                    expect(cost).to_have_value('1000')
                    expect(replacement.locator('output')).to_contain_text('Lowest among these candidates: 200 h or failure.')
                    association = page.locator('[data-cre-explorer="chi-square-count"]')
                    expect(association).not_to_have_attribute('open', '')
                    association.locator('summary').click()
                    count = association.locator('input')
                    count.focus()
                    count.press('Home')
                    expect(association.locator('output')).to_contain_text('21.0526')
                    for _ in range(4):
                        count.press('ArrowRight')
                    expect(association.locator('output')).to_contain_text('0.0000')
                    expect(association.locator('output')).to_contain_text('Fail to reject independence')
                    count.press('End')
                    expect(association.locator('output')).to_contain_text('25.0000')
                    association.locator('[data-cre-reset]').click()
                    expect(count).to_have_value('40')
                    expect(association.locator('output')).to_contain_text('7.8431')
                    voting = page.locator('[data-cre-explorer="voting-required"]')
                    expect(voting).not_to_have_attribute('open', '')
                    voting.locator('summary').click()
                    voting.locator('select').select_option('1')
                    expect(voting.locator('output')).to_contain_text('0.97902')
                    voting.locator('select').select_option('3')
                    expect(voting.locator('output')).to_contain_text('0.71442')
                    voting.locator('[data-cre-reset]').click()
                    expect(voting.locator('select')).to_have_value('2')
                    expect(voting.locator('output')).to_contain_text('0.95256')
                    fatigue = page.locator('[data-cre-explorer="fatigue-stress"]')
                    expect(fatigue).not_to_have_attribute('open', '')
                    fatigue.locator('summary').click()
                    stress = fatigue.locator('input')
                    stress.focus()
                    stress.press('Home')
                    expect(fatigue.locator('output')).to_contain_text('64,000 cycles')
                    stress.press('End')
                    expect(fatigue.locator('output')).to_contain_text('8,000 cycles')
                    fatigue.locator('[data-cre-reset]').click()
                    expect(stress).to_have_value('80')
                    expect(fatigue.locator('output')).to_contain_text('27,000 cycles')
                    standby = page.locator('[data-cre-explorer="standby-coverage"]')
                    expect(standby).not_to_have_attribute('open', '')
                    standby.locator('summary').click()
                    for value, reliability in [('0', '0.81873'), ('0.5', '0.90060'), ('1', '0.98248')]:
                        standby.locator('select').select_option(value)
                        expect(standby.locator('output')).to_contain_text('Total mission reliability: ' + reliability)
                    standby.locator('[data-cre-reset]').click()
                    expect(standby.locator('select')).to_have_value('0.9')
                    expect(standby.locator('output')).to_contain_text('0.96610')
                    density = page.locator('[data-cre-explorer="density-age"]')
                    expect(density).not_to_have_attribute('open', '')
                    density.locator('summary').click()
                    age = density.locator('input')
                    age.focus()
                    age.press('Home')
                    expect(density.locator('output')).to_contain_text('Instantaneous hazard: 0.000101')
                    age.press('End')
                    expect(density.locator('output')).to_contain_text('Instantaneous hazard: 0.004737')
                    density.locator('[data-cre-reset]').click()
                    expect(age).to_have_value('1500')
                    expect(density.locator('output')).to_contain_text('Instantaneous hazard: 0.001714')
                    inspection = page.locator('[data-cre-explorer="inspection-interval"]')
                    expect(inspection).not_to_have_attribute('open', '')
                    inspection.locator('summary').click()
                    spacing = inspection.locator('input')
                    spacing.focus()
                    spacing.press('Home')
                    expect(inspection.locator('output')).to_contain_text('100.0%')
                    spacing.press('End')
                    expect(inspection.locator('output')).to_contain_text('40.0%')
                    inspection.locator('[data-cre-reset]').click()
                    expect(spacing).to_have_value('10')
                    expect(inspection.locator('output')).to_contain_text('80.0%')
                    cox = page.locator('[data-cre-explorer="cox-hazard-ratio"]')
                    expect(cox).not_to_have_attribute('open', '')
                    cox.locator('summary').click()
                    ratio = cox.locator('input')
                    ratio.focus()
                    ratio.press('Home')
                    expect(cox.locator('output')).to_contain_text('Predicted survival at 1,000 h: 0.9457')
                    ratio.press('End')
                    expect(cox.locator('output')).to_contain_text('Predicted survival at 1,000 h: 0.6400')
                    cox.locator('[data-cre-reset]').click()
                    expect(ratio).to_have_value('0.5')
                    expect(cox.locator('output')).to_contain_text('0.8944')
                    proof = page.locator('[data-cre-explorer="proof-test-interval"]')
                    expect(proof).not_to_have_attribute('open', '')
                    proof.locator('summary').click()
                    for value, average in [('250', '0.2496'), ('1000', '0.9934'), ('2000', '1.9736')]:
                        proof.locator('select').select_option(value)
                        expect(proof.locator('output')).to_contain_text('Average hidden-failure unavailability: ' + average + '%')
                    proof.locator('[data-cre-reset]').click()
                    expect(proof.locator('select')).to_have_value('500')
                    expect(proof.locator('output')).to_contain_text('0.4983%')
                    sharing = page.locator('[data-cre-explorer="load-sharing-rate"]')
                    expect(sharing).not_to_have_attribute('open', '')
                    sharing.locator('summary').click()
                    for value, reliability in [('1', '0.9909'), ('2', '0.9825'), ('6', '0.9537')]:
                        sharing.locator('select').select_option(value)
                        expect(sharing.locator('output')).to_contain_text('System reliability at 100 h: ' + reliability)
                    sharing.locator('[data-cre-reset]').click()
                    expect(sharing.locator('select')).to_have_value('4')
                    expect(sharing.locator('output')).to_contain_text('0.9671')
                    blocks = page.locator('[data-cre-explorer="block-shift"]')
                    expect(blocks).not_to_have_attribute('open', '')
                    blocks.locator('summary').click()
                    shift = blocks.locator('input')
                    shift.focus()
                    shift.press('Home')
                    expect(blocks.locator('output')).to_contain_text('Unadjusted B minus A: +6.0')
                    shift.press('End')
                    expect(blocks.locator('output')).to_contain_text('Unadjusted B minus A: +26.0')
                    expect(blocks.locator('output')).to_contain_text('Block-adjusted B minus A: +6.0')
                    blocks.locator('[data-cre-reset]').click()
                    expect(shift).to_have_value('20')
                    expect(blocks.locator('output')).to_contain_text('Unadjusted B minus A: +16.0')
                    exposure = page.locator('[data-cre-explorer="event-exposure"]')
                    expect(exposure).not_to_have_attribute('open', '')
                    exposure.locator('summary').click()
                    for hours, limit, decision in [('250', '10.485', 'Not above'), ('500', '8.000', 'Not above'), ('2000', '5.000', 'Above')]:
                        exposure.locator('select').select_option(hours)
                        expect(exposure.locator('output')).to_contain_text('Upper limit: ' + limit)
                        expect(exposure.locator('output')).to_contain_text(decision + ' upper limit.')
                    exposure.locator('[data-cre-reset]').click()
                    expect(exposure.locator('select')).to_have_value('1000')
                    expect(exposure.locator('output')).to_contain_text('6.243')
                    thermal = page.locator('[data-cre-explorer="thermal-range"]')
                    expect(thermal).not_to_have_attribute('open', '')
                    thermal.locator('summary').click()
                    thermal.locator('input').focus()
                    thermal.locator('input').press('Home')
                    expect(thermal.locator('output')).to_contain_text('36,000 cycles')
                    thermal.locator('input').press('End')
                    expect(thermal.locator('output')).to_contain_text('9,000 cycles')
                    thermal.locator('[data-cre-reset]').click()
                    expect(thermal.locator('input')).to_have_value('60')
                    expect(thermal.locator('output')).to_contain_text('20,250 cycles')
                    intervention = page.locator('[data-cre-explorer="fault-intervention"]')
                    expect(intervention).not_to_have_attribute('open', '')
                    intervention.locator('summary').click()
                    for event, probability, reduction in [('2', '0.0980', '0.0180'), ('3', '0.0880', '0.0280')]:
                        intervention.locator('select').select_option(event)
                        expect(intervention.locator('output')).to_contain_text('Top-event probability: ' + probability)
                        expect(intervention.locator('output')).to_contain_text('Absolute reduction from 0.1160: ' + reduction)
                    intervention.locator('[data-cre-reset]').click()
                    expect(intervention.locator('select')).to_have_value('1')
                    expect(intervention.locator('output')).to_contain_text('Top-event probability: 0.0580')
                    histogram = page.locator('[data-cre-explorer="histogram-scale"]')
                    expect(histogram).not_to_have_attribute('open', '')
                    histogram.locator('summary').click()
                    histogram.locator('select').select_option('0')
                    expect(histogram.locator('output')).to_contain_text('1,200, 3,600, 9,000 count-hours')
                    histogram.locator('[data-cre-reset]').click()
                    expect(histogram.locator('select')).to_have_value('1')
                    expect(histogram.locator('output')).to_contain_text('Bar areas: 0.20, 0.30, 0.50; total area: 1.00')
                    shock = page.locator('[data-cre-explorer="common-shock"]')
                    assert not shock.evaluate('(el)=>el.open'), 'Common-shock tool must start collapsed'
                    shock.locator('summary').click()
                    for value, joint in [('0', '0.010000'), ('0.05', '0.059500'), ('0.10', '0.109000')]:
                        shock.locator('select').select_option(value)
                        expect(shock.locator('output')).to_contain_text('both channels fail: ' + joint)
                    shock.locator('[data-cre-reset]').click()
                    expect(shock.locator('select')).to_have_value('0.02')
                    expect(shock.locator('output')).to_contain_text('both channels fail: 0.029800')
                    bridge = page.locator('[data-cre-explorer="bridge-reliability"]')
                    assert not bridge.evaluate('(el)=>el.open'), 'Bridge tool must start collapsed'
                    bridge.locator('summary').click()
                    for value, reliability in [('0', '0.96390'), ('0.50', '0.97200'), ('1', '0.98010')]:
                        bridge.locator('select').select_option(value)
                        expect(bridge.locator('output')).to_contain_text('Network reliability: ' + reliability)
                    bridge.locator('[data-cre-reset]').click()
                    expect(bridge.locator('select')).to_have_value('0.80')
                    expect(bridge.locator('output')).to_contain_text('Network reliability: 0.97686')
                    mixture = page.locator('[data-cre-explorer="fleet-mixture"]')
                    assert not mixture.evaluate('(el)=>el.open'), 'Fleet-mixture tool must start collapsed'
                    mixture.locator('summary').click()
                    for value, estimate in [('0.10', '2.8%'), ('0.50', '6.0%'), ('0.80', '8.4%')]:
                        mixture.locator('select').select_option(value)
                        expect(mixture.locator('output')).to_contain_text('Weighted mission failure estimate: ' + estimate)
                        expect(mixture.locator('output')).to_contain_text('pooled sample estimate: 6.0%')
                    mixture.locator('[data-cre-reset]').click()
                    expect(mixture.locator('select')).to_have_value('0.20')
                    expect(mixture.locator('output')).to_contain_text('Weighted mission failure estimate: 3.6%')
                    soa = page.locator('[data-cre-explorer="soa-duration"]')
                    assert not soa.evaluate('(el)=>el.open'), 'SOA tool must start collapsed'
                    soa.locator('summary').click()
                    soa.locator('select').select_option('1')
                    expect(soa.locator('output')).to_contain_text('inside the supplied single-pulse SOA')
                    expect(soa.locator('svg')).to_contain_text('Review scenario: one 10 ms rectangular pulse')
                    soa.locator('[data-cre-reset]').click()
                    expect(soa.locator('select')).to_have_value('0')
                    expect(soa.locator('output')).to_contain_text('outside the supplied DC SOA')
                    expect(soa.locator('svg')).to_contain_text('Review scenario: continuous DC operation')
                    dormancy = page.locator('[data-cre-explorer="standby-dormancy"]')
                    assert not dormancy.evaluate('(el)=>el.open'), 'Standby tool must start collapsed'
                    dormancy.locator('summary').click()
                    for value, reliability in [('0', '0.9098'), ('3', '0.8685'), ('5', '0.8452')]:
                        dormancy.locator('select').select_option(value)
                        expect(dormancy.locator('output')).to_contain_text('Mission reliability: ' + reliability)
                    dormancy.locator('[data-cre-reset]').click()
                    expect(dormancy.locator('select')).to_have_value('1')
                    expect(dormancy.locator('output')).to_contain_text('Mission reliability: 0.8951')
                    anova = page.locator('[data-cre-explorer="anova-error"]')
                    assert not anova.evaluate('(el)=>el.open'), 'ANOVA tool must start collapsed'
                    anova.locator('summary').click()
                    for value, f, decision in [('12', '32.00', 'Reject no interaction.'), ('80', '4.80', 'Fail to reject no interaction'), ('120', '3.20', 'Fail to reject no interaction')]:
                        anova.locator('select').select_option(value)
                        expect(anova.locator('output')).to_contain_text('Interaction F: ' + f)
                        expect(anova.locator('output')).to_contain_text(decision)
                        expect(anova.locator('svg')).to_contain_text('F = ' + f)
                    anova.locator('[data-cre-reset]').click()
                    expect(anova.locator('select')).to_have_value('24')
                    expect(anova.locator('output')).to_contain_text('Interaction F: 16.00')
                    assert page.locator('[data-score-result]').text_content() == original_score, 'Explorers changed the original score'
                    assert page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth+2'), f'CRE review overflows at {width}px in {theme} theme'
                    anova.scroll_into_view_if_needed()
                    page.screenshot(path=str(out / f'cre-set2-{width}-{theme}.png'), full_page=False)

            record('cre-set2-evidence-and-review', cre_set2_review)

            def legacy_bookmarks():
                for route in ['/lessons', '/lessons.html', '/lessons/', '/lessons.html/']:
                    page.goto(base + route + '?access=premium#exam-practice', wait_until='load')
                    expect(page).to_have_url(base + '/exam-practice?access=premium')
                    expect(page.locator('#access-notice')).to_be_visible()
                    expect(page.locator('h1')).to_have_text('Simulated Exam Practice & Quizzes')
                    nav_state('Exam Practice & Quizzes')
                page.goto(base + '/lessons/', wait_until='load')
                expect(page.locator('nav.desktop-nav a[aria-current="page"]')).to_have_text('Lessons')
                page.evaluate("()=>{location.hash='exam-practice'}")
                expect(page).to_have_url(base + '/exam-practice')
                expect(page.locator('h1')).to_have_text('Simulated Exam Practice & Quizzes')

            record('legacy-bookmarks-and-hashchange', legacy_bookmarks)

            def unit_converter(width, theme):
                page.set_viewport_size({'width': width, 'height': 900})
                page.goto(base + '/tools/unit-converter', wait_until='load')
                expect(page.locator('#account-menu-btn')).to_be_visible()
                expect(page.locator('header')).to_have_count(1)
                expect(page.locator('header.site .brand img')).to_have_count(1)
                expect(page.locator('h1')).to_have_count(1)
                expect(page.locator('.converter-heading')).to_have_count(1)
                expect(page.locator('.converter-heading img')).to_have_count(0)
                expect(page.locator('#search')).to_have_count(1)
                toggle = page.locator('header.site .theme-toggle')
                expect(page.locator('.theme-toggle')).to_have_count(1)
                expect(toggle).to_be_visible()
                if page.locator('html').get_attribute('data-theme') != theme:
                    toggle.click()
                expect(page.locator('html')).to_have_attribute('data-theme', theme)
                expect(toggle).to_have_attribute('aria-checked', 'true' if theme == 'dark' else 'false')
                nav_state('Engineering Tools')
                no_header_overlap()
                header = page.locator('header.site').bounding_box()
                heading = page.locator('.converter-heading').bounding_box()
                assert heading['y'] >= header['y'] + header['height'] - 1, (header, heading)
                page.locator('.uval[data-unit="MPa"]').fill('1')
                assert float(page.locator('.uval[data-unit="kPa"]').input_value()) == 1000
                expect(page.locator('.converter-back')).to_have_attribute('href', '/engineering-tools')
                page.evaluate("()=>{document.activeElement.blur();window.scrollTo({top:0,behavior:'instant'});}")
                page.mouse.move(0, 0)
                page.wait_for_timeout(300)
                page.screenshot(path=str(out / f'{tier}-unit-converter-{width}-{theme}.png'), full_page=True)

            for width in [320, 390, 1536]:
                for theme in ['light', 'dark']:
                    record(f'unit-converter-{width}-{theme}', lambda w=width, t=theme: unit_converter(w, t))
            context.close()
        browser.close()
    report['passed'] = sum(case['result'] == 'PASS' for case in report['cases'])
    report['failed'] = len(report['cases']) - report['passed']
    save()
    print('EXAM_PRACTICE_AUDIT_SUMMARY ' + json.dumps({key: report[key] for key in ['browser', 'revision', 'passed', 'failed', 'errors', 'network_writes']}), flush=True)
    raise SystemExit(1 if report['failed'] else 0)


if __name__ == '__main__':
    main()
