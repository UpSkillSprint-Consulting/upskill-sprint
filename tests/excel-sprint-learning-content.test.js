const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {inflateRawSync}=require('node:zlib');
const {createHash}=require('node:crypto');
const {JSDOM}=require('jsdom');
const base='assets/lessons/excel-formula-fluency/sprint/learning/';
const catalog=JSON.parse(fs.readFileSync(base+'catalog.json'));
const ids=catalog.skills.flatMap(s=>s.drills.map(d=>d.id));
const numeric=v=>typeof v==='number'&&Number.isFinite(v);
const sum=(rows,column)=>rows.reduce((n,row)=>n+(numeric(row[column])?row[column]:0),0);
const round=(n,d)=>Math.round((n+Number.EPSILON)*10**d)/10**d;
function independentOutput(id,rows){
 const level=+id.match(/^R(\d+)/)[1];
 if(level===1)return round(sum(rows,1)/rows.filter(r=>numeric(r[1])).length,2);
 if(level===2)return sum(rows.filter(r=>r[1]==='Day'&&r[2]==='Repair'),3);
 if(level===3)return id.endsWith('A1')?rows.find(r=>r[0]==='LK1-014')[2]:'Missing';
 if(level===4)return rows.map(r=>[String(r[1]).replace(/[\x00-\x1f]/g,'').trim().replace(/ +/g,' ').toUpperCase()||'Missing']);
 if(level===5)return rows.map(r=>[new Date(Date.UTC(r[1],r[2]-1,r[3])).toISOString().slice(0,10)]);
 if(level===6)return rows.filter(r=>numeric(r[2])&&r[2]<12).map(r=>[r[0]]);
 if(level===7){const chosen=rows.filter(r=>r[1]==='Day');return round(100*sum(chosen,3)/sum(chosen,2),2);}
 if(level===8)return round((sum(rows,1)-sum(rows,2))/sum(rows,1),3);
 if(level===9&&id.endsWith('A1')){const values=rows.map(r=>r[1]).filter(numeric),mean=values.reduce((n,v)=>n+v,0)/values.length;return round(Math.sqrt(values.reduce((n,v)=>n+(v-mean)**2,0)/(values.length-1)),3);}
 if(level===9){const pairs=rows.filter(r=>numeric(r[1])&&numeric(r[2])),x=sum(pairs,1)/pairs.length,y=sum(pairs,2)/pairs.length;return round(pairs.reduce((n,r)=>n+(r[1]-x)*(r[2]-y),0)/Math.sqrt(pairs.reduce((n,r)=>n+(r[1]-x)**2,0)*pairs.reduce((n,r)=>n+(r[2]-y)**2,0)),3);}
 return rows.map(r=>[numeric(r[1])&&numeric(r[2])?round(r[1]*r[2],2):'Missing']);
}
function unzip(bytes){
 const end=bytes.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));assert.ok(end>=0);
 const entries=new Map();let cursor=bytes.readUInt32LE(end+16);
 for(let i=0;i<bytes.readUInt16LE(end+10);i++){
  assert.equal(bytes.readUInt32LE(cursor),0x02014b50);
  const method=bytes.readUInt16LE(cursor+10),size=bytes.readUInt32LE(cursor+20),nameLength=bytes.readUInt16LE(cursor+28),extra=bytes.readUInt16LE(cursor+30),comment=bytes.readUInt16LE(cursor+32),local=bytes.readUInt32LE(cursor+42);
  const name=bytes.subarray(cursor+46,cursor+46+nameLength).toString(),start=local+30+bytes.readUInt16LE(local+26)+bytes.readUInt16LE(local+28),content=bytes.subarray(start,start+size);
  assert.ok(method===0||method===8);entries.set(name,(method===8?inflateRawSync(content):content).toString());cursor+=46+nameLength+extra+comment;
 }
 return entries;
}
function xml(text){return new JSDOM(text,{contentType:'text/xml'}).window.document;}

test('placement samples all ten levels and public practice assets contain no grading material',()=>{
 assert.equal(catalog.diagnostic.questions.length,10);assert.equal(catalog.skills.length,10);assert.equal(ids.length,20);
 assert.deepEqual(catalog.diagnostic.questions.map(q=>q.level),Array.from({length:10},(_,i)=>i+1));
 for(const question of catalog.diagnostic.questions){assert.equal(question.options.length,4);assert.equal(new Set(question.options.map(o=>o.id)).size,4);}
 const privateNames=new Set(['private','answer','correctOption','model','alternatives','hints']);
 function inspect(value){if(!value||typeof value!=='object')return;for(const [key,child] of Object.entries(value)){assert.ok(!privateNames.has(key),'Published private field '+key);inspect(child);}}
 inspect(catalog);
 for(const id of ids){const drill=JSON.parse(fs.readFileSync(base+'drills/'+id+'.json'));inspect(drill);assert.equal(drill.dataset.rows.length,20);assert.ok(drill.dataset.rows.every(row=>row.length===drill.dataset.headers.length));assert.match(drill.scenario,/fictitious/);assert.match(drill.task.prompt,/equivalent approach/);}
});

test('all twenty practice outputs independently calculated from public rows pass grading',async()=>{
 const {learningAction}=await import('../netlify/functions/_shared/excel-sprint-learning.mjs');
 for(const id of ids){const drill=JSON.parse(fs.readFileSync(base+'drills/'+id+'.json'));const output=independentOutput(id,drill.dataset.rows);const report=learningAction({action:'grade',drillId:id,formula:'=SUM(Data!B2:B21)',result:output},'independent-public-output-test-secret-more-than32');assert.equal(report.correct,true,id);assert.equal(report.attempts,1);assert.equal(report.firstAttemptCorrect,true);}
});

test('all authored XLSX downloads preserve exact source cells and empty answer ranges without hidden models',()=>{
 const manifest=JSON.parse(fs.readFileSync(base+'datasets/workbooks.json'));let cells=0;
 for(const id of ids){
  const drill=JSON.parse(fs.readFileSync(base+'drills/'+id+'.json')),bytes=fs.readFileSync('.'+drill.dataset.xlsx),files=unzip(bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),manifest.workbooks[id].sha256,id);
  const shared=files.has('xl/sharedStrings.xml')?[...xml(files.get('xl/sharedStrings.xml')).querySelectorAll('si')].map(n=>n.textContent):[];
  const workbook=xml(files.get('xl/workbook.xml')),rels=xml(files.get('xl/_rels/workbook.xml.rels'));
  function values(name){
   const sheet=[...workbook.querySelectorAll('sheet')].find(s=>s.getAttribute('name')===name);assert.ok(sheet);
   const rel=[...rels.querySelectorAll('Relationship')].find(r=>r.getAttribute('Id')===sheet.getAttribute('r:id'));assert.ok(rel);
   const target=rel.getAttribute('Target'),key=target.startsWith('/')?target.slice(1):path.posix.normalize('xl/'+target),document=xml(files.get(key));
   assert.equal(document.querySelectorAll('f').length,0,id+'/'+name+' has model formulas');
   const values=new Map();for(const cell of document.querySelectorAll('c')){const type=cell.getAttribute('t'),v=cell.querySelector('v');const value=type==='s'?shared[Number(v.textContent)]:type==='inlineStr'?cell.querySelector('is')?.textContent||'':type==='str'?v?.textContent||'':v?Number(v.textContent):'';values.set(cell.getAttribute('r'),value);}return values;
  }
  const data=values('Data'),answers=values('Answers');values('Instructions');
  for(const [i,row] of [drill.dataset.headers,...drill.dataset.rows].entries())for(const [j,value] of row.entries()){assert.equal(data.get(String.fromCharCode(65+j)+(i+1))??'',value,id+' source row '+i+' column '+j);cells++;}
  const range=drill.task.output.match(/^Answers!B(\d+)(?::([A-Z])(\d+))?$/);assert.ok(range);
  for(let row=+range[1];row<=+(range[3]||range[1]);row++)for(let col=66;col<=(range[2]||'B').charCodeAt(0);col++)assert.equal(answers.get(String.fromCharCode(col)+row)??'','',id+' answer area');
 }
 assert.equal(cells,1281);
});
