'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fixture,read}=require('./helpers/segment04-identity.cjs');
const ROOT=path.join(__dirname,'..');
const migration=()=>fs.readFileSync(path.join(ROOT,'supabase/migrations/20260908214508_add_idempotent_exam_ingestion.sql'),'utf8');

function versionedLedger(t,client){
  const f=fixture(t);f.w.TextEncoder=require('node:util').TextEncoder;f.w.eval(read('test-bank-versioning.js'));
  f.w.__TB.examVersionPolicy='catalog-v1';f.w.__TBVersionCatalog={exams:{cssbb:f.w.__TBVersions.createExamCatalog('cssbb',f.exam,{source:'segment07 fixture'})}};
  f.w.UpskillAuth={getUser:()=>({id:'10000000-0000-4000-8000-000000000001'}),getClient:()=>client};f.w.eval(read('test-bank-learning-events.js'));return f;
}
function clientWithReceipts(){
  const calls=[],receipts=new Map();let sequence=0;
  const query={eq(){return query},order(){return query},range(){return Promise.resolve({data:[],error:null})},limit(){return Promise.resolve({data:[],error:null})}};
  return {calls,receipts,from(){return {select(){return query},upsert(){throw Error('versioned evidence bypassed receipt RPC')}}},rpc(name,args){
    assert.equal(name,'ingest_test_bank_operations_v1');calls.push(structuredClone(args.p_operations));
    const data=args.p_operations.map(operation=>{
      if(receipts.has(operation.operationId))return receipts.get(operation.operationId);
      const receipt={operationId:operation.operationId,payloadDigest:'digest-'+operation.operationId,receivedAt:'2026-09-08T18:00:00.000Z',acceptedAt:'2026-09-08T18:00:00.001Z',serverSequence:++sequence,sessionRevision:operation.expectedSessionRevision+1,applied:true,canonicalEventId:operation.operationId,state:operation.type==='finalization_requested'?'completed':'in_progress'};
      receipts.set(operation.operationId,receipt);return receipt;
    });return Promise.resolve({data,error:null});
  }};
}

test('Segment 07 migration installs owned receipts, runtime locks and an atomic batch RPC',()=>{
  const sql=migration();
  for(const token of ['test_bank_session_runtime','test_bank_operation_receipts','private.test_bank_ingest_operation_v1','ingest_test_bank_operations_v1','FOR UPDATE','Operation ID reused with conflicting payload','Session already has a conflicting canonical completion'])assert.match(sql,new RegExp(token.replaceAll('.','\\.')));
  assert.match(sql,/CREATE POLICY owner_read[\s\S]*auth\.uid/);
  assert.match(sql,/Operation batch size must be between 1 and 100/);
});

test('versioned browser sync requires explicit receipts and preserves operation order',async t=>{
  const client=clientWithReceipts(),f=versionedLedger(t,client),api=f.w.__TBLearning;
  const started=api.startSession({examId:'cssbb',sessionId:'segment07-runtime-session',questions:f.rows,mode:'quick',returnResult:true});
  api.recordDraft({examId:'cssbb',sessionId:started.sessionId,question:f.rows[0],index:0,selected:0});
  api.completeSession({examId:'cssbb',sessionId:started.sessionId,records:f.rows.map((question,index)=>({question,selected:index?null:0}))});
  await api.sync('segment07-test');
  const operations=client.calls.flat();
  assert.equal(operations[0].type,'session_started');
  assert.equal(operations.at(-1).type,'finalization_requested');
  assert.deepEqual(operations.map(x=>x.expectedSessionRevision),operations.map((_,i)=>i));
  assert.ok(operations.every(x=>x.schemaVersion==='1.0.0'&&x.ownerId==='10000000-0000-4000-8000-000000000001'));
  const stored=api.store(),events=stored.events.filter(x=>x.sessionId===started.sessionId);
  assert.ok(events.every(x=>x.syncedFor.includes('10000000-0000-4000-8000-000000000001')));
  assert.ok(events.every(x=>x.serverReceipt&&x.serverReceipt.acceptedAt));
  assert.equal(stored.sessions[started.sessionId].serverRevision,events.length);
});

test('an incomplete receipt batch never marks versioned operations accepted',async t=>{
  const base=clientWithReceipts(),client={...base,rpc(name,args){return Promise.resolve({data:[],error:null})}},f=versionedLedger(t,client),api=f.w.__TBLearning;
  api.startSession({examId:'cssbb',sessionId:'segment07-missing-receipt',questions:[f.rows[0]],mode:'quick',returnResult:true});
  await assert.rejects(api.sync('segment07-missing'),/incomplete operation receipt/);
  assert.ok(api.store().events.filter(x=>x.sessionId==='segment07-missing-receipt').every(x=>!x.syncedFor.length));
});
