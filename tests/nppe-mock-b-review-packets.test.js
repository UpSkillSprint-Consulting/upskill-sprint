'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {items,build}=require('../scripts/nppe-mock-b-review-packets.cjs');
test('review exporter preserves 110 canonical question versions and scoring roles',()=>{
 const q=items();assert.equal(q.length,110);
 assert.equal(q.filter(x=>x.scored).length,100);
 assert.equal(q.filter(x=>x.experimental).length,10);
 assert.equal(q[0].legacyId,'NPPE-281');assert.equal(q[109].legacyId,'NPPE-390');
});
test('blind and keyed review packets are separated and pending by default',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-review-'));
 try{
  const dest=path.join(temp,'packets'),m=build(dest);
  const blind=JSON.parse(fs.readFileSync(path.join(dest,'blind/questions.json'),'utf8'));
  const keyed=JSON.parse(fs.readFileSync(path.join(dest,'restricted-keyed/questions.json'),'utf8'));
  const ledger=fs.readFileSync(path.join(dest,'review-ledger.csv'),'utf8');
  assert.equal(m.itemCount,110);assert.equal(m.items.length,110);
  assert.equal(m.keyedPacketSha256,require('node:crypto').createHash('sha256').update(JSON.stringify(keyed)).digest('hex'));
  assert.match(m.sourceRevision,/^[a-f0-9]{40}$/);
  assert.ok(items().every(q=>q.releaseStatus==='held'&&q.form==='set-1-mock-b'));
  assert.equal(blind.items.length,110);assert.equal(keyed.items.length,110);
  assert.equal(fs.statSync(dest).mode&0o777,0o700);
  assert.equal(fs.statSync(path.join(dest,'restricted-keyed')).mode&0o777,0o700);
  assert.equal(fs.statSync(path.join(dest,'restricted-keyed/questions.json')).mode&0o777,0o600);
  assert.ok(m.items.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)));
  assert.ok(blind.items.every(q=>!('answerIndex'in q)&&!('correctOption'in q)&&!('optionRationales'in q)&&!('sources'in q)&&!('keyPoint'in q)));
  assert.ok(keyed.items.every(q=>Number.isInteger(q.answerIndex)&&q.optionRationales.length===4&&q.sources.length>0));
  assert.equal(ledger.split('\n').filter(Boolean).length,111);
  const legalCsv=fs.readFileSync(path.join(dest,'restricted-keyed/legal-source-review.csv'),'utf8');
  const smeCsv=fs.readFileSync(path.join(dest,'restricted-keyed/sme-editorial-review.csv'),'utf8');
  assert.ok(legalCsv.split('\n').filter(Boolean).length>=111);
  assert.equal(smeCsv.split('\n').filter(Boolean).length,111);
  assert.ok(legalCsv.includes('"NPPE-281"')&&legalCsv.includes('"pending"'));
  assert.ok(smeCsv.includes('"NPPE-390"')&&smeCsv.includes('"pending"'));
  assert.equal(fs.statSync(path.join(dest,'restricted-keyed/legal-source-review.csv')).mode&0o777,0o600);
  assert.equal(fs.statSync(path.join(dest,'restricted-keyed/sme-editorial-review.csv')).mode&0o777,0o600);
  const decisions=JSON.parse(fs.readFileSync(path.join(dest,'restricted-keyed/review-decisions.json'),'utf8'));
  assert.equal(decisions.items.length,110);
  assert.ok(decisions.items.every(x=>x.technical.status==='pending'&&x.legal.status==='pending'&&x.distractors.status==='pending'&&x.adjudication.status==='pending'));
  assert.ok(decisions.items.every(x=>x.distractors.optionFindings.length===4&&x.adjudication.independenceDeclaration===''&&x.legal.effectiveDate===''));
  const cue=JSON.parse(fs.readFileSync(path.join(dest,'restricted-keyed/cue-review.json'),'utf8'));
  assert.equal(cue.items.length,110);
  assert.ok(cue.items.every(x=>x.disposition==='pending'&&/^[a-f0-9]{64}$/.test(x.itemSha256)));
  assert.equal(cue.items.filter(x=>x.priority==='critical').length,0);
  assert.ok(cue.items.some(x=>x.priority==='major'));
  assert.ok(cue.items.every(x=>x.disposition==='pending'));
  assert.ok(cue.items.every(x=>x.answerLengthRank>=1&&x.answerLengthRank<=4));
  assert.ok(!blind.items.some(x=>'answerLengthRank' in x||'scored' in x||'experimental' in x));
  assert.equal(fs.statSync(path.join(dest,'restricted-keyed/cue-review.json')).mode&0o777,0o600);

  assert.equal((ledger.match(/"pending"/g)||[]).length,110);
  assert.throws(()=>build(dest),/empty/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('review exporter never writes packets inside publicly tracked repository',()=>{
 assert.throws(()=>build(path.join(__dirname,'..','public-site','nppe-review')),/outside the public repository/);
});

test('review exporter rejects a symlink that resolves into the repository',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-link-'));
 try{
  fs.symlinkSync(path.resolve(__dirname,'..'),path.join(temp,'linked-repo'),'dir');
  assert.throws(()=>build(path.join(temp,'linked-repo','nppe-private-packets')),/Symlink output/);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});

test('review exporter rejects a symlink even if it points to a seemingly private directory',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-private-link-'));
 try{
  fs.mkdirSync(path.join(temp,'real-private'));
  fs.symlinkSync(path.join(temp,'real-private'),path.join(temp,'shortcut'),'dir');
  assert.throws(()=>build(path.join(temp,'shortcut','packets')),/Symlink output/);
  assert.equal(fs.readdirSync(path.join(temp,'real-private')).length,0);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
