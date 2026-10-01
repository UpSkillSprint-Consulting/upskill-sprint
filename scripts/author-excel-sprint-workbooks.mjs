// Run from a temporary directory with @oai/artifact-tool available; see docs/excel-sprint-phase2.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root=path.resolve(process.argv[2]||'.');
const {phase2Packages}=await import(pathToFileURL(path.join(root,'content/excel-sprint/phase2.mjs')));
const {randomFor,workbookFingerprint}=await import(pathToFileURL(path.join(root,'content/excel-sprint/seed.mjs')));
const out=path.join(root,'content/excel-sprint/workbooks'),previews=path.resolve(process.argv[3]||'workbook-previews');
await fs.mkdir(out,{recursive:true});await fs.mkdir(previews,{recursive:true});
const manifest={};
const letter=n=>{let s='';for(;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
function header(sheet,range){sheet.getRange(range).format={fill:'#102D3D',font:{bold:true,color:'#FFFFFF'},rowHeight:30,wrapText:true};}
function base(sheet){sheet.showGridLines=false;sheet.getRange('A1:H150').format.font={name:'Aptos',size:11,color:'#173847'};sheet.getRange('A1:H150').format.columnWidth=22;sheet.freezePanes.freezeRows(1);}
for(const p of phase2Packages(randomFor)) {
 const w=Workbook.create(),names=['Data','Answers','Dictionary','Instructions',...p.sheets.map(s=>s.name)];
 for(const name of names)base(w.worksheets.add(name));
 const data=w.worksheets.getItem('Data'),headers=p.columns.map(c=>c.name);
 const writeData=(sheet,head,rows,tableName)=>{
  sheet.getRange(`A1:${letter(head.length)}${rows.length+1}`).values=[head,...rows];
  header(sheet,`A1:${letter(head.length)}1`);
  sheet.tables.add(`A1:${letter(head.length)}${rows.length+1}`,true,tableName);
  sheet.getRange(`A${rows.length+3}`).values=[['Fictitious data for training purposes.']];
  sheet.getRange(`A${rows.length+3}:${letter(Math.max(4,head.length))}${rows.length+3}`).merge();
  sheet.getRange(`A${rows.length+3}`).format.font={italic:true,color:'#56717E'};
 };
 writeData(data,headers,p.rows,'SprintData');
 // Imported identifiers must remain strings, including control characters and leading zeros.
 headers.forEach((_,i)=>{if(p.rows.some(r=>typeof r[i]==='string'&&r[i]!==''))data.getRange(`${letter(i+1)}2:${letter(i+1)}${p.rows.length+1}`).setNumberFormat('@');});
 for(const s of p.sheets){const sheet=w.worksheets.getItem(s.name);writeData(sheet,s.headers,s.rows,`${s.name}Data`);if(s.name==='Holidays')sheet.getRange('E2:E3').setNumberFormat('yyyy-mm-dd');}
 const ans=w.worksheets.getItem('Answers');ans.getRange('A1:E1').values=[['Task','Your output','','','']];header(ans,'A1:E1');ans.getRange('A1:A150').format.columnWidth=16;
 for(const task of [...p.tasks,p.bonus]){
  const range=task.output.replace('Answers!',''),row=Number(range.match(/\d+/)[0]);
  ans.getRange(`A${row}`).values=[[task.id==='bonus'?'Optional bonus':`Task ${task.id.slice(1)}`]];
  ans.getRange(range).format={fill:'#EAF5FA',borders:{preset:'outside',style:'thin',color:'#77AABF'}};
  if(task.type==='text')ans.getRange(range).setNumberFormat('@');
 }
 const dictionary=w.worksheets.getItem('Dictionary');dictionary.getRange(`A1:B${p.columns.length+1}`).values=[['Data column','Meaning'],...p.columns.map(c=>[c.name,c.description])];header(dictionary,'A1:B1');dictionary.getRange('B1:B20').format.columnWidth=80;dictionary.getRange('A1:B20').format.wrapText=true;
 const instructions=w.worksheets.getItem('Instructions');instructions.getRange('A1:B1').values=[['Excel Formula Sprint',`${p.id} · ${p.title}`]];header(instructions,'A1:B1');instructions.getRange('B1:B20').format.columnWidth=100;instructions.getRange('A1:B20').format.wrapText=true;
 const rows=[['Scenario',p.scenario],['How to submit','Solve in Microsoft 365 Excel. Copy each requested output range into the lesson, then submit its formula and result. Blue Answers cells are intentionally empty. The website scores results; AI feedback does not award marks.'],['Data',`${p.rows.length} fictitious records. Data headers are in row 1. Keep the footer outside SprintData. Supporting sheets: ${p.sheets.map(s=>s.name).join(', ')||'none'}.`],...p.tasks.map((t,i)=>[`Task ${i+1} · ${t.output}`,t.prompt]),[`Bonus · ${p.bonus.output}`,p.bonus.prompt],['Practice data','Fictitious data for training purposes.']];
 instructions.getRange(`A2:B${rows.length+1}`).values=rows;instructions.getRange(`A2:B${rows.length+1}`).format.rowHeight=65;
 w.recalculate();
 await (await SpreadsheetFile.exportXlsx(w)).save(path.join(out,`${p.id}.xlsx`));
 await fs.rm(path.join(out,`${p.id}.xlsx.inspect.ndjson`),{force:true});
 // Preview every authored sheet, including empty answer cells and supporting lookup tables.
 for(const name of names){const preview=await w.render({sheetName:name,range:name==='Instructions'?'A1:B5':name==='Dictionary'?'A1:B6':'A1:F8',format:'png',scale:1});await fs.writeFile(path.join(previews,`${p.id}-${name}.png`),new Uint8Array(await preview.arrayBuffer()));}
 const bytes=await fs.readFile(path.join(out,`${p.id}.xlsx`));manifest[p.id]={fingerprint:workbookFingerprint(p),sha256:createHash('sha256').update(bytes).digest('hex')};
 console.log(`Authored and rendered ${p.id} (${names.length} sheets)`);
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
