'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('all 110 Mock B items are assigned independent, pending technical/legal and distractor source dispositions',()=>{
 const lines=fs.readFileSync(path.join(root,'docs/nppe-mock-b-independent-review-source-ledger.csv'),'utf8').trim().split(/\r?\n/);
 assert.equal(lines.length,111);
 const header=lines[0];
 for(const field of ['independent_technical_reviewer','independent_legal_reviewer','source_effective_date_checked','qualified_disposition','categorical_cue_status'])
  assert.ok(header.includes(field));
 for(let n=281;n<=390;n++){
  const line=lines[n-280];
  assert.ok(line.startsWith('"NPPE-'+n+'",'),'Expected matching row NPPE-'+n);
  assert.ok(line.includes('"pending"'),'No synthetic sign-off is allowed');
  assert.ok(!line.includes('"approved"'),'External review not completed');
 }
 const priorities=lines.filter(line=>line.includes('"critical_categorical_cue"')).length;
 assert.equal(priorities,8);
});
