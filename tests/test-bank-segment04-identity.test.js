'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {fixture,question,live,read}=require('./helpers/segment04-identity.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
const codes=r=>r.errors.map(e=>e.code);
const snapshot=w=>Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>w.localStorage.key(i)).map(k=>[k,w.localStorage.getItem(k)]));

test('published inventory: every canonical identity/domain is validated without mutating question content',async t=>{
  const {dom,w,errors}=await live();t.after(()=>dom.window.close());assert.deepEqual(errors,[]);
  const baseline=JSON.parse(read('docs/exam-reliability/identity/v1/published-baseline.json'));
  const globalIds=new Set();
  for(const [id,exam] of Object.entries(w.__TB.EXAMS)){
    const before=JSON.stringify(exam),r=w.__TBQuestionRegistry.validate(id);
    assert.equal(r.valid,true,id);assert.deepEqual(plain(r.errors),[]);assert.equal(JSON.stringify(exam),before);
    if(!r.published){assert.ok(['cqa','cre'].includes(id));continue;}
    const qs=w.__TBQuestionRegistry.questionsFor(id),ids=Array.from(qs,q=>q.qid).sort();
    assert.equal(ids.length,baseline.exams[id].count);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(ids)).digest('hex'),baseline.exams[id].idsSha256);
    assert.equal(r.derivedLegacyIds,0);
    for(const q of qs){assert.ok(!globalIds.has(q.qid));globalIds.add(q.qid);assert.equal(w.__TBQuestionRegistry.idFor(id,q),q.qid);}
    // Entire bank reordered and wording edited: no new identities or derived IDs.
    Object.values(exam.sets).forEach(rows=>rows.reverse());
    qs.forEach(q=>q.stem='Edited wording: '+q.stem);
    assert.deepEqual(Array.from(w.__TBQuestionRegistry.questionsFor(id),q=>q.qid).sort(),ids);
    for(const q of qs)assert.equal(w.__TBQuestionRegistry.idFor(id,q),q.qid);
  }
  assert.equal(globalIds.size,3189);
});

for(const [name,change,code] of [
  ['missing ID',q=>{delete q.qid;},'MISSING_ID'],
  ['empty ID',q=>q.qid='','INVALID_ID'],
  ['numeric ID',q=>q.qid=100,'INVALID_ID'],
  ['whitespace ID',q=>q.qid=' cssbb:q1 ','INVALID_ID'],
  ['oversized ID',q=>q.qid='cssbb:'+ 'x'.repeat(180),'INVALID_ID'],
  ['namespace',q=>q.qid='mbb:fixture:one','WRONG_NAMESPACE'],
  ['conflicting aliases',q=>q.questionId='cssbb:different','CONFLICTING_ID_FIELDS'],
  ['invalid secondary alias',q=>q.question_id=null,'INVALID_ID'],
  ['unmapped subtopic',q=>q.sub='missing','UNKNOWN_DOMAIN'],
  ['missing subtopic',q=>{delete q.sub;},'UNKNOWN_DOMAIN']
])test('strict rejection: '+name,t=>{
  const {api,exam}=fixture(t);const q=question();change(q);
  const r=api.inspect('cssbb',{...exam,bank:[q],sets:{1:[q]}});
  assert.equal(r.valid,false);assert.ok(codes(r).includes(code));assert.equal(r.total,0);assert.equal(api.validate('cssbb').total,2);
});

test('inherited IDs are not accepted as explicitly supplied IDs',t=>{
  const {api,exam}=fixture(t);const q=Object.assign(Object.create({qid:'cssbb:inherited'}),{sub:'p1'});
  assert.ok(codes(api.inspect('cssbb',{...exam,bank:[q],sets:{1:[q]}})).includes('MISSING_ID'));
});
test('all supplied identity aliases must agree; explicit retired snapshots keep their IDs',t=>{
  const {api}=fixture(t);const q=question('cssbb:retired:fixture');q.questionId=q.qid;q.id=q.qid;q.question_id=q.qid;
  assert.equal(api.idFor('cssbb',q),q.qid);assert.equal(api.idFor('mbb',q),'');
  assert.equal(api.idFor('cssbb',{stem:'No ID',options:['A']}),'');
});
test('G09: duplicate objects reject the entire bank rather than expose a silently truncated subset',t=>{
  const {api,w,exam,rows}=fixture(t);const duplicate={...rows[0],stem:'Distinct question, colliding ID'};
  exam.sets[1].push(duplicate);const r=api.validate('cssbb');
  assert.equal(r.valid,false);assert.equal(r.total,0);assert.equal(api.questionsFor('cssbb').length,0);
  assert.ok(codes(r).includes('DUPLICATE_ID'));assert.match(w.document.getElementById('tb-question-identity-alert').textContent,/unavailable/);
  assert.equal(exam.sets[1].length,3,'Source is not silently edited');
  exam.sets[1].pop();assert.equal(api.ensure('cssbb'),true);assert.equal(api.questionsFor('cssbb').length,2);
});
test('cache observes array replacement, push, splice, alias/subtopic/BoK edits and renamed IDs',t=>{
  const {api,exam,rows}=fixture(t);assert.equal(api.validate('cssbb').valid,true);
  const q=question('cssbb:fixture:new');exam.sets[2]=[q];assert.equal(api.validate('cssbb').total,3);
  exam.sets[2].push({...q});assert.equal(api.validate('cssbb').valid,false);exam.sets[2].splice(1,1);
  assert.equal(api.validate('cssbb').valid,true);q.questionId='cssbb:other';assert.equal(api.validate('cssbb').valid,false);delete q.questionId;
  q.sub='absent';assert.equal(api.validate('cssbb').valid,false);q.sub='p1';assert.equal(api.validate('cssbb').valid,true);
  exam.bok[0].subs.push({id:'p1'});assert.equal(api.validate('cssbb').valid,false);exam.bok[0].subs.pop();
  rows[0].qid='cssbb:renamed';assert.ok(codes(api.validate('cssbb')).includes('IDENTITY_CHANGED'));assert.equal(api.idFor('cssbb',rows[0]),'');
});
test('membership is separate: repeated reference in another set or bank counts once; repetition within a set rejects',t=>{
  const {api,exam,rows}=fixture(t);exam.sets[2]=[rows[0]];
  assert.equal(api.validate('cssbb').total,2);assert.deepEqual(plain(api.membershipsFor('cssbb',rows[0].qid)),['1','2']);
  exam.sets.bank=[rows[0]];assert.equal(api.validate('cssbb').valid,true);
  assert.deepEqual(plain(api.membershipsFor('cssbb',rows[0].qid)),['1','2','bank'],'A set named bank is distinct from the bank mirror');
  exam.sets[2].push(rows[0]);assert.ok(codes(api.validate('cssbb')).includes('DUPLICATE_MEMBERSHIP'));
});
test('malformed containers, sparse rows, duplicate domains and unreadable records produce errors',t=>{
  const {api,exam}=fixture(t);
  for(const source of [null,[],{...exam,sets:[]},{...exam,sets:{1:null}},{...exam,sets:{1:Array(1)}},{...exam,bok:[]},{...exam,sets:{1:[]},bank:[]}])assert.equal(api.inspect('cssbb',source).valid,false);
  const q=question();Object.defineProperty(q,'qid',{get(){throw Error('hostile getter');}});
  assert.ok(codes(api.inspect('cssbb',{...exam,sets:{1:[q]}})).includes('UNREADABLE_BANK'));
  assert.equal(api.inspect('CSSBB',exam).valid,false);
});
test('cross-exam object reuse cannot leak a remembered identity into another certification',t=>{
  const {api,w,rows,exam}=fixture(t);assert.equal(api.idFor('cssbb',rows[0]),rows[0].qid);
  w.__TB.EXAMS.mbb={...exam};assert.equal(api.validate('mbb').valid,false);assert.equal(api.idFor('mbb',rows[0]),'');
});
test('atomic import rejects a late error without editing source, cache, objects or learner storage',t=>{
  const {api,w,exam,rows}=fixture(t);w.localStorage.setItem('tb-learning-events-v2','{"evidence":"unchanged"}');const before=snapshot(w),raw=JSON.stringify(exam);
  const extra=question('cssbb:new:1');let updates=0;w.document.addEventListener('tb:question-bank-updated',()=>updates++);
  const r=api.replaceBank('cssbb',{1:rows.concat(extra,{...extra})});
  assert.equal(r.accepted,false);assert.equal(w.__TB.EXAMS.cssbb,exam);assert.equal(JSON.stringify(exam),raw);
  assert.deepEqual(snapshot(w),before);assert.equal(updates,0);assert.equal(api.validate('cssbb').total,2);
  assert.equal(Object.hasOwn(extra,'__tbQuestionId'),false,'Rejected candidates never receive assignments');
  assert.match(w.document.getElementById('tb-question-identity-alert').textContent,/previous bank has not been changed/);
});
test('accepted import retains IDs, detaches input buffers, refreshes the registry and emits one update',t=>{
  const {api,w,rows,exam}=fixture(t);const oldId=rows[0].qid,newQ=question('cssbb:new:1');const input={1:[{...rows[0],stem:'Wording correction'},rows[1],newQ]};
  let updates=0;w.document.addEventListener('tb:question-bank-updated',()=>updates++);
  assert.equal(api.replaceBank('cssbb',input).accepted,true);assert.equal(api.validate('cssbb').total,3);assert.equal(updates,1);
  assert.equal(api.find('cssbb',oldId).stem,'Wording correction');assert.equal(w.__TB.EXAMS.cssbb.minutes,exam.minutes);
  input[1].pop();newQ.options[0]='Changed after import';assert.equal(api.find('cssbb',newQ.qid).options[0],'A');assert.equal(api.validate('cssbb').total,3);
});
test('moving membership or editing wording does not rename IDs or couple identity to q.set',t=>{
  const {api,rows}=fixture(t);rows[0].set=1;
  assert.equal(api.replaceBank('cssbb',{1:[rows[1]],2:[rows[0]]}).accepted,true);
  assert.deepEqual(plain(api.membershipsFor('cssbb',rows[0].qid)),['2']);assert.equal(api.find('cssbb',rows[0].qid).set,1);
});
test('removal requires a later explicit retirement policy and cannot silently erase an identity',t=>{
  const {api,rows}=fixture(t);const r=api.replaceBank('cssbb',{1:[rows[0]]});assert.equal(r.accepted,false);assert.ok(codes(r).includes('MISSING_EXISTING_ID'));
});
test('malformed content, unsafe set keys and nonserializable inputs reject without changing accepted state',t=>{
  const {api,w,rows,exam}=fixture(t);
  const invalid={...rows[0],answer:7};assert.ok(codes(api.replaceBank('cssbb',{1:[invalid,rows[1]]})).includes('INVALID_CONTENT'));
  const polluted=JSON.parse('{"__proto__":[]}');polluted[1]=rows;assert.equal(api.replaceBank('cssbb',polluted).accepted,false);assert.equal({}.polluted,undefined);
  const cycle={...rows[0]};cycle.chart=cycle;assert.equal(api.replaceBank('cssbb',{1:[cycle,rows[1]]}).accepted,false);assert.equal(w.__TB.EXAMS.cssbb,exam);
});
test('authoring errors are text, not executable HTML',t=>{
  const {api,w,rows}=fixture(t);const sets={'<img src=x onerror=alert(1)>':[question('cssbb:bad:1')],1:rows};
  assert.equal(api.replaceBank('cssbb',sets).accepted,false);
  assert.equal(w.document.querySelector('#tb-question-identity-alert img'),null);
  assert.equal(w.document.getElementById('tb-question-identity-alert').getAttribute('role'),'alert');
});
test('active core or ledger session blocks bank replacement without changing its bank',t=>{
  const {api,w,exam,rows}=fixture(t);w.__TB.isExamSessionActive=()=>true;
  assert.ok(codes(api.replaceBank('cssbb',{1:rows})).includes('ACTIVE_SESSION'));
  w.__TB.isExamSessionActive=()=>false;w.__TBLearning={store:()=>({sessions:{s:{examId:'cssbb',status:'active'}}})};
  assert.ok(codes(api.replaceBank('cssbb',{1:rows})).includes('ACTIVE_SESSION'));assert.equal(w.__TB.EXAMS.cssbb,exam);
});

test('all new live session modes reject foreign, unknown and duplicate IDs before writing learner evidence',async t=>{
  const {api,w,rows}=fixture(t);w.eval(read('test-bank-learning-events.js'));const learning=w.__TBLearning;
  for(const mode of ['exam','quick','focus','diagnostic','practice','adaptive','review']){
    for(const invalid of [[rows[0],rows[0]],[question('mbb:foreign')],[question('cssbb:unknown')],[{...rows[0],answer:3}],[rows[0].qid],new Array(1),[]]){
      const before=JSON.stringify(learning.store());const r=learning.startSession({examId:'cssbb',questions:invalid,mode,returnResult:true});
      assert.equal(r.saved,false,mode);assert.equal(r.rejected,true);assert.equal(r.reason,'invalid-question-identity');assert.equal(JSON.stringify(learning.store()),before);
    }
  }
  assert.equal(learning.startSession({examId:'cssbb',questions:rows,mode:'quick',returnResult:true}).saved,true);
});
test('invalid New-only candidates never reach the reservation RPC',async t=>{
  const {w,rows}=fixture(t);let calls=0;w.UpskillAuth={getUser:()=>({id:'fixture-owner'}),getClient:()=>({rpc(){calls++;throw Error('Must not call');}})};
  w.eval(read('test-bank-learning-events.js'));
  for(const ids of [['mbb:foreign'],['cssbb:unknown'],[rows[0].qid,rows[0].qid],[]]){
    const r=await w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:ids});assert.equal(r.reserved,false);assert.equal(r.reason,'invalid-question-identity');
  }
  assert.equal(calls,0);
});
test('mixed selection draws one canonical question even when it belongs to multiple sets',async t=>{
  const {dom,w}=await live();t.after(()=>dom.window.close());const e=w.__TB.EXAMS.cssbb;const first=e.sets[1][0];
  e.sets[2].push(first);w.__TBSegment04Probe.set('mix');assert.equal(w.__TBQuestionRegistry.validate('cssbb').valid,true);
  const mixed=w.__TBSegment04Probe.mixedBank(),active=w.__TBSegment04Probe.activeBank();
  assert.equal(mixed.filter(q=>q.qid===first.qid).length,1);assert.equal(active.filter(q=>q.qid===first.qid).length,1);
});


test('removing an assigned explicit ID cannot fall back to a remembered or text-derived ID',t=>{
  const {api,rows}=fixture(t);const id=rows[0].qid;assert.equal(api.idFor('cssbb',rows[0]),id);
  delete rows[0].qid;assert.equal(api.idFor('cssbb',rows[0]),'');assert.equal(api.validate('cssbb').valid,false);
  assert.equal(api.idFor('cssbb',question('cssbb:')),'');
});
test('identity rejection is not treated as storage quota failure or compacted by the mobile wrapper',t=>{
  const {w}=fixture(t);let stores=0,starts=0;
  w.__TBLearning={store(){stores++;return {};},startSession(){starts++;return {saved:false,rejected:true,reason:'invalid-question-identity'};}};
  // Install through the production enhancer, without changing the application API.
  let source=read('test-bank-set-controls.js');
  source=source.replace("  function activeSetValue(overview) {", "  window.__segment04InstallRecovery=installLearningStorageRecovery;\n  function activeSetValue(overview) {");
  w.eval(source);w.__segment04InstallRecovery();
  const result=w.__TBLearning.startSession({});assert.equal(result.rejected,true);assert.equal(starts,1);assert.equal(stores,0);
});

test('serialized import data is revalidated for content, existing identity and sparse options',t=>{
  const {api,w,rows,exam}=fixture(t);
  for(const patch of [{answer:4},{qid:'cssbb:replacement'}, {options:new Array(4)}]) {
    const q={...rows[0],toJSON(){return {...rows[0],...patch};}};
    const result=api.replaceBank('cssbb',{1:[q,rows[1]]});
    assert.equal(result.accepted,false);assert.equal(w.__TB.EXAMS.cssbb,exam);assert.equal(api.validate('cssbb').total,2);
  }
});
