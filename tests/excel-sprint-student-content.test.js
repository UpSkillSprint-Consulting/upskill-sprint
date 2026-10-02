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
 const result=audit('audit-excel-sprint-workbook-data.py');assert.equal(result.workbooks,73);assert.ok(result.source_cells>10000);assert.ok(result.empty_answer_cells>2000);assert.deepEqual(result.errors,[]);
});
test('functions are taught before their first required dynamic-array task',()=>{
 const p=id=>JSON.parse(fs.readFileSync(path.join(root,`assets/lessons/excel-formula-fluency/sprint/packages/${id}.json`)));
 assert.ok(p('L6-A1').lesson.functions.some(f=>f.name==='CHOOSECOLS'));
 assert.ok(p('L6-A3').lesson.functions.some(f=>f.name==='HSTACK'));
 assert.match(p('L1-A4').tasks[1].prompt,/Ignore current Stock_units/);
});
