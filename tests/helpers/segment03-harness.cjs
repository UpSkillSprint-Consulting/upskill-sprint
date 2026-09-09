'use strict';
// Synthetic transport is NOT Supabase authorization. Database-role tests run separately.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '../..');
const copy = x => JSON.parse(JSON.stringify(x));
const EXAMS = ['cssbb', 'cqe', 'mbb', 'cssgb', 'cmq'];
const EPOCH = Date.UTC(2026, 8, 7, 18);
function questions(exam = 'cssbb') {
  return [0, 1, 2].map(i => ({ qid: `${exam}:fixture:${i}`, stem: `Synthetic question ${i}`, sub: `d${i}`, options: ['A','B','C','D'], answer: i, why: 'Synthetic explanation.' }));
}
class Clock {
  constructor(at = EPOCH) { this.wall = at; this.mono = 0; this.next = 0; this.tasks = new Map(); }
  setTimeout(fn, delay = 0) { const id = ++this.next; this.tasks.set(id, {fn, at: this.mono + Math.max(0, Number(delay) || 0)}); return id; }
  clearTimeout(id) { this.tasks.delete(id); }
  shiftWall(ms) { this.wall += ms; }
  advance(ms, fire = true) {
    assert.ok(Number.isSafeInteger(ms) && ms >= 0);
    const end = this.mono + ms; let callbacks = 0;
    if (fire) for (;;) {
      const due = [...this.tasks].filter(([,t]) => t.at <= end).sort((a,b) => a[1].at-b[1].at || a[0]-b[0])[0];
      if (!due) break;
      assert.ok(++callbacks <= 10000, 'Virtual clock runaway');
      const at = Math.max(this.mono, due[1].at); this.wall += at-this.mono; this.mono = at;
      this.tasks.delete(due[0]); due[1].fn();
    }
    this.wall += end-this.mono; this.mono = end;
  }
  install(w) {
    const self = this, NativeDate = w.Date;
    w.Date = class extends NativeDate { constructor(...a) { super(...(a.length ? a : [self.wall])); } static now() { return self.wall; } };
    w.setTimeout = this.setTimeout.bind(this); w.clearTimeout = this.clearTimeout.bind(this);
    w.setInterval = () => { throw new Error('Unexpected interval in isolated ledger'); };
    w.clearInterval = () => {};
    Object.defineProperty(w.performance, 'now', {value: () => self.mono, configurable: true});
  }
}
class Service {
  constructor() { this.rows = new Map(); this.progress = new Map(); this.receipts = new Map(); this.calls = []; this.faults = []; this.sequence = 0; this.online = true; this.reverse = false; }
  failNext(kind) { assert.ok(['before_commit', 'after_commit', 'read'].includes(kind)); this.faults.push(kind); }
  async exchange(owner, request) {
    this.calls.push(copy({owner, ...request}));
    if (!this.online) return {data:null,error:{message:'synthetic offline'}};
    if (request.kind === 'rpc') {
      if (request.name === 'get_test_bank_server_time_v1') {
        const reason = request.args && request.args.p_reason;
        assert.ok(reason == null || String(reason).length <= 64, 'clock reason too long');
        return {data:{protocolVersion:1,serverTime:new Date(EPOCH + this.sequence).toISOString(),userId:owner},error:null};
      }
      assert.equal(request.name, 'ingest_test_bank_operations_v1');
      const operations = request.args && request.args.p_operations;
      assert.ok(Array.isArray(operations) && operations.length, 'ingestion requires operations');
      const eventTypes = { session_started:'session_started', question_displayed:'question_exposed', response_committed:'answer_recorded', finalization_requested:'session_completed', session_abandoned:'session_abandoned' };
      const receipts = operations.map(operation => {
        assert.equal(operation.ownerId, owner, 'RPC owner mismatch');
        const key = owner + '|' + operation.operationId;
        if (this.receipts.has(key)) return copy(this.receipts.get(key));
        const eventType = eventTypes[operation.type];
        assert.ok(eventType, 'unsupported synthetic operation type');
        const acceptedAt = new Date(EPOCH + ++this.sequence).toISOString();
        this.rows.set(key, {user_id:owner,event_id:operation.operationId,device_id:operation.deviceId,event_type:eventType,exam_id:operation.examId,session_id:operation.sessionId,question_id:operation.payload.questionId,occurred_at:operation.clientOccurredAt,payload:copy(operation.payload.eventPayload),received_at:acceptedAt});
        const receipt = {operationId:operation.operationId,payloadDigest:'synthetic-digest-'+operation.operationId,receivedAt:acceptedAt,acceptedAt,serverSequence:this.sequence,sessionRevision:operation.expectedSessionRevision+1,applied:true,canonicalEventId:operation.operationId,state:operation.type==='finalization_requested'?'completed':'in_progress'};
        this.receipts.set(key, copy(receipt)); return receipt;
      });
      return {data:receipts,error:null};
    }
    if (request.kind === 'upsert') {
      if (this.faults[0] === 'before_commit') { this.faults.shift(); return {error:{message:'synthetic precommit failure'}}; }
      if (request.table === 'test_bank_progress_devices') { const row=request.batch; assert.equal(row.user_id,owner); this.progress.set(owner+'|'+row.device_id,{...copy(row),updated_at:new Date(EPOCH + ++this.sequence).toISOString()}); return {error:null}; }
      assert.equal(request.table, 'test_bank_learning_events');
      assert.equal(request.options.onConflict, 'user_id,event_id'); assert.equal(request.options.ignoreDuplicates, true);
      for (const row of request.batch) { assert.equal(row.user_id, owner, 'transport owner mismatch'); const key=owner+'|'+row.event_id; if(!this.rows.has(key))this.rows.set(key,{...copy(row),received_at:new Date(EPOCH + ++this.sequence).toISOString()}); }
      if (this.faults[0] === 'after_commit') { this.faults.shift(); return {error:{message:'synthetic acknowledgement lost'}}; }
      return {error:null};
    }
    if (request.kind === 'read') {
      if (this.faults[0] === 'read') { this.faults.shift(); return {data:null,error:{message:'synthetic read failure'}}; }
      if (request.table === 'test_bank_progress_devices') return {data:copy([...this.progress.values()].filter(r=>r.user_id===owner)),error:null};
      if (request.table !== 'test_bank_learning_events') return {data:[],error:null};
      assert.equal(request.owner, owner, 'query must scope owner');
      let rows=[...this.rows.values()].filter(r=>r.user_id===owner&&(!request.since||r.received_at>=request.since));
      rows.sort((a,b)=>a.received_at.localeCompare(b.received_at)||a.event_id.localeCompare(b.event_id));
      rows=rows.slice(request.from||0,request.to==null?undefined:request.to+1);if(this.reverse)rows.reverse();return {data:copy(rows),error:null};
    }
    throw new Error('Unexpected synthetic request ' + request.kind);
  }
  client(owner) { return client(request => this.exchange(owner, request)); }
}
function client(send) {
  return { rpc(name,args) { return send({kind:'rpc',name,args}); }, from(table) { return {
    upsert(batch, options) { return send({kind:'upsert',table,batch,options}); },
    select() { const state={kind:'read',table}; const q={
      eq(key,value){if(key==='user_id')state.owner=value;return q;},gte(key,value){if(key==='received_at')state.since=value;return q;},order(){return q;},abortSignal(){return q;},range(from,to){return send({...state,from,to});},limit(count){return send({...state,from:0,to:count-1});},maybeSingle(){return send(state).then(r=>({...r,data:Array.isArray(r.data)?r.data[0]||null:r.data}));},then(resolve,reject){return send(state).then(resolve,reject);}
    };return q;}
  }; }};
}
function mutate(source, name) {
  const variants={counting:['answeredEvents: answeredEvents,','answeredEvents: answeredEvents + 1,'],sync:['mergeRemoteRows(state, remoteRows, userId);','mergeRemoteRows(state, [], userId);']};
  if(!name)return source;assert.ok(Object.hasOwn(variants,name),'Unknown mutation');const [from,to]=variants[name];assert.equal(source.split(from).length,2,'Mutation seam changed');return source.replace(from,to);
}
function device(service, options = {}) {
  const { owner='fixture-owner-a',id='fixture-device-a',exam='cssbb',storage={},mutation=null }=options;
  const dom=new JSDOM('<!doctype html><body></body>',{url:'https://segment03.invalid/test-bank',runScripts:'outside-only'});const w=dom.window,clock=new Clock();clock.install(w);
  Object.defineProperty(w.document,'readyState',{get:()=> 'loading',configurable:true});
  let online=true,user=owner,denied=false;Object.defineProperty(w.navigator,'onLine',{get:()=>online,configurable:true});w.fetch=()=>{throw new Error('External network forbidden');};
  for(const [k,v] of Object.entries(storage))w.localStorage.setItem(k,v);w.localStorage.setItem('tb-account-sync-device-v1',id);
  const set=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){if(denied&&k==='tb-learning-events-v2')throw new w.DOMException('Synthetic quota','QuotaExceededError');return set.call(this,k,v);};
  w.UpskillAuth={getUser:()=>user?{id:user}:null,getClient:()=>service.client(user)};
  const qs=questions(exam);w.__TB={EXAMS:{[exam]:{questions:165,sets:{1:qs},bok:[{subs:qs.map((q,i)=>({id:q.sub,name:q.sub,w:i+1}))}]}}};
  w.eval(fs.readFileSync(path.join(ROOT,'test-bank-question-registry.js'),'utf8'));w.eval(mutate(fs.readFileSync(path.join(ROOT,'test-bank-learning-events.js'),'utf8'),mutation));
  return {w,clock,questions:qs,api:w.__TBLearning,close:()=>dom.window.close(),setOnline:v=>{online=v;},setOwner:v=>{user=v;},denyStorage:v=>{denied=v;},snapshot:()=>Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>w.localStorage.key(i)).map(k=>[k,w.localStorage.getItem(k)]))};
}
function completed(d, sessionId='fixture-session-1') { const q=d.questions,exam=q[0].qid.split(':')[0];d.api.startSession({examId:exam,sessionId,questions:q,mode:'quick',timed:false});return d.api.completeSession({examId:exam,sessionId,records:[{question:q[0],selected:0,status:'correct'},{question:q[1],selected:0,status:'incorrect'},{question:q[2],selected:null,status:'unanswered'}]}); }
module.exports={Clock,Service,client,device,completed,questions,EXAMS,EPOCH,copy,mutate};
