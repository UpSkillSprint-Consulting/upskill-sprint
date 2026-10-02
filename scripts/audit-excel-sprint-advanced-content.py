"""Independent student arithmetic from public rows and stated task contracts.
Private keys are read only after all calculations for comparison, never used as inputs.
"""
import json, math, statistics, pathlib, decimal, itertools,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'assets/lessons/excel-formula-fluency/sprint/packages'
number=lambda x:isinstance(x,(int,float)) and not isinstance(x,bool)
def rnd(x,d=2):return float(decimal.Decimal(str(x)).quantize(decimal.Decimal(1).scaleb(-d),rounding=decimal.ROUND_HALF_UP))
def norm(x):return ' '.join(str(x).strip().split()).upper()
def col(rows,i):return [r[i] for r in rows]
def total(rows,i):return sum(r[i] for r in rows if number(r[i]))
def vec(values):return [[x] for x in values]
def unique(rows):return list(dict.fromkeys(tuple(r) for r in rows))
def means(rows,keys):
 result=[]
 for key in keys:
  out=[]
  for orient in ['LPA','TWA']:
   selected=[r[3] for r in rows if tuple(r[:2])==tuple(key) and norm(r[2])==orient and number(r[3])]
   out.append(rnd(statistics.mean(selected)) if selected else 'Missing')
  result.append(out)
 return result
def stats(rows,indices):
 keys=sorted(unique([[r[i] for i in indices] for r in rows]))
 return [[*key,rnd(total([r for r in rows if all(r[j]==key[i] for i,j in enumerate(indices))],2)),total([r for r in rows if all(r[j]==key[i] for i,j in enumerate(indices))],3)] for key in keys]
def percentile(values,k):
 a=sorted(values);position=k*(len(a)-1);i=math.floor(position)
 return a[i] if i==len(a)-1 else a[i]+(a[i+1]-a[i])*(position-i)
def business_stats(rows):
 units=sum(r[2]-r[3] for r in rows);rev=sum((r[2]-r[3])*r[4] for r in rows);profit=sum((r[2]-r[3])*(r[4]-r[5]) for r in rows)
 return [units,rnd(rev),rnd(profit),'Zero revenue' if rev==0 else rnd(100*profit/rev)]
outputs={}
for level in [7,8,9,10]:
 for n in range(1,6):
  id=f'L{level}-A{n}';p=json.loads((BASE/(id+'.json')).read_text());rows=p['dataset']['rows'];sheets={s['name']:s['rows'] for s in p['dataset'].get('sheets',[])}
  if id=='L7-A1':
   day=[r for r in rows if r[1]=='Day'];out=[100*total(rows,3)/total(rows,2),sum(r[4]*r[5] for r in rows),total(day,3),sum(r[4]*r[5] for r in day)/total(day,3),rnd(total(rows,3)/total(rows,4))]
  elif id=='L7-A2':
   matches=[[r for r in rows if r[1:3]==req] for req in sheets['Requests']];pos=next(i+1 for i,r in enumerate(rows) if r in matches[0]);out=[vec([len(m) for m in matches]),vec([m[0][0] if len(m)==1 else 'Review key' for m in matches]),pos,matches[1],total(matches[1],3)]
  elif id=='L7-A3':
   keys=sheets['Keys'];m=means(rows,keys);counts=[[sum(tuple(r[:2])==tuple(k) and norm(r[2])==o and number(r[3]) for r in rows) for o in ['LPA','TWA']] for k in keys];out=[vec([norm(r[2]) for r in rows[:8]]),counts,m,[[*k,*a] for k,a in zip(keys,m)],sum(x=='Missing' for row in m for x in row)]
  elif id=='L7-A4':
   matrix=sheets['Matrix'];headers=next(s['headers'] for s in p['dataset']['sheets'] if s['name']=='Matrix');positions=[];limits=[];statuses=[]
   for r in rows[:8]:
    m=[(i,a) for i,a in enumerate(matrix) if a[0]==r[1]];position=m[0][0]+1 if m else 'Missing';limit=m[0][1][headers.index(r[2])] if m and r[2] in headers[1:] else 'Missing';status='Missing' if not number(r[3]) or limit=='Missing' else 'Pass' if r[3]>=limit else 'Hold';positions.append(position);limits.append(limit);statuses.append(status)
   out=[vec(positions),vec(limits),vec(statuses),statuses.count('Missing'),next(r[2] for r in matrix if r[0]=='G4')]
  elif id=='L7-A5':
   statuses=['Review' if not number(r[3]) else 'Hold' if r[2]<9.5 or r[2]>10.5 or r[3]<450 else 'Pass' for r in rows];exceptions=[r for r,s in zip(rows,statuses) if s!='Pass'];out=[vec(statuses),sorted(exceptions,key=lambda r:r[0]),sum(r[4] for r,s in zip(rows,statuses) if s=='Hold'),[r for r in exceptions if r[1]=='EV-H2'],statuses.count('Review')]
  elif id=='L8-A1':
   complete=[r for r in rows if number(r[2])];report=[[r[0],rnd(r[1]-r[2]),rnd(100*r[2]/r[1])] for r in complete];report.sort(key=lambda r:(-r[2],r[0]));out=[vec([rnd(r[1]-r[2]) if number(r[2]) else 'Missing' for r in rows[:8]]),100*total(complete,2)/total(complete,1),report,rnd(620*(total(complete,1)-total(complete,2))),len(complete)]
  elif id=='L8-A2':
   def margin(r):return 'Missing' if not number(r[2]) else 'Zero revenue' if r[1]==0 else rnd(100*(r[1]-r[2])/r[1])
   first=[margin(r) for r in rows[:8]];statuses=['Review' if not number(m) else 'Strong' if m>=20 else 'Thin' for m in first];out=[margin(rows[1]),vec(first),vec(statuses),sum(r[1]-r[2] for r in rows if number(r[2])),statuses.count('Review')]
  elif id=='L8-A3':
   counts=[sum(number(v) and v>=27 for v in r[1:]) for r in rows];out=[vec([min(r[1:]) if all(number(v) for v in r[1:]) else 'Missing' for r in rows[:8]]),vec([rnd(statistics.mean(r[1:])) if all(number(v) for v in r[1:]) else 'Missing' for r in rows[:8]]),vec(counts),[[rnd(statistics.mean(r[i] for r in rows if number(r[i]))) for i in [1,2,3]]],sum(counts)]
  elif id=='L8-A4':
   net=list(itertools.accumulate(col(rows,1)));gross=list(itertools.accumulate([max(0,r[1]) for r in rows]));out=[vec(net[:10]),net[-1],vec(gross[:10]),gross[-1],sum(r[1]<0 for r in rows)]
  elif id=='L8-A5':
   keys=sheets['Keys'];m=means(rows,keys);out=[vec([a[0] for a in m]),vec([a[1] for a in m]),[[*k,*a] for k,a in zip(keys,m)],sum('Missing' in row for row in m),sum(number(r[3]) and r[3]==0 for r in rows)]
  elif id=='L9-A1':
   both=stats(rows,[0,1]);out=[stats(rows,[1]),stats(rows,[0]),both,total(both,3)-total(rows,3),rnd(statistics.mean(col(rows,2)),3)]
  elif id=='L9-A2':
   keys=sorted(unique([r[:2] for r in rows]),key=lambda k:k[0]+'|'+k[1]);m=means(rows,keys);counts=[[k[0]+'|'+k[1],sum(tuple(r[:2])==k and number(r[3]) for r in rows)] for k in keys];out=[counts,[[k[0]+'|'+k[1],*a] for k,a in zip(keys,m)],[[*k,*a] for k,a in zip(keys,m)],sum(x=='Missing' for row in m for x in row),sum(number(r[3]) for r in rows)]
  elif id=='L9-A3':
   values=[r[1] for r in rows if number(r[1])];out=[statistics.stdev(values),rnd(percentile(values,.5),3),rnd(percentile(values,.9),3),sum(x<9.7 or x>10.3 for x in values),rnd(statistics.mean(values),3)]
  elif id=='L9-A4':
   pairs=[r for r in rows if number(r[1]) and number(r[2])];corr=statistics.correlation(col(pairs,1),col(pairs,2));out=[len(pairs),corr,vec(['Paired' if number(r[1]) and number(r[2]) else 'Missing pair' for r in rows[:8]]),'Association only' if abs(corr)>=.5 else 'Weak association',rnd(statistics.mean(col(pairs,2)))]
  elif id=='L9-A5':
   values=col(rows,1);lsl,usl,sigma,ref=[r[1] for r in sheets['Assumptions']];mean=statistics.mean(values);out=[[[mean,statistics.stdev(values)]],(usl-lsl)/(6*sigma),min((usl-mean)/(3*sigma),(mean-lsl)/(3*sigma)),[[rnd(ref-3*sigma,3),rnd(ref+3*sigma,3)]],sum(v<lsl or v>usl for v in values)]
  elif id=='L10-A1':
   specs=sheets['Specs'];limits=[];statuses=[]
   for r in rows:
    matched=[a[1] for a in specs if a[0]==r[1]];limit=matched[0] if len(matched)==1 else 'Review';limits.append(limit);statuses.append('Review' if limit=='Review' or not number(r[2]) else 'Released' if r[2]>=limit else 'Hold')
   held=[r for r,s in zip(rows,statuses) if s=='Hold'];held.sort(key=lambda r:(-r[3],r[0]));cost=total(held,3);out=[vec(limits[:8]),vec(statuses),[[statuses.count('Released'),statuses.count('Hold'),statuses.count('Review'),cost]],held,cost-sum(r[3] for r,s in zip(rows,statuses) if s=='Hold')]
  elif id=='L10-A2':
   shipments=sheets['Shipments'];report=[]
   for r in rows:
    shipped=sum(s[2] for s in shipments if s[1]==r[0]);left=r[1]-shipped;report.append([r[0],r[1],shipped,left,'Short' if left>0 else 'Over' if left<0 else 'Balanced'])
   known=set(col(rows,0));matched=sum(s[2] for s in shipments if s[1] in known);orphan=sum(s[2] for s in shipments if s[1] not in known);out=[vec([r[2] for r in report[:8]]),report,[r for r in report if r[3]!=0],[[total(rows,1),matched,orphan,total(shipments,2)-matched-orphan]],sum(r[4]=='Over' for r in report)]
  elif id=='L10-A3':
   rates=sheets['Rates'];corrected=[];statuses=[]
   for r in rows:
    match=[a[1] for a in rates if a[0]==r[1]];cost=rnd(r[2]*match[0]) if number(r[2]) and len(match)==1 else 'Review';corrected.append(cost);statuses.append('Review' if cost=='Review' else 'Mismatch' if abs(rnd(r[3]-cost))>.01 else 'Match')
   report=[[r[0],cost,r[3],s] for r,cost,s in zip(rows,corrected,statuses) if s!='Match'];out=[vec(corrected[:8]),vec(statuses),sorted(report,key=lambda r:r[0]),sum(c for c in corrected if number(c)),statuses.count('Mismatch')]
  elif id=='L10-A4':
   monthly=[[month[0],*business_stats([r for r in rows if r[0]==month[0]])] for month in sheets['Months']];productstats=[[product[0],*business_stats([r for r in rows if r[1]==product[0]])] for product in sheets['Products']];loss=[[r[0],r[3]] for r in productstats if r[3]<0];loss.sort(key=lambda r:(r[1],r[0]));source=business_stats(rows);out=[[[r[2]-r[3],rnd((r[2]-r[3])*r[4]),rnd((r[2]-r[3])*(r[4]-r[5]))] for r in rows[:8]],monthly,loss,[[total(monthly,1)-source[0],rnd(total(monthly,2)-source[1]),rnd(total(monthly,3)-source[2])]],sum(r[3]>r[2] for r in rows)]
  else:
   keys=sorted(unique([r[:2] for r in rows]),key=lambda k:(k[1],k[0]));m=means(rows,keys);statuses=['Review' if 'Missing' in a else 'Hold' if a[0]<27 or a[1]<20 else 'Pass' for a in m];costs={tuple(r[:2]):r[2] for r in sheets['Costs']};out=[list(map(list,keys)),m,[[*k,*a,s] for k,a,s in zip(keys,m,statuses)],[[statuses.count('Pass'),statuses.count('Hold'),statuses.count('Review'),sum(costs[k] for k,s in zip(keys,statuses) if s=='Hold')]],sum(v=='Missing' for a in m for v in a)]
  outputs[id]=dict(zip(['t1','t2','t3','t4','bonus'],out))
for n in [1,2,3]:
 id=f'EX-A{n}';p=json.loads((BASE/(id+'.json')).read_text());rows=p['dataset']['rows'];sheets={s['name']:s['rows'] for s in p['dataset'].get('sheets',[])}
 if n==1:
  grades=[norm(r[2]) for r in rows];specs=dict(sheets['Specs']);statuses=['Review' if not number(r[3]) or g not in specs else 'Released' if r[3]>=specs[g] else 'Rework' for r,g in zip(rows,grades)];costs=[rnd(r[4]*r[5]) for r in rows];queue=[[r[0],c] for r,c,s in zip(rows,costs,statuses) if s=='Rework'];queue.sort(key=lambda r:(-r[1],r[0]));out=[vec(grades),vec(statuses),queue,[[statuses.count(s) for s in ['Released','Rework','Review']]+[rnd(sum(c for c,s in zip(costs,statuses) if s=='Rework'))]],rnd(statistics.mean(r[3] for r,s in zip(rows,statuses) if s=='Released'))]
 elif n==2:
  keys=sorted(unique([r[:2] for r in rows]));m=means(rows,keys);out=[vec([norm(r[2]) for r in rows]),list(map(list,keys)),m,[[*k,*a] for k,a in zip(keys,m)],sum('Missing' in a for a in m)]
 else:
  stock=sheets['Stock'];signed=[r[3] if norm(r[2])=='RECEIPT' else -r[3] for r in rows];report=[];reorder=[]
  for sku,opening,minimum in stock:
   totals=[sum(r[3] for r in rows if r[1]==sku and norm(r[2])==m) for m in ['RECEIPT','DISPATCH','SCRAP']];closing=opening+totals[0]-totals[1]-totals[2];report.append([sku,opening,*totals,closing]);
   if closing<minimum:reorder.append([sku,closing,minimum-closing])
  reorder.sort(key=lambda r:(r[1],r[0]));net=sum(signed);opening=total(stock,1);closing=total(report,5);dispatch=[r for r in rows if norm(r[2])=='DISPATCH'];out=[vec(signed),report,reorder,[[net,opening,closing,closing-opening-net]],rnd(sum(r[3]*r[4] for r in dispatch)/total(dispatch,3),4)]
 outputs[id]=dict(zip(['t1','t2','t3','t4','bonus'],out))
# Public shapes are checked before private outputs are read.
shape_errors=[];required_cells=bonus_cells=0
for id,out in outputs.items():
 p=json.loads((BASE/(id+'.json')).read_text())
 for t in p['tasks']+[p['bonus']]:
  result=out[t['id']];cells=sum(len(row) for row in result) if isinstance(result,list) else 1
  if t['id']=='bonus':bonus_cells+=cells
  else:required_cells+=cells
  if isinstance(result,list):
   m=re.fullmatch(r'Answers!([A-Z]+)(\d+):([A-Z]+)(\d+)',t['output'])
   def column_number(s):
    n=0
    for c in s:n=n*26+ord(c)-64
    return n
   if not m or len(result)!=int(m[4])-int(m[2])+1 or any(len(row)!=column_number(m[3])-column_number(m[1])+1 for row in result):shape_errors.append([id,t['id']])
# Comparison happens after every public-derived output has been computed.
keys=json.loads((ROOT/'netlify/functions/_shared/excel-sprint-answers.json').read_text())
def equal(a,b):
 if number(a) and number(b):return abs(a-b)<=1e-6
 if isinstance(a,list) and isinstance(b,list):return len(a)==len(b) and all(equal(x,y) for x,y in zip(a,b))
 return a==b
errors=[]
for id,out in outputs.items():
 expected={t['id']:t['answer'] for t in keys[id]['tasks']};expected['bonus']=keys[id]['bonus']['answer']
 for task,result in out.items():
  if not equal(result,expected[task]):errors.append([id,task])
print(json.dumps({'packages':len(outputs),'requiredOutputs':len(outputs)*4,'bonusOutputs':len(outputs),'required_cells':required_cells,'bonus_cells':bonus_cells,'mismatches':errors,'shape_errors':shape_errors}))
assert not errors and not shape_errors
