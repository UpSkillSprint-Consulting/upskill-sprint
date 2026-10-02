const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('lessons/power-bi-excel-sql/excel-formula-fluency.html','utf8');
function page(){const dom=new JSDOM(html,{url:'https://sprint.example/lesson',runScripts:'outside-only'}),w=dom.window;w.HTMLElement.prototype.scrollIntoView=function(){};w.IntersectionObserver=class{observe(){}disconnect(){}};w.setTimeout=()=>1;w.clearTimeout=()=>{};return{dom,w,el:id=>w.document.getElementById(id),close:()=>dom.window.close()};}
function reference(options={}){
 const h=page(),{w}=h,raw=new Map(Object.entries(options.initial||{})),writes=[];
 const storage={getItem:key=>raw.get(key)??null,setItem:(key,value)=>{if(options.failWrites||options.failKey===key)throw new Error('Quota exceeded');writes.push(key);raw.set(key,value);}};
 Object.defineProperty(w,'localStorage',{configurable:true,get(){if(options.blockStorage)throw new Error('Storage unavailable');return storage;}});
 const base=[...w.document.scripts].find(s=>s.textContent.includes('const productionData ='));
 const scripts=options.allInline?[...w.document.scripts].filter(s=>!s.src).map(s=>s.textContent):[h.el('reference-progress-storage').textContent,base.textContent,h.el('phase2-platform').textContent,h.el('phase3-platform-core').textContent];
 w.eval(scripts.join('\n')+'\nwindow.referenceProbe={state,save};');
 return{...h,raw,writes};
}
test('malformed reference progress starts safely, preserves all existing stored records and exposes the exact unreadable text',()=>{
 const raw='{broken progress',accounts=JSON.stringify([{id:'old-profile',name:'Existing Learner',progress:{completed:{'0':true},revealed:{},streak:1,xp:10,current:0}}]);
 const h=reference({initial:{excelFormulaFluency:raw,excelFormulaFluencyAccountsV2:accounts,excelFormulaFluencyActiveProfileV2:'old-profile'}});try{
  assert.ok(h.el('challengeTitle').textContent);h.w.referenceProbe.state.xp=25;assert.equal(h.w.referenceProbe.save(),false);assert.equal(h.w.P3.persist(),false);
  assert.equal(h.raw.get('excelFormulaFluency'),raw);assert.equal(h.raw.get('excelFormulaFluencyAccountsV2'),accounts);assert.equal(h.writes.length,0);
  assert.match(h.el('reference-save-status').textContent,/original saved text is preserved/);h.el('reference-recovery-export').click();assert.equal(JSON.parse(h.el('reference-recovery-text').value).excelFormulaFluency,raw);
  assert.equal(h.w.document.activeElement,h.el('reference-recovery-text'));
 }finally{h.close();}
});
test('blocked browser storage keeps reference challenges and profile progress usable without claiming a saved copy',()=>{
 const h=reference({blockStorage:true});try{
  assert.ok(h.el('challengeTitle').textContent);h.w.referenceProbe.state.xp=42;assert.equal(h.w.P3.persist(),false);assert.equal(h.w.P3.activeAccount().progress.xp,42);
  assert.match(h.el('reference-save-status').textContent,/only kept on this page/);h.w.P3.toast('Profile settings saved.');assert.match(h.el('phase2Toast').textContent,/updated for this visit/);assert.doesNotMatch(h.el('phase2Toast').textContent,/settings saved/);h.el('openAccountDialog').click();assert.match(h.el('syncStatus').textContent,/saving is unavailable/);
 }finally{h.close();}
});
test('quota failures retain changed reference work for profile export and normal storage persists valid existing progress',()=>{
 const saved={completed:{'0':true},revealed:{},streak:2,xp:20,current:0},h=reference({failWrites:true,initial:{excelFormulaFluency:JSON.stringify(saved)}});try{
  assert.equal(h.w.referenceProbe.state.xp,20);h.w.referenceProbe.state.xp=51;assert.equal(h.w.P3.persist(),false);assert.equal(h.w.P3.activeAccount().progress.xp,51);assert.equal(JSON.parse(h.raw.get('excelFormulaFluency')).xp,20);
  assert.match(h.el('reference-save-status').textContent,/storage is unavailable/);
 }finally{h.close();}
 const ok=reference({initial:{excelFormulaFluency:JSON.stringify(saved)}});try{ok.w.referenceProbe.state.xp=52;assert.equal(ok.w.P3.persist(),true);assert.equal(JSON.parse(ok.raw.get('excelFormulaFluency')).xp,52);assert.equal(JSON.parse(ok.raw.get('excelFormulaFluencyAccountsV2'))[0].progress.xp,52);}finally{ok.close();}
});
test('invalid JSON shapes and malformed account registries are preserved without reference startup errors',()=>{
 for(const raw of ['null','[]','{"completed":null}','{"phase3":{"certification":{"assessments":null}}}']){const h=reference({initial:{excelFormulaFluency:raw}});try{assert.equal(h.raw.get('excelFormulaFluency'),raw);assert.match(h.el('reference-save-status').textContent,/could not be read/);}finally{h.close();}}
 const h=reference({initial:{excelFormulaFluencyAccountsV2:'{bad accounts'}});try{assert.equal(h.raw.get('excelFormulaFluencyAccountsV2'),'{bad accounts');assert.equal(h.w.P3.persist(),false);h.el('reference-recovery-export').click();assert.equal(JSON.parse(h.el('reference-recovery-text').value).excelFormulaFluencyAccountsV2,'{bad accounts');}finally{h.close();}
});
test('older profile records receive safe role/date defaults while invalid role/date shapes remain untouched',()=>{
 const account={id:'older',name:'Older profile',progress:{}},h=reference({initial:{excelFormulaFluencyAccountsV2:JSON.stringify([account]),excelFormulaFluencyActiveProfileV2:'not-a-matching-id'}});try{h.el('openAccountDialog').click();assert.match(h.el('settingsProfileMeta').textContent,/Learner.*Not yet/);assert.equal(h.w.P3.activeAccount().id,'older');}finally{h.close();}
 for(const invalid of [{...account,role:42},{...account,createdAt:'bad date'},{...account,createdAt:1e100}]){const raw=JSON.stringify([invalid]),x=reference({initial:{excelFormulaFluencyAccountsV2:raw}});try{x.el('openAccountDialog').click();assert.equal(x.raw.get('excelFormulaFluencyAccountsV2'),raw);assert.match(x.el('reference-save-status').textContent,/could not be read/);}finally{x.close();}}
});
test('malformed nested reference records cannot break component startup or overwrite existing saved text',()=>{
 for(const value of [{phase2:{projects:{broken:null}}},{phase3:{certification:{credentials:[null]}}},{phase3:{portfolio:{artifacts:[null]}}},{phase2:{sync:{lastSync:'not a date'}}}]){const raw=JSON.stringify(value),h=reference({initial:{excelFormulaFluency:raw}});try{assert.equal(h.raw.get('excelFormulaFluency'),raw);assert.equal(h.w.P3.persist(),false);h.el('openAccountDialog').click();assert.match(h.el('syncStatus').textContent,/saving is unavailable/);}finally{h.close();}}
});
test('reference profile imports reject invalid nested progress before it can poison the saved registry',async()=>{
 const h=reference();try{const before=h.raw.get('excelFormulaFluencyAccountsV2'),input=h.el('importProfileFile');await input.onchange({target:{files:[{size:100,text:async()=>JSON.stringify({name:'Broken import',progress:{phase3:{certification:{credentials:[null]}}}})}],value:'upload'}});assert.equal(h.raw.get('excelFormulaFluencyAccountsV2'),before);assert.match(h.el('phase2Toast').textContent,/Profile import failed/);assert.equal(h.w.P3.accounts().length,1);
  await input.onchange({target:{files:[{size:100,text:async()=>JSON.stringify({name:'Valid older profile',progress:{completed:{'0':true},revealed:{},xp:10,current:0}})}],value:'upload'}});assert.equal(h.w.P3.accounts().length,2);assert.equal(h.w.P3.accounts()[1].role,'learner');assert.equal(h.w.P3.accounts()[1].progress.completed['0'],true);
 }finally{h.close();}
});
test('a failed active-profile selection rolls back the snapshot and cannot overwrite the other profile',()=>{
 const progress=xp=>({completed:{},revealed:{},streak:0,xp,current:0}),accounts=[{id:'a',name:'Profile A',role:'learner',progress:progress(10)},{id:'b',name:'Profile B',role:'learner',progress:progress(30)}],h=reference({failKey:'excelFormulaFluencyActiveProfileV2',initial:{excelFormulaFluency:JSON.stringify(progress(10)),excelFormulaFluencyAccountsV2:JSON.stringify(accounts),excelFormulaFluencyActiveProfileV2:'a'}});try{
  h.el('openAccountDialog').click();h.el('profileChoices').querySelector('[data-profile="b"]').click();assert.equal(h.w.P3.activeAccount().id,'a');assert.equal(h.raw.get('excelFormulaFluencyActiveProfileV2'),'a');assert.equal(JSON.parse(h.raw.get('excelFormulaFluency')).xp,10);h.w.P3.persist();assert.equal(JSON.parse(h.raw.get('excelFormulaFluencyAccountsV2')).find(p=>p.id==='b').progress.xp,30);assert.match(h.el('reference-save-status').textContent,/storage is unavailable/);
 }finally{h.close();}
});
test('all reference inline scripts initialize and render partial legacy modules after safe defaults',()=>{
 const value={completed:{},revealed:{},current:0,liveLab:{},phase2:{projects:{'copq-dashboard':{}}},phase3:{coach:{},certification:{},portfolio:{},organization:{teams:[{}]},industryProjects:{}}},h=reference({allInline:true,initial:{excelFormulaFluency:JSON.stringify(value)}});try{
  assert.ok(h.el('challengeTitle').textContent);assert.ok(h.el('coachMessages').textContent);assert.ok(h.el('certReadinessText').textContent);assert.ok(h.el('teamList').textContent);assert.equal(h.w.referenceProbe.state.phase3.organization.teams[0].memberIds.length,0);assert.equal(h.w.referenceProbe.state.phase2.projects['copq-dashboard'].checks.length,0);h.w.P3.refresh();h.el('openAccountDialog').click();assert.ok(h.el('settingsProfileMeta').textContent);
 }finally{h.close();}
 const corrupt=reference({allInline:true,initial:{excelFormulaFluency:'{broken'}});try{assert.ok(corrupt.el('coachMessages').textContent);assert.equal(corrupt.raw.get('excelFormulaFluency'),'{broken');assert.match(corrupt.el('reference-save-status').textContent,/could not be read/);}finally{corrupt.close();}
 const blocked=reference({allInline:true,blockStorage:true});try{assert.ok(blocked.el('coachMessages').textContent);blocked.w.P3.refresh();assert.match(blocked.el('reference-save-status').textContent,/storage is unavailable/);assert.ok(blocked.el('certReadinessText').textContent);}finally{blocked.close();}
});
test('malformed local credential identifiers remain protected and the lookup safely handles legacy runtime records',()=>{
 for(const credential of [{},{id:1}]){const raw=JSON.stringify({phase3:{certification:{credentials:[credential]}}}),h=reference({allInline:true,initial:{excelFormulaFluency:raw}});try{assert.equal(h.raw.get('excelFormulaFluency'),raw);assert.match(h.el('reference-save-status').textContent,/could not be read/);h.el('verifyCredentialInput').value='USS-UNKNOWN';assert.doesNotThrow(()=>h.el('verifyCredential').onclick());assert.match(h.el('verifyResult').textContent,/No matching credential/);}finally{h.close();}}
 const h=reference({allInline:true});try{h.w.referenceProbe.state.phase3.certification.credentials=[{},{id:1}];h.el('verifyCredentialInput').value='USS-UNKNOWN';assert.doesNotThrow(()=>h.el('verifyCredential').onclick());assert.match(h.el('verifyResult').textContent,/No matching credential/);}finally{h.close();}
});
function assessment(){
 const h=page(),{w}=h;let now=1000,callback,persisted=0;w.Date.now=()=>now;w.setInterval=fn=>(callback=fn,1);w.clearInterval=()=>{};
 w.state={phase3:{certification:{assessments:[],bestScore:0,credentials:[]}}};w.P3={el:h.el,esc:String,skill:()=>({name:'Practice'}),toast:()=>{},persist:()=>{persisted++;},certRequirements:()=>[{name:'Practice',detail:'Incomplete',done:false}],refresh:()=>{},refreshers:[]};
 w.eval(h.el('phase3-platform-cert').textContent);return{...h,advance:ms=>{now+=ms;},tick:()=>callback(),persisted:()=>persisted,results:()=>w.state.phase3.certification.assessments};
}
test('completed reference assessment disables navigation and answers; late callbacks cannot record it twice; a fresh attempt works',()=>{
 const h=assessment();try{
  h.w.P3.cert.start(true);for(let i=0;i<5;i++){const input=h.el('examOptions').querySelector('input');input.checked=true;input.onchange();if(i<4)h.el('examNext').onclick();}h.advance(6500);h.w.P3.cert.submit();
  assert.equal(h.results().length,1);assert.equal(h.results()[0].durationSeconds,6);for(const id of ['examPrevious','examNext','submitExam']){assert.equal(h.el(id).disabled,true);assert.doesNotThrow(()=>h.el(id).onclick());}assert.ok([...h.el('examOptions').querySelectorAll('input')].every(x=>x.disabled));h.tick();assert.equal(h.results().length,1);
  h.w.P3.cert.start(true);assert.equal(h.el('examNext').disabled,false);assert.ok([...h.el('examOptions').querySelectorAll('input')].every(x=>!x.disabled));assert.equal(h.el('examTimer').textContent,'10:00');
 }finally{h.close();}
});
test('reference timer counts wall-clock elapsed time and submits once after a delayed background callback',()=>{
 const h=assessment();try{h.w.P3.cert.start(true);h.advance(125000);h.tick();assert.equal(h.el('examTimer').textContent,'07:55');h.advance(476000);h.tick();assert.equal(h.results().length,1);assert.equal(h.results()[0].durationSeconds,600);assert.equal(h.results()[0].correct,0);assert.equal(h.el('examTimer').textContent,'00:00');h.tick();assert.equal(h.persisted(),1);}finally{h.close();}
});
test('expired reference assessments finish on visibility return or a manual action without an interval tick',()=>{
 for(const action of ['visibility','submit','next','answer']){const h=assessment();try{h.w.P3.cert.start(true);h.advance(601000);if(action==='visibility')h.w.document.dispatchEvent(new h.w.Event('visibilitychange'));if(action==='submit')h.w.P3.cert.submit();if(action==='next')h.el('examNext').onclick();if(action==='answer'){const x=h.el('examOptions').querySelector('input');x.checked=true;x.onchange();}assert.equal(h.results().length,1,action);assert.equal(h.results()[0].correct,0,action);assert.equal(h.el('examPrevious').disabled,true);}finally{h.close();}}
});
