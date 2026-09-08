'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {PROFILES}=require('../scripts/lib/student-audit-contract.cjs');
const {validateFullReport,validateSupervisor,validateNeeds,verifyEvidenceDirectory}=require('../scripts/check-student-audit.cjs');
const source='a'.repeat(40),bank=Array.from({length:175},(_,i)=>({qid:`mbb:set-3:fixture-${i}`,answer:i%4}));
const needs={regression:{result:'success'},browsers:{result:'success'},'edge-cases':{result:'success'}};
function full(profile=PROFILES[0]) {
 const records=()=>bank.map((q,i)=>({number:i+1,qid:q.qid,reopened:true,selected:profile.mixed?(i%3===2?null:i%3===0?q.answer:(q.answer+1)%4):q.answer,status:profile.mixed?(i%3===2?'unanswered':i%3===0?'correct':'incorrect'):'correct',checks:['light','dark'].map(theme=>({theme,geometry:{pageOverflow:false,clipped:[],svgOutside:[]},violations:[],a11y:{completed:true,passedRules:3,incompleteRules:[],engine:{name:'axe-core',version:'4.13.0'}}}))}));
 return {...profile,profile:profile.label,complete:true,source,failures:[],pageErrors:[],qualityFailures:[],accessibilityRequired:true,accessibilityScans:700,toolVersions:{playwright:'1.63.0',axe:'4.13.0'},accessibilitySelfTest:{passed:true,violationsDetected:['image-alt','button-name']},sessionOrder:bank.map(q=>q.qid),expectedCorrect:profile.mixed?59:175,verdict:`${profile.mixed?59:175} of 175 correctly`,questions:records(),reviews:records()};
}
function supervisor(totalLimitMs=35*60000,engine='chromium') {return {source,status:'passed',exitCode:0,signal:null,progressMessages:100,idleLimitMs:90000,totalLimitMs,renderingPolicy:{version:1,platform:'linux',engine,rasterizer:engine==='webkit'?'webkit-skia-cpu':'browser-default',paintingThreads:engine==='webkit'?1:null,scope:'audit-process-only'}};}
test('student gate accepts complete correct and mixed-score evidence for every required profile',()=>{
 for(const profile of PROFILES)validateFullReport(full(profile),profile,source,bank);
 validateNeeds(needs);validateSupervisor(supervisor(),source);
 assert.equal(PROFILES.filter(p=>p.engine==='webkit'&&p.width===390).length,2,'Requires an independent second WebKit mobile session');
});
test('student gate rejects disabled accessibility, false pass, stale source, wrong question and lost diagnostics',()=>{
 const corruptions=[r=>r.complete=false,r=>r.diagnosticOnly=true,r=>r.accessibilityRequired=false,r=>r.source='b'.repeat(40),r=>r.profile='wrong',r=>r.questions[0].qid='mbb:invented',r=>r.reviews[0].number=0,r=>r.questions[0].checks[0].violations.push({id:'image-alt'}),r=>r.questions[0].checks[0].geometry.pageOverflow=true,r=>r.questions[0].checks[0].a11y.passedRules=0,r=>delete r.questions[0].checks[0].a11y.incompleteRules,r=>r.pageErrors.push('broken'),r=>r.sessionOrder.pop(),r=>r.questions[0].selected=999,r=>r.toolVersions.axe='latest',r=>r.accessibilitySelfTest.passed=false,r=>r.reviews.pop(),r=>r.accessibilityScans=699];
 for(const corrupt of corruptions){const r=full();corrupt(r);assert.throws(()=>validateFullReport(r,PROFILES[0],source,bank));}
});
test('a cancelled, skipped or failed dependency cannot produce a green gate',()=>{
 for(const k of Object.keys(needs))for(const state of ['cancelled','skipped','failure','in_progress']){
  const n=structuredClone(needs);n[k].result=state;assert.throws(()=>validateNeeds(n));
 }
 assert.throws(()=>validateNeeds({browsers:{result:'success'}}));
 for(const edit of [s=>s.status='failed',s=>s.exitCode=1,s=>s.source='',s=>s.progressMessages=0,s=>s.idleLimitMs=1e9,s=>s.totalLimitMs=1e9]){const s=supervisor();edit(s);assert.throws(()=>validateSupervisor(s,source));}
});
test('aggregate rejects a missing or corrupted independent WebKit report and emits content hashes',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'student-gate-'));
 const write=(f,o)=>{fs.mkdirSync(path.dirname(path.join(dir,f)),{recursive:true});fs.writeFileSync(path.join(dir,f),typeof o==='string'?o:JSON.stringify(o));};
 try{
  for(const profile of PROFILES){const base=`final-student-summary-${profile.label}`;write(`${base}/report.json`,full(profile));write(`${base}/supervisor.json`,supervisor(35*60000,profile.engine));write(`${base}/tested-commit.txt`,source);}
  for(const engine of ['chromium','webkit']){const base=`final-student-edges-${engine}`;write(`${base}/supervisor.json`,supervisor(15*60000,engine));write(`${base}/report.json`,{complete:true,source,engine,width:320,failures:[],pageErrors:[],calculatorAndLookup:true,timeout:{all:175,unvisitedSkipped:174,flagged:1,score:1},failedSaveAndRetake:true,correctionQuiz:{corrected:174,originalScoreStill:1},relatedPractice:5,rapidReview:175,reviews:['light','dark'].map(theme=>({theme,violations:[],geometry:{pageOverflow:false,clipped:[],svgOutside:[]}}))});}
  write('final-student-regression/tested-commit.txt',source);
  const gate=verifyEvidenceDirectory(dir,source,bank,needs);assert.equal(gate.profiles.length,7);assert.equal(gate.manifest.length,18);gate.manifest.forEach(m=>assert.match(m.sha256,/^[a-f0-9]{64}$/));
  write('final-student-summary-webkit-mobile-repeat/report.json','{incomplete');assert.throws(()=>verifyEvidenceDirectory(dir,source,bank,needs));
  fs.rmSync(path.join(dir,'final-student-summary-webkit-mobile-repeat/report.json'));assert.throws(()=>verifyEvidenceDirectory(dir,source,bank,needs));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('every future PR retains all profiles, independent supervision and a fail-closed acceptance job',()=>{
 const workflow=fs.readFileSync(path.join(__dirname,'../.github/workflows/mbb-set3-final-student.yml'),'utf8');
 assert.match(workflow,/on:\n  pull_request:\n  workflow_dispatch:/);
 assert.match(workflow,/run: node scripts\/run-student-audit\.cjs full/);
 assert.match(workflow,/run: node scripts\/run-student-audit\.cjs edges/);
 assert.match(workflow,/name: MBB complete student acceptance\n    if: always\(\)/);
 assert.match(workflow,/needs: \[regression, browsers, edge-cases\]/);
 assert.match(workflow,/timeout-minutes: 40/);
 for(const p of PROFILES)assert.ok(workflow.includes(`- {engine: ${p.engine}, layout: ${p.layout}, width: ${p.width}, mixed: '${p.mixed?'1':'0'}', label: ${p.label}}`),p.label+' missing from workflow');
 assert.equal((workflow.match(/continue-on-error:/g)||[]).length,0);
});

test('isolated audit dependencies are fully locked to the accepted browser and axe revisions',()=>{
 const root=path.join(__dirname,'../scripts/student-audit-tools');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'package.json'))),lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json')));
 assert.equal(manifest.private,true);assert.deepEqual(manifest.dependencies,{'@axe-core/playwright':'4.13.0','axe-core':'4.13.0',playwright:'1.63.0'});
 assert.deepEqual(lock.packages[''].dependencies,manifest.dependencies);
 assert.deepEqual(Object.keys(lock.packages).sort(),['','node_modules/@axe-core/playwright','node_modules/axe-core','node_modules/playwright','node_modules/playwright-core']);
 for(const [key,entry] of Object.entries(lock.packages)){if(!key)continue;assert.match(entry.integrity,/^sha512-/);assert.equal(entry.version,key.includes('axe')?'4.13.0':'1.63.0');}
 assert.match(fs.readFileSync(path.join(__dirname,'../.github/workflows/mbb-set3-final-student.yml'),'utf8'),/npm ci --prefix scripts\/student-audit-tools --ignore-scripts/);
});


test('all seven batch audit drivers share the no-tab-churn engine, bounded teardown and independent watchdog',()=>{
 const root=path.join(__dirname,'..');
 const runner=fs.readFileSync(path.join(root,'scripts/run-student-audit.cjs'),'utf8');
 assert.ok(runner.includes('batch<=7'));
 for(let batch=1;batch<=7;batch++){
  const script=fs.readFileSync(path.join(root,`scripts/audit-mbb-set3-batch${batch}.mjs`),'utf8');
  const workflow=fs.readFileSync(path.join(root,`.github/workflows/mbb-set3-batch${batch}-audit.yml`),'utf8');
  assert.equal((script.match(/analyzeSingleDocument\(page,AxeBuilder/g)||[]).length,2);
  assert.ok(script.includes("await phase('context-close',()=>context.close(),5000)"));
  assert.ok(script.includes('report.complete=!process.exitCode;save()'));
  assert.ok(script.includes('publishProgress(out,report)'));
  assert.ok(script.includes('expected=engines.length*layouts.length*100'));
  // Batch4 retains its concurrent, deliberately bad isolated-fixture comparison.
  // No student question/review may return to unbounded normal-mode aggregation.
  assert.equal((script.match(/new AxeBuilder/g)||[]).length,batch===4?1:0);
  assert.doesNotMatch(script,/force\s*:\s*true|dispatchEvent\(['"]click/);
  if(batch===4){
   assert.ok(script.includes("new AxeBuilder({page:p}).include('#audit-fixture')"));
   assert.ok(script.includes("phase(engine+'-accessibility-self-test'"));
   assert.equal((script.match(/},120000\);/g)||[]).length,2);
   assert.ok(script.includes('report.accessibilityScans!==engines.length*layouts.length*100'));
   assert.equal((workflow.match(/persist-credentials: false/g)||[]).length,2);
   assert.ok(workflow.includes('audit-tools-lock.json'));
  }
  assert.ok(workflow.includes(`node scripts/run-student-audit.cjs batch${batch}`));
  assert.ok(workflow.includes('npm ci --prefix scripts/student-audit-tools --ignore-scripts'));
  assert.doesNotMatch(workflow,/npm install --no-save/);
  if(batch!==2)assert.ok(workflow.includes('scripts/lib/student-audit-*.cjs'));
 }
});


test('student gate rejects missing, mismatched or silently weakened WebKit rendering evidence',()=>{
 const make=()=>supervisor(35*60000,'webkit');
 validateSupervisor(make(),source,35*60000,'webkit');
 for(const change of [s=>delete s.renderingPolicy,s=>s.renderingPolicy.rasterizer='browser-default',s=>s.renderingPolicy.paintingThreads=8,s=>s.renderingPolicy.engine='chromium',s=>s.renderingPolicy.scope='production',s=>s.renderingPolicy.version=2]){
  const s=make();change(s);assert.throws(()=>validateSupervisor(s,source,35*60000,'webkit'),/rendering policy/);
 }
});
