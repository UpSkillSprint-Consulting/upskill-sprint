/* Local tabular data model. No network, formulas, or implicit numeric coercion. */
'use strict';
const GuidedData = (() => {
  const limits = Object.freeze({rows:10000, columns:40, cells:100000, text:5000000, file:10000000, datasets:5});
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const number = value => {
    const text=String(value).trim();
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return NaN;
    const n=Number(text); return Number.isFinite(n)&&Math.abs(n)<=1e100?n:NaN;
  };
  function parseDelimited(text, delimiter='auto') {
    check(typeof text==='string'&&text.length<=limits.text,'Use a text file of at most 5 million characters.');
    text=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
    check(text.trim(),'Paste a table or choose a file first.');
    if (delimiter==='auto') {
      const counts={',':0,';':0,'\t':0}; let quoted=false;
      for(let i=0;i<text.length;i++) {
        if(text[i]==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}
        else if(!quoted&&text[i]==='\n')break;
        else if(!quoted&&text[i] in counts)counts[text[i]]++;
      }
      delimiter=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
    }
    check([',',';','\t'].includes(delimiter),'Choose comma, semicolon, or tab separation.');
    const matrix=[],rowNumbers=[]; let row=[],cell='',quoted=false,closed=false,line=1,start=1;
    function finishCell(){check(cell.length<=10000,'A cell exceeds 10,000 characters.');row.push(cell);cell='';closed=false;check(row.length<=limits.columns,'Use at most 40 columns.');}
    function finishRow(){finishCell();matrix.push(row);rowNumbers.push(start);row=[];check(matrix.length<=limits.rows+1,'Use at most 10,000 data rows plus a header.');}
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else{cell+=c;if(c==='\n')line++;}continue;}
      if(c==='"'){check(!cell&&!closed,`Line ${line}: a quote must start a cell; escape an inner quote as two quotes.`);quoted=true;}
      else if(c===delimiter)finishCell();
      else if(c==='\n'){finishRow();line++;start=line;}
      else{check(!closed,`Line ${line}: unexpected text after a closing quote.`);cell+=c;}
    }
    check(!quoted,`Line ${start}: quoted cell is not closed.`);
    if(cell||closed||row.length||!text.endsWith('\n'))finishRow();
    return {matrix,rowNumbers,delimiter};
  }
  function create(parsed, options={}) {
    const matrix=parsed.matrix;
    check(Array.isArray(matrix)&&matrix.length,'The selected table is empty.');
    check(matrix.length<=limits.rows+1&&matrix.every(r=>Array.isArray(r)&&r.length<=limits.columns),'Table exceeds the row or column limit.');
    const width=Math.max(...matrix.map(r=>r.length));
    const hasHeaders=options.headers!==false, offset=hasHeaders?1:0;
    check(width>0&&matrix.length>offset,'Include at least one data row.');
    check((matrix.length-offset)*width<=limits.cells&&matrix.length-offset<=limits.rows,'Use at most 100,000 cells and 10,000 data rows.');
    const notes=[...(parsed.notes||[])], used=new Set();
    const columns=Array.from({length:width},(_,i)=>{
      let name=hasHeaders?String(matrix[0][i]??'').trim():`Column ${i+1}`;
      if(!name){name=`Column ${i+1}`;notes.push(`Blank header ${i+1} was named ${name}.`);}
      check(name.length<=100,'Column names must be at most 100 characters.');
      const base=name;let suffix=2;while(used.has(name))name=`${base.slice(0,94)} (${suffix++})`;
      if(name!==base)notes.push(`Duplicate header ${base} was renamed ${name}.`);
      used.add(name);return name;
    });
    let padded=0;
    const rows=matrix.slice(offset).map(r=>{if(r.length<width)padded++;return Array.from({length:width},(_,j)=>{
      const value=String(r[j]??'');check(value.length<=10000,'A cell exceeds 10,000 characters.');return value;
    });});
    check(rows.flat().reduce((s,v)=>s+v.length,0)<=limits.text,'Table text exceeds 5 million characters.');
    if(padded)notes.push(`${padded} short rows were padded with blank cells. Review missing values before analysis.`);
    return {name:String(options.name||'Untitled dataset').slice(0,100),source:String(options.source||'Pasted table').slice(0,200),columns,rows,
      sourceRows:rows.map((_,i)=>parsed.rowNumbers?.[i+offset]??i+offset+1),excluded:[],notes,revision:1,audit:[]};
  }
  function profile(dataset) {
    let missing=0;const seen=new Set();let duplicates=0;
    dataset.rows.forEach(r=>{missing+=r.filter(v=>!v.trim()).length;const key=JSON.stringify(r);if(seen.has(key))duplicates++;seen.add(key);});
    return {missing,duplicates,columns:dataset.columns.map((name,j)=>{
      const values=dataset.rows.map(r=>r[j]).filter(v=>v.trim()),numeric=values.filter(v=>Number.isFinite(number(v))).length;
      return {name,missing:dataset.rows.length-values.length,type:!values.length?'Empty':numeric===values.length?'Numeric':numeric?'Mixed':'Text / category'};
    })};
  }
  function audit(dataset,action) {
    check(dataset.audit.length<10000,'This dataset has reached 10,000 edits. Export it and start a new dataset.');
    dataset.revision++;dataset.audit.push({at:new Date().toISOString(),action:String(action).slice(0,500)});
  }
  function restore(text) {
    check(text.length<=limits.file,'Project file exceeds 10 MB.');let data;
    try{data=JSON.parse(text);}catch{throw new Error('This is not a valid workspace JSON file.');}
    check(data?.format==='upskillsprint-guided-workspace'&&data.version===1,'Choose an UpSkillSprint guided workspace project (version 1).');
    check(Array.isArray(data.datasets)&&data.datasets.length>0&&data.datasets.length<=limits.datasets,'A project must contain 1–5 datasets.');
    const datasets=data.datasets.map(d=>{
      check(d&&Array.isArray(d.columns)&&Array.isArray(d.rows)&&d.columns.every(v=>typeof v==='string'),'Project contains an invalid dataset.');
      check(d.rows.every(r=>Array.isArray(r)&&r.length===d.columns.length&&r.every(v=>typeof v==='string')),'Project rows must contain text cells of equal width.');
      check(d.sourceRows?.length===d.rows.length&&d.sourceRows.every(v=>Number.isSafeInteger(v)&&v>0),'Project row references are invalid.');
      check(Array.isArray(d.excluded)&&d.excluded.every(v=>Number.isInteger(v)&&v>=0&&v<d.rows.length),'Project exclusions are invalid.');
      check(Number.isSafeInteger(d.revision)&&d.revision>0,'Project revision is invalid.');
      check(Array.isArray(d.audit)&&d.audit.length<=10000&&d.audit.every(a=>typeof a.at==='string'&&typeof a.action==='string'&&a.action.length<=500),'Project edit history is invalid.');
      check(Array.isArray(d.notes)&&d.notes.length<=1000&&d.notes.every(n=>typeof n==='string'&&n.length<=1000),'Project import notes are invalid.');
      const validated=create({matrix:[d.columns,...d.rows],rowNumbers:[1,...d.sourceRows]},{name:d.name,source:d.source});
      check(validated.columns.every((v,i)=>v===d.columns[i]),'Project column names must be nonempty and unique.');
      return {...validated,excluded:[...new Set(d.excluded)],revision:d.revision,audit:d.audit.map(a=>({at:a.at,action:a.action})),notes:[...d.notes]};
    });
    return {datasets,active:Number.isInteger(data.active)&&data.active>=0&&data.active<datasets.length?data.active:0,
      settings:data.settings&&typeof data.settings==='object'&&!Array.isArray(data.settings)?data.settings:{}};
  }
  function csv(rows) {
    // Spreadsheet applications may evaluate leading formula tokens. Preserve genuine numbers.
    const cell=v=>{let s=String(v??'');if(!Number.isFinite(number(s))&&/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    return rows.map(r=>r.map(cell).join(',')).join('\r\n');
  }
  return {limits,check,number,parseDelimited,create,profile,audit,restore,csv};
})();
