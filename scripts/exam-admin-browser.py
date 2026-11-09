"""Admin UI/layout audit with isolated in-memory accounts; never a real Supabase write.

The page, CSS and admin controller are real. The RPC fixture only drives UI states;
transactional permission behaviour is covered by exam-access-admin.test.js.
"""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

FIXTURE = """(() => {
  let listener;
  let user={id:'admin-fixture'};
  const account={found:true,user_id:'learner-fixture',email:'learner@example.invalid',
    is_administrator:false,can_receive_grants:true,history:[],exams:[
      ['cssbb','CSSBB','Certified Six Sigma Black Belt','granted'],
      ['pmp','PMP','Project Management Professional','locked'],
      ['cqe','CQE','Certified Quality Engineer','expired'],
      ['cqa','CQA','Certified Quality Auditor','coming_soon']
    ].map(([exam_key,badge,display_name,access_status])=>({exam_key,badge,display_name,access_status,
      publication_status:exam_key==='cqa'?'coming_soon':'published',
      grant_status:access_status==='granted'?'active':null,grant_revision:access_status==='granted'?1:0,
      request_status:exam_key==='pmp'?'pending':null,request_revision:exam_key==='pmp'?1:0,expires_at:null}))};
  window.adminAuditCalls=[];
  window.adminAuditSignOut=()=>{user=null;listener(null)};
  const rpc=async(name,args)=>{
    if(name==='owner_manage_access')return {data:{owner:false}};
    if(name!=='admin_manage_exam_access')throw Error('Unexpected RPC');
    window.adminAuditCalls.push(args);
    if(args.operation==='status')return {data:{administrator:true}};
    if(args.operation==='requests')return {data:{requests:[{user_id:account.user_id,email:account.email,exam_key:'pmp',badge:'PMP',requested_at:'2026-10-01T10:00:00Z'}],next_cursor:null}};
    if(args.operation==='approve'){
      const row=account.exams.find(e=>e.exam_key===args.requested_exam_key);
      row.access_status='granted';row.grant_status='active';row.grant_revision++;row.request_status='approved';row.request_revision++;
    }
    if(['search','account','approve'].includes(args.operation))return {data:JSON.parse(JSON.stringify(account))};
    throw Error('Unexpected operation: '+args.operation);
  };
  window.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>{listener=fn;fn(user)},getClient:()=>({rpc:(name,args)=>{const result=rpc(name,args);result.abortSignal=()=>result;return result;}})};
})();"""


def contrast_ratio(foreground, background):
    def luminance(css):
        rgb = [float(v) / 255 for v in re.findall(r'[\d.]+', css)[:3]]
        linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in rgb]
        return sum(v * weight for v, weight in zip(linear, [.2126, .7152, .0722]))
    light, dark = sorted([luminance(foreground), luminance(background)], reverse=True)
    return (light + .05) / (dark + .05)


def check_buttons(page, theme, selector):
    """Text contrast of primary and caution buttons, at rest and hovered."""
    for button in page.locator(selector).all():
        for hovered in [False, True]:
            if hovered:
                button.hover()
            else:
                page.mouse.move(1, 1)
            page.wait_for_timeout(250)
            colors = button.evaluate('(el) => { const s=getComputedStyle(el); return [s.color,s.backgroundColor]; }')
            if colors[1] in ('rgba(0, 0, 0, 0)', 'transparent'):
                colors[1] = button.evaluate("(el) => { let n=el; while(n){const b=getComputedStyle(n).backgroundColor; if(b!=='rgba(0, 0, 0, 0)') return b; n=n.parentElement;} return 'rgb(255, 255, 255)'; }")
            assert contrast_ratio(*colors) >= 4.5, (theme, hovered, colors)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:8765')
    parser.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    parser.add_argument('--out', default='exam-practice-audit-evidence')
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'browser': args.browser, 'basis': 'Real admin HTML/CSS/controller; in-memory RPC fixtures only', 'cases': []}
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch(headless=True)
        for width, theme in [(1280, 'light'), (1280, 'dark'), (390, 'light'), (390, 'dark')]:
            context = browser.new_context(viewport={'width': width, 'height': 900}, color_scheme=theme)
            context.add_init_script(FIXTURE)
            context.add_init_script("localStorage.setItem('upskill-theme'," + json.dumps(theme) + ");")
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))

            def route_request(route):
                request = route.request
                parsed = urlparse(request.url)
                if parsed.netloc != urlparse(args.url).netloc or request.method != 'GET':
                    route.abort()
                elif parsed.path in ['/auth.js', '/profile.js', '/progress.js', '/auth-forms.js', '/access-control.js', '/require-auth.js', '/vendor/supabase.js', '/supabase-config.js']:
                    route.fulfill(status=200, content_type='application/javascript', body='/* isolated fixture */')
                else:
                    route.continue_()

            page.route('**/*', route_request)
            page.goto(args.url + '/admin-exam-access.html')
            expect(page.locator('#exam-admin-controls')).to_be_visible()
            assert page.evaluate('adminAuditCalls.length') == 1
            page.locator('#exam-member-email').fill('learner@example.invalid')
            page.get_by_role('button', name='Find learner').click()
            expect(page.locator('#exam-member-title')).to_have_text('learner@example.invalid')
            expect(page.locator('#admin-shell-header .adm-tabs [aria-current=page]')).to_have_attribute('href', '/admin-exam-access')
            # Load requests before opening the panel: under 800px the panel is a bottom sheet
            # that makes the page behind it inert.
            page.locator('#exam-requests-refresh').click()
            expect(page.locator('#exam-request-list tr')).to_have_count(1)
            check_buttons(page, theme, '#admin-main .adm-btn--primary:visible:enabled')
            page.locator('[data-exam=pmp]').click()
            expect(page.locator('#exam-access-panel')).to_be_visible()
            expect(page.locator('#exam-approve')).to_be_enabled()
            expect(page.locator('#exam-decline')).to_be_visible()
            expect(page.locator('#exam-grant')).to_be_hidden()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Horizontal overflow'
            check_buttons(page, theme, '#exam-access-panel .adm-btn--primary:visible:enabled, #exam-access-panel .adm-btn--caution:visible:enabled')
            page.screenshot(path=str(out / f'admin-{args.browser}-{width}-{theme}.png'), full_page=True)
            page.locator('#exam-approve').click()
            confirmation = page.get_by_role('dialog', name='Approve request and grant access?')
            expect(confirmation).to_be_visible()
            expect(confirmation).to_contain_text('learner@example.invalid')
            expect(confirmation).to_contain_text('Project Management Professional (PMP)')
            expect(confirmation).to_contain_text('Expiry: No expiry')
            expect(page.locator('#exam-decision-cancel')).to_be_focused()
            assert page.evaluate("adminAuditCalls.filter(c=>c.operation==='approve').length") == 0
            page.keyboard.press('Escape')
            expect(confirmation).to_be_hidden()
            expect(page.locator('#exam-approve')).to_be_focused()
            page.locator('#exam-approve').click()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Confirmation overflow'
            page.screenshot(path=str(out / f'admin-confirm-{args.browser}-{width}-{theme}.png'))
            page.get_by_role('button', name='Confirm approval', exact=True).click()
            expect(page.locator('#exam-edit-state')).to_contain_text('Access granted')
            assert page.evaluate("adminAuditCalls.filter(c=>c.operation==='approve').length") == 1
            page.evaluate('adminAuditSignOut()')
            expect(page.locator('#exam-admin-controls')).to_have_count(0)
            expect(page.locator('#exam-member-title')).to_have_count(0)
            expect(page.locator('.adm-denied a[href*="next=%2Fadmin-exam-access"]')).to_be_visible()
            assert page.evaluate("[...document.querySelectorAll('a[href]')].every(a => !/^\\/admin(?:-access|-exam-access|-tool-access)?(?:\\.html)?(?:[/?#]|$)/.test(a.getAttribute('href')))"), 'admin link after sign-out'
            assert not errors, errors
            report['cases'].append({'width': width, 'theme': theme, 'result': 'passed'})
            context.close()
        browser.close()
    (out / ('admin-' + args.browser + '.json')).write_text(json.dumps(report, indent=2))
    print(json.dumps(report))


if __name__ == '__main__':
    main()
