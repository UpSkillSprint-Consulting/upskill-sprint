// Public placement/practice assets. Re-author XLSX only with the primary runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv.find(a=>a.startsWith('--root='))?.slice(7)||process.cwd());
const {createLearningDrills,learningCatalog,diagnosticQuestions}=await import(pathToFileURL(path.join(root,'content/excel-sprint/learning.mjs')));
const {randomFor}=await import(pathToFileURL(path.join(root,'content/excel-sprint/seed.mjs')));
const base='assets/lessons/excel-formula-fluency/sprint/learning',url='/'+base;
const datasets=path.join(root,base,'datasets');
const drills=createLearningDrills(randomFor);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fingerprint=d=>hash(JSON.stringify({version:1,id:d.id,title:d.title,scenario:d.scenario,columns:d.columns,rows:d.rows,task:d.task}));
const csv=rows=>rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
await fs.mkdir(datasets,{recursive:true});
await fs.mkdir(path.join(root,base,'drills'),{recursive:true});
const manifestPath=path.join(datasets,'workbooks.json');
let manifest;
try{manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;manifest={version:1,workbooks:{}};}
if(process.argv.includes('--author-workbooks')){
 const {Workbook,SpreadsheetFile}=await import('@oai/artifact-tool');
 const output=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||'outputs/excel-sprint-learning');
 const previews=path.join(output,'previews');
 await fs.mkdir(previews,{recursive:true});
 const letter=n=>String.fromCharCode(64+n);
 for(const d of drills){
  const w=Workbook.create();
  const answers=w.worksheets.add('Answers'),instructions=w.worksheets.add('Instructions'),data=w.worksheets.add('Data');
  for(const s of [answers,instructions,data]){s.showGridLines=false;s.getRange('A1:F30').format={font:{name:'Arial',size:10,color:'#173847'},columnWidth:22,verticalAlignment:'center',rowHeight:22};}
  const header=(s,range)=>{s.getRange(range).format={fill:'#173847',font:{bold:true,color:'#FFFFFF'},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,rowHeight:32};};
  answers.tabColor='#173847';answers.getRange('A1:B1').values=[['Task','Your output']];header(answers,'A1:B1');
  answers.getRange('A2').values=[['Practice 1']];const range=d.task.output.slice(8);answers.getRange(range).format={fill:'#FFF5CC',borders:{preset:'outside',style:'thin',color:'#C7A747'}};
  if(d.task.type==='text'||(d.task.type==='array'&&d.private.task.answer.every(row=>typeof row[0]==='string')))answers.getRange(range).setNumberFormat('@');
  const last=letter(d.columns.length);
  data.getRange(`A1:${last}21`).values=[d.columns.map(c=>c.name),...d.rows];header(data,`A1:${last}1`);
  data.tables.add(`A1:${last}21`,true,'PracticeData');data.freezePanes.freezeRows(1);
  for(let c=0;c<d.columns.length;c++){
   const address=`${letter(c+1)}2:${letter(c+1)}21`;
   if(d.rows.some(row=>typeof row[c]==='string'&&row[c]!==''))data.getRange(address).setNumberFormat('@');
   else data.getRange(address).setNumberFormat(d.columns[c].name.includes('CAD')?'0.00':d.rows.every(row=>row[c]===''||Number.isInteger(row[c]))?'0':'0.0');
   data.getRange(`${letter(c+1)}1:${letter(c+1)}21`).format.columnWidth=Math.max(18,Math.min(26,d.columns[c].name.length+3));
  }
  instructions.getRange('A1:B1').values=[['Excel practice',`${d.id}: ${d.title}`]];header(instructions,'A1:B1');instructions.getRange('A1:A12').format.columnWidth=20;instructions.getRange('B1:B12').format.columnWidth=96;
  const notes=[['Scenario',d.scenario],['Task',d.task.prompt],['How to submit','Answers are intentionally empty. Solve in Microsoft 365 Excel. Submit your formula and the full requested result in the lesson. Practice guides your next review and does not complete a core assignment or change a certificate.'],...d.columns.map(c=>[c.name,c.description])];
  instructions.getRange(`A2:B${notes.length+1}`).values=notes;instructions.getRange(`A1:B${notes.length+1}`).format.wrapText=true;instructions.getRange(`A2:B${notes.length+1}`).format={rowHeight:48,verticalAlignment:'top'};instructions.getRange('A2:B2').format.rowHeight=64;instructions.getRange('A3:B3').format.rowHeight=112;instructions.getRange('A4:B4').format.rowHeight=64;instructions.getRange('A1:B1').format.rowHeight=40;
  w.recalculate();
  const check=await w.inspect({kind:'table',range:`Data!A1:${last}5`,include:'values,formulas',tableMaxRows:5,tableMaxCols:5,maxChars:1600});await fs.writeFile(path.join(previews,`${d.id}-inspect.ndjson`),check.ndjson);
  const errors=await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:1000});await fs.writeFile(path.join(previews,`${d.id}-errors.ndjson`),errors.ndjson);
  const xlsx=path.join(output,`${d.id}.xlsx`);await (await SpreadsheetFile.exportXlsx(w)).save(xlsx);await fs.copyFile(xlsx,path.join(datasets,`${d.id}.xlsx`));
  for(const name of ['Answers','Instructions','Data']){const area=name==='Answers'?`A1:B${d.task.type==='array'?d.private.task.answer.length+1:4}`:name==='Instructions'?`A1:B${notes.length+1}`:`A1:${last}21`;const image=await w.render({sheetName:name,range:area,scale:1,format:'png'});await fs.writeFile(path.join(previews,`${d.id}-${name}.png`),new Uint8Array(await image.arrayBuffer()));}
  const bytes=await fs.readFile(xlsx);manifest.workbooks[d.id]={fingerprint:fingerprint(d),sha256:hash(bytes)};console.log(`Authored ${d.id}: three sheets, empty learner output`);
 }
 await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
}
const keys={version:1,diagnostic:{id:'placement-v1',questions:diagnosticQuestions.map(q=>({id:q.id,skillId:q.skillId,...q.private}))},drills:{}};
for(const d of drills){
 const {private:answerKey,columns,rows,...pub}=d;
 keys.drills[d.id]=answerKey;
 if(!process.argv.includes('--content-only')){
  const bytes=await fs.readFile(path.join(datasets,`${d.id}.xlsx`));const source=manifest.workbooks[d.id];
  if(source?.fingerprint!==fingerprint(d)||source.sha256!==hash(bytes))throw new Error(`${d.id}: authored workbook is missing or stale. Run --author-workbooks with the primary runtime.`);
 }
 const dataset={headers:columns.map(c=>c.name),rows,rowCount:rows.length,tableName:'PracticeData',columns,xlsx:`${url}/datasets/${d.id}.xlsx`,csv:`${url}/datasets/${d.id}.csv`};
 await fs.writeFile(path.join(root,base,'drills',`${d.id}.json`),JSON.stringify({...pub,dataset},null,2)+'\n');
 await fs.writeFile(path.join(datasets,`${d.id}.csv`),csv([dataset.headers,...rows]));
}
await fs.writeFile(path.join(root,base,'catalog.json'),JSON.stringify(learningCatalog(drills),null,2)+'\n');
await fs.writeFile(path.join(root,'netlify/functions/_shared/excel-sprint-learning-answers.json'),JSON.stringify(keys,null,2)+'\n');
console.log(`Generated ${diagnosticQuestions.length} placement questions and ${drills.length} independent practice drills.`);
