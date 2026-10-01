import {mkdir,writeFile,readFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {levels,createPackages} from '../content/excel-sprint/curriculum.mjs';
import {phase2Packages} from '../content/excel-sprint/phase2.mjs';
import {randomFor,workbookFingerprint} from '../content/excel-sprint/seed.mjs';
import {workbook} from './lib/excel-sprint-xlsx.mjs';
const base='assets/lessons/excel-formula-fluency/sprint',url='/'+base;
await mkdir(base+'/packages',{recursive:true});await mkdir(base+'/datasets',{recursive:true});
const packages=[...createPackages(randomFor),...phase2Packages(randomFor)],keys={},context={};
const workbookDir='content/excel-sprint/workbooks';
const manifest=JSON.parse(await readFile(`${workbookDir}/manifest.json`,'utf8'));
const csv=rows=>rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n')+'\n';
for(const p of packages){
 const {private:unused,rows,columns,parameters,sheets=[],...pub}=p;
 const {scenario:unusedScenario,columns:unusedColumns,rows:unusedRows,sheets:unusedSheets,...key}=p.private;
 keys[p.id]=key;
 const headers=columns.map(x=>x.name);
 const dataset={headers,rows,rowCount:rows.length,tableName:'SprintData',columns,parameters,xlsx:`${url}/datasets/${p.id}.xlsx`,csv:`${url}/datasets/${p.id}.csv`};
 if(sheets.length)dataset.sheets=sheets.map(s=>({...s,csv:`${url}/datasets/${p.id}-${s.name}.csv`}));
 context[p.id]={scenario:p.scenario,headers,rows,parameters,sheets,tasks:[...p.tasks,...(p.bonus?[p.bonus]:[])]};
 await writeFile(`${base}/packages/${p.id}.json`,JSON.stringify({...pub,dataset},null,2)+'\n');
 await writeFile(`${base}/datasets/${p.id}.csv`,csv([headers,...rows,[],['Fictitious data for training purposes.']]));
 for(const sheet of sheets)await writeFile(`${base}/datasets/${p.id}-${sheet.name}.csv`,csv([sheet.headers,...sheet.rows,[],['Fictitious data for training purposes.']]));
 if(p.level<=2)await writeFile(`${base}/datasets/${p.id}.xlsx`,workbook(p));
 else {
  const entry=manifest[p.id],source=await readFile(`${workbookDir}/${p.id}.xlsx`);
  if(entry?.fingerprint!==workbookFingerprint(p)||entry.sha256!==createHash('sha256').update(source).digest('hex'))throw new Error(`${p.id}: workbook source is stale. Re-author the seeded workbook before building.`);
  await copyFile(`${workbookDir}/${p.id}.xlsx`,`${base}/datasets/${p.id}.xlsx`);
 }
}
await writeFile('netlify/functions/_shared/excel-sprint-answers.json',JSON.stringify(keys,null,2)+'\n');
await writeFile('netlify/functions/_shared/excel-sprint-coaching-context.json',JSON.stringify(context)+'\n');
await writeFile(base+'/catalog.json',JSON.stringify({version:1,levels:levels.map(l=>({...l,available:l.level<=6,packages:l.titles.map((title,i)=>{const id=`L${l.level}-A${i+1}`,p=packages.find(p=>p.id===id);return{id,title:p?.title||title,formulas:p?.formulas||l.formulas};})}))},null,2)+'\n');
console.log('Generated thirty fixed-seed assignment packages and downloads.');
