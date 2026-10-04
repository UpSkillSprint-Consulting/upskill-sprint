"""Independent Decimal reference cash-flow calculations; no JavaScript dependencies."""
from decimal import Decimal, getcontext
from pathlib import Path
import json
getcontext().prec=40
cases=[]
for cash,initial,recurring,years,discount,sensitivity in [(50000,12000,8000,3,10,20),(1000,3000,100,5,0,50),(100,1000,200,3,12,100),(0,0,0,1,0,0)]:
    results=[]
    for name,m in [('Low',1-Decimal(sensitivity)/100),('Base',Decimal(1)),('High',1+Decimal(sensitivity)/100)]:
        annual=Decimal(cash)*m;net=annual-recurring;r=Decimal(discount)/100
        npv=-Decimal(initial)+sum(net/(1+r)**t for t in range(1,years+1))
        cost=Decimal(initial+recurring*years)
        payback=Decimal(0) if initial==0 and net>=0 else Decimal(initial)/net if net>0 and Decimal(initial)/net<=years else None
        results.append({'name':name,'npv':float(npv),'netTotal':float(-initial+net*years),'roi':float((annual*years-cost)/cost) if cost else None,'payback':float(payback) if payback is not None else None})
    cases.append({'inputs':dict(cash=cash,initial=initial,recurring=recurring,years=years,discount=discount,sensitivity=sensitivity,avoidance=999999,capacity=888888),'expected':results})
Path('tests/fixtures/calculator-quality-cost-reference.json').write_text(json.dumps({'source':'Python Decimal 40-digit independent discounted cash-flow arithmetic','cases':cases},indent=2)+'\n')
