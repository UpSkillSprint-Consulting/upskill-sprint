// Run in a temporary directory with the primary runtime; production builds use committed sources.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root=path.resolve(process.argv[2]),previews=path.resolve(process.argv[3]);
const {expertPackages}=await import(pathToFileURL(path.join(root,'content/excel-sprint/expert.mjs')));
const {randomFor,workbookFingerprint}=await import(pathToFileURL(path.join(root,'content/excel-sprint/seed.mjs')));
const out=path.join(root,'content/excel-sprint/workbooks');
const manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
await fs.mkdir(previews,{recursive:true});
const letter=n=>String.fromCharCode(64+n);
for(const p of expertPackages(randomFor)) {
 const w=Workbook.create(),names=['Answers','Instructions','Data',...p.sheets.map(s=>s.name),'Dictionary'];
 for(const name of names){const s=w.worksheets.add(name);s.showGridLines=false;s.getRange('A1:H200').format={font:{name:'Arial',size:10,color:'#173847'},columnWidth:22,verticalAlignment:'center'};}
 const header=(s,range)=>{s.getRange(range).format={fill:'#102D3D',font:{bold:true,color:'#FFFFFF'},rowHeight:30,wrapText:true,horizontalAlignment:'center'};};
 const write=(name,headers,rows,tableName)=>{
  const s=w.worksheets.getItem(name),width=letter(headers.length);
  s.getRange(`A1:${width}${rows.length+1}`).values=[headers,...rows];header(s,`A1:${width}1`);s.tables.add(`A1:${width}${rows.length+1}`,true,tableName);s.freezePanes.freezeRows(1);
  for(let i=0;i<headers.length;i++)if(rows.some(r=>typeof r[i]==='string'&&r[i]!==''))s.getRange(`${letter(i+1)}2:${letter(i+1)}${rows.length+1}`).setNumberFormat('@');
  s.getRange(`A${rows.length+3}`).values=[['Fictitious data for training purposes.']];s.getRange(`A${rows.length+3}:D${rows.length+3}`).merge();s.getRange(`A${rows.length+3}`).format.font={italic:true,color:'#56717E'};
 };
 write('Data',p.columns.map(c=>c.name),p.rows,'SprintData');
 for(const s of p.sheets)write(s.name,s.headers,s.rows,`${s.name}Data`);
 const answers=w.worksheets.getItem('Answers');answers.tabColor='#102D3D';answers.getRange('A1:H1').values=[['Task','Your output','','','','','','']];header(answers,'A1:H1');answers.getRange('A1:A200').format.columnWidth=16;
 for(const t of [...p.tasks,p.bonus]){const range=t.output.slice(8),row=Number(range.match(/\d+/)[0]);answers.getRange(`A${row}`).values=[[t.id==='bonus'?'Optional bonus':`Task ${t.id.slice(1)}`]];answers.getRange(range).format={fill:'#EAF5FA',borders:{preset:'outside',style:'thin',color:'#77AABF'}};if(t.type==='text')answers.getRange(range).setNumberFormat('@');}
 const instructions=w.worksheets.getItem('Instructions');instructions.getRange('A1:B1').values=[['Excel Formula Sprint',`${p.id}: ${p.title}`]];header(instructions,'A1:B1');instructions.getRange('A1:A12').format.columnWidth=28;instructions.getRange('B1:B12').format.columnWidth=96;
 const rows=[['Scenario',p.scenario],['How to submit','Solve in Microsoft 365 Excel. Answers cells are intentionally empty. Copy each requested output range into the lesson with its formula. All four required tasks must pass before model solutions unlock.'],...p.tasks.map((t,i)=>[`Task ${i+1}: ${t.output}`,t.prompt]),[`Bonus: ${p.bonus.output}`,p.bonus.prompt],['Practice data','Fictitious data for training purposes. Limits are training assumptions.']];
 instructions.getRange(`A2:B${rows.length+1}`).values=rows;instructions.getRange(`A1:B${rows.length+1}`).format.wrapText=true;instructions.getRange(`A2:B${rows.length+1}`).format={rowHeight:48,verticalAlignment:'top'};instructions.getRange('A2:B2').format.rowHeight=82;
 const dict=w.worksheets.getItem('Dictionary');dict.getRange(`A1:B${p.columns.length+1}`).values=[['Data column','Meaning'],...p.columns.map(c=>[c.name,c.description])];header(dict,'A1:B1');dict.getRange('B1:B10').format={columnWidth:82,wrapText:true};dict.getRange('A2:B10').format.rowHeight=36;
 w.recalculate();
 const summary=await w.inspect({kind:'table',range:'Data!A1:F5',include:'values,formulas',tableMaxRows:5,tableMaxCols:6,maxChars:1600});
 await fs.writeFile(path.join(previews,`${p.id}-inspect.ndjson`),summary.ndjson);
 const errors=await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#SPILL!',options:{useRegex:true,maxResults:20},maxChars:1000});
 await fs.writeFile(path.join(previews,`${p.id}-errors.ndjson`),errors.ndjson);
 await (await SpreadsheetFile.exportXlsx(w)).save(path.join(out,`${p.id}.xlsx`));await fs.rm(path.join(out,`${p.id}.xlsx.inspect.ndjson`),{force:true});
 for(const name of names){const range=name==='Instructions'?'A1:B9':name==='Dictionary'?`A1:B${p.columns.length+1}`:name==='Answers'?'A1:H8':`A1:${letter(name==='Data'?p.columns.length:p.sheets.find(s=>s.name===name).headers.length)}8`;const image=await w.render({sheetName:name,range,format:'png',scale:1});await fs.writeFile(path.join(previews,`${p.id}-${name}.png`),new Uint8Array(await image.arrayBuffer()));}
 const bytes=await fs.readFile(path.join(out,`${p.id}.xlsx`));manifest[p.id]={fingerprint:workbookFingerprint(p),sha256:createHash('sha256').update(bytes).digest('hex')};console.log(`Authored and rendered ${p.id}: ${names.length} sheets`);
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
