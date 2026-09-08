'use strict';
const {spawnSync}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const {ROOT,output,write,profiles}=require('./evidence.cjs');
// Run every repository test, each file in Node's isolated child process. Never replace npm test.
const files=fs.readdirSync(path.join(ROOT,'tests')).filter(n=>n.endsWith('.test.js')).sort().map(n=>'tests/'+n);
const args=['--test','--test-concurrency='+profiles.evidence.nodeConcurrency,...files];
const r=spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',timeout:1100000,maxBuffer:50*1024*1024});
fs.writeFileSync(path.join(output(),'node.log'),(r.stdout||'')+'\n'+(r.stderr||'')+'\n'+(r.error||''));
const get=k=>{const v=[...(r.stdout||'').matchAll(new RegExp('^# '+k+' (\\d+)','gm'))].at(-1);return v?Number(v[1]):null;};
const passed=r.status===0&&!r.error&&get('fail')===0&&get('skipped')===0&&get('todo')===0&&get('tests')>0;
write('node',{status:passed?'passed':'failed',tests:get('tests'),failures:get('fail'),skipped:get('skipped'),command:'node '+args.join(' '),exit:r.status,error:r.error?String(r.error):null});
console.log(JSON.stringify({passed,tests:get('tests'),failures:get('fail'),files:files.length}));if(!passed)process.exitCode=1;
