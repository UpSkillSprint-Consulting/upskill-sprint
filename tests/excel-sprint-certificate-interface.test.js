const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const SECRET='certificate-ui-secret-with-more-than-thirty-two-bytes';
async function ready(check){for(let i=0;i<80;i++){if(check())return;await new Promise(r=>setImmediate(r));}throw new Error('Certificate UI did not settle.');}
async function fixture(){
 const G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs'),C=await import('../netlify/functions/_shared/excel-sprint-certificates.mjs'),keys=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json')),tokens=[];
 for(const id of G.PACKAGE_IDS){const r=G.gradeSubmission({packageId:id,predecessorToken:tokens.at(-1),submissions:keys[id].tasks.map(t=>({taskId:t.id,formula:t.model,result:t.answer}))},SECRET);tokens.push(r.completionToken);}
 return{C,...C.issueCertificate({tokens,award:'levels-1-6',learnerName:'Nora & Iven'},SECRET)};
}
test('certificate page renders only verified server claims, prints safely and clears stale proof',async()=>{
 const f=await fixture(),dom=new JSDOM(fs.readFileSync('excel-sprint-certificate.html','utf8'),{url:'https://sprint.example/excel-sprint-certificate#proof='+f.certificateToken,runScripts:'outside-only'}),w=dom.window;let printCount=0;
 w.print=()=>printCount++;w.fetch=async(url,init)=>{assert.equal(url,'/api/excel-sprint/certificate/verify');try{return new Response(JSON.stringify(f.C.verifyCertificate(JSON.parse(init.body),SECRET)),{status:200});}catch(e){return new Response(JSON.stringify({error:e.message}),{status:e.status});}};
 try{w.eval(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/certificate.js','utf8'));await ready(()=>!w.document.getElementById('certificate-document').hidden);const card=w.document.getElementById('certificate-document');assert.match(card.textContent,/Nora & Iven/);assert.equal(card.querySelector('script'),null);assert.match(card.textContent,/self-reported/);w.document.getElementById('certificate-print').click();assert.equal(printCount,1);
  const input=w.document.getElementById('certificate-token');input.value=f.certificateToken+'x';input.dispatchEvent(new w.Event('input'));assert.equal(card.hidden,true);assert.equal(w.document.getElementById('certificate-print').disabled,true);w.document.getElementById('certificate-verify').click();await ready(()=>w.document.getElementById('certificate-status').className==='certificate-error');assert.equal(card.textContent,'');assert.equal(printCount,1);
 }finally{w.close();}
});
test('editing a proof while verification is pending cannot display the previous certificate',async()=>{
 const f=await fixture(),dom=new JSDOM(fs.readFileSync('excel-sprint-certificate.html','utf8'),{url:'https://sprint.example/excel-sprint-certificate',runScripts:'outside-only'}),w=dom.window;let resolve;
 w.fetch=()=>new Promise(r=>resolve=r);
 try{w.eval(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/certificate.js','utf8'));const input=w.document.getElementById('certificate-token');input.value=f.certificateToken;w.document.getElementById('certificate-verify').click();input.value='changed';input.dispatchEvent(new w.Event('input'));resolve(new Response(JSON.stringify({verified:true,certificate:f.certificate}),{status:200}));await new Promise(r=>setImmediate(r));assert.equal(w.document.getElementById('certificate-document').hidden,true);assert.equal(w.document.getElementById('certificate-print').disabled,true);assert.match(w.document.getElementById('certificate-status').textContent,/Proof changed/);
 }finally{w.close();}
});
test('certificate endpoints enforce JSON, origin and the existing signing secret',async()=>{
 const issue=(await import('../netlify/functions/excel-sprint-certificate.mjs')).default,verify=(await import('../netlify/functions/excel-sprint-certificate-verify.mjs')).default;
 const request=(url,body,headers={})=>new Request('https://sprint.example'+url,{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
 assert.equal((await issue(new Request('https://sprint.example/api/excel-sprint/certificate'))).status,405);
 assert.equal((await verify(request('/api/excel-sprint/certificate/verify',{}, {origin:'https://another.example'}))).status,403);
 global.Netlify={env:{get:()=>undefined}};try{const r=await issue(request('/api/excel-sprint/certificate',{}));assert.equal(r.status,503);assert.ok(!JSON.stringify(await r.json()).includes(SECRET));}finally{delete global.Netlify;}
 const f=await fixture();global.Netlify={env:{get:()=>SECRET}};try{const r=await verify(request('/api/excel-sprint/certificate/verify',{certificateToken:f.certificateToken}));assert.equal(r.status,200);assert.equal((await r.json()).verified,true);}finally{delete global.Netlify;}
});
