"""Real protected tool builds with isolated account fixtures; no hosted writes."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import expect, sync_playwright

FIXTURE = r"""(() => {
  const granted=__GRANTED__;
  let user={id:'tool-learner'},denied=false;
  const listeners=[];
  const tools=[['material_checker','Checker','Material Specification Compliance Checker'],['material_lookup','Lookup','Material Specification Lookup'],['steel_explorer','Steel Explorer','Steel Phase & Transformation Explorer']].map(([tool_key,badge,display_name])=>({tool_key,badge,display_name,publication_status:'published',can_use:tool_key===granted,access_status:tool_key===granted?'granted':'locked',request_revision:0,grant_revision:tool_key===granted?1:0,grant_status:tool_key===granted?'active':null}));
  const account={found:true,user_id:'target-learner',email:'learner@example.invalid',can_receive_grants:true,is_administrator:false,tools,history:[]};
  window.toolAuditRevoke=()=>{denied=true};
  window.toolAuditSignOut=()=>{user=null;listeners.forEach(fn=>fn(null))};
  const rpc=async(name,args)=>{
    if(name==='current_access_level')return {data:'registered'};
    if(name==='get_my_tool_directory')return {data:JSON.parse(JSON.stringify(tools))};
    if(name==='request_tool_access'){
      const row=tools.find(r=>r.tool_key===args.requested_tool_key);
      row.request_status=args.operation==='cancel'?'cancelled':'pending';row.access_status=args.operation==='cancel'?'locked':'pending';row.request_revision++;
      return {data:{status:row.request_status}};
    }
    if(name==='admin_manage_tool_access'){
      if(args.operation==='status')return {data:{administrator:true}};
      if(args.operation==='grant'||args.operation==='revoke'){
        const row=tools.find(r=>r.tool_key===args.requested_tool_key);row.can_use=args.operation==='grant';row.access_status=row.can_use?'granted':'revoked';row.grant_status=row.can_use?'active':'revoked';row.grant_revision++;
      }
      return {data:JSON.parse(JSON.stringify(account))};
    }
    throw Error('Unexpected fixture RPC '+name);
  };
  window.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>{listeners.push(fn);fn(user)},getClient:()=>({auth:{getSession:async()=>({data:{session:user?{user,access_token:'audit.'+(denied?'locked':granted)+'.signature'}:null}})},rpc:(name,args)=>{const p=rpc(name,args);p.abortSignal=()=>p;return p;}})};
})();"""

ROUTES = {
    'material_checker': '/tools/material-specification-compliance-checker',
    'material_lookup': '/engineering-tools/grade-specification-lookup/',
    'steel_explorer': '/tools/steel-phase-explorer',
}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--url',default='http://127.0.0.1:8765')
    parser.add_argument('--browser',choices=['chromium','webkit'],default='chromium')
    args=parser.parse_args()
    out=Path('tool-access-evidence');out.mkdir(exist_ok=True)
    report=[]
    with sync_playwright() as pw:
        browser=getattr(pw,args.browser).launch(headless=True)
        for width,theme in [(1280,'light'),(390,'dark')]:
            for key,route in ROUTES.items():
                context=browser.new_context(viewport={'width':width,'height':900},color_scheme=theme)
                context.add_init_script(FIXTURE.replace('__GRANTED__',json.dumps(key)))
                context.add_init_script('localStorage.setItem("upskill-theme",'+json.dumps(theme)+');')
                page=context.new_page()
                errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                def intercept(r):
                    u=urlparse(r.request.url)
                    if u.scheme=='blob':return r.continue_()
                    if u.netloc!=urlparse(args.url).netloc:return r.abort()
                    if u.path in ['/auth.js','/profile.js','/progress.js','/auth-forms.js','/access-control.js','/require-auth.js','/vendor/supabase.js','/supabase-config.js']:
                        return r.fulfill(status=200,content_type='application/javascript',body='/* isolated auth fixture */')
                    r.continue_()
                context.route('**/*',intercept)
                page.goto(args.url+'/engineering-tools',wait_until='domcontentloaded')
                card=page.locator('[data-tool="'+key+'"]')
                expect(card.locator('.tool-status')).to_have_attribute('data-state','granted')
                assert page.locator('[data-tool] .tool-status[data-state="locked"]').count()==2
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                other=next(k for k in ROUTES if k!=key)
                pending=page.locator('[data-tool="'+other+'"]')
                pending.get_by_role('button',name='Request access',exact=True).click()
                expect(pending.locator('.tool-status')).to_have_attribute('data-state','pending')
                pending.get_by_role('button',name='Cancel request',exact=True).click()
                expect(pending.locator('.tool-status')).to_have_attribute('data-state','locked')
                # Shared site cleanup may remove the decorative trailing arrow.
                card.get_by_role('link',name='Open tool').click()
                expect(page.locator('#tool-workspace')).to_be_visible(timeout=30000)
                frame=page.frame_locator('#tool-workspace')
                if key=='material_checker':expect(frame.locator('#mcPlatform')).to_be_visible(timeout=15000)
                elif key=='material_lookup':
                    expect(frame.locator('#globalSearch')).to_be_visible()
                    frame.locator('#globalSearch').fill('50W')
                    expect(frame.locator('#globalSearch')).to_have_value('50W')
                else:
                    expect(frame.locator('#spx-professional-nav')).to_be_attached(timeout=20000)
                    expect(frame.locator('#spx-professional-load-status')).to_have_count(0)
                page.screenshot(path=str(out/f'{args.browser}-{key}-{width}.png'))
                page.evaluate('toolAuditRevoke();window.dispatchEvent(new Event("focus"))')
                expect(page.locator('#tool-access-status')).to_contain_text('This tool is locked')
                expect(page.locator('#tool-workspace')).to_have_count(0)
                # A different tool stays locked even when the first tool is granted.
                page.goto(args.url+ROUTES[other],wait_until='domcontentloaded')
                expect(page.locator('#tool-access-status')).to_contain_text('This tool is locked')
                # Tool admin uses the same explicit review flow as exams.
                page.goto(args.url+'/admin-tool-access',wait_until='domcontentloaded')
                page.get_by_label('Account email',exact=True).fill('learner@example.invalid')
                page.get_by_role('button',name='Find learner',exact=True).click()
                page.locator('[data-exam="'+other+'"]').click()
                page.get_by_role('button',name='Grant access',exact=True).click()
                expect(page.locator('#exam-decision-summary')).to_contain_text('Tool:')
                page.get_by_role('button',name='Cancel',exact=True).click()
                page.get_by_role('button',name='Grant access',exact=True).click()
                page.get_by_role('button',name='Confirm grant',exact=True).click()
                expect(page.locator('#exam-edit-state')).to_contain_text('Access granted')
                page.get_by_role('button',name='Revoke access',exact=True).click()
                page.get_by_role('button',name='Confirm revocation',exact=True).click()
                expect(page.locator('#exam-edit-state')).to_contain_text('Revoked')
                assert not errors,errors
                report.append({'tool':key,'width':width,'theme':theme,'result':'passed'})
                context.close()
        browser.close()
    (out/(args.browser+'.json')).write_text(json.dumps(report,indent=2))
    print(json.dumps(report))

if __name__=='__main__':main()
