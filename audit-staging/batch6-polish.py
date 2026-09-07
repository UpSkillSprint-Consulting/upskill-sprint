# Retain all answer positions and all item-specific rationales; remove systematic length cues.
choices={
126:'Validate prediction separately; require causal identification before interpreting these observational coefficients as intervention effects.',
127:'Investigate heteroscedasticity and mean-model adequacy; justify variance modeling or robust inference before trusting conventional standard errors.',
129:'Long versus short has about 2.35 times the failure odds; observed risks are 34% versus 18%.',
131:'The fitted Hessian eigenvalues −4 and −10 indicate a maximum; check adequacy and confirm the process candidate.',
132:'Address sparse events and complexity; perform selection inside validation folds, evaluate shrinkage, and seek representative outcome data.',
133:'Flag the definition: centered VIF is at least one; tolerance 0.60 would instead imply VIF 1.67.',
134:'The residual statistic suggests positive dependence; review time structure, uncertainty methods and applicable formal-test bounds.',
135:'Inspect shared predictor information, VIFs, joint evidence and intervals before concluding that these predictors lack useful association.',
136:'Compare held-out error, uncertainty and operational adequacy; favor simplicity when validated performance is sufficiently comparable.',
137:'The slope passes the stated test; the predicted 1.0-day contrast warrants evaluation of uncertainty, cost and causal feasibility.',
138:'Effects are A = +26 MPa and B = +2 MPa; their significance and interaction remain undetermined.',
140:'I = ABC aliases A with BC, B with AC and C with AB; the model is saturated.',
141:'Add the D-only sign reversal, I = −ABCD; combined fractions separate D and ABC if stages remain comparable.',
142:'Interpret contrasts conditionally on sparsity assumptions; this saturated resolution III design needs targeted follow-up to separate aliases.',
143:'Center points identify an aggregate pure-curvature contrast, not separate quadratic terms; augment with suitable additional settings.',
144:'Fitted effects are +9, +16 and +22 nm/min; significance and physical additivity are not established by this display.',
145:'Use I = ABCDE, resolution V; the mutually clear main-plus-two-factor model has 16 parameters and no residual degrees of freedom.',
146:'The expected 1 MPa contrast has SE 4.24 MPa; assess safe wider spacing, replication or justified blocking.',
147:'Retain hierarchy and examine A×B at each C level; nonsignificant marginal tests do not establish zero conditional effects.',
149:'Account for additive operator shifts to improve precision; assess relevant treatment-by-operator differences rather than assuming additivity.',
150:'The DSD protects main effects from second-order aliasing; its 17 runs cannot freely estimate all 45 quadratic-model coefficients.'}
keys=[2,0,1,0,3,0,1,3,1,2,1,0,0,3,3,3,1,1,1,3,3,3,1,1,0]
for p in P:
 if p['number'] in choices:p['options'][keys[p['number']-126]]=choices[p['number']]
 if p['number']==134:p['stem']=p['stem'].replace('the predictor and errors are assumed exogenous','the predictor is assumed exogenous')
