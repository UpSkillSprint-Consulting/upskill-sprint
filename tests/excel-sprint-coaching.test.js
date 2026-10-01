const {before,after,test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const SECRET='sprint-coaching-test-secret-at-least-32-bytes';
const originalNetlify=globalThis.Netlify,originalFetch=globalThis.fetch;
const keys=JSON.parse(fs.readFileSync('netlify/functions/_shared/excel-sprint-answers.json'));
let G,C,handler,status,config;
const feedback={logic:'Your approach uses the requested inputs.',robustness:'Check missing inputs separately from valid zero.',references:'Keep the full data range aligned.',readability:'Use a clear intermediate calculation.',efficiency:'Avoid repeated full-range calculations.',nextStep:'Test one boundary case in Excel.'};
before(async()=>{G=await import('../netlify/functions/_shared/excel-sprint-grading.mjs');C=await import('../netlify/functions/_shared/excel-sprint-coaching.mjs');const m=await import('../netlify/functions/excel-sprint-coach.mjs');handler=m.default;config=m.config;status=(await import('../netlify/functions/excel-sprint-coaching-status.mjs')).default;});
after(()=>{globalThis.Netlify=originalNetlify;globalThis.fetch=originalFetch;});
function env(key='test-anthropic-key',base){globalThis.Netlify={env:{get:name=>({EXCEL_SPRINT_SIGNING_SECRET:SECRET,ANTHROPIC_API_KEY:key,ANTHROPIC_BASE_URL:base})[name]}};}
function payload(){const task=keys['L1-A1'].tasks[0];const graded=G.gradeSubmission({packageId:'L1-A1',submissions:[{taskId:task.id,formula:task.model,result:task.answer}]},SECRET);return{packageId:'L1-A1',taskId:task.id,formula:task.model,result:task.answer,receipt:graded.receipt};}
async function call(body){const response=await handler(new Request('https://sprint.example/api/excel-sprint/coach',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));return{status:response.status,body:await response.json()};}
function aiResponse(value=feedback){return new Response(JSON.stringify({content:[{type:'text',text:JSON.stringify(value)}],stop_reason:'end_turn'}),{status:200});}

test('coaching requires a signed attempted task and predecessor; rejects score overrides without provider calls',async()=>{
 env();let calls=0;globalThis.fetch=async()=>{calls++;return aiResponse();};const p=payload();
 for(const invalid of [{...p,receipt:undefined},{...p,taskId:'t2'},{...p,score:100},{...p,result:{}},{...p,packageId:'L1-A2'}])assert.ok((await call(invalid)).status>=400);
 assert.equal(calls,0);assert.equal(config.rateLimit.windowLimit,6);
});
test('provider receives no private answer key or model and AI verdict cannot override scoring',async()=>{
 env();const p=payload();let outbound;globalThis.fetch=async(url,init)=>{assert.equal(url,'https://api.anthropic.com/v1/messages');outbound=JSON.parse(init.body);return aiResponse();};
 const result=await call(p);assert.equal(result.status,200);assert.equal(result.body.submissionCorrect,true);assert.deepEqual(result.body.feedback,feedback);
 const content=JSON.parse(outbound.messages[0].content);assert.ok(!/"(?:answer|model|hints|alternatives)":/.test(JSON.stringify(content)));assert.equal(content.submittedFormula,p.formula);assert.equal(outbound.model,C.COACH_MODEL);
 assert.equal(result.body.completionToken,undefined);assert.equal(G.readToken(p.receipt,SECRET,'receipt').taskStates.t1.attempts,1);
 const revised=await call({...p,result:'wrong'});assert.equal(revised.body.submissionCorrect,false);assert.equal(revised.body.score,undefined);
});
test('gateway base URL is respected and availability exposes only a boolean',async()=>{
 env('gateway-key','https://gateway.example/v1');assert.equal(C.coachingSettings().endpoint,'https://gateway.example/v1/messages');const s=await status();assert.deepEqual(await s.json(),{available:true});
 env('gateway-key','https://gateway.example');assert.equal(C.coachingSettings().endpoint,'https://gateway.example/v1/messages');
 env('gateway-key','http://gateway.example');assert.equal(C.coachingSettings(),null);
});
test('missing AI configuration, timeouts and provider failures preserve result grading',async()=>{
 env(undefined);let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('private provider exception');};
 // Explicitly omit a key rather than use the helper default.
 globalThis.Netlify={env:{get:n=>n==='EXCEL_SPRINT_SIGNING_SECRET'?SECRET:undefined}};
 assert.equal((await call(payload())).status,503);assert.equal(calls,0);assert.deepEqual(await (await status()).json(),{available:false});
 env();assert.equal((await call(payload())).status,503);
 globalThis.fetch=async()=>new Response('secret provider error',{status:429});const failed=await call(payload());assert.equal(failed.status,503);assert.ok(!JSON.stringify(failed.body).includes('secret'));
 const task=keys['L1-A1'].tasks[0];assert.equal(G.gradeSubmission({packageId:'L1-A1',submissions:[{taskId:task.id,formula:task.model,result:task.answer}]},SECRET).tasks[0].correct,true);
});
test('provider solution snippets, extra verdicts, HTML and incomplete structured feedback are rejected',async()=>{
 env();for(const invalid of [{...feedback,nextStep:'=SUM(Data!D2:D25)'},{...feedback,logic:'Use SUM(Data!D2:D25)'},{...feedback,logic:'<img src=x>'},{...feedback,correct:true},{logic:'Only one field'}]){globalThis.fetch=async()=>aiResponse(invalid);const result=await call(payload());assert.equal(result.status,503);assert.equal(result.body.feedback,undefined);}
});
