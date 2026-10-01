import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {levels,createPackages} from '../content/excel-sprint/curriculum.mjs';
import {workbook} from './lib/excel-sprint-xlsx.mjs';
const base='assets/lessons/excel-formula-fluency/sprint',url='/'+base;
function randomFor(id){let s=createHash('sha256').update('excel-sprint-v1:'+id).digest().readUInt32LE();return{int(a,b){s=(Math.imul(s,1664525)+1013904223)>>>0;return a+Math.floor(s/4294967296*(b-a+1));}};}
await mkdir(base+'/packages',{recursive:true});await mkdir(base+'/datasets',{recursive:true});
const packages=createPackages(randomFor),keys={};
for(const p of packages){keys[p.id]=p.private;const {private:unused,rows,columns,parameters,...pub}=p;const headers=columns.map(x=>x.name);const dataset={headers,rows,rowCount:rows.length,tableName:'SprintData',columns,parameters,xlsx:`${url}/datasets/${p.id}.xlsx`,csv:`${url}/datasets/${p.id}.csv`};await writeFile(`${base}/packages/${p.id}.json`,JSON.stringify({...pub,dataset},null,2)+'\n');await writeFile(`${base}/datasets/${p.id}.csv`,[headers,...rows,[],['Fictitious data for training purposes.']].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n')+'\n');await writeFile(`${base}/datasets/${p.id}.xlsx`,workbook(p));}
await writeFile('netlify/functions/_shared/excel-sprint-answers.json',JSON.stringify(keys,null,2)+'\n');
await writeFile(base+'/catalog.json',JSON.stringify({version:1,levels:levels.map(l=>({...l,available:l.level<=2,packages:l.titles.map((title,i)=>{const id=`L${l.level}-A${i+1}`,p=packages.find(p=>p.id===id);return{id,title,formulas:p?.formulas||l.formulas};})}))},null,2)+'\n');
console.log('Generated ten fixed-seed assignment packages and downloads.');
