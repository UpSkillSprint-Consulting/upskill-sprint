'use strict';
/* Offline editorial/technical whole-form audit. No release authorization or source-validation claim. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
function load(files,selector){
 const c=vm.createContext({window:{}});
 for(const file of files)vm.runInContext(read(file),c,{filename:file,timeout:10000});
 const result=selector(c.window);
 if(!Array.isArray(result))throw new Error('Bank not an array: '+files.join(','));
 return Array.from(result);
}
const bNames=Array.from({length:11},(_,i)=>'test-bank-nppe-mock-b-batch'+(i+1)+'.js');
const aNames=Array.from({length:11},(_,i)=>'test-bank-nppe-mock-a-batch'+(i+1)+'.js');
const lNames=Array.from({length:12},(_,i)=>'test-bank-nppe-learning-batch'+(i+1)+'.js');
const diag=['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js','test-bank-nppe-diagnostic-batch4.js','test-bank-nppe-diagnostic-batch5.js'];
const norm=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const stop=new Set(['which','should','could','would','their','there','about','these','engineer','engineers','professional','professionals','client','clients','company','because','under','given','following','where','before','after','while','rather','project','statement','which','best','most','appropriate']);
const token=s=>new Set(norm(s).split(' ').filter(w=>w.length>=5&&!stop.has(w)));
function jaccard(a,b){let n=0;for(const t of a)if(b.has(t))n++;return n/(a.size+b.size-n||1)}
function auditMockB(){
 const questions=load(bNames,w=>w.NPPE_MOCK_B);
 const others=[
  {bank:'Mock A',questions:load(aNames,w=>w.NPPE_MOCK_A)},
  {bank:'Learning',questions:load(lNames,w=>w.NPPE_LEARNING)},
  {bank:'Diagnostic',questions:load(diag,w=>w.NPPE_DIAGNOSTIC)},
  {bank:'Grok Mock D',questions:load(['test-bank-nppe-set2.js'],w=>w.NPPE_SET2)},
  {bank:'Claude Mock E',questions:load(['test-bank-nppe-set3.js'],w=>w.NPPE_SET3)}
 ];
 const failures=[],warnings=[];
 function require(condition,message){if(!condition)failures.push(message)}
 require(questions.length===110,'Expected 110 Mock B items');
 for(const bank of others)require(bank.questions.length===({ 'Mock A':110,Learning:120,Diagnostic:50,'Grok Mock D':110,'Claude Mock E':110})[bank.bank],'Unexpected existing bank count: '+bank.bank);
 const ledger=read('docs/nppe-mock-b-allocation-ledger.csv').trim().split(/\r?\n/).map(s=>s.split(','));
 require(ledger.length===111,'Allocation ledger must have 110 rows and a header');
 const domains={I:[0,0],II:[0,0],III:[0,0],IV:[0,0],V:[0,0],VI:[0,0]},topics=new Map(),keys=[0,0,0,0],levels={},difficulty={},family=new Set(),seenIds=new Set(),seenStems=new Map(),rolePositions=[],longestKey=0;
 questions.forEach((q,i)=>{
  const n=281+i,label='NPPE-'+n,domain=q.blueprint?.split('.')[0];
  require(q.qid==='nppe:set-1:mock-b:'+n&&q.legacyId===label,'Wrong Mock B ID at '+n);
  require(!seenIds.has(q.qid),'Duplicate canonical ID '+q.qid);seenIds.add(q.qid);
  require(q.authorSet===1&&q.form==='set-1-mock-b'&&q.releaseStatus==='held','Form/ownership/release invariant '+label);
  require(q.options?.length===4&&new Set(q.options).size===4&&q.optionRationales?.length===4,'Four choices/rationales '+label);
  require(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<=3,'Answer index '+label);
  require(q.optionRationales?.every(x=>x.length>=35),'Rationale too short '+label);
  require(q.learningObjective&&q.jurisdiction&&q.keyPoint&&q.trap,'Missing editorial fields '+label);
  require(q.sources?.some(s=>s.sourceType==='official-blueprint')&&q.sources?.some(s=>s.sourceType!=='official-blueprint'),'Blueprint and supporting source needed '+label);
  for(const s of q.sources||[]){let u;try{u=new URL(s.url)}catch{}require(u?.protocol==='https:'&&!!s.title&&!!s.locator,'Invalid source URL/title/locator '+label)}
  const exact=norm(q.stem);
  require(!seenStems.has(exact),'Duplicate Mock B stem '+label+' and '+seenStems.get(exact));seenStems.set(exact,label);
  require(!family.has(q.questionFamily),'Duplicate Mock B questionFamily '+label);family.add(q.questionFamily);
  const role=q.scored&&!q.experimental?'scored':!q.scored&&q.experimental?'simulated_unscored':'invalid';
  require(role!=='invalid','Ambiguous scoring status '+label);
  if(ledger[i+1]){require(ledger[i+1][0]===label&&ledger[i+1][2]===q.blueprint&&ledger[i+1][4]===role&&ledger[i+1][5]==='authored_held','Allocation-ledger mismatch '+label)}
  if(domains[domain])domains[domain][role==='scored'?0:1]++;else failures.push('Invalid domain '+label);
  if(!topics.has(q.blueprint))topics.set(q.blueprint,0);if(role==='scored')topics.set(q.blueprint,topics.get(q.blueprint)+1);
  if(role==='simulated_unscored')rolePositions.push(n);
  if(q.answer>=0&&q.answer<4)keys[q.answer]++;
  levels[q.cognitiveLevel]=(levels[q.cognitiveLevel]||0)+1;
  difficulty[q.difficulty]=(difficulty[q.difficulty]||0)+1;
  if(q.options&&q.options[q.answer].length===Math.max(...q.options.map(s=>s.length)))longestKey++;
  require(q.version>=1&&Number.isInteger(q.version),'Missing integer version '+label);
 });
 const expected={I:[8,1],II:[20,2],III:[30,3],IV:[26,2],V:[8,1],VI:[8,1]};
 for(const [d,counts] of Object.entries(expected))require(JSON.stringify(domains[d])===JSON.stringify(counts),'Blueprint domain mismatch '+d+': '+domains[d]);
 require(Array.from(topics.values()).filter(n=>n>0).length===40,'Not all 40 numbered topics have scored coverage');
 require(rolePositions.length===10,'Unscored allocation must be exactly ten');
 require(rolePositions.filter(n=>n<=370).length>=5&&rolePositions.filter(n=>n>=381).length<=5,'Unscored items are excessively clustered at the end');
 if((difficulty.hard||0)===0)warnings.push('No items provisionally hard: editorial difficulty imbalance; no empirical data');
 if(longestKey>65)warnings.push('Keyed answer is longest in '+longestKey+'/110 items; option-length cue risk');
 const all=[{bank:'Mock B',questions},...others],exactOwners=new Map(),near=[];
 for(const b of all)for(const q of b.questions){const clean=norm(q.stem);if(exactOwners.has(clean))failures.push('Exact cross-bank stem duplication: '+b.bank+' '+(q.legacyId||q.qid)+' and '+exactOwners.get(clean));else exactOwners.set(clean,b.bank+' '+(q.legacyId||q.qid))}
 const otherTokens=others.flatMap(b=>b.questions.map(q=>({bank:b.bank,q,t:token(q.stem)}))),seenPairs=[];
 for(let i=0;i<questions.length;i++){
  const a=questions[i],at=token(a.stem);
  for(let j=i+1;j<questions.length;j++)seenPairs.push({item:a.legacyId,other:questions[j].legacyId,bank:'Mock B',score:jaccard(at,token(questions[j].stem))});
  for(const o of otherTokens)seenPairs.push({item:a.legacyId,other:o.q.legacyId||o.q.qid,bank:o.bank,score:jaccard(at,o.t)});
 }
 seenPairs.sort((a,b)=>b.score-a.score);
 near.push(...seenPairs.filter(x=>x.score>=0.24).slice(0,50).map(x=>({...x,score:Number(x.score.toFixed(3))})));
 return {items:questions.length,scored:110-rolePositions.length,experimental:rolePositions.length,unscoredIds:rolePositions,domains,scoredTopics:Array.from(topics.values()).filter(n=>n>0).length,keys,difficulty,cognition:levels,longestKey,otherBanks:others.map(x=>({name:x.bank,count:x.questions.length})),nearDuplicateCandidates:near,failures,warnings};
}
if(require.main===module){const r=auditMockB();console.log(JSON.stringify(r,null,2));if(r.failures.length)process.exitCode=1}
module.exports={auditMockB};
