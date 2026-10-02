"""Independent public-data checks for Levels 1–6; never prints private answers."""
import json, math, calendar, re
from decimal import Decimal, ROUND_HALF_UP
from datetime import date, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'assets/lessons/excel-formula-fluency/sprint/packages'
PACKAGES={f'L{l}-A{a}':json.loads((BASE/f'L{l}-A{a}.json').read_text()) for l in range(1,7) for a in range(1,6)}
DERIVED={}
def D(v): return Decimal(str(v))
def R(v,n=2): return float(D(v).quantize(Decimal(1).scaleb(-n),rounding=ROUND_HALF_UP))
def products(a,b): return D(a)*D(b)
def rows(p): return [dict(zip(p['dataset']['headers'],r)) for r in p['dataset']['rows']]
def sheet(p,name):
    s=next(s for s in p['dataset']['sheets'] if s['name']==name)
    return [dict(zip(s['headers'],r)) for r in s['rows']]
def values(rr,k): return [r[k] for r in rr]
def summ(rr,k): return sum((D(r[k]) for r in rr),Decimal(0))
def avg(rr,k): return summ(rr,k)/len(rr)
def vector(v): return [[x] for x in v]
def record(p,*answers):
    assert len(answers)==5
    DERIVED[p['id']]=dict(zip(['t1','t2','t3','t4','bonus'],answers))
def dt(r): return date(r['Year'],r['Month'],r['Day'])
def monthshift(d,n,end=False):
    m=d.year*12+d.month-1+n; y,mm=divmod(m,12); mm+=1
    return date(y,mm,calendar.monthrange(y,mm)[1] if end else min(d.day,calendar.monthrange(y,mm)[1]))
def clean(s): return re.sub(' +',' ',re.sub('[\x00-\x1f]','',s).strip(' '))

for pid,p in PACKAGES.items():
    rr=rows(p); first=rr[0]; six=rr[:6]
    if pid=='L1-A1':
        tapped=summ(rr,'Tapped_t'); charged=summ(rr,'Charged_t'); minutes=summ(rr,'Tap_duration_min')
        record(p,float(tapped),float(minutes/len(rr)),float(tapped/charged*100),float((charged-tapped)/len(rr)),float(tapped/minutes*60))
    elif pid=='L1-A2':
        n=len(values(rr,'Order_code'))
        record(p,sum(isinstance(x,(int,float)) for x in values(rr,'Units')),sum(x!='' for x in values(rr,'Order_code')),sum(isinstance(x,(int,float)) for x in values(rr,'Order_code')),float(summ(rr,'Order_value_CAD')/n),float(summ(rr,'Units')/sum(x!='' for x in values(rr,'Shipment_ref'))))
    elif pid=='L1-A3':
        ys=values(rr,'Yield_MPa'); ts=values(rr,'Tensile_MPa'); es=values(rr,'Elongation_pct')
        record(p,min(ys),max(ts),float(D(max(es))-D(min(es))),max(ts)/min(ys),float((D(max(ys))-D(min(ys)))/avg(rr,'Yield_MPa')*100))
    elif pid=='L1-A4':
        firstfive=rr[:5]; lines=[R(products(r['Stock_units'],r['Unit_cost_CAD'])) for r in firstfive]
        record(p,R(first['Unit_cost_CAD']),vector([math.ceil(r['Demand_units']/r['Pack_size_units']) for r in firstfive]),vector([math.floor(r['Stock_units']/r['Pack_size_units']) for r in firstfive]),vector(lines),R(sum(map(D,lines))))
    elif pid=='L1-A5':
        params={x['name']:D(x['value']) for x in p['dataset']['parameters']}; target=params['Target_mm']; tol=params['Tolerance_mm']
        record(p,float(abs(D(first['Measured_mm'])-target)),float(abs(avg(rr,'Measured_mm')-target)),vector(['Pass' if D(R(abs(D(r['Measured_mm'])-target)))<=tol else 'Hold' for r in rr[:8]]),'Release' if D(min(values(rr,'Measured_mm')))>=target-tol and D(max(values(rr,'Measured_mm')))<=target+tol else 'Hold','Centred' if abs(avg(rr,'Measured_mm')-target)<=D('.05') else 'Investigate')
    elif pid=='L2-A1':
        screen=lambda r:r['Lead_days']<=10 and r['Quality_score_pct']>=95
        order=lambda r:r['Approved']=='Yes' and r['Credit_hold']!='Yes' and screen(r)
        record(p,'Eligible' if screen(first) else 'Review',vector(['Clear' if screen(r) else 'Alert' for r in rr[:8]]),vector(['Allowed' if r['Credit_hold']!='Yes' else 'Blocked' for r in rr[:8]]),vector(['Order' if order(r) else 'Do not order' for r in rr[:8]]),'Escalate' if first['Approved']=='Yes' and (first['Credit_hold']=='Yes' or not screen(first)) else 'Routine')
    elif pid=='L2-A2':
        ratio=lambda r:D(r['Labor_cost_CAD'])/D(r['Units_lost'])
        record(p,'Short' if first['Duration_min']<=10 else 'Medium' if first['Duration_min']<=30 else 'Long',vector(['No lost units' if r['Units_lost']==0 else R(ratio(r)) for r in six]),vector(['Critical' if r['Duration_min']>=45 else 'Priority' if r['Duration_min']>=20 else 'Routine' for r in six]),vector(['No loss' if r['Units_lost']==0 else 'Review' if ratio(r)>15 else 'Accept' for r in rr[:8]]),R(summ(rr,'Labor_cost_CAD')/summ(rr,'Units_lost')))
    elif pid=='L2-A3':
        c=[r for r in rr if r['Region']=='Cove']; cw=[r for r in c if r['Channel']=='Wholesale']; cws=[r for r in cw if r['Category']=='Supplies']
        record(p,float(summ(c,'Revenue_CAD')),len(cw),float(summ(cws,'Revenue_CAD')),R(avg(cw,'Revenue_CAD')),float(summ([r for r in c if r['Revenue_CAD']>=500],'Revenue_CAD')))
    elif pid=='L2-A4':
        m=[r for r in rr if r['Cell']=='Mill-2']; mn=[r for r in m if r['Shift']=='Night']; mns=[r for r in mn if r['Defect_family']=='Seam']; seam=[r for r in rr if r['Defect_family']=='Seam']
        record(p,float(avg(m,'Repair_min')),R(avg(mns,'Repair_cost_CAD')) if mns else 'No repairs',float(summ(seam,'Repair_cost_CAD')),'Prioritize' if avg(mn,'Repair_min')>40 and summ(seam,'Repair_cost_CAD')>1500 else 'Monitor',R(summ(seam,'Repair_cost_CAD')/summ(rr,'Repair_cost_CAD')*100))
    elif pid=='L2-A5':
        z=[r for r in rr if r['Carrier']=='Zephra' and r['Status']=='Delivered']; zn=[r for r in z if r['Region']=='North']; v=[r for r in rr if r['Carrier']=='Vanta' and r['Status']=='Delivered']; a=values(zn,'Lead_days')
        record(p,max(values(z,'Lead_days')),min(a),max(a)-min(a),max(values(v,'Lead_days')) if v else 'No matching shipments','Met' if zn and max(a)<=5 else 'Review')
    elif pid=='L3-A1':
        ss=sheet(p,'Specs'); specs={r['Product_code']:r['Yield_min_MPa'] for r in ss}; get=lambda r:specs.get(r['Product_code'],'Missing')
        record(p,get(first),ss[1]['Yield_min_MPa'],vector(['Missing' if get(r)=='Missing' else 'Pass' if r['Yield_MPa']>=get(r) else 'Hold' for r in six]),R(D(first['Yield_MPa'])/D(get(first)),3),ss[-1]['Product_code'])
    elif pid=='L3-A2':
        ss=sheet(p,'Allowances'); lookup={r['Band_code']:r['Monthly_allowance_CAD'] for r in ss}; get=lambda r:lookup.get(r['Band_code'],'Missing'); allowance=get(first)
        record(p,[r['Band_code'] for r in ss].index(first['Band_code'])+1,ss[2]['Monthly_allowance_CAD'],vector([get(r) for r in six]),R(D(first['Claim_CAD'])-D(allowance)),'Review' if first['Claim_CAD']>allowance else 'Within')
    elif pid=='L3-A3':
        ss=sheet(p,'Matrix'); get=lambda r:next((x.get(r['Orientation'],'Missing') for x in ss if x['Grade_code']==r['Grade_code']),'Missing')
        record(p,[r['Grade_code'] for r in ss].index(first['Grade_code'])+1,['LPA','TWA'].index(first['Orientation'])+1,vector([get(r) for r in six]),'Pass' if first['Energy_J']>=get(first) else 'Hold',ss[0]['LPA']-ss[0]['TWA'])
    elif pid=='L3-A4':
        ss=sheet(p,'Bands'); get=lambda mass:'Invalid' if mass<0 else max((r for r in ss if r['Lower_kg']<=mass),key=lambda r:r['Lower_kg'])['Rate_CAD_per_km']
        record(p,get(first['Mass_kg']),next(i+1 for i,r in enumerate(ss) if r['Rate_CAD_per_km']==get(first['Mass_kg'])),vector([get(r['Mass_kg']) for r in six]),R(products(first['Distance_km'],get(first['Mass_kg']))),get(99.9))
    elif pid=='L3-A5':
        ss=sheet(p,'Limits'); matches=lambda r:[x for x in ss if x['Product_code']==r['Product_code']]; get=lambda r:matches(r)[0]['Hardness_max_HB'] if len(matches(r))==1 else 'Review key'
        record(p,vector([len(matches(r)) for r in six]),get(first),vector([get(r) for r in six]),vector(['Review key' if get(r)=='Review key' else 'Pass' if r['Hardness_HB']<=get(r) else 'Hold' for r in six]),sum(x['Product_code']=='EX-2' for x in ss))
    elif pid=='L4-A1':
        canon=lambda r:clean(r['Raw_inspection_id']).upper()
        record(p,vector([canon(r) for r in six]),clean(first['Raw_inspection_id']),vector(['Retest' if canon(r)=='FN-101' else 'Other' for r in six]),sum(r['Raw_inspection_id']!='' for r in rr),canon(first)+'|CHECK')
    elif pid=='L4-A2':
        skus=[r['Raw_SKU'].strip(' ') for r in six]
        record(p,vector([s[:2].upper() for s in skus]),vector([s[3:6] for s in skus]),vector([s[-1] for s in skus]),vector(['Priority' if s[-1]=='A' else 'Standard' for s in skus]),R(products(first['Stock_units'],first['Unit_price_CAD'])))
    elif pid=='L4-A3':
        split=lambda r:r['Raw_key'].strip(' ').split('|') if r['Raw_key'].count('|')==2 else None
        record(p,vector([split(r)[0] if split(r) else 'Missing' for r in six]),vector([split(r)[2].upper() if split(r) else 'Missing' for r in six]),vector([split(r)[1] if split(r) else 'Missing' for r in six]),vector(['Missing' if not split(r) else 'Transverse' if split(r)[2].upper()=='TWA' else 'Longitudinal' for r in six]),'/'.join(split(first)[:2]))
    elif pid=='L4-A4':
        sp=lambda r:r['Manifest'].split('|')
        record(p,[sp(first)],' / '.join(x for x in sp(rr[1]) if x!=''),vector([sp(r)[1] or 'Unknown' for r in six]),'|'.join(sp(first)),sp(first)[2].upper())
    elif pid=='L4-A5':
        canon=lambda r:r['Raw_sample'].replace('_','-').strip(' ').upper()
        txt=lambda r,n:f'{D(r["Reading_mm"]).quantize(Decimal(1).scaleb(-n),rounding=ROUND_HALF_UP):.{n}f}'
        record(p,vector([canon(r) for r in six]),vector([txt(r,3) for r in six]),vector([r['Technician_name'].title() for r in six]),vector([f'{canon(r)}: {txt(r,2)} mm | '+('Review' if r['Reading_mm']>13 else 'Within') for r in six]),R(first['Reading_mm']))
    elif pid=='L5-A1':
        record(p,vector([dt(r).isoformat() for r in six]),vector([monthshift(dt(r),0,True).isoformat() for r in six]),(monthshift(dt(first),0,True)-dt(first)).days,sum(r['Month']==7 for r in rr),monthshift(dt(first),3,True).isoformat())
    elif pid=='L5-A2':
        renew=lambda r:monthshift(dt(r),r['Renewal_months'])
        record(p,vector([renew(r).isoformat() for r in six]),vector([monthshift(dt(r),r['Renewal_months'],True).isoformat() for r in six]),(renew(first)-dt(first)).days,R(products(first['Units'],first['Unit_cost_CAD'])),monthshift(dt(first),-1,True).isoformat())
    elif pid=='L5-A3':
        holidays=[dt(r) for r in sheet(p,'Holidays')]
        eligible=lambda day,exclude:day.weekday()<5 and day not in exclude
        def deadline(r,exclude=holidays):
            current=dt(r); remaining=r['Target_workdays']
            while remaining:
                current+=timedelta(days=1)
                if eligible(current,exclude): remaining-=1
            return current
        def count(r):
            end=deadline(r); current=dt(r); n=0
            while current<=end:
                n+=eligible(current,holidays); current+=timedelta(days=1)
            return n
        record(p,vector([d.isoformat() for d in holidays]),vector([deadline(r).isoformat() for r in six]),vector([count(r) for r in six]),vector(['Extended' if count(r)>6 else 'Standard' for r in six]),deadline(first,[]).isoformat())
    elif pid=='L5-A4':
        ref=date(2026,10,1)
        years=lambda r:ref.year-dt(r).year-((ref.month,ref.day)<(dt(r).month,dt(r).day))
        months=lambda r:(ref.year-dt(r).year)*12+ref.month-dt(r).month-(ref.day<dt(r).day)
        def week(r):
            start=date(r['Year'],1,1); monday=start-timedelta(days=start.weekday()); return (dt(r)-monday).days//7+1
        record(p,vector([years(r) for r in six]),vector([months(r) for r in six]),vector([week(r) for r in six]),vector(['Established' if years(r)>=3 else 'Developing' for r in six]),sum(r['Year']==2025 for r in rr))
    elif pid=='L5-A5':
        minutes=lambda r:((r['End_hour']*60+r['End_minute'])-(r['Start_hour']*60+r['Start_minute']))%1440
        record(p,vector([f'{r["Start_hour"]:02}:{r["Start_minute"]:02}' for r in six]),vector([R(D(minutes(r))/60) for r in six]),vector([R(D(minutes(r)-r['Break_min'])/60) for r in six]),vector(['Review' if minutes(r)-r['Break_min']>480 else 'Standard' for r in six]),minutes(first))
    elif pid=='L6-A1':
        bad=[r for r in rr if r['Length_mm']!='' and r['Length_mm']<5985]; line=[r for r in bad if r['Line']=='Tovrin']
        record(p,vector(values(bad,'Inspection_code')),vector(sorted(values(bad,'Length_mm'))),len(bad),[[r['Inspection_code'],r['Length_mm']] for r in line],'None')
    elif pid=='L6-A2':
        ordered=sorted(rr,key=lambda r:(-r['Urgency_score'],-r['Order_value_CAD'],r['Order_code'])); full=lambda r:[r[k] for k in p['dataset']['headers']]
        record(p,vector(values(ordered,'Order_code')),vector([first['Order_code'],rr[-1]['Order_code']]),[full(r) for r in ordered[:3]],vector(['High' if r['Urgency_score']>=4 else 'Normal' for r in six]),ordered[2]['Order_code'])
    elif pid=='L6-A3':
        heats=sorted(set(r['Heat_no'] for r in rr if r['Heat_no']!='')); counts=[sum(r['Heat_no']==heat for r in rr) for heat in heats]
        record(p,vector(heats),vector(range(1,7)),vector(counts),[[h,n] for h,n in zip(heats,counts)],sum(r['Heat_no']=='' for r in rr))
    elif pid=='L6-A4':
        secondary=sheet(p,'Secondary'); combined=rr+secondary; full=lambda r:[r[k] for k in p['dataset']['headers']]; valid=[r for r in combined if r['SKU']!='']; order=sorted(valid,key=lambda r:(-r['Stock_units'],r['SKU'],r['Warehouse']))
        record(p,[full(r) for r in rr[:3]+secondary[:3]],[[r['SKU'],r['Stock_units']] for r in rr[:5]],[full(r) for r in combined[:5]],[full(r) for r in combined[2:5]],[full(order[0])])
    elif pid=='L6-A5':
        pairs=list(dict.fromkeys((r['Sample_no'],r['Heat_no']) for r in rr))
        def energy(pair,orientation):
            matches=[r for r in rr if (r['Sample_no'],r['Heat_no'])==pair and r['Orientation'].strip(' ').upper()==orientation]
            return 'Missing' if not matches or matches[0]['Energy_J']=='' else matches[0]['Energy_J']
        orient=[[energy(pair,'LPA'),energy(pair,'TWA')] for pair in pairs]; full=lambda r:[r[k] for k in p['dataset']['headers']]
        record(p,[list(pair) for pair in pairs],[full(first),full(rr[-1])],orient,[list(pair)+out for pair,out in zip(pairs,orient)],'Review' if energy((1,'TH-7401'),'TWA')=='Missing' else 'Measured')
    else: raise AssertionError(pid)

# Private keys are loaded only after all outputs have been independently derived.
KEYS=json.loads((ROOT/'netlify/functions/_shared/excel-sprint-answers.json').read_text())
def equal(a,b,tol):
    if isinstance(a,list) or isinstance(b,list): return isinstance(a,list) and isinstance(b,list) and len(a)==len(b) and all(equal(x,y,tol) for x,y in zip(a,b))
    if isinstance(a,(int,float,Decimal)) and isinstance(b,(int,float)): return abs(float(a)-b)<=tol
    return a==b
required=bonus=requiredcells=bonuscells=0; mismatches=[]; shape_errors=[]
for pid,outs in DERIVED.items():
    p=PACKAGES[pid]; tasks=p['tasks']+[p['bonus']]
    keys={t['id']:t for t in KEYS[pid]['tasks']+[KEYS[pid]['bonus']]}
    for t in tasks:
        actual=outs[t['id']]; key=keys[t['id']]
        n=sum(len(r) for r in actual) if isinstance(actual,list) else 1
        if t['id']=='bonus': bonus+=1; bonuscells+=n
        else: required+=1; requiredcells+=n
        if not equal(actual,key['answer'],key.get('tolerance',1e-6)):
            mismatches.append({'package':pid,'task':t['id'],'public_prompt':t['prompt']})
        if isinstance(actual,list):
            parsed=re.search(r'!([A-Z]+)(\d+):([A-Z]+)(\d+)$',t['output'])
            def num(s):
                n=0
                for c in s: n=n*26+ord(c)-64
                return n
            height=int(parsed[4])-int(parsed[2])+1; width=num(parsed[3])-num(parsed[1])+1
            if len(actual)!=height or any(len(r)!=width for r in actual): shape_errors.append({'package':pid,'task':t['id']})
print(json.dumps({'packages':len(DERIVED),'required_outputs':required,'bonus_outputs':bonus,'required_cells':requiredcells,'bonus_cells':bonuscells,'mismatch_count':len(mismatches),'mismatches':mismatches,'shape_errors':shape_errors},indent=2))

if mismatches or shape_errors: raise SystemExit(1)
