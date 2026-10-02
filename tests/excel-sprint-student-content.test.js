const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'..');
function audit(file){
 const result=spawnSync('python3',[path.join(root,'scripts',file)],{cwd:root,encoding:'utf8',timeout:30000});
 assert.equal(result.status,0,(result.stdout||'')+(result.stderr||''));
 return JSON.parse(result.stdout);
}
test('all 212 core/Expert required outputs and 53 bonuses match independent public-data arithmetic',()=>{
 const early=audit('audit-excel-sprint-early-content.py'),advanced=audit('audit-excel-sprint-advanced-content.py');
 assert.equal(early.packages+advanced.packages,53);assert.equal(early.required_outputs+advanced.requiredOutputs,212);assert.equal(early.bonus_outputs+advanced.bonusOutputs,53);
 assert.equal(early.mismatch_count,0);assert.deepEqual(early.shape_errors,[]);assert.deepEqual(advanced.mismatches,[]);assert.deepEqual(advanced.shape_errors,[]);
});
test('all 73 workbook downloads preserve source data and empty learner output areas',()=>{
 const result=audit('audit-excel-sprint-workbook-data.py');assert.equal(result.workbooks,73);assert.ok(result.source_cells>10000);assert.ok(result.empty_answer_cells>2000);assert.equal(result.instruction_contracts,358);assert.deepEqual(result.errors,[]);
});
test('every core task and bonus uses functions taught by that assignment',()=>{
 const p=id=>JSON.parse(fs.readFileSync(path.join(root,`assets/lessons/excel-formula-fluency/sprint/packages/${id}.json`)));
 const taught=new Set();let reviewed=0;
 for(let level=1;level<=10;level++)for(let assignment=1;assignment<=5;assignment++){
  const lesson=p(`L${level}-A${assignment}`);for(const f of lesson.lesson.functions)taught.add(f.name);
  for(const task of [...lesson.tasks,lesson.bonus]){reviewed++;for(const name of task.formulas)assert.ok(taught.has(name),`${lesson.id}/${task.id} uses untaught ${name}`);}
 }
 assert.equal(reviewed,250);
 assert.match(p('L1-A4').tasks[1].prompt,/Ignore current Stock_units/);
 const ifna=p('L7-A4').lesson.functions.find(f=>f.name==='IFNA');assert.ok(ifna);assert.match(ifna.arguments,/#N\/A/);assert.match(ifna.mistake,/only #N\/A/);
 assert.match(p('L10-A4').bonus.prompt,/Review SUMPRODUCT/);
});
test('practice date examples distinguish numeric DATE results from ISO text',()=>{
 for(const id of ['R5-A1','R5-A2']){
  const drill=JSON.parse(fs.readFileSync(path.join(root,`assets/lessons/excel-formula-fluency/sprint/learning/drills/${id}.json`)));
  const date=drill.lesson.formulas.find(f=>f.name==='DATE');assert.match(date.explanation,/numeric date serial/);assert.equal(date.example,'=TEXT(DATE(2024,2,29),"yyyy-mm-dd")');assert.equal(date.result,'2024-02-29');
 }
});
