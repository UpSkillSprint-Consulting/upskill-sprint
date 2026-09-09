/* Immutable exam content/configuration snapshots. Wire codec 1 is additive to
 * the deployed learning-event payload; it does not introduce new event types.
 * No identity is derived here: qid is supplied by the Segment 04 registry. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.__TBVersions = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const SCHEMA = '1.0.0';
  const verifiedPins = new WeakSet();
  const MODES = ['exam','quick','focus','diagnostic','practice','adaptive','review'];
  const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
  function requireValue(ok, message) { if (!ok) { const e = new Error(message); e.code = 'INVALID_EXAM_VERSION'; throw e; } }
  function canonical(value) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
    if (typeof value === 'number') { requireValue(Number.isFinite(value), 'Non-finite catalog number'); return JSON.stringify(value); }
    if (Array.isArray(value)) return '[' + Array.from(value, canonical).join(',') + ']';
    requireValue(value && typeof value === 'object', 'Catalog data must be JSON');
    return '{' + Object.keys(value).sort().map(k => {
      requireValue(!['__proto__','constructor','prototype'].includes(k), 'Unsafe catalog key');
      return JSON.stringify(k) + ':' + canonical(value[k]);
    }).join(',') + '}';
  }
  function clone(value) { return JSON.parse(canonical(value)); }
  function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
  /* FIPS 180-4 SHA-256 over UTF-8, synchronous to preserve the existing durable
   * start API. Verified independently against node:crypto, including Unicode. */
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  function sha256(text) {
    const bytes = new TextEncoder().encode(text), size = Math.ceil((bytes.length + 9) / 64) * 64;
    const data = new Uint8Array(size); data.set(bytes); data[bytes.length] = 128;
    const view = new DataView(data.buffer); view.setUint32(size - 8, Math.floor(bytes.length / 536870912)); view.setUint32(size - 4, bytes.length * 8);
    const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], w = new Int32Array(64);
    const r = (x,n) => (x >>> n) | (x << (32-n));
    for (let offset=0; offset<size; offset+=64) {
      for(let i=0;i<16;i++) w[i]=view.getInt32(offset+i*4);
      for(let i=16;i<64;i++) w[i]=((r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10))+w[i-7]+(r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3))+w[i-16])|0;
      let [a,b,c,d,e,f,g,z]=h;
      for(let i=0;i<64;i++) {const t1=(z+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0;const t2=((r(a,2)^r(a,13)^r(a,22))+((a&b)^(a&c)^(b&c)))|0;z=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
      [a,b,c,d,e,f,g,z].forEach((n,i)=>h[i]=(h[i]+n)|0);
    }
    return h.map(n=>(n>>>0).toString(16).padStart(8,'0')).join('');
  }
  const digest = (kind,data) => sha256(kind + '\n' + canonical(data));
  function content(question) {
    const out = {};
    Object.keys(question).filter(k=>!['qid','questionId','id','set'].includes(k)).forEach(k=>{if(question[k]!==undefined) out[k]=question[k];});
    requireValue(typeof out.stem === 'string' && Array.isArray(out.options) && out.options.length >= 2 && out.options.every(o=>typeof o==='string') && Number.isInteger(out.answer) && out.answer>=0 && out.answer<out.options.length, 'Invalid single-select revision');
    return clone(out);
  }
  function configuration(exam) {
    const target=exam.pass==null?null:exam.pass*100;
    requireValue(target===null || Number.isInteger(target)&&target>=0&&target<=10000,'Invalid site target');
    requireValue(Number.isInteger(exam.questions)&&exam.questions>0&&Number.isFinite(exam.minutes)&&exam.minutes>0,'Invalid exam length/timing');
    return clone({questions:exam.questions,minutes:exam.minutes,siteTargetBps:target,fullExamQuestionsBySet:exam.fullExamQuestionsBySet||{},bok:exam.bok,
      badge:exam.badge||'',title:exam.title||'',gradingPolicyVersion:'single-select-v1',masteryPolicyVersion:'baseline-confidence-v1',timingPolicyVersion:'site-proportional-v1'});
  }
  function createExamCatalog(examId,exam,provenance) {
    const questions={}, sets={};
    Object.keys(exam.sets||{bank:exam.bank}).sort().forEach(set=>{
      sets[set]=(exam.sets?exam.sets[set]:exam.bank).map(q=>{const id=q.qid||q.questionId||q.id; requireValue(typeof id==='string'&&id.startsWith(examId+':'),'Invalid canonical ID');const c=content(q);const revision=digest('question-v1',c);requireValue(!questions[id]||questions[id]===revision,'Conflicting question revisions');questions[id]=revision;return id;}).sort();
    });
    const config=configuration(exam), blueprintVersion=digest('blueprint-v1',exam.bok);
    const configVersion=digest('config-v1',{config,provenance});
    const bankVersion=digest('bank-v1',{examId,questions,sets});
    return {examId,configVersion,bankVersion,blueprintVersion,config,provenance:clone(provenance),questions,sets};
  }
  function validateCandidates(examId,questions,exam,catalog) {
    requireValue(catalog&&catalog.examId===examId&&digest('config-v1',{config:configuration(exam),provenance:catalog.provenance})===catalog.configVersion,'Unpublished exam configuration');
    requireValue(Array.isArray(questions)&&questions.length>0,'Empty version candidate set');
    questions.forEach(q=>{const id=q&&(q.qid||q.questionId||q.id);requireValue(catalog.questions[id]===digest('question-v1',content(q)),'Unpublished question revision: '+id);});
    return true;
  }
  function pin(input,exam,catalog) {
    requireValue(catalog&&catalog.examId===input.examId, 'Published exam catalog has not loaded');
    requireValue(digest('config-v1',{config:configuration(exam),provenance:catalog.provenance})===catalog.configVersion,'Unpublished configuration; rebuild and publish its catalog before starting');
    requireValue(MODES.includes(input.mode), 'Unsupported session mode');
    requireValue(Array.isArray(input.questions)&&input.questions.length>0&&input.questions.length<=200,'Invalid session item count');
    const setId=String(input.setId||'mix'), ownerId=input.ownerId||null;
    requireValue(setId==='mix'||own(catalog.sets,setId),'Unknown set');
    requireValue(typeof input.sessionId==='string'&&input.sessionId.length>0,'Missing session identity');
    const timed=input.timed===true, limitSeconds=timed?input.limitSeconds:null;
    requireValue(!timed||Number.isSafeInteger(limitSeconds)&&limitSeconds>0&&limitSeconds<=86400,'Timed session requires explicit positive seconds');
    requireValue(!timed || !['adaptive','review'].includes(input.mode),'Adaptive/review sessions are untimed');
    requireValue(input.mode!=='review','Review is not a new learning session');
    requireValue(Number.isFinite(input.startedAt), 'Missing session start time');
    const startedAt=new Date(input.startedAt).toISOString(), seen=new Set();
    const contents=[], orderedItems=input.questions.map((q,index)=>{
      const id=q.qid||q.questionId||q.id, c=content(q), revision=digest('question-v1',c);
      requireValue(!seen.has(id),'Repeated question in session');seen.add(id);
      requireValue(catalog.questions[id]===revision,'Unpublished question revision: '+id);
      requireValue(setId==='mix'||catalog.sets[setId].includes(id),'Question outside selected set');
      const domains=catalog.config.bok.filter(d=>d.subs.some(s=>s.id===q.sub));requireValue(domains.length===1,'Ambiguous domain');
      contents.push(Object.assign({qid:id},own(q,'set')?{set:q.set}:{},c));
      const ids=c.options.map((_,i)=>'o'+i);
      return {itemId:input.sessionId+':'+index,questionId:id,questionRevision:revision,domainId:domains[0].domain,optionIds:ids,optionOrder:ids.slice(),selectedOptionId:null,effectiveAnsweredAt:null};
    });
    const config=catalog.config, expectedLength=input.mode==='exam'?(config.fullExamQuestionsBySet[setId]||config.questions):orderedItems.length;
    const snapshot={contractVersion:SCHEMA,sessionId:input.sessionId,ownerId,examId:input.examId,setId,mode:input.mode,bankVersion:catalog.bankVersion,blueprintVersion:catalog.blueprintVersion,configVersion:catalog.configVersion,
      gradingPolicyVersion:config.gradingPolicyVersion,masteryPolicyVersion:config.masteryPolicyVersion,timingPolicyVersion:config.timingPolicyVersion,expectedLength,siteTargetBps:config.siteTargetBps,orderedItems,
      state:'in_progress',sessionRevision:0,writerEpoch:0,resetEpochId:input.resetEpochId||null,startedAt,deadlineAt:timed?new Date(input.startedAt+limitSeconds*1000).toISOString():null,timed,limitSeconds,
      reportingTimeZoneAtStart:input.reportingTimeZone||'UTC',currentItemId:orderedItems[0].itemId,flags:[],configuration:clone(config),configurationDigest:digest('snapshot-config-v1',config),contents};
    snapshot.pinDigest=digest('session-pin-v1',wire(snapshot));
    return freeze(snapshot);
  }
  function wire(pin) {
    return {codec:1,contractVersion:pin.contractVersion,sessionId:pin.sessionId,examId:pin.examId,configurationDigest:pin.configurationDigest,reportingTimeZoneAtStart:pin.reportingTimeZoneAtStart,resetEpochId:pin.resetEpochId,configVersion:pin.configVersion,bankVersion:pin.bankVersion,blueprintVersion:pin.blueprintVersion,
      setId:pin.setId,mode:pin.mode,expectedLength:pin.expectedLength,siteTargetBps:pin.siteTargetBps,gradingPolicyVersion:pin.gradingPolicyVersion,masteryPolicyVersion:pin.masteryPolicyVersion,timingPolicyVersion:pin.timingPolicyVersion,
      timed:pin.timed,limitSeconds:pin.limitSeconds,startedAt:pin.startedAt,deadlineAt:pin.deadlineAt,
      /* Tuple: canonical question, revision, ordered revision-local option IDs.
       * Avoid duplicated snapshots in the 64KiB append-only event envelope. */
      items:pin.orderedItems.map(i=>[i.questionId,i.questionRevision,i.optionOrder])};
  }
  function reference(pin) { const ref=wire(pin); delete ref.items; return ref; }
  function checkedPin(pin) {
    if (pin && verifiedPins.has(pin)) return pin;
    requireValue(pin&&pin.contractVersion===SCHEMA&&pin.gradingPolicyVersion==='single-select-v1','Unsupported pinned grading policy');
    requireValue(pin.pinDigest===digest('session-pin-v1',wire(pin)),'Corrupt session version pin');
    requireValue(pin.orderedItems.every((item,i)=>item.itemId===pin.sessionId+':'+i && Array.isArray(item.optionIds)&&Array.isArray(item.optionOrder)&&new Set(item.optionOrder).size===item.optionIds.length&&item.optionOrder.length===item.optionIds.length&&item.optionOrder.every(o=>item.optionIds.includes(o))), 'Invalid pinned option order');
    requireValue(pin.configurationDigest === digest('snapshot-config-v1',pin.configuration),'Corrupt configuration snapshot');
    requireValue(Array.isArray(pin.contents)&&pin.contents.length===pin.orderedItems.length,'Missing historical question snapshots');
    pin.contents.forEach((q,i)=>{const item=pin.orderedItems[i];requireValue((q.qid||q.questionId||q.id)===item.questionId&&digest('question-v1',content(q))===item.questionRevision&&canonical(item.optionIds)===canonical(q.options.map((_,n)=>'o'+n)),'Corrupt historical question snapshot');const domains=pin.configuration.bok.filter(d=>d.subs.some(sub=>sub.id===q.sub));requireValue(domains.length===1&&domains[0].domain===item.domainId,'Corrupt pinned domain');});
    freeze(pin); verifiedPins.add(pin); return pin;
  }
  function displayQuestion(pin,index) {
    const q=clone(pin.contents[index]),item=pin.orderedItems[index];
    q.options=item.optionOrder.map(id=>q.options[Number(id.slice(1))]);
    q.answer=item.optionOrder.indexOf('o'+q.answer);
    return q;
  }
  /* C05 single-select policy. This is the one client scoring implementation;
   * the database independently validates the same counts/target at ingestion.
   * Display rounding must never be used as a grading or histogram boundary. */
  function scoreCounts(counts, siteTargetBps) {
    const total=counts && counts.total, correct=counts && counts.correct;
    requireValue(Number.isSafeInteger(total)&&total>=0&&Number.isSafeInteger(correct)&&correct>=0&&correct<=total,'Invalid score counts');
    requireValue(siteTargetBps===null || Number.isInteger(siteTargetBps)&&siteTargetBps>=0&&siteTargetBps<=10000,'Invalid site target');
    if (own(counts,'incorrect') || own(counts,'unanswered')) {
      requireValue(Number.isSafeInteger(counts.incorrect)&&counts.incorrect>=0&&Number.isSafeInteger(counts.unanswered)&&counts.unanswered>=0&&counts.incorrect+counts.unanswered===total-correct,'Score categories do not reconcile');
    }
    const scorePercent=total ? 100*correct/total : null;
    return {total,correct,scorePercent,siteTargetBps,
      siteTargetMet:total===0 || siteTargetBps===null ? null : BigInt(correct)*10000n>=BigInt(total)*BigInt(siteTargetBps),
      margin:total===0 || siteTargetBps===null ? null : Number(BigInt(correct)*10000n-BigInt(total)*BigInt(siteTargetBps))/(total*100)};
  }
  function classify(question, selected) {
    requireValue(question&&Array.isArray(question.options)&&Number.isInteger(question.answer)&&question.answer>=0&&question.answer<question.options.length,'Invalid single-select answer key');
    requireValue(selected==null || Number.isInteger(selected)&&selected>=0&&selected<question.options.length,'Invalid selected option');
    return selected==null ? 'unanswered' : selected===question.answer ? 'correct' : 'incorrect';
  }
  function aggregateStatuses(rows) {
    requireValue(Array.isArray(rows),'Missing scored items');
    const counts={total:0,correct:0,incorrect:0,unanswered:0},domains=new Map(),subs=new Map();
    function increment(group,key,status) {
      if(key==null)return;
      requireValue(typeof key==='string'&&key.length>0&&!['__proto__','constructor','prototype'].includes(key),'Invalid score group');
      if(!group.has(key))group.set(key,{total:0,correct:0,incorrect:0,unanswered:0});
      const item=group.get(key);item.total++;item[status]++;
    }
    rows.forEach(row=>{
      requireValue(row&&['correct','incorrect','unanswered'].includes(row.status),'Invalid scored status');
      counts.total++;counts[row.status]++;
      increment(domains,row.domainId,row.status);increment(subs,row.subId,row.status);
    });
    return Object.assign(counts,{byDomain:Object.fromEntries(domains),bySubtopic:Object.fromEntries(subs)});
  }
  function scoreRecords(supplied, configuration) {
    requireValue(Array.isArray(supplied),'Missing scored records');
    const rows=supplied.map(r=>{
      requireValue(r&&r.question,'Missing scored question');
      const q=r.question, status=classify(q,r.selected);
      const matches=configuration ? configuration.bok.filter(d=>d.subs.some(s=>s.id===q.sub)) : [];
      if(configuration)requireValue(matches.length===1,'Ambiguous score domain');
      return {status,domainId:configuration?matches[0].domain:null,subId:q.sub||'general'};
    });
    return aggregateStatuses(rows);
  }
  function checkedReference(value) {
  const v=value;
  requireValue(v&&v.codec===1&&v.contractVersion===SCHEMA,'Unsupported historical version reference');
  requireValue(typeof v.sessionId==='string'&&v.sessionId.length>0&&typeof v.examId==='string'&&v.examId.length>0&&typeof v.setId==='string'&&v.setId.length>0,'Missing historical version identity');
  for(const key of ['configVersion','bankVersion','blueprintVersion','configurationDigest'])requireValue(typeof v[key]==='string'&&/^[a-f0-9]{64}$/.test(v[key]),'Missing or invalid historical '+key);
  for(const key of ['gradingPolicyVersion','masteryPolicyVersion','timingPolicyVersion'])requireValue(typeof v[key]==='string'&&v[key].length>0,'Missing historical '+key);
  requireValue(MODES.includes(v.mode)&&v.mode!=='review','Invalid historical session mode');
  requireValue(Number.isSafeInteger(v.expectedLength)&&v.expectedLength>0&&v.expectedLength<=200,'Invalid historical expected length');
  requireValue(v.siteTargetBps===null||Number.isInteger(v.siteTargetBps)&&v.siteTargetBps>=0&&v.siteTargetBps<=10000,'Invalid historical site target');
  requireValue(typeof v.timed==='boolean'&&typeof v.startedAt==='string'&&!Number.isNaN(Date.parse(v.startedAt)),'Invalid historical timing identity');
  if(v.timed) {
    requireValue(Number.isSafeInteger(v.limitSeconds)&&v.limitSeconds>0&&v.limitSeconds<=86400&&typeof v.deadlineAt==='string'&&!Number.isNaN(Date.parse(v.deadlineAt)),'Invalid historical deadline');
    requireValue(Date.parse(v.deadlineAt)-Date.parse(v.startedAt)===v.limitSeconds*1000,'Historical deadline differs from pinned limit');
  } else requireValue(v.limitSeconds===null&&v.deadlineAt===null,'Untimed historical session has a deadline');
  return v;
}
  /* Historical presentation is read-only. Unknown legacy policy is not today's
   * policy. Invalid/conflicting evidence remains unavailable rather than being
   * clamped or silently regraded using the current question bank. */
  function assessAttempt(entry, expectedExamId) {
    const unavailable={available:false,eligible:false,scorePercent:null,margin:null,siteTargetMet:null,siteTargetBps:null,expectedLength:null,provenance:'invalid',diagnostic:'Invalid historical grading evidence'};
    try {
      requireValue(entry&&typeof entry==='object','Missing attempt');
      if(entry.completed===false || ['created','in_progress','paused','finalizing','abandoned','cancelled','canceled'].includes(entry.state) || ['abandoned','cancelled','canceled'].includes(entry.completedReason))return Object.assign({},unavailable,{provenance:'not-finalized',diagnostic:'Session has no finalized score'});
      const v=entry.versionPin||null, g=entry.grading||null;
      if(v)checkedReference(v);
      if(expectedExamId!=null) {
        requireValue(typeof expectedExamId==='string'&&expectedExamId.length>0,'Invalid historical exam scope');
        if(entry.examId!=null)requireValue(entry.examId===expectedExamId,'Historical exam scope mismatch');
        if(v&&v.examId!=null)requireValue(v.examId===expectedExamId,'Pinned exam scope mismatch');
      }
      if(v&&v.sessionId!=null) {
        requireValue(typeof v.sessionId==='string'&&v.sessionId.length>0,'Invalid historical session identity');
        if(entry.id!=null)requireValue(entry.id===v.sessionId,'Historical session identity mismatch');
        if(entry.sessionId!=null)requireValue(entry.sessionId===v.sessionId,'Historical session identity mismatch');
      }
      if(v&&v.examId!=null&&entry.examId!=null)requireValue(v.examId===entry.examId,'Historical exam identity mismatch');
      if(v)requireValue(v.gradingPolicyVersion==='single-select-v1','Unsupported historical grading policy');
      if(g) {
        requireValue(v&&g.resultId===v.sessionId+':original','Original result identity mismatch');
        requireValue(typeof g.pinDigest==='string'&&/^[a-f0-9]{64}$/.test(g.pinDigest),'Missing original pin digest');
        requireValue(v&&g.schemaVersion===SCHEMA&&g.gradingPolicyVersion===v.gradingPolicyVersion&&g.configVersion===v.configVersion&&g.bankVersion===v.bankVersion&&g.expectedLength===v.expectedLength&&g.siteTargetBps===v.siteTargetBps,'Conflicting historical grade');
        requireValue(g.total===entry.total&&g.correct===entry.correct,'Conflicting historical counts');
      }
      const score=scoreCounts(g||entry,v?v.siteTargetBps:null);
      if(g) {
        requireValue(g.kind==='original'&&g.siteTargetMet===score.siteTargetMet,'Conflicting original target verdict');
        requireValue(g.byDomain&&typeof g.byDomain==='object'&&!Array.isArray(g.byDomain),'Missing original domain counts');
        const sums={total:0,correct:0,incorrect:0,unanswered:0};
        Object.keys(g.byDomain).forEach(id=>{const d=g.byDomain[id];scoreCounts(d,null);Object.keys(sums).forEach(k=>sums[k]+=d[k]);});
        requireValue(Object.keys(sums).every(k=>sums[k]===g[k]),'Original domains do not reconcile');
      }
      const terminal=(entry.completed===true || ['completed','expired'].includes(entry.state)) && !['created','in_progress','paused','finalizing','abandoned','cancelled','canceled'].includes(entry.state) && !['abandoned','cancelled','canceled'].includes(entry.completedReason);
      const mode=v?v.mode:entry.mode,timed=v?v.timed:entry.timed;
      if(v)requireValue((entry.mode==null||entry.mode===v.mode)&&(entry.timed==null||entry.timed===v.timed),'Conflicting historical session mode');
      return Object.assign(score,{available:true,eligible:!!(v&&terminal&&mode==='exam'&&timed===true&&score.total===v.expectedLength),
        expectedLength:v?v.expectedLength:null,provenance:v?'pinned':'legacy-unknown',diagnostic:null});
    } catch(error) {return Object.assign(unavailable,{diagnostic:error.message});}
  }
  function scoreBucket(score) {
    if(score && Number.isSafeInteger(score.total)&&Number.isSafeInteger(score.correct)) {
      scoreCounts(score,null);
      if(!score.total)return null;
      const numerator=BigInt(score.correct)*100n,denominator=BigInt(score.total);
      for(let i=0;i<5;i++)if(numerator<denominator*BigInt(50+i*10))return i;
      return 5;
    }
    const p=score && score.scorePercent;
    if(p==null || !Number.isFinite(p)||p<0||p>100)return null;
    return p<50?0:p<60?1:p<70?2:p<80?3:p<90?4:5;
  }
  function formatScore(value, digits) {
    if(value==null || !Number.isFinite(value))return 'Unavailable';
    const text=value.toFixed(digits==null?2:digits);
    return (text.includes('.')?text.replace(/0+$/,'').replace(/\.$/,''):text)+'%';
  }

  function records(pin, supplied) {
    checkedPin(pin); requireValue(Array.isArray(supplied)&&supplied.length===pin.orderedItems.length,'Completion must preserve every pinned item, including blanks');
    return supplied.map((r,index)=>{
      const item=pin.orderedItems[index],q=displayQuestion(pin,index);
      requireValue(r&&r.question&&(r.question.qid||r.question.questionId||r.question.id)===item.questionId,'Completion item order/identity mismatch');
      const selected=r.selected==null?null:r.selected;
      requireValue(selected===null||Number.isInteger(selected)&&selected>=0&&selected<q.options.length,'Invalid selected option');
      return {question:clone(q),selected,status:classify(q,selected)};
    });
  }
  function grade(pin,supplied) {
    const answers=records(pin,supplied);
    const {total,correct,incorrect,unanswered,byDomain}=aggregateStatuses(answers.map((r,i)=>({status:r.status,domainId:pin.orderedItems[i].domainId})));
    const score=scoreCounts({total,correct,incorrect,unanswered},pin.siteTargetBps);
    return freeze({schemaVersion:SCHEMA,kind:'original',resultId:pin.sessionId+':original',pinDigest:pin.pinDigest,configVersion:pin.configVersion,bankVersion:pin.bankVersion,
      gradingPolicyVersion:pin.gradingPolicyVersion,expectedLength:pin.expectedLength,siteTargetBps:pin.siteTargetBps,total,correct,incorrect,unanswered,byDomain,
      scorePercent:score.scorePercent,siteTargetMet:score.siteTargetMet,
      answers:answers.map((r,i)=>({questionId:pin.orderedItems[i].questionId,questionRevision:pin.orderedItems[i].questionRevision,selectedOptionId:r.selected===null?null:pin.orderedItems[i].optionOrder[r.selected],status:r.status}))});
  }

  function questionFor(snapshot, supplied, position) {
    const p=checkedPin(snapshot),id=supplied&&(supplied.qid||supplied.questionId||supplied.id);
    const index=position==null?p.orderedItems.findIndex(i=>i.questionId===id):position;
    requireValue(Number.isInteger(index)&&index>=0&&index<p.contents.length&&p.orderedItems[index].questionId===id,'Question is not the pinned session item');
    return {index,question:displayQuestion(p,index)};
  }
  function validateArchive(archive, bankVersion, examId) {
    requireValue(archive&&archive.schemaVersion===SCHEMA&&archive.examId===examId&&archive.bankVersion===bankVersion,'Wrong historical bank archive');
    const questions={};
    for(const [id,row] of Object.entries(archive.contents||{})) {
      requireValue(id.startsWith(examId+':')&&row.revision===digest('question-v1',content(row.content)),'Corrupt historical revision');questions[id]=row.revision;
    }
    requireValue(digest('bank-v1',{examId,questions,sets:archive.sets})===bankVersion,'Corrupt historical bank manifest');
    return freeze(clone(archive));
  }
  function validateConfiguration(archive,configVersion) {
    requireValue(archive&&archive.schemaVersion===SCHEMA&&archive.configVersion===configVersion&&digest('config-v1',{config:archive.config,provenance:archive.provenance})===configVersion,'Corrupt historical configuration');
    return freeze(clone(archive));
  }
  async function loadHistory(versionPin, fetcher) {
    requireValue(versionPin&&versionPin.codec===1&&versionPin.contractVersion===SCHEMA,'Unknown historical version');
    for(const key of ['configVersion','bankVersion'])requireValue(/^[a-f0-9]{64}$/.test(versionPin[key]),'Unsafe history resource');
    requireValue(typeof fetcher==='function','A history fetch implementation is required');
    async function get(url){const response=await fetcher(url,{credentials:'same-origin'});requireValue(response.ok,'Historical archive unavailable; current content must not be substituted');return response.json();}
    const [bank,config]=await Promise.all([get('/exam-catalog/'+versionPin.bankVersion+'.json'),get('/exam-catalog/config-'+versionPin.configVersion+'.json')]);
    return {bank:validateArchive(bank,versionPin.bankVersion,versionPin.examId),config:validateConfiguration(config,versionPin.configVersion)};
  }
  function historicalQuestions(versionPin,archive) {
    requireValue(versionPin&&versionPin.codec===1&&versionPin.contractVersion===SCHEMA&&Array.isArray(versionPin.items),'Unsupported historical item manifest');
    const bank=validateArchive(archive,versionPin.bankVersion,versionPin.examId),seen=new Set();
    return versionPin.items.map(item=>{
      requireValue(Array.isArray(item)&&item.length===3&&!seen.has(item[0]),'Invalid historical item tuple');seen.add(item[0]);
      const row=bank.contents[item[0]];requireValue(row&&row.revision===item[1],'Historical item is unavailable');
      const q=Object.assign({qid:item[0]},clone(row.content)),order=item[2],ids=q.options.map((_,i)=>'o'+i);
      requireValue(Array.isArray(order)&&order.length===ids.length&&new Set(order).size===ids.length&&order.every(id=>ids.includes(id)),'Invalid historical option order');
      q.options=order.map(id=>q.options[Number(id.slice(1))]);q.answer=order.indexOf('o'+q.answer);
      return freeze(q);
    });
  }
  // Aliases are explicit administrative mappings, never inferred from text,
  // position or a shortened ID. Revision and identity remain separate concepts.
  function resolveAlias(examId,id,aliases) {
    const found=(aliases||[]).filter(a=>a.examId===examId&&a.alias===id);
    requireValue(found.length<=1,'Ambiguous historical alias');
    if(!found.length)return id;
    requireValue(typeof found[0].questionId==='string'&&found[0].questionId.startsWith(examId+':'),'Cross-exam alias');
    return found[0].questionId;
  }

  function context(payload) {
    const v=payload&&payload.versionPin;
    if(!v) return {provenance:'legacy-unknown',expectedLength:null,siteTargetBps:null,configVersion:null,bankVersion:null};
    requireValue(v.codec===1&&v.contractVersion===SCHEMA,'Unsupported historical version pin');
    return {provenance:'pinned',expectedLength:v.expectedLength,siteTargetBps:v.siteTargetBps,configVersion:v.configVersion,bankVersion:v.bankVersion};
  }
  return {schemaVersion:SCHEMA,scoreCounts,classify,aggregateStatuses,scoreRecords,assessAttempt,scoreBucket,formatScore,canonical,clone,freeze,sha256,digest,content,configuration,createExamCatalog,validateCandidates,pin,wire,reference,checkedPin,questionFor,records,grade,context,validateArchive,validateConfiguration,loadHistory,historicalQuestions,resolveAlias};
}));
