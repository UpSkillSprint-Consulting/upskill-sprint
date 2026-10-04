"""Independent NIST-formula checks using SciPy/NumPy, not calculator JavaScript."""
import json
from pathlib import Path
import numpy as np
from scipy import stats, special
rng=np.random.default_rng(23602)
rows=rng.normal(10,.4,(30,5)); base=rows[:25]; monitor=rows[25:]
c4=np.sqrt(2/4)*np.exp(special.gammaln(2.5)-special.gammaln(2))
mu=base.mean(); rbar=np.ptp(base,axis=1).mean(); sbar=base.std(axis=1,ddof=1).mean()
expected={}
for kind,sigma,spread in [('xr',rbar/2.326,rbar),('xs',sbar/c4,sbar)]:
    expected[kind]={'center':mu,'sigma':sigma,'spread':spread,'lo':mu-3*sigma/np.sqrt(5),'hi':mu+3*sigma/np.sqrt(5)}
    if kind=='xr': expected[kind].update(spreadLo=0,spreadHi=2.115*rbar)
    else: expected[kind].update(spreadLo=max(0,sbar-3*sigma*np.sqrt(1-c4*c4)),spreadHi=sbar+3*sigma*np.sqrt(1-c4*c4))
N=base.size;df=N-base.shape[0];pooled=np.sqrt(np.sum(base.var(axis=1,ddof=1)*4)/df)
cap=[]
for prefix,sigma,dof in [('P',base.std(ddof=1),N-1),('C',pooled,df)]:
    cp=6/(6*sigma);cpk=min(mu-7,13-mu)/(3*sigma);se=np.sqrt(1/(9*N)+cpk*cpk/(2*dof))
    cap.extend([{'index':prefix+'p','value':cp,'interval':(cp*np.sqrt(stats.chi2.ppf([.025,.975],dof)/dof)).tolist()},{'index':prefix+'pk','value':cpk,'interval':[cpk-stats.norm.ppf(.975)*se,cpk+stats.norm.ppf(.975)*se]}])
individual=rng.normal(20,2,35);ib=individual[:25];mr=np.abs(np.diff(ib)).mean()
ewma=[];z=ib.mean()
for i,x in enumerate(individual[25:]):
    z=.2*x+.8*z; width=3*ib.std(ddof=1)*np.sqrt(.2/1.8*(1-.8**(2*(i+1))))
    ewma.append([z,ib.mean()-width,ib.mean()+width])
cusum=[];pos=neg=0
for x in individual[25:]:
    standardized=(x-ib.mean())/ib.std(ddof=1);pos=max(0,pos+standardized-.5);neg=max(0,neg-standardized-.5);cusum.append([pos,neg])
obj={'generator':'NumPy seeded data; SciPy 1.17.0 variance quantiles and gamma; NIST formula definitions','subgroups':rows.tolist(),'expected':expected,'capability':cap,'individuals':individual.reshape(-1,1).tolist(),'imr':{'center':ib.mean(),'sigma':mr/1.128,'mr':mr},'ewma':ewma,'cusum':cusum}
Path('tests/fixtures/calculator-spc-reference.json').write_text(json.dumps(obj,indent=2)+'\n')
