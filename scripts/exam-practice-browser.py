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
                if parsed.path in ['/lessons/', '/lessons.html/']:
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
                for certification in ['CRE', 'CQA']:
                    chip = page.locator('.exam-certifications .chip').filter(has_text=re.compile(r'^' + certification + r'\b'))
                    expect(chip).to_have_count(1)
                    expect(chip).to_contain_text(re.compile('Coming soon', re.I))
                expect(page.locator('.exam-intro')).to_contain_text('untimed')
                expect(page.locator('.exam-actions a[href="/test-bank"]')).to_be_visible()
                expect(page.locator('footer a[href="/exam-practice"]')).to_be_visible()
                for chip in page.locator('.exam-certifications .chip').all():
                    expect(chip).to_have_attribute('href', re.compile(r'^/test-bank\?exam=[^&#]+$'))
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
                page.screenshot(path=str(out / f'{tier}-directory-{width}-{theme}.png'), full_page=True)

            for width in [320, 390, 1440, 1441, 1536]:
                for theme in ['light', 'dark']:
                    record(f'layout-{width}-{theme}', lambda w=width, t=theme: layout(w, t))

            def certification_links():
                page.set_viewport_size({'width': 1536, 'height': 1000})
                directory()
                chips = page.locator('.exam-certifications .chip').evaluate_all("rows=>rows.map(e=>({label:e.textContent.trim(),href:e.getAttribute('href')}))")
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
                        expect(page).to_have_url(re.compile(r'/sign-in\.html\?next='))
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
                    expect(page).to_have_url(re.compile(r'/sign-in\.html\?next='))
                    assert 'test-bank' in page.url, page.url
                    expect(page.locator('.tb-quiz')).to_have_count(0)
                    return
                page.wait_for_selector('body.auth-ready.access-ready')
                assert not urlparse(page.url).query, 'Main entry must open the full catalog without an exam query'
                expect(page.locator('#tb-overview')).to_be_visible()
                assert page.locator('.tb-tile[data-exam]').count() == page.evaluate('()=>Object.keys(__TB.EXAMS).length')
                nav_state('Exam Practice & Quizzes')
                no_header_overlap()
                for certification in ['cqa', 'cre']:
                    page.locator(f'.tb-tile[data-exam="{certification}"]').click()
                    expect(page.locator('#tb-overview .tb-soon')).to_have_text('Coming soon')
                    expect(page.locator('#tb-overview .tb-soonline')).to_be_visible()
                    expect(page.locator('.tb-quiz')).to_have_count(0)
                breadcrumb = page.locator('.tb-crumb a')
                expect(breadcrumb).to_have_attribute('href', '/exam-practice')
                expect(breadcrumb).to_have_text('Exam Practice & Quizzes')
                breadcrumb.click()
                expect(page).to_have_url(base + '/exam-practice')
                nav_state('Exam Practice & Quizzes')

            record('test-bank-entry-access-and-breadcrumb', simulator_journey)

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
            context.close()
        browser.close()
    report['passed'] = sum(case['result'] == 'PASS' for case in report['cases'])
    report['failed'] = len(report['cases']) - report['passed']
    save()
    print('EXAM_PRACTICE_AUDIT_SUMMARY ' + json.dumps({key: report[key] for key in ['browser', 'revision', 'passed', 'failed', 'errors', 'network_writes']}), flush=True)
    raise SystemExit(1 if report['failed'] else 0)


if __name__ == '__main__':
    main()
