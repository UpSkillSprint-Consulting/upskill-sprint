#!/usr/bin/env node
/** Offline NPPE Mock B reviewer-packet exporter. No network or production writes.
 * Answer keys and protected question text must NEVER be committed to a public repo.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const stable=x=>JSON.stringify(x);
function items(){
 const sandbox={window:{}};vm.createContext(sandbox);
 for(let n=1;n<=11;n++)vm.runInContext(fs.readFileSync(path.join(root,`test-bank-nppe-mock-b-batch${n}.js`),'utf8'),sandbox,{filename:`mock-b-batch${n}.js`,timeout:5000});
 const list=Array.from(sandbox.window.NPPE_MOCK_B||[],x=>JSON.parse(JSON.stringify(x)));
 if(list.length!==110||new Set(list.map(x=>x.qid)).size!==110)throw Error('Mock B must contain 110 unique items');
 for(let i=0;i<110;i++){const q=list[i],id=`NPPE-${String(i+281).padStart(3,'0')}`;
  if(q.legacyId!==id||q.qid!==`nppe:set-1:mock-b:${i+281}`||!Number.isInteger(q.version)||q.version<1||q.options?.length!==4||q.optionRationales?.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||!Array.isArray(q.sources)||!q.sources.length)throw Error('Invalid '+id);
  if(q.form!=='set-1-mock-b'||q.authorSet!==1||q.set!==1||q.bank!=='mock'||q.author!=='ChatGPT'||q.original!==true||q.releaseStatus!=='held'||typeof q.stem!=='string'||!q.stem.trim()||q.options.some(o=>typeof o!=='string'||!o.trim())||new Set(q.options).size!==4)throw Error('Invalid held Mock B provenance '+id);
  const simulated=new Set([282,296,320,337,349,355,382,386,389,390]).has(i+281);
  if(q.scored!==!simulated||q.experimental!==simulated)throw Error('Unauthorized Mock B scoring-role change '+id);
  if(!q.sources.some(x=>x.sourceType==='official-blueprint')||!q.sources.some(x=>x.sourceType!=='official-blueprint')||q.sources.some(x=>!x.sourceType||!x.title||!x.locator||!x.url))throw Error('Invalid source provenance '+id);
 }
 if(list.filter(x=>x.scored&&!x.experimental).length!==100||list.filter(x=>x.experimental&&!x.scored).length!==10)throw Error('Scored/experimental roles changed');
 return list;
}
const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
function csv(rows){return rows.map(r=>r.map(quote).join(',')).join('\n')+'\n';}
function build(out){
 if(!out)throw Error('Supply --out <directory outside repository>');
 const dest=path.resolve(out),relative=path.relative(root,dest);
 // Reject every symlink component, even if its target currently appears safe:
 // replacing the link later could redirect private reviewer files into a public tree.
 for(let part=dest;;part=path.dirname(part)){
  let st;try{st=fs.lstatSync(part);}catch(e){if(e.code!=='ENOENT')throw e;}
  if(st?.isSymbolicLink())throw Error('Symlink output path is forbidden');
  if(part===path.dirname(part))break;
 }
 if(dest===root||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Reviewer packets must be generated outside the public repository');
 if(fs.existsSync(dest)&&fs.readdirSync(dest).length)throw Error('Output directory must be empty');
 // Resolve symlinks in the nearest existing parent before creating any sensitive output.
 let ancestor=dest;
 while(!fs.existsSync(ancestor)){const parent=path.dirname(ancestor);if(parent===ancestor)throw Error('No existing output parent');ancestor=parent;}
 const resolved=path.resolve(fs.realpathSync(ancestor),path.relative(ancestor,dest));
 const resolvedRelative=path.relative(fs.realpathSync(root),resolved);
 if(!resolvedRelative.startsWith('..'+path.sep)&&resolvedRelative!=='..')throw Error('Symlink output would enter public repository');
 const dirty=cp.execFileSync('git',['status','--porcelain','--untracked-files=no'],{cwd:root,encoding:'utf8'}).trim();
 if(dirty)throw Error('Refusing to label modified tracked sources with a clean commit SHA');
 const list=items(),revision=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const manifest={schema:'nppe-mock-b-review-v1',sourceRevision:revision,form:'set-1-mock-b',itemCount:110,scored:100,simulatedUnscored:10,items:[]};
 const blind=[],keyed=[],cueReview=[],decisions=[];
 const legalRows=[['item_id','qid','version','item_sha256','jurisdiction','source_type','source_title','source_locator','source_url','effective_date_verified','access_verified','legal_reviewer','qualification','independence_conflict','reviewed_at','severity','disposition','evidence']];
 const editorialRows=[['item_id','qid','version','item_sha256','blueprint','difficulty','cognitive_level','blind_best_answer_index','option_A_assessment','option_B_assessment','option_C_assessment','option_D_assessment','categorical_wrong_count','correct_option_length_rank','editor_reviewer','qualification','independence_conflict','reviewed_at','severity','disposition','adjudication_reference','evidence']];
 const headers=['item_id','qid','version','item_sha256','reviewer_role','reviewer_name','qualifications','independence_conflict','review_date','evidence_reviewed','one_best_answer','distractors','jurisdiction_currency','blueprint_fit','fairness_accessibility','overlap','difficulty_cognition','severity','disposition','findings','adjudicator','adjudication_evidence'];
 const ledger=[headers];
 for(const q of list){
  const digest=sha(stable(q)),base={id:q.legacyId,qid:q.qid,version:q.version,sha256:digest,blueprint:q.blueprint,jurisdiction:q.jurisdiction,learningObjective:q.learningObjective,difficulty:q.difficulty,cognitiveLevel:q.cognitiveLevel,stem:q.stem,options:q.options};
  blind.push(base);
  keyed.push({...base,scored:q.scored,simulatedUnscored:q.experimental,answerIndex:q.answer,correctOption:q.options[q.answer],optionRationales:q.optionRationales,keyPoint:q.keyPoint,trap:q.trap,sources:q.sources,questionFamily:q.questionFamily});
  manifest.items.push({id:q.legacyId,qid:q.qid,version:q.version,sha256:digest,scored:q.scored,simulatedUnscored:q.experimental});
  const absolute=/\b(always|never|every|only|automatically|solely|immediately|entirely|cannot|regardless of)\b/i;
  const optionLen=q.options.map(s=>s.length),answerLen=optionLen[q.answer];
  const wrongAbsolute=q.options.filter((s,i)=>i!==q.answer&&absolute.test(s)).length;
  const pending={status:'pending',disposition:'pending',severity:'unassessed',reviewer:'',qualification:'',independenceDeclaration:'',reviewedAt:'',evidence:''};
  decisions.push({itemId:q.legacyId,version:q.version,itemSha256:digest,
   technical:{...pending,findings:''},
   legal:{...pending,effectiveDate:'',sourceLocator:'',jurisdictionChecked:'',findings:''},
   distractors:{...pending,blindAnswerIndex:null,optionFindings:[null,null,null,null],findings:''},
   fairnessAccessibility:{...pending,findings:''},
   adjudication:{...pending,conflictResolution:'',findings:''}});
  for(const source of q.sources.filter(x=>x.sourceType!=='official-blueprint')){
   legalRows.push([q.legacyId,q.qid,q.version,digest,q.jurisdiction,source.sourceType,source.title,source.locator,source.url,'pending','pending','','','','','unassessed','pending','']);
  }
  editorialRows.push([q.legacyId,q.qid,q.version,digest,q.blueprint,q.difficulty,q.cognitiveLevel,'','','','','',wrongAbsolute,1+optionLen.filter(n=>n<answerLen).length,'','','','','unassessed','pending','','']);
  cueReview.push({id:q.legacyId,version:q.version,itemSha256:digest,answerPosition:q.answer,
    answerLengthRank:1+optionLen.filter(n=>n<answerLen).length,
    lengths:optionLen,categoricalWrongCount:wrongAbsolute,categoricalKey:absolute.test(q.options[q.answer]),
    priority:wrongAbsolute===3&&!absolute.test(q.options[q.answer])?'critical':wrongAbsolute>=2?'major':'editorial',
    disposition:'pending',reviewerNotes:''});

  // All reviewer dispositions begin pending; the exporter never invents an approval.
  ledger.push([q.legacyId,q.qid,q.version,digest,...Array(headers.length-4).fill('')].map((v,i)=>i===18?'pending':v));
 }
 const keyedPacket={sourceRevision:revision,items:keyed};
 // Bind calibration scoring to the exact keyed export, not only to item labels.
 manifest.keyedPacketSha256=sha(JSON.stringify(keyedPacket));
 const write=(name,value)=>{const p=path.join(dest,name);fs.mkdirSync(path.dirname(p),{recursive:true,mode:0o700});fs.chmodSync(path.dirname(p),0o700);fs.writeFileSync(p,value,{mode:0o600});};
 fs.mkdirSync(dest,{recursive:true,mode:0o700});fs.chmodSync(dest,0o700);
 write('blind/questions.json',JSON.stringify({sourceRevision:revision,items:blind},null,2)+'\n');
 write('restricted-keyed/questions.json',JSON.stringify(keyedPacket,null,2)+'\n');
 write('review-ledger.csv',csv(ledger));
 write('restricted-keyed/cue-review.json',JSON.stringify({sourceRevision:revision,items:cueReview},null,2)+'\n');
 write('restricted-keyed/legal-source-review.csv',csv(legalRows));
 write('restricted-keyed/sme-editorial-review.csv',csv(editorialRows));
 write('restricted-keyed/review-decisions.json',JSON.stringify({sourceRevision:revision,items:decisions},null,2)+'\n');
 write('manifest.json',JSON.stringify(manifest,null,2)+'\n');
 write('README.txt','CONFIDENTIAL REVIEW MATERIAL — DO NOT COMMIT OR DEPLOY.\nSource: '+revision+'\nblind/questions.json omits keys and rationales; restricted-keyed/questions.json contains both.\nKeep restricted-keyed separately access-controlled; cue-review.json belongs there too. Blind reviewers should not receive manifest scoring roles if that biases their assessment.\nReview ledgers and cue-review findings start pending. The manifest keyedPacketSha256 binds the private key export. No independent approvals are implied.\n');
 return manifest;
}
if(require.main===module){
 try{const i=process.argv.indexOf('--out');if(i<0||!process.argv[i+1])throw Error('Usage: node scripts/nppe-mock-b-review-packets.cjs --out /private/empty-dir');const m=build(process.argv[i+1]);process.stdout.write('Generated '+m.itemCount+' pinned reviewer records at '+m.sourceRevision+'\n');}
 catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={items,build};
