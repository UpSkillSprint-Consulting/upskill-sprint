'use strict';
const fs=require('node:fs'),path=require('node:path');
const {gate,commit,output,lanes}=require('./evidence.cjs');
try{const reports=lanes.map(l=>JSON.parse(fs.readFileSync(path.join(output(),l+'.json'),'utf8')));const result=gate(reports,commit());fs.writeFileSync(path.join(output(),'gate.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));}catch(e){console.error(e.stack);process.exitCode=1;}
