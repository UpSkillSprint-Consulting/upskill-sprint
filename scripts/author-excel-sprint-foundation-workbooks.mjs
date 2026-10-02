// Run from a temporary directory with the primary runtime; builds copy committed workbooks.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root=path.resolve(process.argv[2]),previews=path.resolve(process.argv[3]);
const {createPackages}=await import(pathToFileURL(path.join(root,'content/excel-sprint/curriculum.mjs')));
const {randomFor,workbookFingerprint}=await import(pathToFileURL(path.join(root,'content/excel-sprint/seed.mjs')));
const out=path.join(root,'content/excel-sprint/workbooks');
const manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
await fs.mkdir(previews,{recursive:true});
const letter=n=>String.fromCharCode(64+n);
for(const p of createPackages(randomFor)){
 const w=Workbook.create(),names=['Answers','Instructions','Data','Dictionary',...(p.parameters.length?['Parameters']:[])];
 for(const name of names){const s=w.worksheets.add(name);s.showGridLines=false;s.getRange('A1:G60').format={font:{name:'Arial',size:10,color:'#173847'},columnWidth:22,verticalAlignment:'center',rowHeight:22};}
 const header=(s,range)=>{s.getRange(range).format={fill:'#173847',font:{bold:true,color:'#FFFFFF'},rowHeight:34,wrapText:true,horizontalAlignment:'center'};};
 const data=w.worksheets.getItem('Data'),headers=p.columns.map(c=>c.name),last=letter(headers.length);
 data.getRange(`A1:${last}${p.rows.length+1}`).values=[headers,...p.rows];header(data,`A1:${last}1`);data.tables.add(`A1:${last}${p.rows.length+1}`,true,'SprintData');data.freezePanes.freezeRows(1);
 for(let c=0;c<headers.length;c++){const range=`${letter(c+1)}2:${letter(c+1)}${p.rows.length+1}`;if(p.rows.some(row=>typeof row[c]==='string'&&row[c]!==''))data.getRange(range).setNumberFormat('@');else data.getRange(range).setNumberFormat(headers[c].includes('CAD')?(headers[c]==='Unit_cost_CAD'?'0.000':'0.00'):p.rows.every(row=>row[c]===''||Number.isInteger(row[c]))?'0':'0.00');}
 const answers=w.worksheets.getItem('Answers');answers.tabColor='#173847';answers.getRange('A1:G1').values=[['Task','Your output','','','','','']];header(answers,'A1:G1');answers.getRange('A1:A60').format.columnWidth=16;
 for(const task of [...p.tasks,p.bonus]){const range=task.output.slice(8),row=Number(range.match(/\d+/)[0]);answers.getRange(`A${row}`).values=[[task.id==='bonus'?'Optional bonus':`Task ${task.id.slice(1)}`]];answers.getRange(range).format={fill:'#FFF5CC',borders:{preset:'outside',style:'thin',color:'#C7A747'}};if(task.type==='text')answers.getRange(range).setNumberFormat('@');}
 const instructions=w.worksheets.getItem('Instructions');instructions.getRange('A1:B1').values=[['Excel Formula Sprint',`${p.id}: ${p.title}`]];header(instructions,'A1:B1');instructions.getRange('A1:A12').format.columnWidth=28;instructions.getRange('B1:B12').format.columnWidth=96;
 const notes=[['Scenario',p.scenario],['How to submit','Solve in Microsoft 365 Excel. Yellow Answers cells are empty for your work. Submit the formula and the complete requested output in the lesson. Unless a task asks for rounding, use the calculated numeric value. Keep leading-zero identifiers as text.'],['Formula entry','Examples use comma argument separators. If your Excel locale uses semicolons, change argument separators. Enter formulas outside Data table cells when they spill. Keep the full output range empty and use its first cell as the anchor.'],...p.tasks.map((task,i)=>[`Task ${i+1}: ${task.output}`,task.prompt]),[`Bonus: ${p.bonus.output}`,p.bonus.prompt],['Training data','All company names, records and limits are fictitious training assumptions.']];
 instructions.getRange(`A2:B${notes.length+1}`).values=notes;instructions.getRange(`A1:B${notes.length+1}`).format.wrapText=true;instructions.getRange(`A2:B${notes.length+1}`).format={rowHeight:76,verticalAlignment:'top'};instructions.getRange('A1:B1').format.rowHeight=44;
 const dictionary=w.worksheets.getItem('Dictionary');dictionary.getRange(`A1:B${p.columns.length+1}`).values=[['Data column','Meaning'],...p.columns.map(c=>[c.name,c.description])];header(dictionary,'A1:B1');dictionary.getRange('A1:A10').format.columnWidth=28;dictionary.getRange('B1:B10').format={columnWidth:88,wrapText:true};dictionary.getRange('A2:B10').format.rowHeight=38;
 if(p.parameters.length){const params=w.worksheets.getItem('Parameters');params.getRange('A1:B1').values=[['Parameter','Value']];header(params,'A1:B1');params.getRange('A1:A10').format.columnWidth=32;for(const parameter of p.parameters){const row=Number(parameter.cell.slice(1));params.getRange(`A${row}:B${row}`).values=[[parameter.name,parameter.value]];params.getRange(parameter.cell).setNumberFormat('0.00');}}
 w.recalculate();
 const check=await w.inspect({kind:'table',range:`Data!A1:${last}5`,include:'values,formulas',tableMaxRows:5,tableMaxCols:7,maxChars:1600});await fs.writeFile(path.join(previews,`${p.id}-inspect.ndjson`),check.ndjson);
 const errors=await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:1000});await fs.writeFile(path.join(previews,`${p.id}-errors.ndjson`),errors.ndjson);
 const xlsx=path.join(out,`${p.id}.xlsx`);await (await SpreadsheetFile.exportXlsx(w)).save(xlsx);
 try{await fs.rename(xlsx+'.inspect.ndjson',path.join(previews,`${p.id}-export-inspect.ndjson`));}catch(error){if(error.code!=='ENOENT')throw error;}
 for(const name of names){const maxRow=Math.max(...[...p.tasks,p.bonus].map(t=>Number(t.output.match(/\d+$/)[0])));const range=name==='Instructions'?`A1:B${notes.length+1}`:name==='Dictionary'?`A1:B${p.columns.length+1}`:name==='Parameters'?'A1:B4':name==='Answers'?`A1:G${maxRow}`:`A1:${last}${p.rows.length+1}`;const image=await w.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(path.join(previews,`${p.id}-${name}.png`),new Uint8Array(await image.arrayBuffer()));}
 const bytes=await fs.readFile(path.join(out,`${p.id}.xlsx`));manifest[p.id]={fingerprint:workbookFingerprint(p),sha256:createHash('sha256').update(bytes).digest('hex')};console.log(`Authored and rendered ${p.id}: ${names.length} sheets`);
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
