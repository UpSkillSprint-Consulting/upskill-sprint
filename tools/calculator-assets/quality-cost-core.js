/* Cost of quality and benefit-record arithmetic. User attestations are not certification. */
'use strict';
const QualityCost=(()=>{
 const D=GuidedData,check=D.check;
 const headers={cost:['Period','Product','Category','Cause','Quantity','Unit','UnitCost','Events'],production:['Period','Product','Volume','Revenue'],benefits:['ID','Period','Type','Amount','Status','Owner','Evidence','Date','Notes']};
 const categories=['Prevention','Appraisal','Internal failure','External failure'];
 const types=['Cash savings','Cost avoidance','Released capacity','Implementation cost','Recurring cost'];
 const statuses=['Projected','Realized','Verified'];
 const sum=a=>a.reduce((s,x)=>s+x,0),key=(a,b)=>JSON.stringify([a,b]);
 function num(v,label,negative=false){const n=D.number(v);check(Number.isFinite(n)&&Math.abs(n)<=1e12&&(negative||n>=0),`${label}: enter ${negative?'a':'a nonnegative'} complete number within ${negative?'±':''}1 trillion.`);return n;}
 function text(v,label){const s=String(v??'').trim();check(s&&s.length<=500,`${label}: enter 1–500 characters.`);return s;}
 function choice(v,items,label){const match=items.find(x=>x.toLowerCase()===String(v).trim().toLowerCase());check(match,`${label}: use ${items.join(', ')}.`);return match;}
 function table(value,kind){
  const h=headers[kind];check(h,'Unknown table.');check(typeof value==='string'&&value.length<=1000000,'Each input table must be at most 1 million characters.');
  if(!value.trim()&&kind==='benefits')return [];
  const p=D.parseDelimited(value),matrix=p.matrix;
  check(matrix[0].length===h.length&&matrix[0].every((v,i)=>v.trim().toLowerCase()===h[i].toLowerCase()),`${kind} headers must be: ${h.join(',')}`);
  check(matrix.length<=2001,'Use at most 2,000 data rows per table.');
  return matrix.slice(1).map((r,i)=>{check(r.length===h.length,`${kind} row ${i+2}: expected ${h.length} cells; empty fields must retain their separators.`);return Object.fromEntries([...h.map((v,j)=>[v,r[j].trim()]),['sourceRow',p.rowNumbers[i+1]]]);});
 }
 function read(costText,productionText,benefitText){
  const costs=table(costText,'cost').map((r,i)=>{
   for(const f of ['Period','Product','Cause','Unit'])r[f]=text(r[f],`Cost row ${i+2} ${f}`);
   r.Category=choice(r.Category,categories,'Cost category');for(const f of ['Quantity','UnitCost','Events'])r[f]=num(r[f],`Cost row ${i+2} ${f}`);
   check(Number.isSafeInteger(r.Events),'Events must be whole-number counts.');r.amount=r.Quantity*r.UnitCost;check(r.amount<=1e15,'A cost line exceeds 1 quadrillion; check units and rates.');return r;
  });
  const seen=new Set();const production=table(productionText,'production').map((r,i)=>{for(const f of ['Period','Product'])r[f]=text(r[f],`Production row ${i+2} ${f}`);r.Volume=num(r.Volume,'Production volume');check(r.Volume>0,'Production volume must be greater than zero.');r.Revenue=r.Revenue===''?null:num(r.Revenue,'Revenue');const k=key(r.Period,r.Product);check(!seen.has(k),'Duplicate period/product in the production table.');seen.add(k);return r;});
  check(production.length,'Add production rows.');check(costs.length,'Add at least one cost line.');
  for(const r of costs)check(seen.has(key(r.Period,r.Product)),`Cost row ${r.sourceRow}: no matching production period/product.`);
  const periods=[...new Set(production.map(r=>r.Period))],ids=new Set();
  const benefits=table(benefitText,'benefits').map(r=>{
   r.ID=text(r.ID,'Benefit ID');check(!ids.has(r.ID),'Duplicate benefit ID: '+r.ID);ids.add(r.ID);r.Period=text(r.Period,'Benefit period');r.Type=choice(r.Type,types,'Benefit type');r.Status=choice(r.Status,statuses,'Benefit status');r.Amount=num(r.Amount,'Benefit amount',!r.Type.endsWith('cost'));
   for(const f of ['Owner','Evidence','Notes'])check(r[f].length<=2000,`${f} is limited to 2,000 characters.`);
   if(r.Status!=='Projected')check(periods.includes(r.Period),`Benefit ${r.ID}: actual period must exist in the production table.`);
   if(r.Status==='Verified'){
    check(r.Owner&&r.Evidence&&r.Notes,`Benefit ${r.ID}: verified entries require an owner, evidence reference and verification/basis notes.`);
    check(/^\d{4}-\d{2}-\d{2}$/.test(r.Date)&&Number.isFinite(Date.parse(r.Date))&&new Date(r.Date+'T00:00:00Z').toISOString().slice(0,10)===r.Date,`Benefit ${r.ID}: enter a valid verification date (YYYY-MM-DD).`);
    check(r.Date<=new Date().toISOString().slice(0,10),`Benefit ${r.ID}: verification date cannot be in the future.`);
   }
   return r;
  });
  return {costs,production,benefits,periods};
 }
 function pareto(rows,measure){
  const grouped=new Map();for(const r of rows){const k=key(r.Category,r.Cause);const v=grouped.get(k)||{category:r.Category,cause:r.Cause,cost:0,events:0};v.cost+=r.amount;v.events+=r.Events;grouped.set(k,v);}
  const sorted=[...grouped.values()].sort((a,b)=>b[measure]-a[measure]||a.cause.localeCompare(b.cause)),total=sum(sorted.map(r=>r[measure]));let cumulative=0;
  return sorted.map(r=>{cumulative+=r[measure];return {...r,share:total?r[measure]/total:null,cumulative:total?cumulative/total:null};});
 }
 function caseModel(o){
  const c={};for(const id of ['cash','avoidance','capacity','initial','recurring','years','discount','sensitivity'])c[id]=num(o[id],id);
  check(Number.isInteger(c.years)&&c.years>=1&&c.years<=30,'Choose an integer horizon of 1–30 years.');check(c.discount<=100,'Discount rate must be 0–100%.');check(c.sensitivity<=100,'Sensitivity must be 0–100%.');
  const scenarios=[['Low',1-c.sensitivity/100],['Base',1],['High',1+c.sensitivity/100]].map(([name,factor])=>{
   const cash=c.cash*factor,net=cash-c.recurring,flows=[{year:0,cash:0,cost:c.initial,net:-c.initial,present:-c.initial,cumulative:-c.initial}],rate=c.discount/100;
   for(let t=1;t<=c.years;t++)flows.push({year:t,cash,cost:c.recurring,net,present:net/(1+rate)**t,cumulative:-c.initial+t*net});
   const payback=c.initial===0?(net>=0?0:null):net>0&&c.initial/net<=c.years?c.initial/net:null;
   const cost=c.initial+c.recurring*c.years;
   return {name,factor,cash,net,npv:sum(flows.map(f=>f.present)),netTotal:sum(flows.map(f=>f.net)),roi:cost>0?(cash*c.years-cost)/cost:null,payback,flows};
  });return {inputs:c,scenarios};
 }
 function run(data,o){
  check(data.periods.includes(o.baseline),'Select a baseline period.');check(data.periods.includes(o.current)&&o.current!==o.baseline,'Choose a different comparison period.');
  const currency=text(o.currency,'Currency');check(/^[A-Z]{3}$/.test(currency),'Use a three-letter uppercase currency code, for example CAD. No currency conversion is performed.');
  const productionUnit=text(o.productionUnit,'Production volume unit');const notes=text(o.assumptions,'Baseline and normalization assumptions');
  check(o.complete===true,'Confirm complete comparable cost/production records, consistent valuation and non-overlapping event counts.');
  const baselineProducts=new Map(data.production.filter(r=>r.Period===o.baseline).map(r=>[r.Product,r]));
  function costFor(period,product,category){return sum(data.costs.filter(r=>r.Period===period&&r.Product===product&&r.Category===category).map(r=>r.amount));}
  const periodRows=data.periods.map(period=>{
   const p=data.production.filter(r=>r.Period===period),rows=data.costs.filter(r=>r.Period===period),cat=categories.map(c=>sum(rows.filter(r=>r.Category===c).map(r=>r.amount))),volume=sum(p.map(r=>r.Volume)),revenue=p.every(r=>r.Revenue!=null)?sum(p.map(r=>r.Revenue)):null;
   const uncovered=p.filter(r=>!baselineProducts.has(r.Product)).map(r=>r.Product);
   const expected=uncovered.length?null:categories.map(c=>sum(p.map(r=>costFor(o.baseline,r.Product,c)/baselineProducts.get(r.Product).Volume*r.Volume)));
   const coq=sum(cat),copq=cat[2]+cat[3];return {period,volume,revenue,cat,coq,copq,perUnit:coq/volume,percentRevenue:revenue>0?coq/revenue:null,expected,adjustedCOPQ:expected?expected[2]+expected[3]-copq:null,adjustedCOQ:expected?sum(expected)-coq:null,uncovered};
  });
  const current=periodRows.find(r=>r.period===o.current),base=periodRows.find(r=>r.period===o.baseline);
  const mix=data.production.filter(r=>r.Period===o.current).map(r=>({product:r.Product,volume:r.Volume,share:r.Volume/current.volume,baselineVolume:baselineProducts.get(r.Product)?.Volume??null,baselineRate:baselineProducts.has(r.Product)?sum(data.costs.filter(c=>c.Period===o.baseline&&c.Product===r.Product&&c.Category.endsWith('failure')).map(c=>c.amount))/baselineProducts.get(r.Product).Volume:null}));
  const selected=data.costs.filter(r=>r.Period===o.current),benefitTotals=status=>types.map(type=>sum(data.benefits.filter(r=>r.Status===status&&r.Type===type).map(r=>r.Amount)));
  const projected=benefitTotals('Projected'),realized=benefitTotals('Realized'),verified=benefitTotals('Verified');
  const actual=realized.map((v,i)=>v+verified[i]);
  const verification=data.periods.map(period=>{const rows=data.benefits.filter(r=>r.Period===period),by=(status,type)=>sum(rows.filter(r=>r.Status===status&&r.Type===type).map(r=>r.Amount));return {period,realizedCash:by('Realized','Cash savings')+by('Verified','Cash savings'),verifiedCash:by('Verified','Cash savings'),verifiedCost:by('Verified','Implementation cost')+by('Verified','Recurring cost'),pending:rows.filter(r=>r.Status==='Realized').length};});
  const duplicates=data.costs.length-new Set(data.costs.map(r=>JSON.stringify(headers.cost.map(k=>r[k])))).size;
  const warnings=['A normalized cost reduction is an analytical comparison, not proof of causation or cash realization. Price changes, utilization and unrecorded costs can affect it.','Released capacity and cost avoidance are not included in cash NPV, cash ROI or cash savings totals.','Verification is recorded by the user; this browser does not authenticate owners, inspect evidence or grant finance approval.','Cost tables, forecasts and the benefit register are separate views. Do not add their totals together or record the same benefit/cost twice.'];
  if(duplicates)warnings.push(`${duplicates} identical cost rows retained. Check duplicate invoices/events; no rows were removed automatically.`);
  if(current.uncovered.length)warnings.push('Adjusted comparison unavailable: missing baseline for '+current.uncovered.join(', ')+'. Supply a representative baseline for these products.');
  if(!data.costs.some(r=>r.Period===o.current))warnings.push('No cost rows for the comparison period: interpreted as zero only under your completeness acknowledgement.');
  if(realized[3]||realized[4])warnings.push('Actual project costs awaiting verification are excluded from verified net cash. Review pending costs before using the verified subtotal.');
  const currentVerified=sum(data.benefits.filter(v=>v.Period===o.current&&v.Type==='Cash savings'&&v.Status==='Verified').map(v=>v.Amount));
  if(current.adjustedCOQ!=null&&currentVerified>Math.max(0,current.adjustedCOQ))warnings.push('Verified cash claims in the comparison period exceed the normalized COQ reduction. Reconcile scope, prices, attribution and supporting evidence; these measures need not be identical.');
  return {currency,productionUnit,notes,base,current,periodRows,mix,costPareto:pareto(selected,'cost'),frequencyPareto:pareto(selected,'events'),business:caseModel(o),benefits:{projected,realized,verified,actual,verifiedNet:verified[0]-verified[3]-verified[4],actualNet:actual[0]-actual[3]-actual[4],verification},warnings,generated:new Date().toISOString(),options:o,data};
 }
 function restore(raw){check(typeof raw==='string'&&raw.length<=3500000,'Project exceeds 3.5 MB.');let v;try{v=JSON.parse(raw);}catch{throw Error('Invalid project JSON.');}check(v?.format==='upskillsprint-quality-cost'&&v.version===1&&v.inputs&&v.settings,'Unsupported cost-workspace format/version.');for(const k of ['cost','production','benefits'])check(typeof v.inputs[k]==='string','Missing project table: '+k);read(v.inputs.cost,v.inputs.production,v.inputs.benefits);return v;}
 function report(r){return ['UpSkillSprint Cost of Quality & Savings v1',`Generated: ${r.generated}`,`Currency: ${r.currency}; production unit: ${r.productionUnit}`,`Settings: ${JSON.stringify(r.options)}`,'',...r.warnings,'','Period analysis:',D.csv([['Period','Volume','COQ','COPQ','COQ/unit','COQ/revenue','Mix-adjusted COQ reduction','Mix-adjusted COPQ reduction'],...r.periodRows.map(v=>[v.period,v.volume,v.coq,v.copq,v.perUnit,v.percentRevenue??'Unavailable',v.adjustedCOQ??'Unavailable',v.adjustedCOPQ??'Unavailable'])]),'','Product mix and baseline rates:',JSON.stringify(r.mix,null,2),'','Category costs by period:',D.csv([['Period',...categories],...r.periodRows.map(v=>[v.period,...v.cat])]),'','Projected business case:',JSON.stringify(r.business,null,2),'','Benefit register totals (project-wide, no forecast addition):',JSON.stringify(r.benefits,null,2),'','Input cost ledger:',D.csv([headers.cost,...r.data.costs.map(v=>headers.cost.map(k=>v[k]))]),'','Input production:',D.csv([headers.production,...r.data.production.map(v=>headers.production.map(k=>v[k]??''))]),'','Input benefit records:',D.csv([headers.benefits,...r.data.benefits.map(v=>headers.benefits.map(k=>v[k]))]),'','Cost Pareto:',D.csv([['Category','Cause','Cost','Events','Cumulative cost fraction'],...r.costPareto.map(v=>[v.category,v.cause,v.cost,v.events,v.cumulative??'Unavailable'])]),'','Frequency Pareto:',D.csv([['Category','Cause','Events','Cumulative event fraction'],...r.frequencyPareto.map(v=>[v.category,v.cause,v.events,v.cumulative??'Unavailable'])])].join('\n');}
 return {headers,categories,types,statuses,read,pareto,caseModel,run,restore,report};
})();
