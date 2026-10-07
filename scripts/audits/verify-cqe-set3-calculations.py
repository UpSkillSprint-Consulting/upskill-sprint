#!/usr/bin/env python3
"""Independent numerical audit. Requires numpy/scipy; run from any directory.

Uses problem inputs (including values read from the original image crops), not
the worked solutions. Verifies computed results and the selected answer text.
Writes machine-readable evidence when --output PATH is supplied.
"""
import argparse
import json
import math
import re
import subprocess
from pathlib import Path

import numpy as np
from scipy import stats

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--bank', type=Path, help='Optional extracted bank for work in progress')
parser.add_argument('--output', type=Path)
args = parser.parse_args()
if args.bank:
    bank = json.loads(args.bank.read_text())
else:
    bank = json.loads(subprocess.check_output(['node', '-e', r"const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('test-bank.html','utf8');process.stdout.write(JSON.stringify(vm.runInNewContext(s.match(/var CQE_SET3=(\[[\s\S]*?\n\s*\]);/)[1])));"], cwd=ROOT))

checks = []
def check(q, method, value, expected, tolerance, answer):
    actual = np.asarray(value, dtype=float)
    assert np.allclose(actual, expected, rtol=0, atol=tolerance), (q, method, value, expected)
    selected = bank[q-1]['options'][bank[q-1]['answer']]
    normalize = lambda s: re.sub(r'\s+', ' ', s.replace('−', '-').replace('–', '-')).strip()
    assert normalize(answer) in normalize(selected), (q, selected, answer)
    checks.append(dict(question=q, method=method, result=actual.tolist(), expected=expected, tolerance=tolerance, selectedAnswer=selected))

def scalar(q, method, value, expected, places, answer=None):
    check(q, method, value, expected, 0.500001 * 10**(-places), str(expected) if answer is None else answer)

N = stats.norm
T = stats.t
C = stats.chi2
B = stats.binom
P = stats.poisson
sqrt = math.sqrt
exp = math.exp
scalar(38,'1 - (1 - .95)^2',1-(1-.95)**2,.9975,4)
check(49,'8 ± .05',[8-.05,8+.05],[7.95,8.05],1e-12,'7.95 and 8.05')
scalar(71,'Binomial CDF(2;45,.05)',B.cdf(2,45,.05),.6077,4)
scalar(74,'AOQ = .05 * Binomial CDF(2;45,.05)',.05*B.cdf(2,45,.05),.0304,4)
for q in [79,280]: scalar(q,'P(X≤1)+P(X≥4); X~Bin(50,.1)',B.cdf(1,50,.1)+B.sf(3,50,.1),.7835,4)
scalar(105,'12 sigma specification width / 6 sigma',12/6,2,0,'2.0')
x=[5,8,12,3,2,7,6,5]
check(113,'Sample mean and median', [np.mean(x),np.median(x)],[6,5.5],1e-12,'6 minutes')
scalar(114,'Sample SD, ddof=1',np.std([3.2,3.1,3.4,3.1,3.2,3.3,3.2],ddof=1),.1069,4,'0.1069')
scalar(121,'Complement',1-.02,.98,2)
scalar(123,'Mutually exclusive intersection',0,0,0)
scalar(124,'Exponential CDF, mean=5, t=3',-math.expm1(-3/5),.4512,4)
scalar(125,'Normal survival at z=1.5',N.sf((18-15)/2),.0668,4)
scalar(127,'Normal overfill probability',N.sf((24.08-24.01)/.025),.00256,5)
scalar(129,'Poisson survival P(X≥2), mean=5',P.sf(1,5),.9596,4)
scalar(131,'Binomial PMF(4;15,.1)',B.pmf(4,15,.1),.0428,4)
scalar(132,'Expected sample mean equals population mean',24,24,0)
scalar(133,'Normal sampling mean survival, n=16',N.sf((24.04-24)/(.05/sqrt(16))),.0007,4)
scalar(134,'Standard error sqrt(64/16)',sqrt(64/16),2,0)
check(137,'99% t interval, df=14',T.interval(.99,14,loc=4.3,scale=.51/sqrt(15)),[3.908,4.692],.00051,'(3.908, 4.692)')
scalar(138,'Ceiling of (z .975 * .5/.15)^2',math.ceil((N.ppf(.975)*.5/.15)**2),43,0)
x=np.array([10.37,11.50,9.80,10.65,11.95,10.15,9.52]);v=x.var(ddof=1)
check(139,'Normal variance CI: 6s² / chi-square quantiles',6*v/C.ppf([.975,.025],6),[.324,3.788],.00051,'(0.324, 3.788)')
scalar(170,'Inspection plus test equipment',12000+65000,77000,0,'$77,000')
scalar(171,'No listed external failure costs',0,0,0,'$0')
scalar(226,'Available seconds / demanded units',8*3600/550,52.36,2)
check(227,'Cycle 7200/45 exceeds takt 7200/50',7200/45>7200/50,1,0,'Cycle time > Takt time')
check(229,'Cycle 50 exceeds takt 36000/750',50>36000/750,1,0,'No, since cycle time > takt time')
scalar(231,'Availability percent, breaks excluded',100*(480-30-35-10)/(480-30),90,0,'90%')
scalar(246,'Survivors after two intervals / initial count',(450-7-16)/450,.9489,4)
scalar(247,'Failures / initial units / interval width',27/(450*100),.0006,4)
scalar(248,'Failures / survivors at interval start / width',27/((450-7-16-19)*100),.00066,5)
scalar(249,'Five independent series components',.995**5,.9752,4)
scalar(250,'Five independent parallel components',1-.005**5,1,4,'1.0000')
scalar(251,'Series system conditional on one failed component',1,1,0,'1.00')
scalar(252,'Two independent series components',.8**2,.64,2)
scalar(253,'At least 3 of 6 independent components survive',B.sf(2,6,.88),.9975,4)
scalar(254,'Four sequential exponential components: Poisson CDF(3;8)',P.cdf(3,8),.0424,4)
scalar(255,'Failures / accumulated operating exposure',28/3750,.0075,4)
check(256,'MTTF=-400/log(.645); closest offered 910',-400/math.log(.645),912.190, .001,'910')
scalar(257,'Exponential survival at mean lifetime',exp(-1),.368,3)
scalar(258,'Survival percent, no intermediate rounding',100*exp(-1000/525),14.89,2,'14.89%')
scalar(259,'Exponential failure CDF',-math.expm1(-6/5),.6988,4)
scalar(260,'Exponential survival',exp(-500/900),.5738,4)
scalar(261,'Survival percent at MTTF',100*exp(-1),36.79,2,'36.79%')
scalar(262,'Steady availability with MTBF=1250, MTTR=5',1250/1255,.996,3)
scalar(263,'Availability from exposure and total repair time',15000/(15000+515*8),.7845,4)
scalar(271,'RPN product',8*2*7,112,0)
check(272,'Candidate RPN exceeds threshold 40',3*4*4>40,1,0,'Severity = 3, Occurrence = 4, Detection = 4')
scalar(281,'ASN=50+75 P(X=2); X~Bin(50,.1)',50+75*B.pmf(2,50,.1),55.85,2)
x=np.array([51,47,45,39]);m=x.mean();s=x.std(ddof=1);qu=(52-m)/s;ql=(m-37)/s
check(290,'n=4 unbiased tail estimates: max(0,.5-Q/3); compare total with M=1.49%',100*(max(0,.5-qu/3)+max(0,.5-ql/3)),6.666666667,1e-8,'No, since the total percentage nonconforming is more')
scalar(312,'Mean measurement minus reference',np.mean([6.05,5.94,5.98,6.01,6.03,5.97])-6,-.003,3)
scalar(315,'Sum variance components',.8842+.2466,1.1308,4)
vr=1.233;vp=(11-.867)/6;vop=max(0,(.033-.867)/15);vi=max(0,(.867-1.233)/3)
scalar(316,'Full ANOVA: repeatability plus nonnegative operator/interaction components',vr+vop+vi,1.233,3)
check(317,'Repeatability fraction of full-model total variance',100*vr/(vr+vp+vop+vi),42.20,.01,'repeatability should be investigated')
scalar(318,'6 * measurement SD / tolerance',6*sqrt(vr+vop+vi)/20,.333,3)
scalar(323,'P(nonconforming | overnight)',23/88,.26,2)
scalar(324,'Expected invoice-error count',np.dot([0,1,2,3,4],[.86,.06,.04,.03,.01]),.27,2)
scalar(325,'One-sample t=(17.98-18)/(.03/sqrt24)',(17.98-18)/(.03/sqrt(24)),-3.266,3)
check(328,'Exact upper binomial test with 7 of 56, null p=.10',B.sf(6,56,.1)>.05,1,0,'Do not reject H')
scalar(330,'Right-tailed pooled t critical; df=28+25-2',T.ppf(.99,51),2.402,3)
scalar(331,'Ratio of sample variances',2.34/2.04,1.147,3)
p1=28/1250;p2=18/1175;se=sqrt(p1*(1-p1)/1250+p2*(1-p2)/1175)
check(332,'Unpooled two-proportion 90% CI',np.array([-1,1])*N.ppf(.95)*se+p1-p2,[-.002,.016],.00051,'(-0.002, 0.016)')
scalar(333,'Type II error = 1-power',1-.8,.20,2,'0.20')
d=np.array([10.2,9.8,10.1,10.3,10.4])-np.array([10.0,9.9,10.3,10.0,10.3]);dse=d.std(ddof=1)/sqrt(5)
scalar(337,'Paired t from original table',d.mean()/dse,.647,3,'0.647')
scalar(338,'Equal-probability GOF from [32,28,45,35]',stats.chisquare([32,28,45,35]).statistic,4.514,3)
check(340,'ANOVA p-value from F=1.70, df=(2,12)',stats.f.sf(1.70,2,12)>.05,1,0,'Do not reject H')
check(343,'Independence test from original 3x2 table',stats.chi2_contingency([[94,5],[87,10],[65,23]],correction=False).statistic,19.071,.001,'not independent')
scalar(344,'Coefficient of x is slope',2.5,2.5,1)
scalar(345,'Predicted cholesterol',140+.23*130,169.9,1)
x=np.array([5.2,6.1,3.2,4.6]);y=np.array([26.7,27.5,24.9,25.5]);lr=stats.linregress(x,y)
scalar(346,'OLS slope from four paired observations',lr.slope,.92,2)
scalar(350,'Correlation sign from slope; magnitude sqrt(R²)',-sqrt(.85),-.92,2)
check(365,'New p within three-sigma p-chart limits',11/150 < .037+3*sqrt(.037*.963/150),1,0,'within the control limits')
scalar(366,'p-chart UCL',.048+3*sqrt(.048*.952/3575),.0587,4)
scalar(368,'u-chart UCL',.73+3*sqrt(.73/35),1.16,2)
for q,mu,sd,lo,hi,out,target in [(377,5.45,.085,5.25,5.75,True,.0095),(378,2.5014,.0568/2.704,2.45,2.55,False,.9825),(574,1.4983,.0906/2.059,1.42,1.58,True,.0693),(591,10.45,1.05,8.3,13.3,False,.9764)]:
    inside=N.cdf((hi-mu)/sd)-N.cdf((lo-mu)/sd)
    scalar(q,'Normal specification probability using unrounded z scores',1-inside if out else inside,target,4)
check(380,'Cp and Cpk',[9/6/1.1,min(25.85-20.98,20.98-16.85)/3/1.1],[1.36,1.25],.005,'Cₚ = 1.36; Cₚₖ = 1.25')
scalar(381,'Minimum one-sided capability index',min(19-13,13-9)/3/1.5,.89,2,'0.89')
scalar(382,'Cp from range-based within-subgroup sigma',.1/(6*(.0568/2.704)),.79,2)
scalar(384,'Treatment count in 2^3 design',2**3,8,0)
scalar(385,'Number of manipulated factors',3,3,0)
check(391,'F-test significant terms from MS/error MS',[stats.f.sf(v/.1325,1,8)<.05 for v in [35.03,30.54,.10,2.98,.02,.03,.002]],[1,1,0,1,0,0,0],0,'A, B, and AB')
scalar(393,'Saturated 2^4 model leaves no residual df',16-1-(4+6+4+1),0,0)
scalar(412,'Incoming inspection appraisal total',60000,60000,0,'$60,000')
scalar(429,'Prevention design support and preventive field trials',12000+110000,122000,0,'$122,000')
scalar(457,'Square root of sum of squared component SDs',math.hypot(.9214,.5873),1.0927,4)
scalar(463,'Poisson approximation, mean=80*.025',P.cdf(2,80*.025),.677,3)
check(477,'Unilateral specification limits',[10,10+.002],[10,10.002],1e-12,'10.000 and 10.002')
scalar(482,'First-stage decision P(X≤2)+P(X≥5); Bin(75,.015)',B.cdf(2,75,.015)+B.sf(4,75,.015),.9022,4)
scalar(488,'Maximum product of three 1–10 scales',10**3,1000,0)
scalar(491,'Exponential CDF at MTTF',-math.expm1(-1),.6321,4)
scalar(492,'Exponential failure percent',100*(-math.expm1(-1000/525)),85.11,2,'85.11%')
scalar(497,'2-of-3 independent system',B.sf(1,3,.95),.9928,4)
scalar(499,'Mixed-level full factorial count',4*2*3*2,48,0)
scalar(500,'Total exposure / failures, rounded to whole hours',3750/28,134,0)
scalar(502,'Availability MTBF/(MTBF+MTTR)',1250/(1250+48),.963,3)
scalar(508,'Three independent parallel components',1-(1-.99)*(1-.92)*(1-.95),.99996,5)
scalar(511,'Exponential CDF at mean lifetime',-math.expm1(-1),.632,3)
scalar(516,'Availability from accumulated exposure and repair time',2800/(2800+62*3),.9377,4)
scalar(520,'Exponential failure percent',100*(-math.expm1(-10/8)),71.35,2,'71.35%')
check(522,'All seven F tests have p>.05',[stats.f.sf(v/5,1,8)>.05 for v in [16,12,5,2.5,1.5,.5,.25]],[1]*7,0,'None of the main effects or interactions')
scalar(524,'Three independent series components',.99*.92*.95,.8653,4)
check(531,'SE=5.5/sqrt32',5.5/sqrt(32),.972271824,1e-8,'5.5/√32')
check(533,'New subgroup mean inside, range outside',[(26.75-.729*8.1)<np.mean([20,29,40,25])<(26.75+.729*8.1),np.ptp([20,29,40,25])>2.282*8.1],[1,1],0,'only the range was outside')
p=6/56
check(536,'Wald 90% interval',p+np.array([-1,1])*N.ppf(.95)*sqrt(p*(1-p)/56),[.0392,.1751],.000051,'(0.0392, 0.1751)')
scalar(537,'Standard normal interval probability',N.cdf(.58)-N.cdf(-1.02),.5652,4)
scalar(543,'One-sample z with known sigma',(124-120)/(1.25/sqrt(15)),12.39,2)
scalar(545,'Intersection of independent events',.62*.09,.0558,4)
scalar(548,'Required n rounded upward',math.ceil((N.ppf(.995)*.5/.05)**2),664,0)
check(549,'np upper limit versus new count',18>150*.045+3*sqrt(150*.045*.955),1,0,'outside the control limits')
scalar(552,'Predicted cholesterol',135+.28*175,184,0)
check(553,'Lower-tail variance chi-square decision',21*1.75/4<C.ppf(.05,21),1,0,'Reject H')
scalar(554,'Normal tail beyond 4.5 sigma, parts per million',1e6*(N.sf(4.5)+N.sf(7.5)),3.4,1)
check(555,'Chi-square independence from original counts',stats.chi2_contingency([[82,18],[75,19],[45,14]],correction=False).statistic,.757,.001,'Do not reject H')
scalar(557,'c-chart UCL',5.68+3*sqrt(5.68),12.83,2)
x=np.array([9.66,8.25,12.46,12.35,11.52,8.92,11,11.12,11.13]);v=x.var(ddof=1)
check(558,'Normal standard-deviation 99% CI',np.sqrt(8*v/C.ppf([.995,.005],8)),[.885,3.576],.00051,'(0.885, 3.576)')
scalar(560,'Intercept of fitted line',-19,-19,0)
scalar(561,'Mutually exclusive union',.4+.13,.53,2)
scalar(562,'Power=1-beta',1-.15,.85,2)
scalar(564,'Mode of waiting-time data',stats.mode([5,8,12,3,2,7,6,5]).mode,5,0,'5 minutes')
scalar(565,'Cpk minimum one-sided index',min(13.3-10.45,10.45-8.3)/(3*1.05),.68,2)
check(566,'GOF original counts [22,34,47,45]',stats.chisquare([22,34,47,45]).statistic,10.757,.001,'Reject H')
scalar(568,'Normal sampling mean lower tail n=9',N.cdf((23.96-24)/(.05/sqrt(9))),.0082,4)
scalar(576,'Conditional probability day given nonconforming',5/38,.13,2)
x=np.array([.183,.190,.180,.189,.190,.188,.186,.185])
check(577,'95% t interval from raw eight diameters',T.interval(.95,7,loc=x.mean(),scale=x.std(ddof=1)/sqrt(8)),[.183,.189],.00051,'(0.183, 0.189)')
check(578,'Regression F test df=(1,14)',stats.f.sf(52.53,1,14)<.05,1,0,'significant linear association')
scalar(579,'u lower limit truncated at zero',max(0,.214-3*sqrt(.214/28)),0,0)
check(583,'Two-sample z statistic', (15.95-16.02)/sqrt(.05**2/24+.04**2/25),-5.398,.001,'Reject H')
scalar(586,'Variance E(X²)-E(X)²',np.dot(np.arange(5)**2,[.86,.06,.04,.03,.01])-.27**2,.5771,4)
scalar(588,'SE=sqrt(variance/n)',sqrt(85/24),1.88,2)
check(592,'Factor/interaction F tests from original mean squares',[stats.f.sf(v/(622/6),df,6)<.05 for v,df in [(1918.5/2,2),(21.33,1),(561.17/2,2)]],[1,0,0],0,'Factor A has a significant effect')
scalar(593,'Pearson r from four raw data pairs',lr.rvalue,.96,2)
scalar(596,'Two-sided t critical df=23',T.ppf(.975,23),2.069,3,'±2.069')
check(597,'Paired t interval from original table',T.interval(.95,4,loc=d.mean(),scale=dse),[-.197,.317],.00051,'(-0.197, 0.317)')
scalar(598,'Exponential survival mean=4 at t=5',exp(-5/4),.2865,4)
check(599,'Levels = df+1',[5+1,4+1],[6,5],0,'6, 5')
scalar(600,'Sample variance ddof=1',np.var([5.3,8.6,7.2,9.1,7.5,3.5],ddof=1),4.459,3)
check(601,'Moving-range limits n=2',[0,3.267*1.75],[0,5.72],.005,'LCL = 0, UCL = 5.72')
scalar(606,'Cpk minimum one-sided index',min(16.75-16.5,16.5-14.25)/(.1*3),.83,2,'0.83')
scalar(607,'Poisson mean = variance = SD squared',3.04**2,9.24,2)
check(610,'Cycle 40 meets takt 36000/750',40<=36000/750,1,0,'Yes, since cycle time ≤ takt time')

if args.output:
    args.output.write_text(json.dumps({'questionsChecked':len(set(x['question'] for x in checks)), 'checks':checks},ensure_ascii=False,indent=2)+'\n')
print(f'{len(checks)} independent numerical checks passed for {len(set(x["question"] for x in checks))} questions.')
