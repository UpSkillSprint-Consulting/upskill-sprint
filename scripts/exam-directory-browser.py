"""Learner access states using the real directory/controller and isolated RPC fixtures.

No real identities, database writes or question delivery. PostgreSQL and endpoint
tests separately verify authorization; this checks the learner's visible journey.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

FIXTURE = """(() => {
  let user={id:'directory-learner'},listener,rows,error=false;
  window.directoryCalls=[];
  const seed=()=>[...document.querySelectorAll('.exam-card')].map(card=>({
    exam_key:card.dataset.exam,display_name:card.querySelector('h3').textContent,badge:card.querySelector('.exam-acronym').textContent,
    publication_status:card.dataset.publication,can_practice:card.dataset.exam==='pmp',
    access_status:card.dataset.exam==='pmp'?'granted':card.dataset.exam==='cqe'?'expired':card.dataset.exam==='cre'?'revoked':'locked',
    expires_at:card.dataset.exam==='cqe'?'2020-01-01T00:00:00Z':null,
    request_status:card.dataset.exam==='cssbb'?'pending':null,request_revision:card.dataset.exam==='cssbb'?1:0,requested_at:null
  }));
  window.directoryMode=mode=>{
    if(mode==='signedout'){user=null;listener(null);return;}
    if(mode==='revoke'){rows.find(r=>r.exam_key==='pmp').can_practice=false;rows.find(r=>r.exam_key==='pmp').access_status='revoked';}
    if(mode==='approve'){const row=rows.find(r=>r.exam_key==='mbb');row.can_practice=true;row.access_status='granted';row.request_status='approved';row.request_revision++;}
    error=mode==='error';
    document.querySelector('#exam-directory-refresh').click();
  };
  window.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>{listener=fn;fn(user)},getClient:()=>({rpc:(name,args)=>{
    window.directoryCalls.push({name,args});
    const promise=Promise.resolve().then(()=>{
      rows=rows||seed();
      if(name==='get_my_exam_directory')return error?{error:{message:'Unavailable'}}:{data:JSON.parse(JSON.stringify(rows))};
      if(name==='request_exam_access'){
        const row=rows.find(r=>r.exam_key===args.requested_exam_key);
        if(args.expected_revision!==row.request_revision)return {error:{code:'40001',message:'Changed'}};
        row.request_status=args.operation==='cancel'?'cancelled':'pending';row.request_revision++;row.requested_at=new Date().toISOString();
        return {data:{status:row.request_status}};
      }
      throw Error('Unexpected RPC '+name);
    });promise.abortSignal=()=>promise;return promise;
  }})};
})();"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:8765')
    parser.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    parser.add_argument('--out', default='exam-practice-audit-evidence')
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'browser': args.browser, 'basis': 'Real directory with isolated RPC fixtures', 'cases': []}
    with sync_playwright() as pw:
        browser = getattr(pw, args.browser).launch(headless=True)
        for width, theme in [(1280, 'light'), (1280, 'dark'), (390, 'light'), (390, 'dark')]:
            context = browser.new_context(viewport={'width': width, 'height': 900}, color_scheme=theme)
            context.add_init_script(FIXTURE)
            context.add_init_script("localStorage.setItem('upskill-theme'," + json.dumps(theme) + ");")
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('dialog', lambda dialog: dialog.accept())

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
            page.goto(args.url + '/exam-practice')
            expect(page.locator('body')).to_have_attribute('data-directory-phase', 'ready')
            expect(page.locator('#my-exams-grid .exam-card')).to_have_count(1)
            expect(page.locator('#my-exams-grid .exam-card')).to_have_attribute('data-exam', 'pmp')
            expect(page.locator('#exam-cssbb')).to_have_attribute('data-state', 'pending')
            expect(page.locator('#exam-cqe')).to_have_attribute('data-state', 'expired')
            expect(page.locator('#exam-cre')).to_have_attribute('data-state', 'revoked')
            expect(page.locator('#exam-cqa a,#exam-cqa button')).to_have_count(0)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Horizontal overflow'
            page.screenshot(path=str(out / f'directory-{args.browser}-{width}-{theme}.png'), full_page=True)
            page.locator('#exam-directory-search').fill('master black')
            expect(page.locator('.exam-card:visible')).to_have_count(1)
            expect(page.locator('#exam-mbb')).to_be_visible()
            page.locator('#exam-directory-search').fill('')
            page.locator('#exam-mbb [data-action=request]').click()
            expect(page.locator('#exam-mbb')).to_have_attribute('data-state', 'pending')
            expect(page.locator('#exam-mbb a[href^="/test-bank"]')).to_have_count(0)
            page.locator('#exam-mbb [data-action=cancel]').click()
            expect(page.locator('#exam-mbb [data-action=request]')).to_be_disabled()
            page.evaluate("directoryMode('approve')")
            expect(page.locator('#my-exams-grid .exam-card')).to_have_count(2)
            page.evaluate("directoryMode('revoke')")
            expect(page.locator('#exam-pmp')).to_have_attribute('data-state', 'revoked')
            expect(page.locator('#exam-pmp a[href^="/test-bank"]')).to_have_count(0)
            page.evaluate("directoryMode('error')")
            expect(page.locator('body')).to_have_attribute('data-directory-phase', 'unavailable')
            expect(page.locator('main a[href^="/test-bank"]')).to_have_count(0)
            page.evaluate("directoryMode('recover')")
            expect(page.locator('body')).to_have_attribute('data-directory-phase', 'ready')
            page.evaluate("directoryMode('signedout')")
            expect(page.locator('body')).to_have_attribute('data-directory-phase', 'signedout')
            expect(page.locator('main a[href^="/test-bank"]')).to_have_count(0)
            assert not errors, errors
            report['cases'].append({'width': width, 'theme': theme, 'result': 'passed'})
            context.close()
        browser.close()
    (out / ('directory-' + args.browser + '.json')).write_text(json.dumps(report, indent=2))
    print(json.dumps(report))


if __name__ == '__main__':
    main()
