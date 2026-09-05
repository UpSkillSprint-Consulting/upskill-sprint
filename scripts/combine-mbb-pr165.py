from pathlib import Path
import os, subprocess, re
root=Path(os.environ['MBB_ROOT']);os.chdir(root)
BASE='01ca49f58ac6405e2f9f46f6e18caa3ea4fe06eb'
B1='e88f28d29b3c8d16f53420cf23703761e275da9a'
B2='dc4e1588900647aab46d694c0caa17f2165e9efb'
def src(ref,name): return subprocess.check_output(['git','show',f'{ref}:{name}'])
def replace(text,old,new,n=1):
    assert text.count(old)==n, (old[:90],text.count(old),n)
    return text.replace(old,new)
paths=subprocess.check_output(['git','diff','--name-only',BASE,B1],text=True).splitlines()
shared={'test-bank-mbb-set2.js','test-bank.html','test-bank-feedback-loop.js','scripts/build-mbb160-assets.mjs'}
for name in paths:
    if name.startswith('.github/') or name in shared: continue
    p=Path(name);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(src(B1,name))
name='test-bank-mbb-set2.js'
a=src(B1,name).decode();b=src(B2,name).decode()
pattern=r'  var batch1=\[[\s\S]*?(?=  var batch2=\[)'
segment=re.search(pattern,a).group()
b=re.sub(pattern,lambda m:segment,b,count=1)
p=r'  function visual\([\s\S]*?(?=  function visual2\()'
b=re.sub(p,lambda m:re.search(p,a).group(),b,count=1)
Path(name).write_text(b)
name='test-bank.html';s=src(B2,name).decode()
s=replace(s,'<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css">\n<link rel="stylesheet" href="test-bank-mbb-batch1-review.css">')
s=replace(s,'<script src="/test-bank-mbb-set2.js"></script>','<script src="/test-bank-mbb-set2.js"></script>\n<script src="/test-bank-mbb-batch1-review.js"></script>')
s=replace(s,"return '<div class=\"tb-quiz\" data-question-id=\"'+esc(questionId)+'\">", "return '<div class=\"tb-quiz'+(window.__TBMbbBatch1Review&&window.__TBMbbBatch1Review.applies(q)?' tb-mbb-batch1':'')+'\" data-question-id=\"'+esc(questionId)+'\">")
s=replace(s,"(window.__MBBBatch2UI && window.__MBBBatch2UI.isQuestion(q) ? ","(window.__TBMbbBatch1Review && window.__TBMbbBatch1Review.applies(q) ? window.__TBMbbBatch1Review.render(q,renderQuestionChart,esc) : window.__MBBBatch2UI && window.__MBBBatch2UI.isQuestion(q) ? ")
s=replace(s,"  function wireQuiz(){\n    var host=document.getElementById('tb-overview');","  function wireQuiz(){\n    var host=document.getElementById('tb-overview');\n    if(window.__TBMbbBatch1Review)window.__TBMbbBatch1Review.wire(host);")
Path(name).write_text(s)
name='test-bank-feedback-loop.js';s=src(B2,name).decode()
s=replace(s,"return '<article class=\"tb-review-card\" data-review-status=\"'", "return '<article class=\"tb-review-card' + (window.__TBMbbBatch1Review && window.__TBMbbBatch1Review.applies(question) ? ' tb-mbb-batch1-card' : '') + '\" data-review-status=\"'")
s=replace(s,"'<div class=\"tb-review-stem\">' + esc(question.stem) + '</div>' + auditedEvidence(question)","(window.__TBMbbBatch1Review && window.__TBMbbBatch1Review.applies(question) ? window.__TBMbbBatch1Review.review(question) : '<div class=\"tb-review-stem\">' + esc(question.stem) + '</div>') + auditedEvidence(question)",2)
Path(name).write_text(s)
name='scripts/build-mbb160-assets.mjs';s=src(B2,name).decode()
s=replace(s,"responsive:question.batch===2?", "responsive:question.batch===1?{container:'horizontal overflow for wide tables and SVGs; preserve legible labels',minimumChartWidthPx:560,viewBoxDriven:chart.type!=='data-table'}:question.batch===2?")
s=replace(s,"  if(onlyBatch && batchKey!==onlyBatch) continue;", "  if(onlyBatch && batchKey!==onlyBatch) continue;\n  if(batchNumber===1)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch1-review.js'),'utf8'));\n  const batchStyles=styles+(batchNumber===1?fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch1-review.css'),'utf8'):'');")
s=replace(s,"readableLabels:question.batch===2?", "readableLabels:question.batch===1?null:question.batch===2?")
s=replace(s,"scaleAndUnitsReviewed:question.batch===2?", "scaleAndUnitsReviewed:question.batch===1?null:question.batch===2?")
s=replace(s,"breakpoints:['desktop','tablet','mobile'],", "breakpoints:batchNumber===1?[]:['desktop','tablet','mobile'],")
s=replace(s,"      validationStatus:'passed'", "      ...(batchNumber===1?{renderedEvidence:'docs/audits/mbb-set2-batch1.md',scope:'This generator checks data and markup only; it does not verify responsive layouts.'}:{}),\n      validationStatus:batchNumber===1?'semantic-checks-passed':'passed'")
s=replace(s,"    cards.push(`<article class=\"fallback-card\"", "    const batch1Prompt=batchNumber===1?dom.window.__TBMbbBatch1Review.render(question,dom.window.__TB.renderQuestionChart,escapeHtml).replace(/<input[^>]*type=\"range\"[^>]*>/g,''):null;\n    cards.push(`<article class=\"fallback-card${batchNumber===1?' tb-mbb-batch1':''}\"")
s=replace(s,"</strong></header>${question.batch===2?", "</strong></header>${batchNumber===1?batch1Prompt:question.batch===2?")
s=replace(s,"<style>${styles}", "<style>${batchStyles}")
Path(name).write_text(s)
print('Integrated committed Batch 1 into Batch 2 without temporary transport/workflow files.')
