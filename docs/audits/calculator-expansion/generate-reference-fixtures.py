"""Regenerate fixtures with Python + SciPy 1.17.0, from the repository root."""
import json
from scipy import stats
specs=[('normal',stats.norm(2,3),{'mu':2,'sig':3}),('z',stats.norm(),{}),('t',stats.t(7),{'df':7}),('chi2',stats.chi2(2),{'df':2}),('chi2',stats.chi2(1000000),{'df':1000000}),('f',stats.f(5,8),{'d1':5,'d2':8}),('expo',stats.expon(scale=1000),{'lam':.001}),('weibull',stats.weibull_min(1,scale=2),{'beta':1,'eta':2}),('lognormal',stats.lognorm(.5,scale=2.718281828459045),{'mu':1,'sig':.5}),('gamma',stats.gamma(1,scale=2),{'k':1,'theta':2}),('uniform',stats.uniform(2,3),{'a':2,'b':5}),('beta',stats.beta(1,1),{'al':1,'be':1}),('binomial',stats.binom(20,.2),{'n':20,'p':.2}),('poisson',stats.poisson(5),{'lam':5}),('geometric',stats.geom(.2),{'p':.2}),('negbinom',stats.nbinom(3,.2,loc=3),{'r':3,'p':.2}),('hypergeom',stats.hypergeom(100,20,10),{'N':100,'K':20,'n':10})]
r=[]
for id,d,p in specs:
    discrete=id in ['binomial','poisson','geometric','negbinom','hypergeom']
    for q in [1e-8,.01,.5,.99,1-1e-8]:
        x=float(d.ppf(q))
        r.append({'id':id,'params':p,'x':x,'prob':q,'pdf':float(d.pmf(x) if discrete else d.pdf(x)),'cdf':float(d.cdf(x)),'upper':float(d.sf(x-1 if discrete else x))})
    if id in ['gamma','chi2','weibull','beta']:r.append({'id':id,'params':p,'x':0,'pdf':float(d.pdf(0)),'cdf':float(d.cdf(0)),'upper':float(d.sf(0))})
json.dump(r,open('tests/fixtures/calculator-distributions.json','w'),indent=2)
