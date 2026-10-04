"""Independent reference-data audit; run from repository root with SciPy installed.
Recomputes every inexpensive table cell; samples Tukey/Duncan across all alphas.
Does not regenerate source tables or infer exactness from stored source claims.
"""
import json, math, collections
from pathlib import Path
import numpy as np
import scipy
from scipy import stats, special, integrate

ROOT = Path('reference-tables')
counts = collections.Counter()
failures = []
def read(name):
    return json.loads((ROOT / (name + '.json')).read_text())
def check(family, key, actual, expected, tolerance):
    counts[family] += 1
    if not math.isfinite(float(expected)) or abs(actual - expected) > tolerance:
        failures.append(dict(family=family, key=str(key), actual=actual, expected=float(expected), tolerance=tolerance))
def df(v):
    return math.inf if v == 'inf' else float(v)

d = read('z_table')
for side in ['negative_z', 'positive_z']:
    for row in d[side]:
        for col, value in row['values'].items():
            z = row['z'] + (-1 if side == 'negative_z' else 1) * float(col)
            check('Z', z, value, stats.norm.cdf(z), .00005001)
for name, dist in [('t', stats.t), ('chisquare', stats.chi2)]:
    for row in read(name + '_table')['rows']:
        for a, value in row['values'].items():
            expected = stats.norm.isf(float(a)) if row['df'] == 'inf' else dist.isf(float(a), row['df'])
            check(name, (row['df'], a), value, expected, .0005001)
for a, table in read('f_tables')['tables'].items():
    for row in table['rows']:
        for col, value in row['values'].items():
            v1, v2, alpha = df(col), df(row['v2']), float(a)
            expected = (1 if math.isinf(v1) and math.isinf(v2) else
                        stats.chi2.isf(alpha, v1) / v1 if math.isinf(v2) else
                        v2 / stats.chi2.ppf(alpha, v2) if math.isinf(v1) else stats.f.isf(alpha, v1, v2))
            check('F', (a, col, row['v2']), value, expected, .0005001)
for name, dist, col in [('binomial', stats.binom, 'p'), ('poisson', stats.poisson, 'lambda')]:
    for mode, method in [('pmf', dist.pmf), ('cmf', dist.cdf)]:
        for row in read(name + '_tables')[mode]['rows']:
            for param, value in row['values'].items():
                args = (row['x'], row['n'], float(param)) if name == 'binomial' else (row['x'], float(param))
                check(name + '_' + mode, args, value, method(*args), .00005001)
for row in read('exponential_table')['rows']:
    for col, expected in [('area_left', -math.expm1(-row['x'])), ('area_right', math.exp(-row['x']))]:
        check('exponential', (row['x'], col), row[col], expected, .000005001)
for name in ['median_ranks', 'normal_scores']:
    for row in read(name + '_table')['rows']:
        for n, value in row['values'].items():
            expected = (row['i'] - .3) / (int(n) + .4) if name == 'median_ranks' else stats.norm.ppf((row['i'] - .375) / (int(n) + .25))
            check(name, (row['i'], n), value, expected, .0005001 if name == 'median_ranks' else .005001)
for row in read('sigma_level_table')['rows']:
    z = row['sigma_level']
    for side, p in [('no_shift', 2 * stats.norm.sf(z)), ('with_1_5_shift', stats.norm.sf(z - 1.5) + stats.norm.cdf(-z - 1.5))]:
        # Existing centered PPM is rounded to a whole PPM; shifted PPM to a tenth.
        for key, expected, tol in [('percent_in_spec', (1-p)*100, .00005001), ('percent_defective', p*100, .00005001), ('ppm', p*1e6, .500001 if side == 'no_shift' else .050001)]:
            check('sigma_level', (z, side, key), row[side][key], expected, tol)
for side in ['one_sided', 'two_sided']:
    for gamma, table in read('tolerance_factors_table')[side]['tables'].items():
        for row in table['rows']:
            n = row['n']
            for p, value in row['values'].items():
                expected = (stats.nct.ppf(float(gamma), n-1, stats.norm.ppf(float(p))*math.sqrt(n))/math.sqrt(n) if side == 'one_sided' else
                            stats.norm.ppf((1+float(p))/2)*math.sqrt((n-1)*(1+1/n)/stats.chi2.ppf(1-float(gamma), n-1)))
                check('tolerance_' + side, (gamma, n, p), value, expected, .0005001)

# Independent Gaussian quadrature of range order statistics, not stored d2/d3.
nodes, weights = np.polynomial.legendre.leggauss(180)
x = 9*nodes[:, None]; wx = 9*weights[:, None]
y = x + (9-x)*(nodes[None, :]+1)/2; wy = (9-x)*weights[None, :]/2
for row in read('control_chart_constants_table')['rows']:
    n = row['n']
    c4 = math.sqrt(2/(n-1))*math.exp(special.gammaln(n/2)-special.gammaln((n-1)/2))
    d2 = 2*n*integrate.quad(lambda z: z*stats.norm.pdf(z)*stats.norm.cdf(z)**(n-1), -10, 10, epsabs=1e-10)[0]
    moment2 = np.sum(wx*wy*(y-x)**2*n*(n-1)*stats.norm.pdf(x)*stats.norm.pdf(y)*(stats.norm.cdf(y)-stats.norm.cdf(x))**(n-2))
    d3 = math.sqrt(moment2-d2*d2); spread = math.sqrt(1-c4*c4)
    values = {'c4':c4,'1/c4':1/c4,'d2':d2,'1/d2':1/d2,'d3':d3,'A':3/math.sqrt(n),'A2':3/(d2*math.sqrt(n)),'A3':3/(c4*math.sqrt(n)),
              'B3':max(0,1-3*spread/c4),'B4':1+3*spread/c4,'B5':max(0,c4-3*spread),'B6':c4+3*spread,
              'D1':max(0,d2-3*d3),'D2':d2+3*d3,'D3':max(0,1-3*d3/d2),'D4':1+3*d3/d2}
    for key, expected in values.items(): check('control_constants', (n,key), row[key], expected, .0000501)

# Studentized-range inversion is expensive: seeded coverage of tails, df and k.
for name in ['studentized_range', 'duncan_multiple_range']:
    rng = np.random.default_rng(20261004)
    for a, table in read(name + '_table')['tables'].items():
        rows = table['rows']; cols = list(rows[0]['values'])
        points = {(0,0),(0,len(cols)-1),(len(rows)-1,0),(len(rows)-1,len(cols)-1)}
        points |= {(int(rng.integers(len(rows))),int(rng.integers(len(cols)))) for _ in range(4)}
        for ri, ci in sorted(points):
            row, k = rows[ri], int(cols[ci]); alpha = float(a)
            probability = (1-alpha)**(k-1) if name.startswith('duncan') else 1-alpha
            expected = stats.studentized_range.ppf(probability,k,df(row['df']))
            check(name, (a,row['df'],k),row['values'][str(k)],expected,.0005001)

digits = np.random.default_rng(20260901).integers(0,10,size=(50,50))
for row, generated in zip(read('random_number_table')['rows'],digits):
    check('random_digits',row['line'],int(''.join(row['blocks'])==''.join(map(str,generated))),1,0)

report = dict(scipy=scipy.__version__,checks=dict(counts),total=sum(counts.values()),failures=failures)
Path('docs/audits/calculator-expansion/lookup-data-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
raise SystemExit(bool(failures))
