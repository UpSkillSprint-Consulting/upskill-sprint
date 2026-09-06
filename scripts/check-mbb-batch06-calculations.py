"""Independent recomputation from the published case inputs (no textbook data inference)."""
from pathlib import Path
import math,json,numpy as np,itertools
R=Path(__file__).resolve().parents[1];out={'basis':'Recomputed for reconstructed candidate; supplied summaries are not recovered raw observations.'}
out['Q130']=[{'projects':['M']+[x for x,b in zip(['A','B'],bits) if b],'BeltMonths':4+5*sum(bits),'NPV_millions':round(.7+.9*bits[0]+1.2*bits[1],2),'feasible':4+5*sum(bits)<=10}for bits in itertools.product([0,1],repeat=2)]
out['Q136']={'ABDE':3+4+2+4,'ACE':3+4+4,'unit':'working weeks','floatC':2}
out['Q138']={'NPV_Y_minus_X':510000-420000,'limitation':'NPVs/IRRs supplied, not independently derivable without cash flows.'}
out['Q139']={'total':sum([.5,.4,.6,.3]),'totalWithoutAvoidance':.5+.4+.6,'eligibleRealizedHardSavings':.6,'unit':'million currency units'}
po=(27+1893)/2000;pe=((27+53)*(27+27)+(27+1893)*(53+1893))/2000**2
out['Q146']={'observedAgreement':po,'chanceAgreement':pe,'kappa':(po-pe)/(1-pe),'sensitivity':27/80,'specificity':1893/1920,'repeatabilityIdentified':False}
out['Q147']={'n':80,'pointwiseBound':1.96/math.sqrt(80),'scope':'ACF values supplied; no joint p-value reconstructed.'}
B=np.array([[-3.,-1.],[-1.,-2.]]);b=np.array([6.,4.]);x=-.5*np.linalg.solve(B,b);out['Q148']={'stationaryPoint':x.tolist(),'predictedYield':float(82+b@x+x@B@x),'quadraticEigenvalues':np.linalg.eigvalsh(B).tolist(),'HessianEigenvalues':np.linalg.eigvalsh(2*B).tolist(),'classification':'Fitted maximum, not confirmed operation'}
out['Q149']={'lossProbabilityIdentified':False,'reason':'Mean and two percentiles do not determine the distribution.'};out['Q150']={'oldKey':'B','correctedKey':'D','reason':'Feedback compensation can hide process drift in the controlled response.'}
(R/'docs/audits/mbb-set2-batch06/independent-calculations.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
