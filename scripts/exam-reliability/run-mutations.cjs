'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');const {ROOT,output,write}=require('./evidence.cjs');
const trials=[];let failure=null;
try{for(const mutation of ['', 'counting','sync']){
  const pattern=mutation==='sync'?'sentinel: a second':'sentinel:';
  const r=spawnSync(process.execPath,['--test','--test-name-pattern='+pattern,'tests/test-bank-segment03-runtime.test.js'],{cwd:ROOT,env:{...process.env,SEG03_MUTATION:mutation},encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
  const text=(r.stdout||'')+'\n'+(r.stderr||'');fs.writeFileSync(path.join(output(),'mutation-'+(mutation||'control')+'.log'),text);
  assert.ok(!r.error&&!r.signal,'Mutation process infrastructure failure');
  if(!mutation)assert.equal(r.status,0,'Unmodified control must pass');
  else{assert.notEqual(r.status,0,'Deliberate bug escaped');assert.match(text,/ERR_ASSERTION/);assert.match(text,mutation==='counting'?/COUNT_SENTINEL/:/SYNC_SENTINEL/);}
  trials.push({mutation:mutation||'control',exit:r.status,expectedFailure:Boolean(mutation),detected:true});
}}catch(e){failure=e.stack;}
write('mutations',{status:failure?'failed':'passed',tests:trials.length,failures:failure?1:0,skipped:0,trials,error:failure,command:'node scripts/exam-reliability/run-mutations.cjs',limitation:'Two in-memory mutations of production ledger source; no production file edited.'});
console.log(JSON.stringify({trials,failure}));if(failure)process.exitCode=1;
