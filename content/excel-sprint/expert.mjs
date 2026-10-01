// Build-only capstone curriculum. Never publish private task keys.
const round = (n, digits = 2) => Math.round((n + Number.EPSILON) * 10 ** digits) / 10 ** digits;
const sum = values => values.reduce((a, b) => a + b, 0);
const canonical = value => value.trim().replace(/ +/g, ' ').toUpperCase();
const fn = (name, purpose, syntax, args, example, result, mistake) => ({ name, purpose, syntax, arguments: args, example, result, useCase: 'Build and audit the capstone report.', mistake });
const functions = {
 LET: fn('LET', 'Name intermediate calculations inside a formula.', '=LET(name1, name_value1, [name2, name_value2], …, calculation)', 'Supply name/value pairs, then a final calculation. Names must be valid Excel names.', '=LET(units,3,rate,12,units*rate)', 36, 'Names are local to the formula. A name cannot conflict with a cell or range reference.'),
 SUMPRODUCT: fn('SUMPRODUCT', 'Sum products of aligned numeric arrays.', '=SUMPRODUCT(array1, [array2], …)', 'Supply equally sized arrays. Convert Boolean masks to numbers when using separate arguments.', '=SUMPRODUCT({2;3},{10;4})', 32, 'Unequal shapes error. Text is treated as zero in ordinary array arguments; validate required inputs.'),
 AVERAGEIFS: fn('AVERAGEIFS', 'Average numeric observations meeting all criteria.', '=AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], …)', 'All ranges must align. Example: A2:A4 contains A, B, A; B2:B4 contains 10, 20, 30.', '=AVERAGEIFS(B2:B4,A2:A4,"A")', 20, 'No matching numeric observations produces an error. A measured zero counts; missing data must remain missing.'),
 COUNTIFS: fn('COUNTIFS', 'Count observations meeting all criteria.', '=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], …)', 'Pair aligned ranges and criteria. Example: A2:A4 contains A, A, B; B2:B4 contains 1, 2, 3.', '=COUNTIFS(A2:A4,"A",B2:B4,">1")', 1, 'Counting a key alone does not prove that its measurement exists.'),
 SUMIFS: fn('SUMIFS', 'Sum numeric records meeting all criteria.', '=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], …)', 'Start with values, then aligned criterion pairs. Example: A2:A4 contains A, B, A; B2:B4 contains 5, 7, 9.', '=SUMIFS(B2:B4,A2:A4,"A")', 14, 'A zero total does not distinguish no matching records from records whose sum is zero.'),
 SORTBY: fn('SORTBY', 'Sort a report by aligned primary and tie-break keys.', '=SORTBY(array, by_array1, [sort_order1], [by_array2], [sort_order2], …)', 'Use 1 for ascending and -1 for descending. Every sort key must align with the report.', '=SORTBY({"A";"B"},{3;1},1)', 'B, then A', 'Filter the key arrays with the same mask as the output. Declare tie ordering explicitly.')
};
export const EXPERT_IDS = Object.freeze(['EX-A1', 'EX-A2', 'EX-A3']);
export const EXPERT_CORE_IDS = Object.freeze(Array.from({length:30}, (_, i) => `L${Math.floor(i/5)+1}-A${i%5+1}`));
export function expertPackages(randomFor) {
 const packages = [];
 const hints={
  'EX-A1':[
   ['Preserve all 60 grades and trim ordinary spaces.','Combine TRIM and UPPER before matching a specification.','=UPPER(____)'],
   ['Blank strength and unknown grade require Review. Equality meets the minimum.','Reuse XLOOKUP with LET, then guard missing inputs before comparing strength.','=IF(OR(____),"Review",IF(____,"Released","Rework"))'],
   ['Include only Rework pipes. Round each pipe cost and break cost ties by pipe ID.','Use FILTER, ROUND, HSTACK and SORTBY with aligned keys.','=SORTBY(HSTACK(____,____),____,-1,____,1)'],
   ['The counts must cover all 60 records. Sum costs rounded at pipe level.','Use COUNTIF for status counts and SUMPRODUCT for the cost mask.','=HSTACK(____,____,____,ROUND(SUMPRODUCT(____,____),2))'],
   ['Average measured strengths for Released pipes only.','Use AVERAGEIFS on strength with the aligned status range.','=ROUND(AVERAGEIFS(____,____,"Released"),2)']
  ],
  'EX-A2':[
   ['Clean every orientation while preserving Data order.','Combine TRIM and UPPER.','=UPPER(____)'],
   ['Sample alone is not unique. Preserve text identifiers and both sort keys.','Apply UNIQUE to the two-column key array, then SORTBY both columns.','=SORTBY(UNIQUE(____),____,1,____,1)'],
   ['Average numeric replicates within sample, heat and orientation. A measured zero counts.','Guard missing observations with COUNTIFS, then use AVERAGEIFS with all criteria.','=IF(____=0,"Missing",ROUND(AVERAGEIFS(____),2))'],
   ['Keep twenty rows and four columns in the Task 2 key order.','HSTACK the joint keys and aligned orientation means.','=HSTACK(____,____)'],
   ['A pair missing both orientations still counts once.','Create an OR mask with Boolean addition, then count positive row masks.','=SUMPRODUCT(--((____+____)>0))']
  ],
  'EX-A3':[
   ['Receipt adds units; Dispatch and Scrap subtract units.','Normalize Movement with TRIM/UPPER before IF selects the sign.','=IF(____,Data!D2,-Data!D2)'],
   ['Include each Stock SKU once. Closing is opening plus receipts minus dispatch and scrap.','Use SUMIFS for movement totals and combine the six columns with HSTACK.','=HSTACK(Stock!A2:B7,____,____,____,____)'],
   ['Use strictly below minimum. Preserve negative stock and sort ties by SKU.','FILTER all report columns with one mask, then SORTBY closing and SKU.','=SORTBY(HSTACK(____,____,____),____,1,____,1)'],
   ['Recompute net movement from Data, then compare opening plus net with dashboard closing.','Use a normalized sign mask in SUMPRODUCT and retain the reconciliation difference.','=HSTACK(____,____,____,____)'],
   ['Use Dispatch quantities in both numerator and denominator.','SUMPRODUCT weights each cost by quantity; divide by total dispatched quantity.','=ROUND(SUMPRODUCT(____,____,____)/SUMPRODUCT(____,____),4)']
  ]
 };
 function add(id, title, scenario, names, intro, combine, headers, rows, sheets, specs) {
  const task = (spec, index) => {
   const [prompt, output, answer, model, note = '', alternatives = []] = spec;
   const taskId = index === 4 ? 'bonus' : `t${index+1}`;
   return { public: { id:taskId, prompt, output, type:Array.isArray(answer)?'array':typeof answer==='number'?'number':'text' },
    private: { id:taskId, prompt, output, answer, model, alternatives:alternatives.length ? alternatives : index===0 ? [id==='EX-A3'?'=Data!D2*IF(UPPER(TRIM(Data!C2))="RECEIPT",1,-1)':'=TRIM(UPPER(Data!C2))'] : [], ...(note ? {note} : {}), tolerance:0.000001,
     hints:hints[id][index] } };
  };
  const descriptions={Pipe_no:'Unique pipe identifier; retain each pipe as a separate record.',Heat_no:'Heat identifier. A sample is identified by both sample and heat.',Grade_code:'Imported training grade. Trim ordinary spaces and convert to uppercase before matching Specs.',Yield_MPa:'Measured yield strength in MPa. A blank requires Review; equality meets the invented limit.',Length_m:'Pipe length in metres.',Unit_cost_CAD:id==='EX-A1'?'Training rework cost in CAD per metre.':'Transaction unit cost in CAD per inventory unit.',Sample_no:'Three-character text identifier, including leading zeros. Repeats across heats.',Orientation:'Imported LPA or TWA label. Normalize with TRIM and UPPER.',Energy_J:'Replicate energy in joules. A measured zero counts; a blank is missing.',Replicate:'Replicate slot 1 or 2. Average numeric replicates within both keys and orientation.',Txn_no:'Unique transaction identifier.',SKU:'Exact inventory key; each SKU matches one Stock row.',Movement:'Receipt, Dispatch or Scrap, with optional outer spaces and mixed case.',Units:'Nonnegative inventory quantity for this transaction.'};
  const tasks = specs.map(task), columns = headers.map(name => ({name,description:descriptions[name]}));
  packages.push({ id, track:'expert', assignment:EXPERT_IDS.indexOf(id)+1, title, formulas:names, minutes:75, scenario,
   lesson:{intro,functions:names.map(name=>functions[name]),combine}, columns,rows,sheets,parameters:[],
   tasks:tasks.slice(0,4).map(t=>t.public),bonus:tasks[4].public,
   private:{version:1,tasks:tasks.slice(0,4).map(t=>t.private),bonus:tasks[4].private} });
 }
 {
  const id='EX-A1', rng=randomFor(id), specs=[['GX-1',385],['GX-2',420],['GX-3',450]];
  const rows=Array.from({length:60},(_,i)=>[`RV-P${String(i+1).padStart(3,'0')}`,`RV-H${i%8+1}`,i===5?'GX-9':i%2?` gx-${i%3+1} `:`GX-${i%3+1}`,i===4?'':i===0?385:rng.int(350,490),rng.int(600,1250)/100,rng.int(2500,6500)/100]);
  const grades=rows.map(r=>canonical(r[2])), statuses=rows.map((r,i)=>{const limit=specs.find(s=>s[0]===grades[i])?.[1];return r[3]===''||limit===undefined?'Review':r[3]>=limit?'Released':'Rework';});
  const costs=rows.map(r=>round(r[4]*r[5]));
  const queue=rows.flatMap((r,i)=>statuses[i]==='Rework'?[[r[0],costs[i]]]:[]).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const reworkCost=round(sum(costs.filter((_,i)=>statuses[i]==='Rework')));
  add(id,'Reconcile a manufacturing release queue','Ravellen Tube Works has 60 fictitious pipe inspections. Normalize Grade_code, match a unique Specs key and apply the invented minimum yield strength. Blank strength or an unknown grade means Review. Equality meets the training rule. Rework cost is Length_m × Unit_cost_CAD rounded per pipe to two decimals. These limits are training assumptions, not a published standard or production acceptance decision.',
   ['LET','SUMPRODUCT'],'Reuse a lookup and its missing-data guard with LET. Use aligned arrays to reconcile costs. Work through cleaning, status, queue and summary in separate answer areas.',
   'Combine TRIM, UPPER, XLOOKUP and IF before FILTER/SORTBY. Compare the summary with an independent source calculation. Equivalent formulas and explicit helper cells are accepted.',
   ['Pipe_no','Heat_no','Grade_code','Yield_MPa','Length_m','Unit_cost_CAD'],rows,[{name:'Specs',headers:['Grade_code','Yield_min_MPa'],rows:specs}], [
    ['Normalize every Grade_code with ordinary-space trimming and uppercase. Keep Data order.', 'Answers!B2:B61',grades.map(x=>[x]),'=UPPER(TRIM(Data!C2))','Enter at B2 and fill down to B61.'],
    ['For every pipe, return Released, Rework or Review under the scenario rules. Keep Data order. Do not treat a blank strength as zero.', 'Answers!B65:B124',statuses.map(x=>[x]),'=LET(limit,XLOOKUP(B2,Specs!$A$2:$A$4,Specs!$B$2:$B$4,"Missing"),IF(OR(Data!D2="",limit="Missing"),"Review",IF(Data!D2>=limit,"Released","Rework")))','Enter at B65 and fill down to B124. B2 moves through the normalized grades.'],
    [`Return only Rework pipes in two columns: Pipe_no and rounded rework cost (CAD). Sort cost descending, then Pipe_no ascending. Paste all ${queue.length} rows, without headers.`, `Answers!B128:C${127+queue.length}`,queue,'=LET(mask,B65:B124="Rework",pipes,FILTER(Data!A2:A61,mask),costs,FILTER(ROUND(Data!E2:E61*Data!F2:F61,2),mask),SORTBY(HSTACK(pipes,costs),costs,-1,pipes,1))'],
    ['Return one row: Released count, Rework count, Review count, total rounded rework cost (CAD). Use all 60 records and round the final cost to two decimals.', 'Answers!B191:E191',[[...['Released','Rework','Review'].map(s=>statuses.filter(x=>x===s).length),reworkCost]],'=HSTACK(COUNTIF(B65:B124,"Released"),COUNTIF(B65:B124,"Rework"),COUNTIF(B65:B124,"Review"),ROUND(SUMPRODUCT(--(B65:B124="Rework"),ROUND(Data!E2:E61*Data!F2:F61,2)),2))'],
    ['Return the average measured Yield_MPa for Released pipes, rounded to two decimals.', 'Answers!B195',round(sum(rows.filter((_,i)=>statuses[i]==='Released').map(r=>r[3]))/statuses.filter(x=>x==='Released').length),'=ROUND(AVERAGEIFS(Data!D2:D61,B65:B124,"Released"),2)']
   ]);
 }
 {
  const id='EX-A2', rng=randomFor(id), rows=[];
  // Five sample identifiers each occur in four heats. No delimiter-based identity.
  for(let sample=1;sample<=5;sample++)for(let heat=1;heat<=4;heat++)for(const orientation of ['LPA','TWA'])for(let rep=1;rep<=2;rep++){
   let value=rng.int(20,95);if(sample===1&&heat===1&&orientation==='TWA'||sample===1&&heat===2&&orientation==='TWA'&&rep===1)value='';if(sample===1&&heat===3&&orientation==='LPA'&&rep===1)value=0;
   rows.push([String(sample).padStart(3,'0'),`CH-H${heat}`,rep===1?` ${orientation.toLowerCase()} `:orientation,value,rep]);
  }
  // Reorder records so first-match and adjacent-row assumptions fail.
  for(let i=rows.length-1;i>0;i--){const j=rng.int(0,i);[rows[i],rows[j]]=[rows[j],rows[i]];}
  const keys=[...new Map(rows.map(r=>[JSON.stringify(r.slice(0,2)),r.slice(0,2)])).values()].sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1]));
  const mean=(key,orientation)=>{const numeric=rows.filter(r=>r[0]===key[0]&&r[1]===key[1]&&canonical(r[2])===orientation&&typeof r[3]==='number').map(r=>r[3]);return numeric.length?round(sum(numeric)/numeric.length):'Missing';};
  const means=keys.map(key=>['LPA','TWA'].map(o=>mean(key,o))), report=keys.map((k,i)=>[...k,...means[i]]);
  add(id,'Reshape duplicate Charpy measurements','Chelloran Test Lab has 80 fictitious observations: twenty sample/heat pairs, two orientations and two replicate slots per orientation. Sample_no alone is not unique. Group by BOTH Sample_no and Heat_no. Normalize Orientation using TRIM/UPPER. Average numeric replicate energies (J), include measured zero, ignore blanks, round to two decimals and return Missing when no numeric observation exists. Do not select the first duplicate measurement.',
   ['AVERAGEIFS','COUNTIFS'],'A replicated test needs an explicit aggregation rule. Use separate sample and heat criteria, and confirm observations exist before averaging. Clean orientation labels once and reuse them.',
   'UNIQUE on a two-column array preserves joint identity. Reuse COUNTIFS and AVERAGEIFS across orientations, then HSTACK keys and energies. Keep the sorted order fixed.',
   ['Sample_no','Heat_no','Orientation','Energy_J','Replicate'],rows,[], [
    ['Normalize all 80 Orientation labels using ordinary-space trimming and uppercase. Preserve Data order.', 'Answers!B2:B81',rows.map(r=>[canonical(r[2])]),'=UPPER(TRIM(Data!C2))','Enter at B2 and fill down to B81.'],
    ['Return the twenty distinct Sample_no and Heat_no pairs, sorted Sample_no ascending, then Heat_no ascending. Preserve the three-character sample identifiers.', 'Answers!B85:C104',keys,'=LET(keys,UNIQUE(Data!A2:B81),SORTBY(keys,CHOOSECOLS(keys,1),1,CHOOSECOLS(keys,2),1))'],
    ['For the sorted pairs, return two columns: mean LPA energy and mean TWA energy (J). Apply the numeric-replicate and Missing rules. Keep the key order from Task 2.', 'Answers!B108:C127',means,'=IF(COUNTIFS(Data!$A$2:$A$81,$B85,Data!$B$2:$B$81,$C85,$B$2:$B$81,"LPA",Data!$D$2:$D$81,"<>")=0,"Missing",ROUND(AVERAGEIFS(Data!$D$2:$D$81,Data!$A$2:$A$81,$B85,Data!$B$2:$B$81,$C85,$B$2:$B$81,"LPA",Data!$D$2:$D$81,"<>"),2))','Enter at B108 and fill down to B127. Enter the same formula with "TWA" at C108 and fill down to C127. The key row starts at 85 in each column.'],
    ['Return the final twenty-row report: Sample_no, Heat_no, mean LPA_J, mean TWA_J. Preserve the Task 2 sort order and Missing labels.', 'Answers!B131:E150',report,'=HSTACK(B85:C104,B108:C127)'],
    ['Count sample/heat pairs missing at least one orientation mean. Count each pair once.', 'Answers!B154',means.filter(r=>r.includes('Missing')).length,'=SUMPRODUCT(--(((B108:B127="Missing")+(C108:C127="Missing"))>0))']
   ]);
 }
 {
  const id='EX-A3', rng=randomFor(id), stocks=Array.from({length:6},(_,i)=>[`IN-${String(i+1).padStart(3,'0')}`,i<2?20:150+i*15,50]);
  const rows=Array.from({length:60},(_,i)=>{const item=i%6, movement=i<12?'Dispatch':i%3===0?'Receipt':i%3===1?'Dispatch':'Scrap';return[`IL-T${String(i+1).padStart(3,'0')}`,stocks[item][0],i%2?` ${movement.toLowerCase()} `:movement,rng.int(8,25),rng.int(800,1800)/100];});
  const signed=rows.map(r=>canonical(r[2])==='RECEIPT'?r[3]:-r[3]);
  const report=stocks.map(s=>{const quantities=['RECEIPT','DISPATCH','SCRAP'].map(m=>sum(rows.filter(r=>r[1]===s[0]&&canonical(r[2])===m).map(r=>r[3])));return[s[0],s[1],...quantities,s[1]+quantities[0]-quantities[1]-quantities[2]];});
  const reorder=report.flatMap((r,i)=>r[5]<stocks[i][2]?[[r[0],r[5],stocks[i][2]-r[5]]]:[]).sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0]));
  const opening=sum(stocks.map(s=>s[1])),net=sum(signed),closing=sum(report.map(r=>r[5]));
  const dispatched=rows.filter(r=>canonical(r[2])==='DISPATCH'), weighted=round(sum(dispatched.map(r=>r[3]*r[4]))/sum(dispatched.map(r=>r[3])),4);
  add(id,'Build a reconciled inventory dashboard','Ildavon Supply records 60 fictitious inventory movements. Stock provides six unique SKUs, opening units and minimum units. Normalize Movement with TRIM/UPPER. Receipt adds units; Dispatch and Scrap subtract units. All SKUs are valid and quantities are nonnegative. Negative closing stock is meaningful and must remain visible. Reorder when closing units are strictly below the minimum; equality does not reorder.',
   ['SUMIFS','SORTBY'],'Build an inventory report from opening balances and movement totals. Verify the finished dashboard against source movements, then prioritize shortages with deterministic ties.',
   'Use signed movement helpers, SUMIFS by SKU and SORTBY after FILTER. Reconcile total closing units to opening plus the independent source net movement. Reuse SUMPRODUCT for a quantity-weighted cost.',
   ['Txn_no','SKU','Movement','Units','Unit_cost_CAD'],rows,[{name:'Stock',headers:['SKU','Opening_units','Minimum_units'],rows:stocks}], [
    ['Return signed units for every movement. Receipt is positive; Dispatch and Scrap are negative. Keep Data order.', 'Answers!B2:B61',signed.map(x=>[x]),'=IF(UPPER(TRIM(Data!C2))="RECEIPT",Data!D2,-Data!D2)','Enter at B2 and fill down to B61.'],
    ['For all six SKUs in Stock order, return six columns: SKU, opening units, receipt units, dispatch units, scrap units, closing units. Movement totals are positive; closing = opening + receipts - dispatch - scrap.', 'Answers!B65:G70',report,'=HSTACK(Stock!A2:B7,SUMIFS(Data!D2:D61,Data!B2:B61,Stock!A2:A7,Data!C2:C61,"*receipt*"),SUMIFS(Data!D2:D61,Data!B2:B61,Stock!A2:A7,Data!C2:C61,"*dispatch*"),SUMIFS(Data!D2:D61,Data!B2:B61,Stock!A2:A7,Data!C2:C61,"*scrap*"),Stock!B2:B7+SUMIFS(B2:B61,Data!B2:B61,Stock!A2:A7))','The supplied movement values contain only the three stated words with optional outer spaces. Excel criteria are case-insensitive; wildcard criteria are valid for this fixed dataset.'],
    [`Return the ${reorder.length} SKUs needing reorder in three columns: SKU, closing units, shortage to minimum. Sort closing ascending, then SKU ascending. Preserve negative closing values.`, `Answers!B74:D${73+reorder.length}`,reorder,'=LET(mask,G65:G70<Stock!C2:C7,skus,FILTER(B65:B70,mask),closing,FILTER(G65:G70,mask),shortage,FILTER(Stock!C2:C7-G65:G70,mask),SORTBY(HSTACK(skus,closing,shortage),closing,1,skus,1))'],
    ['Return one row: source net movement units, source opening units, dashboard closing units, reconciliation difference (dashboard closing - source opening - source net movement). Recompute source net directly from Data rather than summing the Task 1 helper.', 'Answers!B84:E84',[[net,opening,closing,closing-opening-net]],'=HSTACK(SUMPRODUCT(IF(UPPER(TRIM(Data!C2:C61))="RECEIPT",1,-1),Data!D2:D61),SUM(Stock!B2:B7),SUM(G65:G70),SUM(G65:G70)-SUM(Stock!B2:B7)-SUMPRODUCT(IF(UPPER(TRIM(Data!C2:C61))="RECEIPT",1,-1),Data!D2:D61))'],
    ['Calculate the quantity-weighted Unit_cost_CAD for Dispatch movements only, rounded to four decimals. Use dispatched units as the denominator.', 'Answers!B88',weighted,'=ROUND(SUMPRODUCT(--(UPPER(TRIM(Data!C2:C61))="DISPATCH"),Data!D2:D61,Data!E2:E61)/SUMPRODUCT(--(UPPER(TRIM(Data!C2:C61))="DISPATCH"),Data!D2:D61),4)']
   ]);
 }
 return packages;
}
