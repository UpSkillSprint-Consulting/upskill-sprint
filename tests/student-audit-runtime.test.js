'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {bounded,analyzeSingleDocument,verifyCoverage,TAGS}=require('../scripts/lib/student-audit-runtime.cjs');
test('audit watchdog reports the exact failing operation rather than silently hanging',async()=>{
 const states=[];await assert.rejects(bounded('review-140-dark-axe',()=>new Promise(()=>{}),10,s=>states.push(s)),/AUDIT_TIMEOUT: review-140-dark-axe/);
 assert.deepEqual(states.map(s=>s.status),['running','failed']);
 assert.equal(await bounded('working',()=>17,100),17);
 await assert.rejects(bounded('assertion',()=>{throw Error('original assertion');},100),/original assertion/);
});
test('single document accessibility never omits a newly introduced frame or returns an empty pass',async()=>{
 const page={frames:()=>[{}]},calls=[];
 class Builder{include(s){calls.push(s);return this;}withTags(t){calls.push(t);return this;}setLegacyMode(b){calls.push(b);return this;}async analyze(){return {violations:[],passes:[{id:'example-rule'}],incomplete:[]};}}
 await analyzeSingleDocument(page,Builder,'.tb-review-card');assert.deepEqual(calls,['.tb-review-card',[...TAGS],true]);
 await assert.rejects(analyzeSingleDocument({frames:()=>[{},{}]},Builder,'.tb-review-card'),/frame-aware scan required/);
 class Empty extends Builder{async analyze(){return {violations:[],passes:[],incomplete:[]};}}
 await assert.rejects(analyzeSingleDocument(page,Empty,'.tb-review-card'),/no evaluated rules/);
});
test('complete student coverage requires all 175 unique questions and reviews, both themes and 700 scans',()=>{
 const records=()=>Array.from({length:175},(_,i)=>({number:i+1,qid:'item-'+i,checks:['light','dark'].map(theme=>({theme,a11y:{completed:true}}))}));
 const report={questions:records(),reviews:records(),accessibilityRequired:true,accessibilityScans:700};verifyCoverage(report);
 for(const edit of [r=>r.reviews.pop(),r=>r.questions[1].qid=r.questions[0].qid,r=>r.questions[0].checks.pop(),r=>r.questions[0].checks[0].a11y.completed=false,r=>r.accessibilityScans--]){const copy=structuredClone(report);edit(copy);assert.throws(()=>verifyCoverage(copy));}
});

test('accessibility scope cannot acquire an omitted iframe during a scan',async()=>{
 let frames=1;const page={frames:()=>Array.from({length:frames},()=>({}))};
 class Builder{include(){return this;}withTags(){return this;}setLegacyMode(){return this;}async analyze(){frames=2;return {violations:[],passes:[{id:'rule'}],incomplete:[]};}}
 await assert.rejects(analyzeSingleDocument(page,Builder,'.tb-review-card'),/scope changed during scan/);
});

test('reuse installs an axe engine once but evaluates every new DOM state and selector', async () => {
 const vm=require('node:vm');let installs=0,runs=0,domHasViolation=false;const observed=[];
 const result=()=>({testEngine:{name:'axe-core',version:'4.13.0'},passes:[{id:'rule'}],violations:domHasViolation?[{id:'button-name'}]:[],incomplete:[]});
 const window={};
 const page={frames:()=>[{}],evaluate:async(fn,arg)=>vm.runInNewContext('('+fn.toString()+')(input)',{window,input:arg})};
 class Builder{include(){return this;}withTags(){return this;}setLegacyMode(){return this;}async analyze(){installs++;window.axe={version:'4.13.0',run:async(context,options)=>{runs++;observed.push(JSON.parse(JSON.stringify({context,options})));return result();}};return result();}}
 assert.deepEqual((await analyzeSingleDocument(page,Builder,'.quiz')).violations,[]);
 domHasViolation=true;
 assert.deepEqual((await analyzeSingleDocument(page,Builder,'.review')).violations,[{id:'button-name'}]);
 assert.equal(installs,1);assert.equal(runs,1);
 assert.deepEqual(observed,[{context:{include:['.review']},options:{runOnly:{type:'tag',values:[...TAGS]}}}]);
 delete window.axe;await analyzeSingleDocument(page,Builder,'.new-document');assert.equal(installs,2,'Navigation requires a new engine');
 window.axe.run=async()=>{throw Error('real audit failed');};
 await assert.rejects(analyzeSingleDocument(page,Builder,'.review'),/real audit failed/);
 assert.equal(installs,2,'An audit failure is not retried or hidden');
});

test('two simultaneous scans on a single page fail instead of sharing stale audit state',async()=>{
 let release;const waiting=new Promise(r=>{release=r;});
 const page={frames:()=>[{}]};
 class Builder{include(){return this;}withTags(){return this;}setLegacyMode(){return this;}async analyze(){await waiting;return {passes:[{id:'rule'}],violations:[],incomplete:[]};}}
 const first=analyzeSingleDocument(page,Builder,'.review');
 await assert.rejects(analyzeSingleDocument(page,Builder,'.review'),/Concurrent accessibility/);
 release();await first;
});
