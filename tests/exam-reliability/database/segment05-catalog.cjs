'use strict';
// Each client assertion executes SET ROLE authenticated (non-owner, no bypass).
// Trusted catalog seeding/regrades use the throwaway migration owner explicitly.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const V=require('../../../test-bank-versioning.js');
const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002';
const literal=x=>"'"+String(x).replace(/'/g,"''")+"'";
const json=x=>literal(JSON.stringify(x))+'::jsonb';
const row=(owner,id,session,type,payload,qid=null)=>`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${owner}',${literal(id)},'version-test-device',${literal(type)},'cssbb',${literal(session)},${qid?literal(qid):'NULL'},now(),${json(payload)})`;
function publication(exam){const c=V.createExamCatalog('cssbb',exam,{source:'synthetic SQL regression'});return {schemaVersion:'1.0.0',examId:'cssbb',configVersion:c.configVersion,blueprintVersion:c.blueprintVersion,bankVersion:c.bankVersion,config:c.config,provenance:c.provenance,canonicalConfig:V.canonical({config:c.config,provenance:c.provenance}),canonicalBlueprint:V.canonical(c.config.bok),canonicalManifest:V.canonical({examId:'cssbb',questions:c.questions,sets:c.sets}),contents:Object.fromEntries(exam.sets[1].map(q=>[q.qid,{revision:c.questions[q.qid],content:V.content(q),canonicalContent:V.canonical(V.content(q))}]))};}
function runChecks({ROOT,target,ok,run,role,expect,expectDenied,requireCount}){
  const publish=p=>'SELECT public.publish_test_bank_catalog('+json(p)+');';
  expect(target,'05 published catalog seed validates every canonical SHA in PostgreSQL',fs.readFileSync(path.join(ROOT,'supabase/catalog/segment05-catalog.sql'),'utf8'));
  expect(target,'05 all 3189 question revisions and five catalog releases persisted',requireCount('SELECT * FROM public.test_bank_question_revisions',3189)+requireCount('SELECT * FROM public.test_bank_catalog_releases',5));
  expect(target,'05 authenticated client reads catalog but not another user snapshot',role(A,requireCount('SELECT * FROM public.test_bank_question_revisions',3189)+requireCount('SELECT * FROM public.test_bank_session_versions',0)));
  const qs=[0,1,2].map(i=>({qid:'cssbb:sql-version:'+i,stem:'SQL version test '+i,sub:'v1',options:['A','B','C','D'],answer:i,why:'Synthetic, not exam material.'}));
  const exam={questions:3,minutes:3,pass:70,sets:{1:qs},bank:qs,bok:[{domain:'version-domain',weight:3,subs:[{id:'v1',w:3}]}]};
  const pub=publication(exam),catalog=V.createExamCatalog('cssbb',exam,{source:'synthetic SQL regression'});
  expectDenied(target,'05 authenticated cannot publish question keys/configuration',role(A,publish(pub)),'42501');
  expect(target,'05 trusted catalog publication is repeatable without replacement',publish(pub)+publish(pub)+requireCount("SELECT * FROM public.test_bank_question_revisions WHERE question_id LIKE 'cssbb:sql-version:%'",3));
  const corrupted=V.clone(pub);corrupted.contents[qs[0].qid].content.answer=3;
  // Different hash identifies a new revision; changing bytes under the old hash must fail.
  corrupted.contents[qs[0].qid].revision='f'.repeat(64);
  expectDenied(target,'05 PostgreSQL rejects a forged revision digest',publish(corrupted),'23514');
  const pin=V.pin({examId:'cssbb',sessionId:'sql-version-session',mode:'exam',setId:'1',questions:qs,timed:false,startedAt:Date.UTC(2026,8,8)},exam,catalog);
  const wire=V.wire(pin),start={mode:'exam',timed:false,total:3,versionPin:wire};
  const startRow=(payload=start,sid=pin.sessionId,id='version-start-001',owner=A)=>row(owner,id,sid,'session_started',payload)+';';
  const commit=(owner,sql)=>role(owner,sql).replace(/ROLLBACK;$/,'COMMIT;');
  expect(target,'05 versioned start atomically creates owned session and three ordered references',commit(A,startRow())+requireCount("SELECT * FROM public.test_bank_session_version_items WHERE session_id='sql-version-session'",3));
  expect(target,'05 identical event replay creates no duplicate version/session',role(A,startRow().slice(0,-1)+' ON CONFLICT(user_id,event_id) DO NOTHING;'+requireCount("SELECT * FROM public.test_bank_session_versions WHERE session_id='sql-version-session'",1)));
  expect(target,'05 B and missing subject cannot read A session/results',role(B,requireCount('SELECT * FROM public.test_bank_session_versions',0)+requireCount('SELECT * FROM public.test_bank_session_version_items',0))+role(null,requireCount('SELECT * FROM public.test_bank_session_versions',0)));
  expectDenied(target,'05 foreign-owner append still fails actual RLS',role(B,startRow(start,pin.sessionId,'version-foreign-owner',A)),'42501');
  for(const [name,fn,code] of [
    ['unsupported codec',p=>p.versionPin.codec=2,'23514'],
    ['wrong site target',p=>p.versionPin.siteTargetBps=0,'23514'],
    ['wrong expected length',p=>p.versionPin.expectedLength=175,'23514'],
    ['unknown configuration',p=>p.versionPin.configVersion='f'.repeat(64),'23503'],
    ['wrong blueprint',p=>p.versionPin.blueprintVersion='f'.repeat(64),'23514'],
    ['wrong grading policy',p=>p.versionPin.gradingPolicyVersion='future-policy','23514'],
    ['missing start time',p=>delete p.versionPin.startedAt,'23514'],
    ['invalid timing type',p=>p.versionPin.timed='false','23514']]){
    const bad=V.clone(start);fn(bad);expectDenied(target,'05 rejects '+name,role(A,startRow(bad,pin.sessionId,'version-bad-'+name.replace(/ /g,'-'))),code);
  }
  for(const [name,fn,code] of [
    ['duplicate options',p=>p.items[0][2][1]='o0','23514'],
    ['unknown revision',p=>p.items[0][1]='f'.repeat(64),'23503'],
    ['wrong set',p=>p.setId='99','23514'],
    ['duplicate items',p=>p.items[1]=p.items[0],'23505']]){
    const bad=V.clone(start),sid='bad-'+name.replace(/ /g,'-');bad.versionPin.sessionId=sid;fn(bad.versionPin);expectDenied(target,'05 rejects '+name+' without partial publication',role(A,startRow(bad,sid,'version-'+sid)),code);
  }
  expect(target,'05 rejected plans left no partial ordered items',requireCount("SELECT * FROM public.test_bank_session_versions WHERE session_id LIKE 'bad-%'",0));
  const ans=qs.map((q,i)=>({questionId:q.qid,selected:[0,0,null][i],status:['correct','incorrect','unanswered'][i],sub:q.sub}));
  const g=V.clone(V.grade(pin,qs.map((question,i)=>({question,selected:ans[i].selected}))));delete g.answers;
  const completion={mode:'exam',timed:false,total:3,correct:1,answers:ans,versionPin:V.reference(pin),grading:g};
  const completionRow=(p=completion,id='version-completion-001')=>row(A,id,pin.sessionId,'session_completed',p)+';';
  for(const [name,fn] of [['wrong correct count',p=>p.correct=3],['wrong selected option',p=>p.answers[0].selected=5],['wrong answer status',p=>p.answers[0].status='incorrect'],['missing blank',p=>p.answers.pop()],['reordered answer',p=>p.answers.reverse()],['downgrade to legacy',p=>delete p.versionPin]]){const bad=V.clone(completion);fn(bad);expectDenied(target,'05 rejects completion '+name,role(A,completionRow(bad,'version-completion-bad')),'23514');}
  expect(target,'05 valid completion independently grades original key including blank denominator',commit(A,completionRow()));
  const original=JSON.parse(ok(target,"SELECT grade FROM public.test_bank_versioned_results WHERE user_id='"+A+"' AND kind='original';"));
  for(const k of ['correct','total','incorrect','unanswered','siteTargetMet','byDomain'])assert.deepEqual(original[k],g[k],k);
  expectDenied(target,'05 client cannot overwrite original grade',role(A,"UPDATE public.test_bank_versioned_results SET grade='{}';"),'42501');
  expectDenied(target,'05 even trusted UPDATE cannot silently regrade',"UPDATE public.test_bank_versioned_results SET grade='{}';",'23514');
  expectDenied(target,'05 anonymous cannot read private grades',role(null,'SELECT * FROM public.test_bank_versioned_results;','anon'),'42501');
  expect(target,'05 original result remains invisible across owners',role(B,requireCount('SELECT * FROM public.test_bank_versioned_results',0)));
  const corrected=V.clone(exam);corrected.sets[1][0].answer=1;const newPub=publication(corrected);
  expect(target,'05 publish corrected key alongside old revision, without changing original score',publish(newPub)+requireCount("SELECT * FROM public.test_bank_question_revisions WHERE question_id='cssbb:sql-version:0'",2));
  const corrections={[qs[0].qid]:newPub.contents[qs[0].qid].revision};
  const regrade=(reason='Reviewed answer key correction',map=corrections)=>`SELECT public.regrade_test_bank_versioned_session('${A}','${pin.sessionId}',${json(map)},${literal(reason)},'authorized test reviewer','regrade-request-001');`;
  expectDenied(target,'05 learner cannot request a privileged regrade',role(A,regrade()),'42501');
  expect(target,'05 explicit trusted regrade has separate immutable result and original link',regrade()+regrade()+requireCount('SELECT * FROM public.test_bank_versioned_results',2));
  expect(target,'05 regrade preserves original correct count',`DO $$ BEGIN IF (SELECT (grade->>'correct')::int FROM public.test_bank_versioned_results WHERE kind='original')<>1 OR (SELECT (grade->>'correct')::int FROM public.test_bank_versioned_results WHERE kind='regrade')<>0 THEN RAISE EXCEPTION 'Original/regrade counts differ'; END IF; END $$;`);
  expectDenied(target,'05 conflicting regrade request ID cannot replace provenance',regrade('Different correction rationale'),'23514');
  const remap=V.clone(corrected);remap.sets[1][0].options.reverse();const remapPub=publication(remap);ok(target,publish(remapPub));
  expectDenied(target,'05 changed option order requires explicit remapping rather than guessing',regrade('Option order requires new mapping',{[qs[0].qid]:remapPub.contents[qs[0].qid].revision}),'23514');
  expect(target,'05 retirement and explicit aliases preserve original revision/result references',`UPDATE public.test_bank_catalog_questions SET retired_at=now() WHERE question_id='cssbb:sql-version:0';INSERT INTO public.test_bank_question_aliases VALUES('cssbb','legacy-explicit-hash','cssbb:sql-version:0','Approved synthetic migration map');`+role(A,requireCount("SELECT * FROM public.test_bank_question_aliases WHERE alias_id='legacy-explicit-hash'",1)+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE kind='original'",1)));
  expectDenied(target,'05 alias cannot steal a canonical identity',"INSERT INTO public.test_bank_question_aliases VALUES('cssbb','cssbb:sql-version:1','cssbb:sql-version:0','Invalid alias target conflict');",'23514');
  expectDenied(target,'05 client cannot rewrite an alias or retire a question',role(A,"UPDATE public.test_bank_catalog_questions SET retired_at=now();"),'42501');
  expectDenied(target,'05 aliases cannot point across certification namespace',"INSERT INTO public.test_bank_question_aliases VALUES('cqe','other-legacy','cssbb:sql-version:0','Invalid cross exam mapping');",'23503');
  expect(target,'05 legacy stored events were not rewritten/backfilled with invented versions',requireCount("SELECT * FROM public.test_bank_learning_events WHERE event_id='fixture-event-01' AND payload='{}'::jsonb",2));
}
module.exports={runChecks,publication};
