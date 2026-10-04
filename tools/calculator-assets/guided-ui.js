'use strict';
(() => {
  const D=GuidedData,G=GuidedAnalysis,U=CalculatorUI,el=id=>document.getElementById('guide-'+id),esc=U.esc;
  const settingIds=['goal','design','y','x','group','baseline','target','direction','threshold','lsl','usl','time-order','confidence','unit','filter-column','filter-value','allow-missing','equal-variance'];
  const keys={timeOrder:'time-order',filterColumn:'filter-column',filterValue:'filter-value',allowMissing:'allow-missing',equalVariance:'equal-variance'};
  let datasets=[],active=0,page=0,workbook=null,workbookName='',importVersion=0,output=null;
  const current=()=>datasets[active];
  function settings(){const values={};for(const id of settingIds){const e=el(id);values[id]=e.type==='checkbox'?e.checked:e.value;}return values;}
  function options(){const values=settings();for(const [key,id]of Object.entries(keys))values[key]=values[id];return values;}
  function status(message,error=false){el('data-status').textContent=message;el('data-status').dataset.error=String(error);}
  function invalidate(message='Inputs changed. Run guided analysis to update the evidence.'){
    output=null;el('output').hidden=true;el('status').textContent=message;el('status').dataset.error='false';
    ['report','result-csv','open-analysis'].forEach(id=>el(id).disabled=true);
    ['metrics','charts','tables','notes','next-steps','exclusions'].forEach(id=>el(id).replaceChildren());
  }
  function selectOptions(id,entries,preferred){const e=el(id),value=preferred??e.value;e.replaceChildren();for(const [key,label]of entries)e.add(new Option(label,key));if([...e.options].some(o=>o.value===String(value)))e.value=value;}
  function columns(reset=false){
    const d=current(),entries=d?d.columns.map((name,i)=>[String(i),name]):[];
    for(const id of ['y','x','group'])selectOptions(id,[['','Select a column…'],...entries],reset?'':undefined);
    selectOptions('filter-column',[['','All rows'],...entries],reset?'':undefined);
    if(reset&&d){const profile=D.profile(d).columns,numeric=profile.map((c,i)=>c.type==='Numeric'?i:null).filter(i=>i!=null),category=profile.findIndex(c=>c.type==='Text / category');
      el('y').value=String(numeric[0]??0);el('x').value=String(numeric[1]??(d.columns.length>1?1:0));el('group').value=category>=0?String(category):'';
    }
    values();
  }
  function values(){
    const d=current();if(!d)return;
    const group=el('group').value,filter=el('filter-column').value;
    const groups=group===''?[]:[...new Set(d.rows.map(r=>r[Number(group)].trim()).filter(Boolean))];
    selectOptions('baseline',groups.slice(0,100).map(v=>[v,v]));
    el('filter-value-box').hidden=filter==='';
    if(filter!=='')selectOptions('filter-value',[...new Set(d.rows.map(r=>r[Number(filter)]))].map(v=>[v,v||'(blank)']));
    else selectOptions('filter-value',[]);
  }
  function recommendation(){
    const goal=el('goal').value,paired=goal==='compare'&&el('design').value==='paired';
    el('design-box').hidden=goal!=='compare';el('x-box').hidden=!(paired||['relationship','association'].includes(goal));
    el('group-box').hidden=goal!=='compare'||paired;el('target-box').hidden=goal!=='target';
    el('change-box').hidden=goal!=='compare';el('specs-box').hidden=goal!=='capability';
    el('y-label').textContent=paired?'Before measurement column':goal==='association'?'First category column':'Response / measurement Y column';
    el('x-label').textContent=paired?'After measurement column':goal==='association'?'Second category column':'Predictor X column';
    el('threshold').disabled=el('direction').value==='different';
    let p=G.goals[goal],issue='';
    el('variance-box').hidden=true;
    if(current())try{p=G.plan(current(),options());el('variance-box').hidden=!(goal==='compare'&&!paired&&p.groups.length>2);}catch(error){issue=error.message;}
    el('recommendation').innerHTML=`<strong>${esc(p.method)}</strong><p>${esc(p.why)}</p><ul>${p.assumptions.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>${issue?`<p><b>Before running:</b> ${esc(issue)}</p>`:''}`;
    el('run').disabled=!current();
  }
  function table(){
    const d=current();if(!d)return;const profile=D.profile(d),start=page*25,end=Math.min(d.rows.length,start+25);
    el('profile').innerHTML=`<strong>${d.rows.length.toLocaleString()}</strong> rows · <strong>${d.columns.length}</strong> columns · <strong>${profile.missing}</strong> blank cells · <strong>${profile.duplicates}</strong> duplicate rows retained · <strong>${d.excluded.length}</strong> explicitly excluded · Revision ${d.revision}`;
    el('table').innerHTML=`<table><caption>${esc(d.name)} — rows ${start+1}–${end}; source row numbers retained</caption><thead><tr><th scope="col">Use</th><th scope="col">Row<br>Source</th>${d.columns.map((name,j)=>`<th scope="col"><input data-column="${j}" aria-label="Column ${j+1} name" value="${esc(name)}" maxlength="100"><span class="guide-column-type">${profile.columns[j].type} · ${profile.columns[j].missing} blanks</span></th>`).join('')}</tr></thead><tbody>${d.rows.slice(start,end).map((r,k)=>{const i=start+k,excluded=d.excluded.includes(i);return `<tr data-excluded="${excluded}"><td><input type="checkbox" data-row-use="${i}" aria-label="Include data row ${i+1}" ${excluded?'':'checked'}></td><th scope="row">${i+1}<br><small>${d.sourceRows[i]}</small></th>${r.map((v,j)=>`<td><input data-row="${i}" data-cell="${j}" aria-label="Data row ${i+1}, ${esc(d.columns[j])}" value="${esc(v)}" maxlength="10000" spellcheck="false"></td>`).join('')}</tr>`;}).join('')}</tbody></table>`;
    el('page').textContent=`Rows ${start+1}–${end} of ${d.rows.length}`;el('prev').disabled=page===0;el('next').disabled=end>=d.rows.length;
    el('import-notes').innerHTML=d.notes.map(n=>`<p>${esc(n)}</p>`).join('');
    el('audit').innerHTML=d.audit.length?d.audit.slice(-100).map(a=>`<p>${esc(a.at)} · ${esc(a.action)}</p>`).join(''):'No edits since import.';
    if(d.audit.length>100)el('audit').insertAdjacentHTML('afterbegin','<p>Showing the latest 100 edits. The project and analysis report retain the full history.</p>');
  }
  function refresh(reset=false){
    el('data-tools').hidden=!current();selectOptions('dataset',datasets.map((d,i)=>[String(i),d.name]),String(active));
    if(current()){el('name').value=current().name;table();}columns(reset);recommendation();
  }
  function add(parsed,name,source,headers=el('headers').checked){
    D.check(datasets.length<D.limits.datasets,'This session already has five datasets. Save the workspace, then remove a dataset to add another.');
    const d=D.create(parsed,{headers,name,source});datasets.push(d);active=datasets.length-1;page=0;
    el('allow-missing').checked=false;el('equal-variance').checked=false;el('time-order').checked=false;
    invalidate('Dataset loaded. Review its columns and the suggested method, then run the analysis.');refresh(true);el('import-panel').open=false;
    status(`Added ${d.name}: ${d.rows.length} rows and ${d.columns.length} columns. ${d.notes.length?'Review import notes in the data table.':''}`);
  }
  const guarded=fn=>(...args)=>{try{return fn(...args);}catch(error){status(error.message,true);}};
  function changed(){invalidate();recommendation();}
  settingIds.forEach(id=>{
    el(id).addEventListener('input',()=>{invalidate();if(['select-one','checkbox'].includes(el(id).type)){if(['group','filter-column'].includes(id))values();recommendation();}});
    el(id).addEventListener('change',()=>{if(['group','filter-column'].includes(id))values();changed();});
  });
  el('paste-load').onclick=guarded(()=>{importVersion++;const separator=el('delimiter').value==='tab'?'\t':el('delimiter').value;add(D.parseDelimited(el('paste').value,separator),'Pasted dataset '+(datasets.length+1),'Pasted text');});
  el('file').onchange=async()=>{
    const file=el('file').files?.[0];if(!file)return;const version=++importVersion;workbook=null;el('sheet-box').hidden=true;el('sheet-load').disabled=true;
    try{
      D.check(file.size<=D.limits.file,'Choose a file of at most 10 MB.');status('Reading '+file.name+' locally…');
      if(/\.xlsx$/i.test(file.name)){
        const book=await GuidedXlsx.open(await file.arrayBuffer());if(version!==importVersion)return;
        workbook=book;workbookName=file.name;selectOptions('sheet',book.sheets.map((s,i)=>[String(i),s.name+(s.hidden?' (hidden)':'')]),'0');
        el('sheet-box').hidden=false;el('sheet-load').disabled=false;status('Choose the worksheet to add. Existing datasets are unchanged.');
      }else{
        D.check(/\.(csv|tsv|txt)$/i.test(file.name),'Use .xlsx, .csv, .tsv or .txt. Older .xls and encrypted workbooks must be resaved.');
        const text=await file.text();if(version!==importVersion)return;
        const delimiter=/\.tsv$/i.test(file.name)?'\t':el('delimiter').value==='tab'?'\t':el('delimiter').value;
        add(D.parseDelimited(text,delimiter),file.name,file.name);
      }
    }catch(error){if(version===importVersion)status(error.message,true);}finally{el('file').value='';}
  };
  el('sheet-load').onclick=async()=>{
    if(!workbook)return;const version=++importVersion,book=workbook,index=Number(el('sheet').value),name=workbookName,headers=el('headers').checked;
    el('sheet-load').disabled=true;status('Reading worksheet values…');
    try{const parsed=await book.sheet(index);if(version!==importVersion)return;add(parsed,`${name} · ${book.sheets[index].name}`,`${name} / ${book.sheets[index].name}`,headers);}
    catch(error){if(version===importVersion)status(error.message,true);}finally{if(version===importVersion)el('sheet-load').disabled=false;}
  };
  el('project-file').onchange=async()=>{
    const file=el('project-file').files?.[0];if(!file)return;const version=++importVersion;
    try{
      D.check(file.size<=D.limits.file,'Project file exceeds 10 MB.');const restored=D.restore(await file.text());if(version!==importVersion)return;
      D.check(datasets.length+restored.datasets.length<=D.limits.datasets,'Restoring this project would exceed five datasets. Save and remove an existing dataset first.');
      const offset=datasets.length;datasets.push(...restored.datasets);active=offset+restored.active;page=0;refresh(true);
      // Only known controls and selectable option values can be restored.
      for(const id of ['goal','design','y','x','group','filter-column'])restoreSetting(id,restored.settings[id]);
      values();for(const id of settingIds.filter(id=>!['goal','design','y','x','group','filter-column'].includes(id)))restoreSetting(id,restored.settings[id]);
      invalidate('Workspace restored. Review the settings, then rerun to produce current results.');refresh();el('import-panel').open=false;
      status(`Restored ${restored.datasets.length} datasets. No analysis was run automatically.`);
    }catch(error){if(version===importVersion)status(error.message,true);}finally{el('project-file').value='';}
  };
  function restoreSetting(id,value){
    const e=el(id);if(e.type==='checkbox'){e.checked=value===true;return;}if(typeof value!=='string')return;
    if(e.tagName==='SELECT'){if([...e.options].some(o=>o.value===value))e.value=value;}
    else e.value=value.slice(0,e.maxLength>0?e.maxLength:100);
  }
  el('project-save').onclick=guarded(()=>{
    if(!current())return;const text=JSON.stringify({format:'upskillsprint-guided-workspace',version:1,saved:new Date().toISOString(),datasets,active,settings:settings()},null,2);
    D.check(new Blob([text]).size<=D.limits.file,'This workspace exceeds the 10 MB project limit. Download individual datasets as CSV.');
    U.download('upskillsprint-analysis-workspace.json',text,'application/json');status('Workspace download prepared. Keep this file to restore the datasets and settings.');
  });
  el('dataset').onchange=()=>{active=Number(el('dataset').value);page=0;importVersion++;invalidate();refresh(true);};
  el('name').addEventListener('input',()=>invalidate());
  el('name').onchange=guarded(()=>{
    const d=current(),name=el('name').value.trim();if(!name){el('name').value=d.name;throw new Error('Enter a dataset name.');}D.audit(d,`Renamed dataset: ${d.name} → ${name}`);d.name=name;refresh();
  });
  el('remove').onclick=()=>{
    if(!current()||!window.confirm(`Remove “${current().name}” from this session? Save workspace first if you need these data later.`))return;
    importVersion++;datasets.splice(active,1);active=Math.max(0,active-1);page=0;invalidate('Dataset removed. Select another dataset or import data.');refresh(true);if(!current())el('import-panel').open=true;status('Dataset removed from this session.');
  };
  el('data-csv').onclick=()=>{const d=current();if(d)U.download('guided-analysis-data.csv',D.csv([['Included','Source row',...d.columns],...d.rows.map((r,i)=>[d.excluded.includes(i)?'No':'Yes',d.sourceRows[i],...r])]),'text/csv;charset=utf-8');};
  el('table').addEventListener('input',()=>invalidate());
  el('table').addEventListener('change',guarded(event=>{
    const e=event.target,d=current();if(!d)return;
    if(e.hasAttribute('data-column')){
      const j=Number(e.dataset.column),value=e.value.trim();
      if(!value||d.columns.some((name,k)=>k!==j&&name===value)){e.value=d.columns[j];throw new Error('Column names must be nonempty and unique.');}
      D.audit(d,`Column ${j+1}: ${d.columns[j]} → ${value}`);d.columns[j]=value;
    }else if(e.hasAttribute('data-row-use')){
      const i=Number(e.dataset.rowUse);D.audit(d,`Data row ${i+1}: ${e.checked?'included':'excluded by user'}`);
      d.excluded=d.excluded.filter(v=>v!==i);if(!e.checked)d.excluded.push(i);
    }else if(e.hasAttribute('data-cell')){
      const i=Number(e.dataset.row),j=Number(e.dataset.cell),value=e.value;
      const total=d.rows.reduce((sum,row)=>sum+row.reduce((s,v)=>s+v.length,0),0)-d.rows[i][j].length+value.length;
      if(total>D.limits.text){e.value=d.rows[i][j];throw new Error('Dataset text exceeds 5 million characters.');}
      D.audit(d,`Row ${i+1}, ${d.columns[j]}: ${d.rows[i][j]} → ${value}`);d.rows[i][j]=value;
    }else return;
    refresh();invalidate();status('Dataset updated. Previous analysis results are cleared.');
  }));
  el('prev').onclick=()=>{page=Math.max(0,page-1);table();};el('next').onclick=()=>{page++;table();};
  el('add-row').onclick=guarded(()=>{
    const d=current();D.check(d&&(d.rows.length+1)*d.columns.length<=D.limits.cells&&d.rows.length<D.limits.rows,'Dataset has reached its row or cell limit.');
    D.audit(d,`Added data row ${d.rows.length+1}`);d.rows.push(d.columns.map(()=>''));d.sourceRows.push(Math.max(...d.sourceRows)+1);page=Math.floor((d.rows.length-1)/25);refresh();invalidate();
  });
  function show(output){
    const {result,plan}=output,d=current();el('output').hidden=false;el('result-title').textContent=result.title;
    el('interpretation').textContent=output.interpretation;
    el('provenance').textContent=`${d.name} · revision ${d.revision} · ${plan.selected.length} rows included · ${plan.excluded.length} excluded · ${output.options.confidence*100}% confidence · response unit: ${output.options.unit||'not specified'}`;
    el('metrics').innerHTML=result.metrics.map(([key,value])=>`<div class="res"><div class="k">${esc(key)}</div><div class="v">${esc(CalculatorAnalysis.format(value))}</div></div>`).join('');
    el('charts').innerHTML=result.charts.map(U.plot).join('');
    el('tables').innerHTML=result.tables.map(t=>U.table({...t,rows:t.rows.slice(0,200)})+(t.rows.length>200?'<p class="hint">First 200 table rows shown. The downloaded report and results CSV include every result row.</p>':'')).join('');
    el('notes').innerHTML=result.notes.map(n=>`<p>${esc(n)}</p>`).join('');
    el('next-steps').innerHTML=plan.next.map(n=>`<li>${esc(n)}</li>`).join('');
    el('exclusion-heading').textContent=`Row exclusions (${plan.excluded.length})`;
    el('exclusions').innerHTML=plan.excluded.length?U.table({title:'Exclusion audit',headers:['Data row','Source row','Reason'],rows:plan.excluded.slice(0,200).map(r=>[r.row,r.sourceRow,r.reason])})+(plan.excluded.length>200?'<p>First 200 shown. Download the report for the full exclusion list.</p>':''):'No rows excluded.';
    el('status').textContent=`Analysis complete. ${plan.selected.length} included rows; ${plan.excluded.length} exclusions are documented below.`;
    el('status').dataset.error='false';['report','result-csv','open-analysis'].forEach(id=>el(id).disabled=false);
    el('open-analysis').textContent=output.handoff.test?'Open in Hypothesis Tests':'Open in Data & Quality';
    if(output.handoff.rows&&(output.handoff.rows.flat().length>10000||output.handoff.rows.map(r=>r.join(',')).join('\n').length>250000)){
      el('open-analysis').disabled=true;el('open-analysis').textContent='Data & Quality input limit exceeded';
    }
    if(output.handoff.test==='t2'&&(output.handoff.values.s1===0||output.handoff.values.s2===0)){
      el('open-analysis').disabled=true;el('open-analysis').textContent='Use guided result: a group has zero spread';
    }
  }
  el('run').onclick=()=>{
    invalidate('Analyzing…');try{output=G.run(current(),options());show(output);}catch(error){invalidate(error.message);el('status').dataset.error='true';}
  };
  el('report').onclick=()=>{if(output)U.download('guided-analysis-report.txt',G.report(output,current()));};
  el('result-csv').onclick=()=>{if(!output)return;const {result,plan}=output;U.download('guided-analysis-results.csv',D.csv([['Dataset',current().name],['Revision',current().revision],['Method',result.title],['Included rows',plan.selected.length],['Excluded rows',plan.excluded.length],['Interpretation',output.interpretation],[],['Metric','Value'],...result.metrics,...result.tables.flatMap(t=>[[],[t.title],t.headers,...t.rows]),[],['Data row excluded','Source row','Reason'],...plan.excluded.map(r=>[r.row,r.sourceRow,r.reason])]),'text/csv;charset=utf-8');};
  el('open-analysis').onclick=()=>{
    if(!output)return;const h=output.handoff,confidence=output.options.confidence,set=(id,value)=>{const e=document.getElementById(id);e.value=value==null?'':String(value);e.dispatchEvent(new Event('input',{bubbles:true}));};
    if(h.test){
      const select=document.getElementById('tsel');select.value=String(TESTS.findIndex(t=>t.id===h.test));select.dispatchEvent(new Event('change'));
      for(const [key,value]of Object.entries(h.values)){const e=document.querySelector(`.tfield[data-key="${key}"]`);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));}
      set('talpha',String(Number((1-confidence).toPrecision(5))));document.querySelector('#ttail [data-v=two]').click();document.getElementById('trun').click();document.querySelector('[data-page=pg-test]').click();
    }else{
      const select=document.getElementById('analysis-kind');select.value=h.kind;select.dispatchEvent(new Event('change'));
      set('analysis-data',h.rows.map(r=>r.join(',')).join('\n'));set('analysis-confidence',confidence);set('analysis-alpha',String(Number((1-confidence).toPrecision(5))));set('analysis-lsl',h.lsl);set('analysis-usl',h.usl);
      document.getElementById('analysis-run').click();document.querySelector('[data-page=pg-data]').click();
    }
    status('Sent the current included values to the analysis tool. Return to Guided Analysis for column labels, exclusions and interpretation.');
  };
  el('example-load').onclick=guarded(()=>{
    importVersion++;const example=el('example').value;let parsed,name,settings;
    if(example==='process'){
      parsed=D.parseDelimited('Group,Thickness_mm,Run\nBefore,10.5,1\nBefore,10.3,2\nBefore,10.8,3\nBefore,10.4,4\nBefore,10.6,5\nBefore,10.7,6\nAfter,10.1,7\nAfter,9.9,8\nAfter,10.2,9\nAfter,10.0,10\nAfter,10.1,11\nAfter,9.8,12');name='Worked example · process change';settings={goal:'compare',design:'independent',y:'1',group:'0',baseline:'Before',direction:'lower',threshold:'0.2',unit:'mm'};
    }else if(example==='paired'){
      parsed=D.parseDelimited('Item,Before,After\nA,12,10\nB,15,12\nC,11,10\nD,14,11\nE,13,11\nF,16,12');name='Worked example · matched measurements';settings={goal:'compare',design:'paired',y:'1',x:'2',direction:'lower',threshold:'1',unit:'minutes'};
    }else if(example==='capability'){
      parsed=D.parseDelimited('Order,Thickness_mm\n1,9.96\n2,10.02\n3,9.99\n4,10.04\n5,9.98\n6,10.01\n7,10.03\n8,9.97\n9,10.00\n10,10.02\n11,9.99\n12,10.01');name='Worked example · thickness';settings={goal:'capability',y:'1',lsl:'9.8',usl:'10.2',unit:'mm','time-order':true};
    }else{
      const rows=[['Shift','Outcome']];for(const [shift,pass,fail]of [['Day',40,10],['Night',25,25]]){for(let i=0;i<pass;i++)rows.push([shift,'Pass']);for(let i=0;i<fail;i++)rows.push([shift,'Fail']);}
      parsed={matrix:rows};name='Worked example · inspection';settings={goal:'association',y:'0',x:'1',unit:''};
    }
    parsed.notes=['Fictitious training data. Examples illustrate operation; they are not evidence about a real process.'];add(parsed,name,'Built-in worked example',true);
    for(const id of ['goal','design','y','x','group'])if(id in settings)restoreSetting(id,settings[id]);values();for(const [id,value]of Object.entries(settings))restoreSetting(id,value);
    recommendation();invalidate('Worked example loaded. Review the method and assumptions, then run guided analysis.');
  });
  refresh();
})();
