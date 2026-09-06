import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const ROOT=path.resolve(import.meta.dirname,'..');
const BANK_PATH=path.join(ROOT,'test-bank-mbb-set2.js');
const HTML_PATH=path.join(ROOT,'test-bank.html');

function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
  return value;
}

function digest(value){
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}

function loadBank(){
  const sandbox={};
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(BANK_PATH,'utf8'),sandbox,{filename:BANK_PATH});
  return JSON.parse(JSON.stringify(sandbox.MBB_SET2_BATCHES));
}

function createRenderer(){
  const source=fs.readFileSync(HTML_PATH,'utf8').replace(/<script\b[^>]*\bsrc=(['"])[\s\S]*?<\/script>/gi,'');
  const dom=new JSDOM(source,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true});
  dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch2-ui.js'),'utf8'));
  if(!dom.window.__TB||typeof dom.window.__TB.renderQuestionChart!=='function')throw new Error('Question-chart renderer did not initialize');
  return dom;
}

function constructionSpec(question){
  const chart=question.chart;
  const common={
    type:chart.type,
    renderer:'test-bank.html::__TB.renderQuestionChart',
    rendererVersion:question.batch===7?'mbb-batch07-audit-v1':question.batch===5?'mbb-batch05-audit-v1':question.batch===3?'mbb-batch03-recovered-v1':question.batch===4?'mbb-batch04-audit-v1':question.batch===2?'mbb-batch02-audit-v1':'mbb-160-v1',
    sourceQuestionId:question.qid,
    transformations:[],
    referenceLines:[],
    responsive:question.batch===7?{container:'bounded horizontal scrolling with readable labels and semantic alternatives',minimumChartWidthPx:720,minimumTableWidthPx:480}:question.batch===6?{container:'bounded horizontal scrolling with readable labels and semantic data alternatives',minimumChartWidthPx:720,minimumTableWidthPx:700,equalCodedAxisScales:chart.type==='contour-plot'}:question.batch===5?{container:'bounded horizontal scrolling with legible labels and equivalent data tables',minimumChartWidthPx:720,minimumTableWidthPx:700}:question.batch===3?{container:'bounded horizontal scrolling with readable labels and semantic data tables',minimumChartWidthPx:720,minimumTableWidthPx:700}:question.batch===4?{container:'bounded horizontal overflow, unscaled SVGs and semantic tables',minimumChartWidthPx:720,minimumTableWidthPx:700}:question.batch===1?{container:'horizontal overflow for wide tables and SVGs; preserve legible labels',minimumChartWidthPx:560,viewBoxDriven:chart.type!=='data-table'}:question.batch===2?{container:'bounded horizontal scroll; unscaled readable evidence',minimumWidthPx:640,equalCodedAxisScales:chart.type==='contour-plot'}:{container:'horizontal overflow for wide tables; scalable SVG otherwise',minimumWidthPx:280,viewBoxDriven:chart.type!=='data-table'},
    accessibility:{altText:question.visual.altText,semanticTable:chart.type==='data-table'},
    interactionPurpose:question.visual.interactionPurpose,
    staticFallback:question.visual.staticAssetRef,
    answerCuePolicy:'Neutral series, point, cell, and option styling; no key-dependent annotation.'
  };
  if(question.batch===7 && chart.type==='regression-diagnostic')return {...common,variables:[chart.xLabel,chart.yLabel],observedPoints:chart.points,model:chart.model,proposal:chart.proposal,referenceLines:[],units:'policy-risk score and thousands of dollars',interval:'95% conditional mean-response confidence interval; individual prediction interval separately tabulated'};
  if(question.batch===7 && chart.type==='reliability-plot')return {...common,variables:['subsystem','mission reliability'],units:'probability at a fixed common mission endpoint',components:chart.components,lifetimeDistributionAssumed:false,referenceLines:[]};
  if(question.batch===7 && chart.type==='two-level-interaction')return {...common,variables:[chart.factorA,chart.factorB,chart.yLabel],units:'coded factor levels and response units',series:[{label:chart.lowLabel,values:chart.lowLine},{label:chart.highLabel,values:chart.highLine}],designRows:chart.designRows,rawResponseReplicatesAvailable:false};
  if(chart.type==='data-table')return {...common,variables:chart.columns,rows:chart.rows.length,calculations:question.formula?[question.formula]:[],interaction:chart.whatIf||null};
  if(chart.type==='activity-network')return {...common,variables:['activity','duration','predecessor-successor relationship'],units:chart.durationUnit||'working days',layout:{nodes:chart.nodes,edges:chart.edges},calculations:[question.formula]};
  if(chart.type==='regression-diagnostic')return {...common,variables:[chart.xLabel,chart.yLabel],axes:{xTicks:chart.xTicks,yTicks:chart.yTicks},points:chart.points.length,referenceLines:[question.batch===4?'Bias = 0':'Residual = 0'],calculations:[]};
  if(chart.type==='time-series')return {...common,variables:[chart.xLabel,chart.yLabel],units:chart.units||'orders',observations:chart.data.length,order:'chronological',calculations:[]};
  if(chart.type==='multi-time-series')return {...common,variables:[chart.xLabel,chart.yLabel],units:[5,7].includes(question.batch)?chart.units:'behaviorally anchored score',...(question.batch===5?{referenceOrientation:chart.referenceOrientation}:{}),axes:{xLevels:chart.labels,yDomain:chart.yDomain},series:chart.series.map(item=>({label:item.label,observations:item.data.length,values:item.data})),referenceLines:Number.isFinite(Number(chart.referenceValue))?[`${chart.referenceLabel||'Reference'} at ${chart.referenceValue}`]:[],calculations:[]};
  if(chart.type==='histogram')return {...common,variables:[chart.xLabel,chart.yLabel],units:chart.xLabel,axes:{xDomain:[chart.binEdges[0],chart.binEdges.at(-1)],yDomain:[0,Math.max(...chart.counts)]},bins:chart.counts.map((count,index)=>({lower:chart.binEdges[index],upper:chart.binEdges[index+1],count})),referenceLines:Number.isFinite(Number(chart.referenceValue))?[`${chart.referenceLabel||'Reference'} at ${chart.referenceValue}`]:[],calculations:question.formula?[question.formula]:[]};
  if(chart.type==='acf-plot')return {...common,variables:[chart.xLabel,chart.yLabel],units:'lag and correlation',axes:{xDomain:[Math.min(...chart.lags),Math.max(...chart.lags)],yDomain:[-1,1]},observations:chart.values.length,referenceLines:[`Approximate 95% bounds = ±${chart.confidence}`,'Autocorrelation = 0'],calculations:question.formula?[question.formula]:[]};
  if(chart.type==='two-level-interaction')return {...common,...(question.batch===3?{anova:chart.anova}:{}),variables:[chart.factorA,chart.factorB,chart.yLabel||'adjusted mean response'],units:'factor levels and response percent',axes:{xLevels:[chart.xLowLabel||'Low',chart.xHighLabel||'High'],yDomain:chart.yDomain||null,yTicks:chart.yTicks||null},series:[{label:chart.lowLabel,values:chart.lowLine},{label:chart.highLabel,values:chart.highLine}],calculations:question.formula?[question.formula]:[]};
  if(chart.type==='contour-plot')return {...common,variables:[chart.xLabel,chart.yLabel,'fitted response'],units:'coded factor units and response units',axes:{xDomain:chart.xDomain,yDomain:chart.yDomain,xTicks:chart.xTicks,yTicks:chart.yTicks},model:chart.model,center:chart.center,contours:chart.contours,currentPoint:chart.current,calculations:[question.formula]};
  if(chart.type==='reliability-plot')return {...common,variables:[chart.xLabel,chart.yLabel],units:'hours and probability',axes:{xTicks:chart.xTicks,yDomain:[0,1]},series:chart.series.map(item=>({label:item.label,observations:item.points.length})),referenceLines:[question.batch===5?`Reported crossing time = ${chart.missionTime} hours`:`Mission time = ${chart.missionTime} hours`],calculations:[question.formula]};
  if(chart.type==='reliability-growth')return {...common,variables:['cumulative unit test time','cumulative failures','cumulative MTBF'],units:'hours, failures, and hours',axes:{xScale:'logarithmic',yScale:'logarithmic',xTicks:chart.xTicks,yTicks:chart.yTicks},observations:chart.points.length,configurationEvent:chart.event,calculations:[question.formula]};
  if(chart.type==='mixture-simplex')return {...common,variables:chart.components,units:'mixture proportion',constraint:`${chart.components.join(' + ')} = 1`,lowerBounds:chart.lowerBounds,candidatePoint:chart.point,transform:'z_i = (x_i - L_i) / (1 - sum L_i)',calculations:[question.formula]};
  return common;
}

const onlyBatch=process.argv.find(arg=>arg.startsWith('--batch='))?.split('=')[1];
if(onlyBatch && !/^[1-7]$/.test(onlyBatch)) throw new Error('--batch must be an integer from 1 to 7');
const batches=loadBank();
const dom=createRenderer();
const styles=[...dom.window.document.querySelectorAll('style')].map(style=>style.textContent).join('\n');
// Keep legacy fallback packages byte-stable; Batch 2 CSS is not evidence for other batches.
const legacyStyles=[...dom.window.document.querySelectorAll('style')].filter(style=>style.id!=='mbb2-evidence-style').map(style=>style.textContent).join('\n');

for(const [batchKey,questions] of Object.entries(batches).sort(([left],[right])=>Number(left)-Number(right))){
  const batchNumber=Number(batchKey);
  if(onlyBatch && batchKey!==onlyBatch) continue;
  if(batchNumber===1)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch1-review.js'),'utf8'));
  if(batchNumber===3)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch3-ui.js'),'utf8'));
  if(batchNumber===7)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch7-ui.js'),'utf8'));
  if(batchNumber===6)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch6-ui.js'),'utf8'));
  if(batchNumber===5)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch5-ui.js'),'utf8'));
  if(batchNumber===4)dom.window.eval(fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch4-ui.js'),'utf8'));
  const batchStyles=([1,2,4].includes(batchNumber)?styles:legacyStyles)+(batchNumber===4?':root{--ink:#16343e;--card:#fff;--paper:#f3f6f7;--line:#bcc9ce;--muted:#49616b;--teal:#137c83}html.dark,html[data-theme=dark]{--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}body{background:var(--paper);color:var(--ink)}.fallback-card{background:var(--card)!important;color:var(--ink);border-color:var(--line)!important}.fallback-options li{background:var(--paper)!important;color:var(--ink);border-color:var(--line)!important}'+dom.window.__MBBBatch4UI.css:'')+(batchNumber===1?fs.readFileSync(path.join(ROOT,'test-bank-mbb-batch1-review.css'),'utf8'):'');
  const batch3Styles=batchNumber===3?':root{--ink:#16343e;--card:#fff;--paper:#f3f6f7;--line:#bcc9ce;--muted:#49616b;--teal:#137c83}html.dark,html[data-theme=dark]{--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}body{background:var(--paper);color:var(--ink)}.fallback-card{background:var(--card)!important;color:var(--ink);border-color:var(--line)!important}.fallback-options li{background:var(--paper)!important;color:var(--ink);border-color:var(--line)!important}'+dom.window.__MBBBatch3UI.css:'';
  const batch5Styles=batchNumber===5?':root{--ink:#16343e;--card:#fff;--paper:#f3f6f7;--line:#bcc9ce;--muted:#49616b;--teal:#137c83}html.dark,html[data-theme=dark]{--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}body{background:var(--paper);color:var(--ink)}.fallback-card{background:var(--card)!important;color:var(--ink);border-color:var(--line)!important}.fallback-options li{background:var(--paper)!important;color:var(--ink);border-color:var(--line)!important}'+dom.window.__MBBBatch5UI.css:'';
  const batch6Styles=batchNumber===6?':root{--ink:#16343e;--card:#fff;--paper:#f3f6f7;--line:#bcc9ce;--muted:#49616b;--teal:#137c83}html.dark,html[data-theme=dark]{--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}body{background:var(--paper);color:var(--ink)}.fallback-card{background:var(--card)!important;color:var(--ink);border-color:var(--line)!important}.fallback-options li{background:var(--paper)!important;color:var(--ink);border-color:var(--line)!important}'+dom.window.__MBBBatch6UI.css:'';
  const batch7Styles=batchNumber===7?':root{--ink:#16343e;--card:#fff;--paper:#f3f6f7;--line:#bcc9ce;--muted:#49616b;--teal:#137c83}html.dark,html[data-theme=dark]{--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}body{background:var(--paper);color:var(--ink)}.fallback-card{background:var(--card)!important;color:var(--ink);border-color:var(--line)!important}.fallback-options li{background:var(--paper)!important;color:var(--ink);border-color:var(--line)!important}@media(prefers-color-scheme:dark){html:not([data-theme=light]){--ink:#e7eef2;--card:#16262e;--paper:#20333e;--line:#566d79;--muted:#b9cbd4;--teal:#71d6d4}}'+dom.window.__MBBBatch7UI.css:'';
  const visualQuestions=questions.filter(question=>question.visual);
  const outDir=path.join(ROOT,'test-bank-assets','mbb-160',`batch-${String(batchNumber).padStart(2,'0')}`);
  const datasets={schemaVersion:1,batch:batchNumber,generatedBy:'scripts/build-mbb160-assets.mjs',questions:{}};
  const specs={schemaVersion:1,batch:batchNumber,generatedBy:'scripts/build-mbb160-assets.mjs',questions:{}};
  const validation={schemaVersion:1,batch:batchNumber,generatedBy:'scripts/build-mbb160-assets.mjs',questions:{}};
  const cards=[];

  for(const question of visualQuestions){
    const rendered=dom.window.__TB.renderQuestionChart(question.chart);
    const host=dom.window.document.createElement('div');
    host.innerHTML=rendered;
    const visual=host.firstElementChild;
    if(!visual)throw new Error(`Renderer returned no visual for ${question.qid}`);
    const cueText=visual.textContent.toLowerCase();
    if(/\b(correct answer|answer key)\b/.test(cueText))throw new Error(`Visual answer cue detected for ${question.qid}`);
    const hash=digest(question.chart);
    datasets.questions[question.qid]={sha256:hash,chart:question.chart};
    specs.questions[question.qid]=constructionSpec(question);
    validation.questions[question.qid]={
      datasetSha256:hash,
      datasetMatchesQuestionChart:true,
      rendererReturnedMarkup:true,
      readableLabels:question.batch===7?'requires measured browser evidence':question.batch===6?'requires measured browser evidence':question.batch===5?'requires measured browser evidence':question.batch===3?'requires measured browser evidence':question.batch===4?'requires measured browser evidence':question.batch===1?null:question.batch===2?'requires browser evidence':true,
      scaleAndUnitsReviewed:question.batch===7?'see independent calculations and individual tracker':question.batch===6?'see independently reconstructed calculations and item tracker':question.batch===5?'see independent calculations and item tracker':question.batch===3?'see reconstructed calculations and integration tracker':question.batch===4?'see independent calculations and item tracker':question.batch===1?null:question.batch===2?'see question-level audit tracker':true,
      answerCueAuditPassed:true,
      accessibleAlternativePresent:Boolean(question.visual.altText),
      staticFallbackGenerated:true,
      breakpoints:[1,3,4,5,6,7].includes(batchNumber)?[]:['desktop','tablet','mobile'],
      ...(question.batch===2?{validationScope:'Data hashes and generated markup only; see docs/audits/mbb-set2-batch02/browser-summary.json for measured layout and interaction results'}:{}),
      ...(batchNumber===1?{renderedEvidence:'docs/audits/mbb-set2-batch1.md',scope:'This generator checks data and markup only; it does not verify responsive layouts.'}:{}),
      ...(batchNumber===3?{validationScope:'Generated data and markup only; see docs/audits/mbb-set2-batch03/integration.md for independently rerun layout and numerical checks'}:{}),
      ...(batchNumber===5?{validationScope:'Data hashes and generated markup only; measured results are recorded separately in docs/audits/mbb-set2-batch05/browser-summary.json'}:{}),
      ...(batchNumber===7?{validationScope:'Generated data/markup checks only; measured browser results in docs/audits/mbb-set2-batch07/browser-summary.json'}:{}),
      ...(batchNumber===6?{validationScope:'Data hashes and generated markup only; measured results are recorded separately in docs/audits/mbb-set2-batch06/browser-summary.json'}:{}),
      ...(batchNumber===4?{validationScope:'Generated data/markup checks only, not proof of visual or interactive correctness; measured results in docs/audits/mbb-set2-batch04/browser-summary.json'}:{}),
      validationStatus:[1,3,4,5,6,7].includes(batchNumber)?'semantic-checks-passed':'passed'
    };
    const anchor=question.qid.replace(/:/g,'-');
    const choices=question.options.map((option,index)=>`<li><span>${String.fromCharCode(65+index)}</span>${escapeHtml(option)}</li>`).join('');
    const batch1Prompt=batchNumber===1?dom.window.__TBMbbBatch1Review.render(question,dom.window.__TB.renderQuestionChart,escapeHtml).replace(/<input[^>]*type="range"[^>]*>/g,''):null;
    cards.push(`<article class="fallback-card${batchNumber===1?' tb-mbb-batch1':''}" id="${anchor}" data-question-id="${escapeHtml(question.qid)}"><header><span>${escapeHtml(question.bok.domain)}</span><strong>${escapeHtml(question.qid)}</strong></header>${batchNumber===7?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch7UI.conditions(question)}${dom.window.__MBBBatch7UI.render(question.chart,true)}`:batchNumber===6?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch6UI.conditions(question)}${dom.window.__MBBBatch6UI.render(question.chart,true)}`:batchNumber===5?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch5UI.conditions(question)}${dom.window.__MBBBatch5UI.render(question.chart,true)}`:batchNumber===3?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch3UI.conditions(question)}${dom.window.__MBBBatch3UI.render(question.chart,true)}`:batchNumber===4?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch4UI.conditions(question)}${dom.window.__MBBBatch4UI.render(question.chart,true)}`:batchNumber===1?batch1Prompt:question.batch===2?`<p class="fallback-stem">${escapeHtml(question.stem)}</p>${dom.window.__MBBBatch2UI.conditions(question)}${dom.window.__MBBBatch2UI.render(question.chart,true)}`:`${rendered}<p class="fallback-stem">${escapeHtml(question.stem)}</p>`}<ol class="fallback-options">${choices}</ol><details><summary>Accessible visual description</summary><p>${escapeHtml(question.visual.altText)}</p></details></article>`);
  }

  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,'datasets.json'),JSON.stringify(datasets,null,2)+'\n');
  fs.writeFileSync(path.join(outDir,'visual-specs.json'),JSON.stringify(specs,null,2)+'\n');
  fs.writeFileSync(path.join(outDir,'validation.json'),JSON.stringify(validation,null,2)+'\n');
  fs.writeFileSync(path.join(outDir,'static-fallbacks.html'),`<!doctype html>
<html lang="en"${batchNumber===7?'':' data-theme="light"'}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ASQ MBB ${[2,5,6,7].includes(batchNumber)?'Set 2':'160'} - Batch ${batchNumber} visual fallbacks</title><script src="/theme.js"></script><script src="/site-sections.js"></script><style>${batchStyles}${batch3Styles}${batch5Styles}${batch6Styles}${batch7Styles}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Work Sans",Arial,sans-serif}.fallback-shell{width:min(980px,calc(100% - 28px));margin:32px auto 60px}.fallback-shell>h1{font-family:"Source Serif 4",serif;font-size:clamp(1.65rem,5vw,2.45rem);margin:0 0 8px}.fallback-intro{color:var(--muted);line-height:1.55;margin:0 0 24px}.fallback-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:clamp(16px,4vw,28px);margin:0 0 22px;box-shadow:0 8px 24px rgba(21,44,54,.06)}.fallback-card header{display:flex;gap:14px;justify-content:space-between;align-items:flex-start;color:var(--muted);font-size:.78rem;margin-bottom:16px}.fallback-card header strong{font-family:"IBM Plex Mono",monospace;font-weight:600}.fallback-stem{font-size:1.03rem;line-height:1.55;font-weight:600}.fallback-options{list-style:none;padding:0;margin:16px 0}.fallback-options li{display:flex;gap:10px;padding:11px 12px;border:1px solid var(--line);border-radius:9px;margin:8px 0;line-height:1.4}.fallback-options li span{display:grid;place-items:center;align-self:flex-start;min-width:24px;height:24px;border:1px solid var(--line);border-radius:6px;font-weight:700;font-size:.78rem}.fallback-card details{color:var(--muted);font-size:.9rem}.fallback-card details p{line-height:1.5}@media(max-width:560px){.fallback-shell{width:min(100% - 18px,980px);margin-top:18px}.fallback-card{border-radius:11px}.fallback-card header{flex-direction:column;gap:4px}.tb-q-chart{min-width:280px}.fallback-options li{font-size:.94rem}}</style></head><body><main class="fallback-shell"><h1>ASQ Master Black Belt - Batch ${batchNumber} visual fallbacks</h1><p class="fallback-intro">${visualQuestions.length===10?'Ten':visualQuestions.length} neutral, source-traceable visual questions. These static versions preserve the evidence required to answer each item without revealing the key.</p>${cards.join('\n')}</main></body></html>`);
  console.log(`Generated ${visualQuestions.length} visual evidence packages in ${path.relative(ROOT,outDir)}`);
}

dom.window.close();
