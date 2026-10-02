const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('lessons/power-bi-excel-sql/excel-formula-fluency.html','utf8');

test('restored reference credentials render and export as local practice records',()=>{
 const dom=new JSDOM(html,{runScripts:'outside-only'}),w=dom.window;
 const credential={id:'USS-XFP-EXISTING',name:'Fictitious QA learner',title:'Excel Formula Professional',issuedAt:1728000000000,mastery:90,assessment:92,missions:8,projects:1,verification:'Evidence verified in platform version 3.0'};
 let download;
 w.state={phase3:{certification:{credentials:[credential]}}};
 w.P3={el:id=>w.document.getElementById(id),esc:s=>String(s),certRequirements:()=>[{name:'Practice',detail:'Complete',done:true}],refreshers:[],download:(name,text)=>{download=JSON.parse(text);}};
 w.eval(w.document.getElementById('phase3-platform-cert').textContent);
 w.P3.cert.renderReadiness();
 const card=w.document.getElementById('credentialCard');
 assert.match(card.textContent,/Local reference practice certificate/);
 assert.match(card.textContent,/not a signed Sprint award or independent verification/);
 w.document.getElementById('verifyCredentialInput').value=credential.id;
 w.document.getElementById('verifyCredential').click();
 assert.match(w.document.getElementById('verifyResult').textContent,/Local record found/);
 assert.match(w.document.getElementById('verifyResult').textContent,/not independent verification/);
 w.document.getElementById('downloadCredential').click();
 assert.equal(download.id,credential.id);
 assert.match(download.verification,/Local reference practice record/);
 assert.equal(credential.verification,'Evidence verified in platform version 3.0');
 dom.window.close();
});
