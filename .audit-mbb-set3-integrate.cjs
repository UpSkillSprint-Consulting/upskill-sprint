const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const bankFile='test-bank-mbb-set3.js',source=fs.readFileSync(bankFile,'utf8'),ctx={window:{}};vm.runInNewContext(source,ctx);
const qs=JSON.parse(JSON.stringify(ctx.window.MBB_SET3));
qs[8].chart.altText='P1: $500,000, 80%, risk 2; P2: $900,000, 50%, risk 4; P3: $300,000, 95%, risk 1; P4: $700,000, 65%, risk 3. Benefits are conditional on success and the separate risk scale is 1 to 5.';
const starts=[...source.matchAll(/^  \{$/gm)].map(m=>m.index),suffix=source.slice(starts[25]);assert.equal(hash(suffix),'b55c09425e0b5c6a706127aa9eb5181a58e0983690b880b65113fe63e3014025');
fs.writeFileSync(bankFile,source.slice(0,starts[0])+qs.slice(0,25).map(q=>JSON.stringify(q,null,2).split('\n').map(l=>'  '+l).join('\n')).join(',\n')+',\n'+suffix);
let html=fs.readFileSync('test-bank.html','utf8');
const script='<script src="/test-bank-mbb-set3-batch1-ui.js"></script>';
if(!html.includes(script)){const anchor='<script src="/test-bank-mbb-set3.js"></script>';assert.ok(html.includes(anchor));html=html.replace(anchor,anchor+'\n'+script);}
const renderer="    if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(q))return window.__MBBSet3Batch1UI.render(q,review);";
if(!html.includes(renderer)){const anchor="  function renderQuestionContent(q,review){\n    if(!q)return '';";assert.ok(html.includes(anchor));html=html.replace(anchor,anchor+'\n'+renderer);}
const wire="    if(window.__MBBSet3Batch1UI)window.__MBBSet3Batch1UI.wire(host);";
if(!html.includes(wire)){const anchor="  function wireQuiz(){\n    var host=document.getElementById('tb-overview');";assert.ok(html.includes(anchor));html=html.replace(anchor,anchor+'\n'+wire);}
fs.writeFileSync('test-bank.html',html);
let feedback=fs.readFileSync('test-bank-feedback-loop.js','utf8');const rationale="    if(window.__MBBSet3Batch1UI&&window.__MBBSet3Batch1UI.isQuestion(question))return window.__MBBSet3Batch1UI.rationales(question);";
if(!feedback.includes(rationale)){const anchor='  function auditedRationales(question) {';assert.ok(feedback.includes(anchor));feedback=feedback.replace(anchor,anchor+'\n'+rationale);}
fs.writeFileSync('test-bank-feedback-loop.js',feedback);
console.log('Integrated Set 3 Q1–25 renderer and preserved Q26–175.');
