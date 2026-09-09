(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.__TBHistoryPolicy = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  const VERSION='history-v1';
  const CONTRACT_VERSION='1.0.0';
  const DAY=86400000;

  function fail(message){const e=new Error(message);e.code='INVALID_HISTORY_EVIDENCE';throw e;}
  function finite(value){return typeof value==='number'&&Number.isFinite(value);}
  function validTimeZone(zone){
    if(typeof zone!=='string'||!zone)return false;
    try{new Intl.DateTimeFormat('en-CA',{timeZone:zone}).format(new Date(0));return true;}catch(error){return false;}
  }
  function parts(at,timeZone){
    if(!finite(Number(at)))return null;
    if(!validTimeZone(timeZone))fail('Invalid reporting timezone');
    const formatter=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
    const out={};formatter.formatToParts(new Date(Number(at))).forEach(p=>{if(p.type!=='literal')out[p.type]=p.value;});
    return out.year&&out.month&&out.day?out:null;
  }
  function reportingDay(at,timeZone){const p=parts(at,timeZone);return p?p.year+'-'+p.month+'-'+p.day:null;}
  function calendarKeysEnding(endKey,count){
    const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(endKey||''));if(!m)fail('Invalid calendar day');
    if(!Number.isSafeInteger(count)||count<0)fail('Invalid day count');
    const anchor=Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]));
    const out=[];for(let i=count-1;i>=0;i--){const d=new Date(anchor-i*DAY);out.push(d.toISOString().slice(0,10));}return out;
  }
  function attemptOrder(a,b){return Number(a&&a.at||0)-Number(b&&b.at||0)||String(a&&a.id||'').localeCompare(String(b&&b.id||''));}
  function practiceTrend(input){
    input=input||{};const attempts=Array.isArray(input.attempts)?input.attempts:[];const assess=input.assessAttempt;
    if(typeof assess!=='function')fail('Missing assessment function');
    const limit=input.limit==null?20:Number(input.limit);if(!Number.isSafeInteger(limit)||limit<1||limit>500)fail('Invalid trend limit');
    return attempts.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).slice().sort(attemptOrder).map(entry=>{
      let score;try{score=assess(entry,input.examId);}catch(error){score={available:false,eligible:false,scorePercent:null};}
      const fullExam=Boolean(score&&score.eligible);
      const available=Boolean(score&&score.available&&score.scorePercent!=null);
      if(fullExam||!available)return null;
      return {id:entry.id||null,at:entry.at,mode:entry.mode||null,source:entry.source||null,total:entry.total==null?null:Number(entry.total),correct:entry.correct==null?null:Number(entry.correct),scorePercent:Number(score.scorePercent),pct:Number(score.scorePercent),newQuestions:Number(entry.newQuestions||0),repeated:Number(entry.repeated||0),timed:entry.timed===true,kind:'practice'};
    }).filter(Boolean).slice(-limit);
  }
  function answerActivity(input){
    input=input||{};const timeZone=validTimeZone(input.timeZone)?input.timeZone:null;if(!timeZone)fail('Invalid reporting timezone');
    const events=Array.isArray(input.events)?input.events:[];const attempts=Array.isArray(input.attempts)?input.attempts:[];
    const weeks=input.weeks==null?8:Number(input.weeks);if(!Number.isSafeInteger(weeks)||weeks<1||weeks>104)fail('Invalid heatmap window');
    const now=finite(Number(input.now))?Number(input.now):Date.now();
    const latest=new Map(),invalidTimestamp=[];
    events.forEach(event=>{
      if(!event||event.type!=='answer_recorded'||!event.sessionId||!event.questionId)return;
      const status=event.payload&&event.payload.status;if(status!=='correct'&&status!=='incorrect')return;
      const key=String(event.sessionId)+'|'+String(event.questionId),at=Number(event.occurredAt);
      if(!finite(at)||at<=0){invalidTimestamp.push(event);return;}
      const prior=latest.get(key);
      if(!prior||at>Number(prior.occurredAt)||at===Number(prior.occurredAt)&&String(event.id||'')>String(prior.id||''))latest.set(key,event);
    });
    const counts={},knownBySession={};
    latest.forEach(event=>{const day=reportingDay(Number(event.occurredAt),timeZone);if(!day)return;counts[day]=(counts[day]||0)+1;knownBySession[String(event.sessionId)]=(knownBySession[String(event.sessionId)]||0)+1;});
    let unknownAnswers=invalidTimestamp.length,unknownSessions=0;
    attempts.forEach(entry=>{
      if(!entry||typeof entry!=='object'||Array.isArray(entry))return;
      if(entry.answered==null){unknownSessions+=1;return;}
      const answered=Math.max(0,Number(entry.answered)||0),known=knownBySession[String(entry.id||entry.sessionId||'')]||0;
      if(answered>known)unknownAnswers+=answered-known;
    });
    const endKey=reportingDay(now,timeZone),keys=calendarKeysEnding(endKey,weeks*7);
    return {version:VERSION,contractVersion:CONTRACT_VERSION,timeZone,days:keys.map(key=>({key,count:counts[key]||0})),knownAnswers:latest.size,unknownAnswers,unknownSessions,complete:unknownAnswers===0&&unknownSessions===0};
  }
  function pickReportingTimeZone(attempts,fallback){
    const rows=(Array.isArray(attempts)?attempts:[]).filter(x=>x&&typeof x==='object').slice().sort(attemptOrder).reverse();
    for(const row of rows){const zone=row.versionPin&&row.versionPin.reportingTimeZoneAtStart;if(validTimeZone(zone))return zone;}
    return validTimeZone(fallback)?fallback:'UTC';
  }

  return Object.freeze({VERSION,CONTRACT_VERSION,validTimeZone,reportingDay,calendarKeysEnding,practiceTrend,answerActivity,pickReportingTimeZone});
}));
