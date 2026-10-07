# CQE Set 3: second full question audit

Audit date: 7 October 2026. Baseline: `970ac58d25d71a2c07f52ca8b6fb5f4e2e6ffcd0`.

Reviewed all **613 questions individually**: stem, four choices, keyed answer, worked explanation, source mapping and required visual. Corrected **221 questions**; **392** needed no further change. Independently recomputed **143 numerical questions**. Re-inspected all **47 source crops used by 58 questions**.

The review preserves the original pool, stable IDs and original visual crops. Source disagreement is recorded explicitly. This audit is a reasoned review, not an ASQ endorsement or a guarantee that no error can remain.

## Material findings

| Questions | Correction |
| --- | --- |
| 167, 172, 401 | Corrected purpose-specific cost classification and outsourced internal-audit classification. |
| 281, 284, 286, 482 | Corrected ASN, sampling-table selections and first-stage decision probability. Q286 follows the AQL substitution to the valid 50/50 double plan. |
| 299, 304, 404, 456 | Corrected destructive tensile testing, the current kilogram definition, residual risk and setup-conversion direction. |
| 317, 337, 457, 500, 516, 531, 593, 607 | Corrected gage variance share, paired t statistic, variance-to-SD calculation, reliability estimates, missing radical, correlation arithmetic and Poisson mean. |
| 258, 377, 536, 537, 558, 574 | Corrected final rounding using unrounded intermediate calculations. Other retained results were also recomputed. |
| 31, 32, 146, 155, 201, 282, 382, 414, 549 | Removed ambiguity or multiple defensible choices by stating the intended scope or revising options. |
| 391, 599 | Preserved original ANOVA images; solutions identify the source-table printing errors and use the valid quantities. |
| 326, 331 and shared-image questions | Kept every question self-contained when delivered in a shuffled quiz. |

Five answer **indices** changed: Q167, Q172, Q284, Q401 and Q607. Other corrections replace the text/value of the keyed option or repair the reasoning without changing its index. Exact before/after fields, source references and numerical evidence are in `cqe-set3-question-audit-round2.json`.

## Verification

- Independent numerical verification: `python scripts/audits/verify-cqe-set3-calculations.py` (NumPy and SciPy required). All 143 checks pass.
- **99 Node checks pass** across audit integrity, source visuals/student journeys, formula references, existing context checks, result screens, answer reveal and review. Stateless architecture, JavaScript syntax and whitespace validation pass.
- Q281 now has its ASN formula reference. The audit regression runs in the existing required PR workflow.
- The exhaustive ledger hashes every final question. Browser workflow results are reported in the pull request.
- The first source-mapping audit remains in `cqe-set3-source-audit.json`. Existing duplicate-source pairs and four guide questions absent from this bank remain documented there. This second audit covers all existing 613 entries.

## Question-by-question ledger

| Set 3 | Guide question; printed page | Result | Verification |
| --- | --- | --- | --- |
| 1 | I.1; p. 3 | verified | Juran trilogy: planning, control, improvement. |
| 2 | I.2; p. 3 | verified | Juran breakthrough addresses chronic problems. |
| 3 | I.3; p. 3 | verified | Deming eliminates numerical quotas. |
| 4 | I.4; p. 3 | verified | Fitness for use is Juran's definition. |
| 5 | I.5; p. 4 | verified | SWOT expansion checked. |
| 6 | I.6; p. 4 | corrected | Alignment tests strategic deployment; remove spliced next answer and false attribution. Change: Spliced Q7 feedback and incorrect Deming attribution. |
| 7 | I.7; p. 4 | verified | SMART components match intended convention. |
| 8 | I.8; p. 4 | verified | Action plans specify how, when and ownership. |
| 9 | I.9; p. 4 | verified | Benchmarking compares best practices internally or externally. |
| 10 | I.10; p. 5 | verified | Planning, data collection, analysis, implementation sequence. |
| 11 | I.11; p. 5 | verified | Shareholders own a corporation. |
| 12 | I.12; p. 5 | verified | Balanced scorecard includes four perspectives. |
| 13 | I.13; p. 5 | verified | Achievable targets align with strategy; vital few metrics. |
| 14 | I.14; p. 5 | verified | Cost-benefit analysis compares investments financially. |
| 15 | I.15; p. 6 | verified | Present-value comparison puts cash flows on a common date. |
| 16 | I.16; p. 6 | corrected | RACI expansion; remove following answer contamination. Change: Spliced Q17 answer in feedback. |
| 17 | I.17; p. 6 | verified | One accountable owner in standard RACI. |
| 18 | II.1; p. 13 | verified | Customer needs initiate quality planning. |
| 19 | II.2; p. 13 | corrected | Four-tier hierarchy is a traditional documentation model, not mandatory manual contents. Change: Traditional documentation hierarchy was presented as mandatory contents of a quality manual. |
| 20 | II.3; p. 13 | verified | Documentation requires compliance, accuracy and clarity. |
| 21 | II.4; p. 13 | corrected | Implementation is foundational; narrow overly broad component question. Change: Multiple options are components of a quality system. |
| 22 | II.5; p. 14 | verified | Top management authorizes the quality manual. |
| 23 | II.6; p. 14 | verified | Revision and obsolete-copy control are essential. |
| 24 | II.7; p. 14 | verified | ISO 9001:2015 is explicitly an international standard. |
| 25 | II.8; p. 14 | verified | ISO 9000 family concerns quality management. |
| 26 | II.9; p. 14 | corrected | Correct obsolete eight-principle premise to seven. Change: Obsolete count of ISO quality-management principles. |
| 27 | II.10; p. 15 | verified | ISO 9004 gives guidance for sustained success. |
| 28 | II.11; p. 15 | verified | Seven performance-excellence categories in the study-guide framework. |
| 29 | II.12; p. 15 | verified | Employee-led organizational audit is first-party; independence matters. |
| 30 | II.13; p. 15 | verified | System audit has broadest listed scope. |
| 31 | II.14; p. 15 | corrected | Internal audits also support certification; narrow to improvement purpose. Change: Internal audits can also be certification requirements; scope narrowed. |
| 32 | II.15; p. 16 | corrected | Auditee owns correction; remove overlapping auditee-management distractor. Change: Auditee and its management overlapped as answers. |
| 33 | II.16; p. 16 | corrected | Frame empirical claim as the guide's observation, not a universal requirement. Change: Subjective guide observation was stated as a general fact. |
| 34 | II.17; p. 16 | verified | Objectives and methods communicated in opening meeting. |
| 35 | II.18; p. 16 | verified | Lead auditor owns accuracy of report. |
| 36 | III.1; p. 23 | verified | Defect counts are discrete attribute data. |
| 37 | III.2; p. 23 | verified | Accept only go-end fit for stated limit-gage convention. |
| 38 | III.3; p. 23 | corrected | 1 - (1 - .95)^2. Independently computed 0.9974999999999999; checked against the selected answer. Change: Lost exponent and unstated independence. |
| 39 | III.4; p. 23 | verified | CTQ tree translates voice of customer to drivers. |
| 40 | III.5; p. 24 | verified | Customer use occurs in post-production phase. |
| 41 | III.6; p. 24 | verified | Explicit measurable dimensional requirement is CTQ. |
| 42 | III.7; p. 24 | verified | Concept phase explores alternative solutions. |
| 43 | III.8; p. 24 | verified | Insurance-policy request is customer need; other options are metrics. |
| 44 | III.9; p. 24 | verified | QFD links needs to design. |
| 45 | III.10; p. 25 | verified | QFD translates customer requirements into technical requirements. |
| 46 | III.12; p. 25 | verified | DFSS includes design-for-X considerations. |
| 47 | III.13; p. 25 | verified | Cross-functional design reviews cover relevant disciplines. |
| 48 | III.14; p. 25 | verified | Acceptable failure rate is a reliability criterion. |
| 49 | III.15; p. 26 | corrected | 8 ± .05. Independently computed [7.95, 8.05]; checked against the selected answer. Change: Ambiguous tolerance typography. |
| 50 | III.18; p. 26 | verified | IQ verifies installation. |
| 51 | III.19; p. 27 | verified | Verification confirms specified requirements. |
| 52 | III.20; p. 27 | corrected | Correct false claim that validation can only follow completion. Change: Validation is not restricted to after completion. |
| 53 | III.21; p. 27 | corrected | Distinguish post-release field reliability from valid pre-release reliability tests. Change: False claim that reliability cannot be measured before release. |
| 54 | III.22; p. 27 | verified | CDF is cumulative failure probability, not instantaneous hazard. |
| 55 | III.23; p. 27 | verified | F(t)=0.992 is fraction failed by t. |
| 56 | III.24; p. 28 | corrected | Exponential constant hazard; Weibull shape 1 is same special case. Change: Weibull includes constant-hazard exponential special case. |
| 57 | IV.1; p. 45 | verified | Control plan includes sample size and frequency. |
| 58 | IV.2; p. 45 | verified | Reaction plan provides containment instructions. |
| 59 | IV.3; p. 45 | verified | Work instructions reduce execution errors. |
| 60 | IV.4; p. 45 | corrected | Material identification enables traceability and risk containment. Change: Risk and reproducibility both valid absent traceability focus. |
| 61 | IV.5; p. 46 | corrected | RFID uses radio tags/readers, not barcodes as its mechanism. Change: RFID mechanism incorrectly conflated with barcodes. |
| 62 | IV.6; p. 46 | verified | Design traceability at development start. |
| 63 | IV.7; p. 46 | verified | Segregation prevents mixing nonconforming stock. |
| 64 | IV.8; p. 46 | verified | Brake safety failure is critical. |
| 65 | IV.9; p. 46 | verified | Reduced usability without safety hazard is major defect. |
| 66 | IV.10; p. 47 | corrected | MRB primarily determines nonconforming material disposition. Change: MRB disposition conflated with systemic corrective action. |
| 67 | IV.11; p. 47 | corrected | Sampling saves high/destructive inspection cost. Change: OCR spacing in explanation. |
| 68 | IV.12; p. 47 | verified | Sampling variability creates false rejection/acceptance risks. |
| 69 | IV.13; p. 47 | verified | OC curve is acceptance probability versus lot quality. |
| 70 | IV.14; p. 47 | verified | Finite sampling without replacement uses hypergeometric model. |
| 71 | IV.16; p. 48 | corrected | Binomial CDF(2;45,.05). Independently computed 0.6076598529460557; checked against the selected answer. Change: Fraction described as percent; damaged binomial exponents. |
| 72 | IV.17; p. 48 | corrected | LTPD is rejectable lot quality at specified consumer risk. Change: LTPD described as quality that should be accepted. |
| 73 | IV.18; p. 49 | verified | Producer risk is type I error at acceptable quality. |
| 74 | IV.19; p. 49 | corrected | AOQ = .05 * Binomial CDF(2;45,.05). Independently computed 0.03038299264730279; checked against the selected answer. Change: Missing rectification assumption and percent/fraction ambiguity. |
| 75 | IV.20; p. 49 | corrected | Larger sample lowers Pa at fixed c and nonzero p. Change: Quality level not held fixed; flattened explanatory table. |
| 76 | IV.21; p. 49 | corrected | Large-lot size has little influence when sampling fraction is small. Change: Lot-size approximation lacks sampling-fraction condition. |
| 77 | IV.22; p. 49 | corrected | Single sampling can use tightened plans; replace incorrect disadvantage. Change: Single sampling can operate under normal/tightened/reduced switching schemes. |
| 78 | IV.23; p. 50 | corrected | Reject at d≥Re, not only d>Re; accept d=Ac. Change: Rejection boundary incorrectly excluded equality. |
| 79 | IV.24; p. 50 | corrected | P(X≤1)+P(X≥4); X~Bin(50,.1). Independently computed 0.7834919537391238; checked against the selected answer. Change: Fraction described as percentage and malformed subscripts. |
| 80 | V.1; p. 71 | verified | Pareto ranks frequencies; 80/20 is a heuristic. |
| 81 | V.2; p. 71 | verified | Fishbone organizes suspected causes, not proof of causation. |
| 82 | V.3; p. 71 | corrected | Histogram shows shape; repair corrupted scatterplot explanation. Change: Truncated feedback misdefines scatter diagrams. |
| 83 | V.4; p. 72 | verified | Check sheet collects categorical defect counts. |
| 84 | V.5; p. 72 | verified | Flowchart exposes process steps and bottlenecks. |
| 85 | V.6; p. 72 | corrected | Control chart monitors stability and signals investigation. Change: Control-chart signal framed as certainty. |
| 86 | V.7; p. 72 | verified | Scatterplot explores association of two quantitative variables. |
| 87 | V.8; p. 72 | verified | Activity network represents dependencies and schedule. |
| 88 | V.9; p. 73 | verified | SIPOC outlines process scope and customer requirements. |
| 89 | V.10; p. 73 | corrected | PDPC anticipates disruption and countermeasures; repair OCR. Change: OCR spacing in explanation. |
| 90 | V.11; p. 73 | verified | Fault tree models combinations leading to top event. |
| 91 | V.12; p. 73 | verified | Affinity diagram groups ideas by theme. |
| 92 | V.13; p. 74 | verified | Matrix maps customer and technical requirements. |
| 93 | V.14; p. 74 | corrected | Interrelationship digraph represents directed relationships; repair OCR. Change: OCR spacing in explanation. |
| 94 | V.15; p. 74 | verified | Concept fan explores alternative design concepts. |
| 95 | V.16; p. 74 | corrected | Prioritization matrix compares designs by consistent criteria; repair OCR. Change: OCR spacing in explanation. |
| 96 | V.17; p. 75 | verified | Incremental continual changes describe kaizen. |
| 97 | V.18; p. 75 | corrected | Plan defines problem/action; explanation missing Check/Act clauses. Change: Truncated PDCA explanation. |
| 98 | V.19; p. 75 | verified | TQM integrates customer focus, workforce and leadership. |
| 99 | V.20; p. 75 | verified | Analyzing implemented change is Check. |
| 100 | V.21; p. 76 | verified | Kaizen emphasizes incremental improvement. |
| 101 | V.22; p. 76 | verified | Six Sigma reduces variation and defects. |
| 102 | V.23; p. 76 | corrected | TOC optimizes system constraint; avoid denying improvements at a single bottleneck. Change: Absolute claim about individual-process improvements is false at the bottleneck. |
| 103 | V.24; p. 76 | corrected | 1.5σ is a Six Sigma convention, not a universal measured drift; broken sigma glyph. Change: Broken sigma symbol and universal drift claim. |
| 104 | V.25; p. 76 | verified | Radical process redesign is reengineering. |
| 105 | V.26; p. 77 | verified | 12 sigma specification width / 6 sigma. Independently computed 2.0; checked against the selected answer. |
| 106 | VI.1; p. 93 | corrected | Weight is continuous; feedback incorrectly refers to falls instead of visits. Change: Feedback names a different variable. |
| 107 | VI.2; p. 93 | verified | Nonconforming-unit count is discrete. |
| 108 | VI.3; p. 93 | verified | Colors are unordered nominal categories. |
| 109 | VI.4; p. 93 | verified | Height has meaningful true zero and ratios. |
| 110 | VI.5; p. 94 | verified | Service ratings are ordered categories. |
| 111 | VI.6; p. 94 | verified | Transform prepares compatible structure/format. |
| 112 | VI.8; p. 94 | verified | Coding simplifies data representation and analysis. |
| 113 | VI.9; p. 94 | verified | Sample mean and median. Independently computed [6.0, 5.5]; checked against the selected answer. |
| 114 | VI.10; p. 95 | verified | Sample SD, ddof=1. Independently computed 0.10690449676496966; checked against the selected answer. |
| 115 | VI.11; p. 95 | corrected | Mean below median suggests left skew in usual unimodal cases, not a universal proof. Change: Mean-median ordering does not prove skew direction for every distribution. |
| 116 | VI.12; p. 95 | verified | CLT makes n40 exponential sample means approximately normal. |
| 117 | VI.13; p. 95 | corrected | Population variance uses N and squared deviations; clarify damaged notation. Change: Flattened summation limits obscure formula. |
| 118 | VI.14; p. 96 | verified | Side-by-side boxplots compare distributions by group. |
| 119 | VI.17; p. 96 | verified | Sample average is a statistic. |
| 120 | VI.18; p. 97 | verified | Population descriptor is a parameter. |
| 121 | VI.20; p. 97 | verified | Complement. Independently computed 0.98; checked against the selected answer. |
| 122 | VI.21; p. 98 | verified | Joint probability cannot be inferred without dependence information. |
| 123 | VI.22; p. 98 | verified | Mutually exclusive intersection. Independently computed 0.0; checked against the selected answer. |
| 124 | VI.23; p. 98 | corrected | Exponential CDF, mean=5, t=3. Independently computed 0.45118836390597356; checked against the selected answer. Change: Lost exponential superscripts. |
| 125 | VI.24; p. 98 | verified | Normal survival at z=1.5. Independently computed 0.06680720126885807; checked against the selected answer. |
| 126 | VI.25; p. 98 | verified | Weibull is generally asymmetric among listed distributions. |
| 127 | VI.26; p. 99 | verified | Normal overfill probability. Independently computed 0.002555130330428967; checked against the selected answer. |
| 128 | VI.27; p. 99 | corrected | t is symmetric with heavier tails; mean needs df>1. Change: t mean does not exist for all degrees of freedom. |
| 129 | VI.28; p. 99 | corrected | Poisson survival P(X≥2), mean=5. Independently computed 0.9595723180054873; checked against the selected answer. Change: Mixed nonconformity and nonconforming-unit counts. |
| 130 | VI.29; p. 99 | verified | Hypergeometric is exact for finite sampling without replacement. |
| 131 | VI.30; p. 99 | corrected | Binomial PMF(4;15,.1). Independently computed 0.042835146366285; checked against the selected answer. Change: Binomial model requires independent Bernoulli sampling. |
| 132 | VI.32; p. 100 | corrected | Expected sample mean equals population mean. Independently computed 24.0; checked against the selected answer. Change: Damaged standard-error formula; CLT not needed for expectation. |
| 133 | VI.33; p. 100 | corrected | Normal sampling mean survival, n=16. Independently computed 0.0006871379379160104; checked against the selected answer. Change: Missing decimal in probability distractor. |
| 134 | VI.34; p. 100 | verified | Standard error sqrt(64/16). Independently computed 2.0; checked against the selected answer. |
| 135 | VI.35; p. 101 | corrected | 95% CI describes repeated-sampling coverage, not probability of fixed parameter. Change: Confidence coverage needs repeated-sampling interpretation. |
| 136 | VI.36; p. 101 | corrected | Point estimate is 11.75; explanation had11.73. Change: Explanation does not match observed sample mean. |
| 137 | VI.37; p. 101 | corrected | 99% t interval, df=14. Independently computed [3.9080050806271087, 4.691994919372891]; checked against the selected answer. Change: Small-sample t interval requires distribution and sampling assumptions. |
| 138 | VI.38; p. 101 | verified | Ceiling of (z .975 * .5/.15)^2. Independently computed 43.0; checked against the selected answer. |
| 139 | VI.39; p. 102 | verified | Normal variance CI: 6s² / chi-square quantiles. Independently computed [0.3243837708087024, 3.788066961224462]; checked against the selected answer. |
| 140 | VII.1; p. 147 | corrected | Effect of uncertainty defines risk, not risk management. Change: Risk confused with risk management. |
| 141 | VII.2; p. 147 | corrected | Risk-based thinking anticipates deviation and opportunities. Change: FMEA incorrectly equated with a risk register. |
| 142 | VII.3; p. 147 | verified | Prevention and recurrence control are risk-based thinking. |
| 143 | VII.4; p. 148 | verified | Pesticide is hazard; harm not yet realized. |
| 144 | VII.5; p. 148 | corrected | Identify relevant risks comprehensively, including outside direct control. Change: Absolute all-possible-risks claim is unattainable. |
| 145 | VII.6; p. 148 | verified | Risk planning establishes context, owners and objectives. |
| 146 | VII.7; p. 148 | corrected | Risk evaluation compares risk with criteria; remove overlapping acceptable-risk alternative. Change: Two options describe valid risk evaluation purposes. |
| 147 | VII.8; p. 149 | verified | Changed industry benchmark is external context. |
| 148 | VII.9; p. 149 | verified | Risk management supports organizational objectives under uncertainty. |
| 149 | VII.10; p. 149 | verified | Early risk work permits economical design changes. |
| 150 | VII.11; p. 149 | verified | Evaluation may be qualitative or quantitative. |
| 151 | VII.12; p. 150 | verified | ISO31000 risk assessment includes analysis. |
| 152 | VII.13; p. 150 | verified | Evaluation informs treatment, retention or reconsideration of objectives. |
| 153 | VII.14; p. 150 | verified | Comparison with criteria is risk evaluation. |
| 154 | VII.15; p. 150 | verified | Assessment comprises identification, analysis and evaluation. |
| 155 | VII.16; p. 150 | corrected | Delphi requires anonymous iterative expert rounds; expertise alone also describes FMEA. Change: Expert opinion alone also applies to FMEA and other methods. |
| 156 | VII.17; p. 151 | corrected | Conventional FMEA may miss interacting failure combinations; not an absolute inability. Change: Overstated FMEA limitation. |
| 157 | VII.18; p. 151 | verified | Likelihood and severity are basic risk dimensions. |
| 158 | VII.19; p. 151 | verified | Catastrophic/critical labels express severity. |
| 159 | VII.21; p. 152 | corrected | Traditional RPN multiplies S,O,D ratings; D represents difficulty of detection. Change: Detection rating direction incorrectly implied probability of detecting failure. |
| 160 | VII.22; p. 152 | verified | Fault tree is top-down deductive analysis. |
| 161 | II.19; p. 16 | verified | Audit nonconformity assessment uses evidence and risk. |
| 162 | II.20; p. 17 | verified | Audit scope, depth and timeframe guide planning. |
| 163 | II.21; p. 17 | corrected | Follow-up method should be agreed; not every finding needs a separate audit. Change: Separate follow-up audit is not universally necessary. |
| 164 | II.22; p. 17 | verified | Fewer nonconformities lower failure costs, other things equal. |
| 165 | II.23; p. 17 | corrected | Rework before delivery is internal failure; training classification needs separate purpose. Change: Training/reeducation does not invariably classify as internal failure. |
| 166 | II.24; p. 17 | verified | Personnel proficiency assessment is appraisal. |
| 167 | II.25; p. 18 | corrected | Supplier evaluation/approval is appraisal in ASQ public PAF guidance; correct guide conflict. Change: Guide classification conflicts with ASQ PAF guidance; clarify appraisal activity. |
| 168 | II.26; p. 18 | verified | Reduced defects may justify lower appraisal effort, not automatic elimination. |
| 169 | II.27; p. 18 | verified | Test-equipment depreciation associated with conformity assessment is appraisal. |
| 170 | II.28; p. 18 | verified | Inspection plus test equipment. Independently computed 77000.0; checked against the selected answer. |
| 171 | II.29; p. 19 | verified | No listed external failure costs. Independently computed 0.0; checked against the selected answer. |
| 172 | II.30; p. 19 | corrected | Audit confirming QMS operation is appraisal in ASQ public PAF guidance; correct guide conflict. Change: Guide classification conflicts with ASQ classification of quality audits. |
| 173 | II.31; p. 19 | verified | Training begins with needs assessment. |
| 174 | II.32; p. 19 | verified | Applying training to real problems supports success. |
| 175 | II.33; p. 20 | verified | Pre/posttests assess learning; delayed posttests assess retention. |
| 176 | I.18; p. 6 | verified | NPV supports financial project selection. |
| 177 | I.19; p. 6 | verified | Varying discount rate is sensitivity analysis. |
| 178 | I.20; p. 7 | corrected | Gantt chart shows scheduled bars; can include milestones but is not identical to milestone chart. Change: Gantt and milestone charts incorrectly equated. |
| 179 | I.21; p. 7 | verified | Quality information system collects and supports use of quality data. |
| 180 | I.22; p. 7 | verified | ASQ ethics governs conduct. |
| 181 | I.23; p. 7 | corrected | Unqualified certification claim must be current; historic status must be identified. Change: Current certification versus explicitly identified historical status. |
| 182 | I.24; p. 7 | verified | Social responsibility is an ethics principle. |
| 183 | I.25; p. 8 | verified | Services should be within competence. |
| 184 | I.26; p. 8 | verified | Expulsion is most severe among listed sanctions. |
| 185 | I.27; p. 8 | verified | Storming features conflict and individual agendas. |
| 186 | I.28; p. 8 | verified | Facilitator supports team process and focus. |
| 187 | I.29; p. 8 | verified | Facilitator addresses process rather than technical content. |
| 188 | I.30; p. 9 | corrected | Nominal group ranking narrows ideas with equal participation. Change: Explanation does not describe narrowing/ranking step. |
| 189 | I.31; p. 9 | verified | Judgmental evaluation can provoke defensiveness. |
| 190 | I.32; p. 9 | corrected | Supplier survey is preliminary screening; not final verification of claimed capability. Change: Survey alone does not verify supplier claims. |
| 191 | I.33; p. 9 | verified | Lack of empowerment obstructs quality improvement. |
| 192 | VII.20; p. 151 | verified | Visual combines severity and probability: risk matrix. |
| 193 | VII.23; p. 152 | verified | HAZOP guide words identify deviations. |
| 194 | VII.24; p. 152 | verified | Recording sources/events/consequences is risk identification. |
| 195 | VII.25; p. 152 | verified | Risk control seeks acceptable residual risk, not elimination of all risk. |
| 196 | VII.26; p. 153 | verified | Monitoring incorporates new evidence and revisits criteria. |
| 197 | VII.27; p. 153 | verified | Absent/ineffective controls are risk-control gaps. |
| 198 | VII.28; p. 153 | verified | Residual risk remains after treatment. |
| 199 | VII.29; p. 153 | corrected | Risk reduction and acceptance form risk control in the guide's framework. Change: Risk reduction incorrectly equated with avoidance. |
| 200 | VII.30; p. 153 | verified | Risk audit evaluates treatment effectiveness. |
| 201 | VII.31; p. 154 | corrected | ISO31000 also lists treatments; identify requested QMS standard explicitly. Change: Both ISO9001 and ISO31000 address listed risk responses. |
| 202 | VII.32; p. 154 | corrected | Mitigation reduces likelihood/severity; sharing is not limited to opportunities. Change: Several risk treatments can apply; incorrect positive-risk-only claim. |
| 203 | VII.33; p. 154 | verified | Incoming RMA can lead downstream product risk while lagging supplier defects. |
| 204 | VII.34; p. 154 | verified | Monitoring revisits effectiveness and assumptions. |
| 205 | VII.35; p. 155 | corrected | Evaluate opportunity and safety/regulatory risk before pursuing an expanded indication. Change: Positive-risk framing omitted safety assessment and regulatory pathway. |
| 206 | VII.36; p. 155 | verified | Mitigation reduces risk rather than guaranteeing elimination. |
| 207 | VII.37; p. 155 | verified | Reducing impact is mitigation. |
| 208 | V.27; p. 77 | verified | Sustained Six Sigma needs infrastructure and leadership. |
| 209 | V.28; p. 77 | verified | VSM identifies flow and value/nonvalue activities. |
| 210 | V.29; p. 77 | verified | Unnecessary employee travel is motion waste. |
| 211 | V.30; p. 77 | corrected | Customer queue is waiting waste. Change: Make the waiting scenario self-contained and remove the distracting counter wording. |
| 212 | V.31; p. 78 | corrected | Nonvalue activities include both avoidable waste and necessary compliance work. Change: Necessary non-value-added work incorrectly called unnecessary. |
| 213 | V.32; p. 78 | verified | 5S organizes workplace. |
| 214 | V.33; p. 78 | corrected | Repainting is excess processing only if basecoat is not technically needed. Change: White coat could be a necessary primer. |
| 215 | V.34; p. 78 | verified | Kanban limits/replenishes WIP based on demand signals. |
| 216 | V.35; p. 78 | verified | Cleaning, locations and standard practices are 5S. |
| 217 | V.36; p. 79 | verified | Status light is visual control. |
| 218 | V.37; p. 79 | verified | Replenishment card is kanban. |
| 219 | V.38; p. 79 | verified | Unnecessary part travel is transportation waste. |
| 220 | V.39; p. 79 | verified | Floor arrows are visual control. |
| 221 | V.40; p. 80 | verified | Standardized work reduces variation in execution. |
| 222 | V.41; p. 80 | corrected | SMED reduces changeover time; it is not itself a time unit. Change: SMED confused with the definition of changeover time. |
| 223 | V.42; p. 80 | verified | Takt derives from demand; cycle from process execution. |
| 224 | V.43; p. 80 | verified | Producing above need is overproduction. |
| 225 | V.44; p. 80 | verified | Common proctoring instructions standardize work. |
| 226 | V.45; p. 81 | verified | Available seconds / demanded units. Independently computed 52.36363636363637; checked against the selected answer. |
| 227 | V.46; p. 81 | corrected | Cycle 7200/45 exceeds takt 7200/50. Independently computed 1.0; checked against the selected answer. Change: Actual cycle time not inferable without downtime convention. |
| 228 | V.47; p. 81 | verified | SMED can reduce patient setup changeovers. |
| 229 | V.48; p. 81 | verified | Cycle 50 exceeds takt 36000/750. Independently computed 1.0; checked against the selected answer. |
| 230 | V.49; p. 82 | verified | Minor stoppages are OEE performance/speed loss. |
| 231 | V.50; p. 82 | verified | Availability percent, breaks excluded. Independently computed 90.0; checked against the selected answer. |
| 232 | V.51; p. 82 | verified | Poor problem definition undermines solving. |
| 233 | V.52; p. 82 | corrected | Creativity belongs to solution generation; narrow broad success-factor question. Change: Several listed items can contribute to success. |
| 234 | V.53; p. 82 | verified | Monitoring key variables helps sustain change. |
| 235 | V.54; p. 83 | verified | Effectiveness review checks sustained results. |
| 236 | V.55; p. 83 | corrected | Five Whys ends at evidence-supported actionable cause, not fifth iteration. Change: Team agreement alone does not establish root cause. |
| 237 | V.56; p. 83 | verified | Operator has firsthand production knowledge. |
| 238 | V.57; p. 83 | verified | Poka-yoke is error-proofing. |
| 239 | V.58; p. 83 | verified | Robust recipe reduces sensitivity to noise factors. |
| 240 | V.59; p. 84 | verified | Interlock prevents operation with open tray. |
| 241 | V.60; p. 84 | verified | Sorting detects nonconformity before next step. |
| 242 | III.7; p. 24 | verified | Concept phase explores solutions; existing duplicate source noted. |
| 243 | III.11; p. 25 | verified | House of quality belongs to QFD. |
| 244 | III.16; p. 26 | verified | Feature-frame0.01 is tolerance, not datum. |
| 245 | III.17; p. 26 | verified | Frame datumA is primary reference. |
| 246 | III.25; p. 28 | verified | Survivors after two intervals / initial count. Independently computed 0.9488888888888889; checked against the selected answer. |
| 247 | III.26; p. 28 | verified | Failures / initial units / interval width. Independently computed 0.0006; checked against the selected answer. |
| 248 | III.27; p. 29 | corrected | Failures / survivors at interval start / width. Independently computed 0.0006617647058823529; checked against the selected answer. Change: Finite-interval estimate mislabeled exact instantaneous hazard. |
| 249 | III.28; p. 29 | corrected | Five independent series components. Independently computed 0.975248753121875; checked against the selected answer. Change: Product/binomial reliability requires independent subsystem failures. |
| 250 | III.29; p. 29 | corrected | Five independent parallel components. Independently computed 0.999999999996875; checked against the selected answer. Change: Product/binomial reliability requires independent subsystem failures. |
| 251 | III.30; p. 29 | verified | Series system conditional on one failed component. Independently computed 1.0; checked against the selected answer. |
| 252 | III.31; p. 29 | corrected | Two independent series components. Independently computed 0.6400000000000001; checked against the selected answer. Change: Product/binomial reliability requires independent subsystem failures. |
| 253 | III.32; p. 30 | corrected | At least 3 of 6 independent components survive. Independently computed 0.99745693696; checked against the selected answer. Change: Product/binomial reliability requires independent subsystem failures. |
| 254 | III.33; p. 30 | corrected | Four sequential exponential components: Poisson CDF(3;8). Independently computed 0.04238011199168396; checked against the selected answer. Change: Unclear active-versus-standby count and dormant/switching assumptions. |
| 255 | III.34; p. 30 | corrected | Failures / accumulated operating exposure. Independently computed 0.007466666666666667; checked against the selected answer. Change: Calendar exposure not necessarily accumulated operating time. |
| 256 | III.35; p. 30 | corrected | MTTF=-400/log(.645); closest offered 910. Independently computed 912.1903615539933; checked against the selected answer. Change: Clarify log/exponential notation without early rounding. |
| 257 | III.36; p. 30 | corrected | Exponential survival at mean lifetime. Independently computed 0.36787944117144233; checked against the selected answer. Change: Ambiguous flattened exponential notation. |
| 258 | III.37; p. 31 | corrected | Survival percent, no intermediate rounding. Independently computed 14.885808080333316; checked against the selected answer. Change: Ambiguous flattened exponential notation. |
| 259 | III.38; p. 31 | corrected | Exponential failure CDF. Independently computed 0.6988057880877979; checked against the selected answer. Change: Clarify cumulative failure probability and exponential notation. |
| 260 | III.39; p. 31 | corrected | Exponential survival. Independently computed 0.5737534207374327; checked against the selected answer. Change: Ambiguous flattened exponential notation. |
| 261 | III.40; p. 31 | corrected | Survival percent at MTTF. Independently computed 36.787944117144235; checked against the selected answer. Change: Ambiguous flattened exponential notation. |
| 262 | III.41; p. 32 | verified | Steady availability with MTBF=1250, MTTR=5. Independently computed 0.9960159362549801; checked against the selected answer. |
| 263 | III.42; p. 32 | corrected | Availability from exposure and total repair time. Independently computed 0.7845188284518828; checked against the selected answer. Change: Total operating exposure unspecified for failed/repaired components. |
| 264 | III.43; p. 32 | corrected | Run-to-failure policy defers work until failure; no universal maximum-uptime claim. Change: Run-to-failure does not universally maximize uptime between repairs. |
| 265 | III.45; p. 32 | verified | Bathtub middle useful-life region is approximately constant random hazard. |
| 266 | III.46; p. 33 | corrected | Exponential is standard constant-hazard lifetime model; Weibull shape1 special case. Change: Weibull shape1 also has constant hazard. |
| 267 | III.47; p. 33 | corrected | Weibull shape>1 models increasing wear-out hazard; clarify shape criterion. Change: Normal can also model increasing hazard; specify Weibull shape behavior. |
| 268 | III.48; p. 33 | verified | FMEA identifies and reduces potential failure risk proactively. |
| 269 | III.49; p. 33 | corrected | Cross-functional FMEA team appropriate to process; no universal mandatory job titles. Change: No universal required list of six FMEA job titles. |
| 270 | III.50; p. 33 | verified | FMEA organizes failure modes, effects, causes and controls. |
| 271 | III.51; p. 34 | verified | RPN product. Independently computed 112.0; checked against the selected answer. |
| 272 | III.52; p. 34 | verified | Candidate RPN exceeds threshold 40. Independently computed 1.0; checked against the selected answer. |
| 273 | III.53; p. 34 | verified | Use FMEA focuses on user interaction and human factors. |
| 274 | III.54; p. 34 | corrected | Process FMEA follows design concept in simplified sequence; real work can overlap. Change: FMEAs are not always strictly sequential. |
| 275 | III.55; p. 34 | verified | Instructions are part of user interface, suited to use FMEA. |
| 276 | III.56; p. 35 | verified | Detection complements severity and occurrence ratings. |
| 277 | III.57; p. 35 | verified | Visual-alarm usability is use-related risk. |
| 278 | III.58; p. 35 | verified | FMECA adds criticality prioritization. |
| 279 | IV.15; p. 48 | verified | Dashed lower OC reduces acceptance of poor lots; consumer-protection interpretation. |
| 280 | IV.24; p. 50 | corrected | P(X≤1)+P(X≥4); X~Bin(50,.1). Independently computed 0.7834919537391238; checked against the selected answer. Change: Invalid unused final-stage gap and implicit binomial assumption. |
| 281 | IV.25; p. 50 | corrected | ASN=50+75 P(X=2); X~Bin(50,.1). Independently computed 55.845717249043645; checked against the selected answer. Change: Used prior question r1=4 instead of own r1=3; ASN is not rounded up like required n. |
| 282 | IV.26; p. 50 | corrected | Double sampling often lowers ASN at quality extremes; correct indifference definition. Change: Overlapping answer and wrong definition of indifference level. |
| 283 | IV.27; p. 51 | verified | Z1.4 provides single,double,multiple sampling schemes. |
| 284 | IV.28; p. 51 | corrected | K at lot1500 normalII yields125 at AQL.40; guide315 is wrong. Change: Wrong sample-size lookup; K at AQL0.40 has n125 Ac1 Re2. |
| 285 | IV.29; p. 51 | verified | H at500 and AQL.65 redirects down to J80 Ac1 Re2. |
| 286 | IV.30; p. 51 | corrected | Verified G at AQL .65: upward F single-plan substitution; specified double alternative J uses 50 plus 50. Replaced invalid 20/20 key content. Change: The nominal G-row sample sizes ignore the AQL arrow and single-plan substitution; the double-plan alternative is J. |
| 287 | IV.31; p. 52 | verified | H double AQL.65 redirects J, first-stage Ac0 Re2. |
| 288 | IV.32; p. 52 | verified | Variables plans can reduce n at equal protection under distribution assumptions. |
| 289 | IV.33; p. 52 | corrected | Checked the 2003 Z1.9 Table B-3 standard-deviation method: code F, n = 10 at AQL .65; removed the overgeneralization that AQL never matters. Change: Remove the false assertion that sample size never depends on AQL arrows. |
| 290 | IV.34; p. 52 | corrected | n=4 unbiased tail estimates: max(0,.5-Q/3); compare total with M=1.49%. Independently computed 6.666666666666665; checked against the selected answer. Change: State the unknown-variability standard-deviation method so the Z1.9 lookup is unambiguous. |
| 291 | IV.35; p. 53 | verified | Sample integrity protects against contamination and misrepresentation. |
| 292 | IV.36; p. 53 | verified | Batch/change/configuration controls preserve identity and history. |
| 293 | IV.37; p. 53 | verified | Dimensional inspection determines conformance, not improvement by itself. |
| 294 | IV.38; p. 53 | verified | Sine bar is most precise of listed angular methods under suitable setup. |
| 295 | IV.39; p. 53 | verified | Snap gage assesses external dimension limits. |
| 296 | IV.40; p. 54 | verified | Go-end failure means reject for stated gaging convention. |
| 297 | IV.41; p. 54 | verified | Stylus method records a surface profile; clarify outdated generic description. |
| 298 | IV.42; p. 54 | corrected | Roundness measurement differs from outside diameter; specify roundness in stem. Change: Round shape alone does not specify the measurement required. |
| 299 | IV.43; p. 54 | corrected | Ultimate tensile strength requires destructive tensile testing; NDT answer is wrong. Change: Nondestructive testing cannot directly establish ultimate tensile strength. |
| 300 | IV.44; p. 54 | corrected | Magnetic particle inspection requires ferromagnetism, not all and only iron/steel. Change: Ferromagnetic materials include more than iron/steel; some steels are nonmagnetic. |
| 301 | IV.45; p. 55 | verified | Eddy currents require electrical conductivity. |
| 302 | IV.46; p. 55 | verified | NIST maintains US national measurement standards. |
| 303 | IV.47; p. 55 | verified | Metrology concerns measurement standards and methods. |
| 304 | IV.48; p. 55 | corrected | Kilogram defined through fixed Planck constant since2019, not cylinder. Change: Artifact definition obsolete since2019. |
| 305 | IV.49; p. 55 | corrected | Unpredictable temperature fluctuations may be random; steady offset causes systematic error. Change: Temperature changes can cause systematic or random error. |
| 306 | IV.50; p. 56 | corrected | Metrological traceability is documented calibration chain with uncertainties. Change: Traceability needs documented calibration chain and uncertainty. |
| 307 | IV.51; p. 56 | verified | Measurement assurance considers procedure/operator/environment contributions. |
| 308 | IV.52; p. 56 | corrected | Calibration establishes reference relationship; adjustment is separate. Change: Calibration itself does not adjust equipment or guarantee accuracy. |
| 309 | IV.53; p. 56 | verified | Persistent positive offset is systematic bias. |
| 310 | IV.54; p. 56 | verified | Linearity describes bias change across range. |
| 311 | IV.55; p. 57 | verified | Bias contributes measurement error. |
| 312 | IV.56; p. 57 | corrected | Mean measurement minus reference. Independently computed -0.0033333333333338544; checked against the selected answer. Change: Nominal target is not necessarily a known reference value. |
| 313 | IV.57; p. 57 | verified | Bias depends on reference size: -.002,-.157,.275. |
| 314 | IV.58; p. 57 | verified | Precision under repeatability conditions is closeness of repeated results. |
| 315 | IV.59; p. 58 | verified | Sum variance components. Independently computed 1.1308; checked against the selected answer. |
| 316 | IV.60; p. 58 | verified | Full ANOVA: repeatability plus nonnegative operator/interaction components. Independently computed 1.233; checked against the selected answer. |
| 317 | IV.61; p. 58 | corrected | Repeatability fraction of full-model total variance. Independently computed 42.19953225714449; checked against the selected answer. Change: Full-model part variance used wrong mean square; repeatability contribution recalculated. |
| 318 | IV.62; p. 59 | corrected | 6 * measurement SD / tolerance. Independently computed 0.33312159941979147; checked against the selected answer. Change: Specify the full-model variance convention instead of leaving pooling implicit. |
| 319 | IV.63; p. 59 | corrected | Range chart stable within-operator repeatability; does not compare mean bias. Change: No signal does not prove absence of special causes or equal operator means. |
| 320 | VI.7; p. 94 | corrected | Weibull lowestAD/highestp; no proof from p-value alone. Change: Largest goodness-of-fit p-value alone is not proof of best model. |
| 321 | VI.15; p. 96 | corrected | Whiskers may exclude outliers; specify classical five-number-summary convention. Change: Tukey whiskers need not be minimum/maximum. |
| 322 | VI.16; p. 96 | verified | Strong probability-plot deviation supports rejecting normality; no inference about Weibull. |
| 323 | VI.19; p. 97 | verified | P(nonconforming / overnight). Independently computed 0.26136363636363635; checked against the selected answer. |
| 324 | VI.31; p. 100 | verified | Expected invoice-error count. Independently computed 0.27; checked against the selected answer. |
| 325 | VI.40; p. 102 | corrected | One-sample t=(17.98-18)/(.03/sqrt24). Independently computed -3.2659863237108344; checked against the selected answer. Change: Specify assumptions for small-sample t test. |
| 326 | VI.41; p. 102 | corrected | Remove previous-question dependency; restate mean hypotheses and p-value. Change: Question relies on unavailable preceding question after shuffle. |
| 327 | VI.42; p. 102 | verified | Lower-mean alternative μ<25; boundary nullμ25. |
| 328 | VI.43; p. 103 | corrected | Exact upper binomial test with 7 of 56, null p=.10. Independently computed 1.0; checked against the selected answer. Change: Nonrejection falsely asserted equality; count of falls confused with patients. |
| 329 | VI.44; p. 103 | verified | Zero excluded from90% difference interval supports two-sided difference at10%. |
| 330 | VI.45; p. 103 | corrected | Right-tailed pooled t critical; df=28+25-2. Independently computed 2.4017175230846974; checked against the selected answer. Change: Pooled t critical value needs equal-variance independent-sample assumptions. |
| 331 | VI.46; p. 104 | corrected | Ratio of sample variances. Independently computed 1.1470588235294117; checked against the selected answer. Change: Variance-test data missing when question is selected alone. |
| 332 | VI.47; p. 104 | corrected | Unpooled two-proportion 90% CI. Independently computed [-0.001981746263784152, 0.016143448391443726]; checked against the selected answer. Change: Pooled standard error incorrectly used for confidence interval. |
| 333 | VI.48; p. 104 | verified | Type II error = 1-power. Independently computed 0.19999999999999996; checked against the selected answer. |
| 334 | VI.49; p. 104 | verified | Failure to reject false null is typeII. |
| 335 | VI.50; p. 104 | corrected | Large-sample two-proportion statistic is asymptotically normal under null. Change: Asymptotic null distribution needs adequate counts. |
| 336 | VI.51; p. 105 | verified | Within-person equipment readings are paired; differences need suitable assumptions. |
| 337 | VI.52; p. 105 | corrected | Paired t from original table. Independently computed 0.6469966392206271; checked against the selected answer. Change: The paired t statistic from the original five pairs is .646997, not .650 to three decimals. |
| 338 | VI.53; p. 105 | verified | Equal-probability GOF from [32,28,45,35]. Independently computed 4.514285714285714; checked against the selected answer. |
| 339 | VI.54; p. 106 | corrected | Pearson goodness-of-fit asymptotic chi-square; subtract fitted parameters fromdf. Change: GOF asymptotic distribution and fitted-parameter adjustment. |
| 340 | VI.55; p. 106 | verified | ANOVA p-value from F=1.70, df=(2,12). Independently computed 1.0; checked against the selected answer. |
| 341 | VI.56; p. 106 | corrected | Classical ANOVA assumes independent errors, within-group normality and common variance. Change: ANOVA normality is within groups/residuals, not pooled observations. |
| 342 | VI.57; p. 107 | corrected | Parallel sample-mean lines show little interaction; no significance claim from plot alone. Change: Plot alone cannot establish statistical nonsignificance. |
| 343 | VI.59; p. 108 | verified | Independence test from original 3x2 table. Independently computed 19.070896200913538; checked against the selected answer. |
| 344 | VI.60; p. 108 | verified | Coefficient of x is slope. Independently computed 2.5; checked against the selected answer. |
| 345 | VI.61; p. 108 | verified | Predicted cholesterol. Independently computed 169.9; checked against the selected answer. |
| 346 | VI.62; p. 108 | verified | OLS slope from four paired observations. Independently computed 0.9229904440697028; checked against the selected answer. |
| 347 | VI.63; p. 109 | verified | Test regression slope β1≠0. |
| 348 | VI.64; p. 109 | verified | Positive approximately linear scatter supportsr.88. |
| 349 | VI.65; p. 110 | corrected | Symmetric U-shaped scatter has near-zero linear correlation, not all curved relationships. Change: Curvature alone does not imply zero correlation. |
| 350 | VI.66; p. 110 | verified | Correlation sign from slope; magnitude sqrt(R²). Independently computed -0.9219544457292888; checked against the selected answer. |
| 351 | VI.67; p. 110 | verified | Negative correlation is inverse association, not causation. |
| 352 | VI.68; p. 111 | corrected | Autocorrelation is serial association, not necessarily direct causation. Change: Autocorrelation does not require one value to cause the next. |
| 353 | VI.69; p. 111 | verified | SPC detects signals of instability over time. |
| 354 | VI.70; p. 111 | verified | Adjustment in response to common cause is tampering/overcontrol. |
| 355 | VI.71; p. 111 | verified | Control charts signal possible special causes, not identify their specific source. |
| 356 | VI.72; p. 111 | corrected | Clarify unusual wrong-setting event versus routine stable variation. Change: Any broad listed source could contain common or special causes. |
| 357 | VI.73; p. 112 | verified | Rational subgroups isolate short-term common-cause variation. |
| 358 | VI.74; p. 112 | verified | Shewhart introduced control charts. |
| 359 | VI.75; p. 112 | corrected | Normal theory derives conventional constants; exact normality is not universal requirement. Change: Normality stated as absolute requirement for every variables chart. |
| 360 | VI.76; p. 112 | verified | New mean28.142857 andrange11 exceed bothUCLs27.1045,10.582. |
| 361 | VI.77; p. 112 | verified | n12 favors sample-S chart over ranges. |
| 362 | VI.78; p. 113 | verified | Mean12.3333 SD1.632993 fall within normal-theory Xbar-S limits. |
| 363 | VI.79; p. 113 | verified | Expensive continuous measurements favor individual/MR charts. |
| 364 | VI.80; p. 113 | verified | Binary complication fraction with varying n usesp chart. |
| 365 | VI.81; p. 113 | verified | New p within three-sigma p-chart limits. Independently computed 1.0; checked against the selected answer. |
| 366 | VI.82; p. 114 | corrected | p-chart UCL. Independently computed 0.0587256179830759; checked against the selected answer. Change: p-chart limit depends on actual subgroup size. |
| 367 | VI.83; p. 114 | corrected | Fixed five-screen inspection unit and defect counts usec chart. Change: Identify the constant inspection unit and plotted defect count. |
| 368 | VI.84; p. 114 | verified | u-chart UCL. Independently computed 1.1632600670662896; checked against the selected answer. |
| 369 | VI.85; p. 114 | verified | Unspecified out-of-control distribution gives unknown zone probability. |
| 370 | VI.86; p. 115 | verified | Long in-control ARL reduces false alarms. |
| 371 | VI.87; p. 115 | verified | MR chart contains point beyond upper limit. |
| 372 | VI.88; p. 115 | corrected | p chart alternating pattern needs explicit14-point rule. Change: Supplementary chart rule unspecified. |
| 373 | VI.89; p. 116 | corrected | No detected signal supports apparent stability, not proof. Change: No observed signal is not proof of stability. |
| 374 | VI.90; p. 116 | verified | Short build-to-order runs favor standardized short-run SPC. |
| 375 | VI.91; p. 116 | verified | Stability precedes predictive capability assessment. |
| 376 | VI.92; p. 117 | verified | Capability compares process distribution with requirements. |
| 377 | VI.93; p. 117 | corrected | Normal specification probability using unrounded z scores. Independently computed 0.009521032424262943; checked against the selected answer. Change: Avoid premature z-score rounding in the numerical answer and worked solution. |
| 378 | VI.94; p. 117 | corrected | Normal specification probability using unrounded z scores. Independently computed 0.9824521417059504; checked against the selected answer. Change: Avoid premature z-score rounding in the numerical answer and worked solution. |
| 379 | VI.95; p. 117 | corrected | Specification distractor equations corrupted; specification limits derive from requirements. Change: Malformed OCR formulas in distractors. |
| 380 | VI.96; p. 118 | verified | Cp and Cpk. Independently computed [1.3636363636363635, 1.251515151515151]; checked against the selected answer. |
| 381 | VI.97; p. 118 | verified | Minimum one-sided capability index. Independently computed 0.8888888888888888; checked against the selected answer. |
| 382 | VI.98; p. 118 | corrected | Cp from range-based within-subgroup sigma. Independently computed 0.7934272300469485; checked against the selected answer. Change: Unspecified capability measure makes Cp andCpk bothdefensible. |
| 383 | VI.99; p. 118 | corrected | Pp describes observed overall spread; unstable process cannot support predictive capability claim. Change: Pp not predictive capability for unstableprocess. |
| 384 | VI.100; p. 119 | verified | Treatment count in 2^3 design. Independently computed 8.0; checked against the selected answer. |
| 385 | VI.101; p. 119 | verified | Number of manipulated factors. Independently computed 3.0; checked against the selected answer. |
| 386 | VI.102; p. 119 | verified | Replicate treatment variability estimates experimental error. |
| 387 | VI.103; p. 119 | verified | Experiment objective must be defined first. |
| 388 | VI.104; p. 119 | corrected | Randomization protects against unknown nuisance confounding; blocking also controls knownnuisance. Change: Blockingalsoaddressesnuisance;randomizationdoesnotreducenoisemagnitude. |
| 389 | VI.105; p. 120 | corrected | Blocking accounts for known day effects; does not eliminate physical influence. Change: Blocking accountsforratherthanremovesdayeffects. |
| 390 | VI.106; p. 120 | verified | Factorial design evaluates all combinations and interaction. |
| 391 | VI.107; p. 120 | verified | F-test significant terms from MS/error MS. Independently computed [1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0]; checked against the selected answer. |
| 392 | VI.108; p. 121 | verified | Residual run-order plot can reveal dependence. |
| 393 | VI.109; p. 121 | corrected | Saturated 2^4 model leaves no residual df. Independently computed 0.0; checked against the selected answer. Change: Lost exponentinexperimentaldesign. |
| 394 | VI.110; p. 121 | verified | 128 of256 combinations is half-fraction. |
| 395 | VI.111; p. 121 | verified | Full factorial avoids aliasing main/two-factor effects with other factorial terms. |
| 396 | VI.112; p. 122 | verified | ResolutionIV: main withthree-factor, two-factor withtwo-factor. |
| 397 | VI.113; p. 122 | corrected | Complete aliasB=AD=ABCE=CDE; option omittedfour-factoralias. Change: Correctoptiondidnotlistcompletealiasset. |
| 398 | VI.114; p. 122 | verified | Robustness means insensitivity to noise. |
| 399 | VI.115; p. 122 | verified | Control-by-noise interaction permits robust settings. |
| 400 | S2.92; p. 186 | corrected | Policy top tier in traditional documentation model. Change: Traditional documentationmodelnotmandatorymanualstructure. |
| 401 | S2.135; p. 198 | corrected | Outsourced internal audit remains first-party; employmentstatus is not auditclassification. Change: Auditor employmentstatusdoesnotdeterminefirst-partyclassification. |
| 402 | S2.212; p. 217 | verified | International standards harmonize vocabulary and requirements. |
| 403 | S2.49; p. 176 | verified | Missing/inadequate control is a gap. |
| 404 | S2.60; p. 178 | corrected | Risk after mitigation is residual; inherent means before controls. Change: Residualriskincorrectlycalledinherentuntreatablerisk. |
| 405 | S2.68; p. 180 | verified | Reaction plan addresses authorized suspect-material disposition. |
| 406 | S2.90; p. 186 | verified | Winter tires reduce likelihood rather than eliminate risk. |
| 407 | S2.151; p. 202 | corrected | Initial plan specifies review/report frequency; outputs can be linked later. Change: Riskplanscanreferenceexistingoutputs;askinitialplanningdecision. |
| 408 | S2.166; p. 205 | corrected | Design-change audit directly reviews verification/validation evidence. Change: Multiplelistedrecords canberelevanttochangeaudit. |
| 409 | S2.196; p. 214 | verified | Risk control maintains acceptable residual level. |
| 410 | S2.201; p. 215 | verified | Severity scale represents consequence magnitude. |
| 411 | S2.215; p. 218 | corrected | Conventional Boolean FTA treats events as binary; qualify extension-dependent claim. Change: Binary limitation applies toconventional BooleanFTA. |
| 412 | S2.7; p. 164 | corrected | Incoming inspection appraisal total. Independently computed 60000.0; checked against the selected answer. Change: Fieldtrial costdepends onpurpose;clarifydevelopmentpreventionconvention. |
| 413 | S2.17; p. 167 | verified | Process improvement team changes existing/new processes. |
| 414 | S2.19; p. 167 | corrected | QFD translates training needs; narrow generic needs-analysis ambiguity. Change: Genericneedsanalysiscanalsousechecklists. |
| 415 | S2.38; p. 173 | corrected | Supplier capability covers financial/manufacturing/qualitysystems. Change: Explanationdidnotjustifycorrectchoice. |
| 416 | S2.51; p. 176 | verified | Truthful conduct supports ethics; not sufficient to satisfy everyother duty. |
| 417 | S2.70; p. 181 | verified | Norming shifts individual to team orientation. |
| 418 | S2.100; p. 188 | verified | NPV expansion verified. |
| 419 | S2.107; p. 190 | verified | Confidential information needs protection. |
| 420 | S2.108; p. 190 | corrected | Crosby definition is conformance to requirements, not only technicalspecifications. Change: Crosbydefinitionnarrowedincorrectlytospecificationonly. |
| 421 | S2.131; p. 197 | verified | Confirming meaning supports active listening. |
| 422 | S2.161; p. 204 | verified | Using another badge misrepresents identity. |
| 423 | S2.171; p. 206 | verified | Warranty is external failure. |
| 424 | S2.176; p. 208 | verified | Forming clarifies mission androles. |
| 425 | S2.181; p. 209 | verified | Training on job is Demingpoint; historicalpercentclaim notitselfa14point. |
| 426 | S2.190; p. 212 | verified | Unused employee ideas are lost creativity. |
| 427 | S2.206; p. 216 | corrected | RACI informed role determined by task, not jobtitle. Change: RACIrolesarenotfixedbyjobtitle. |
| 428 | S2.213; p. 217 | verified | Baldrige emphasizes organizational results. |
| 429 | S2.214; p. 217 | corrected | Prevention design support and preventive field trials. Independently computed 122000.0; checked against the selected answer. Change: Fieldtrial costdepends onpurpose;clarifydevelopmentpreventionconvention. |
| 430 | S2.4; p. 163 | verified | SixSigma focuses variation; LeanSixSigma includeswaste. |
| 431 | S2.12; p. 165 | verified | Digraph models potentialcausalrelationships. |
| 432 | S2.13; p. 165 | corrected | Contain nonconformingbattery beforeMRBdisposition; don'tmerelywait. Change: WaitingforMRBwithoutcontainmentis incomplete;dispositionnotrootcauseaction. |
| 433 | S2.20; p. 167 | verified | Recurrencecontrol standardizes correction. |
| 434 | S2.28; p. 170 | verified | Taguchi developedS/Nrobust-design methods. |
| 435 | S2.30; p. 170 | verified | Standardizedwork reducesexecutionvariation. |
| 436 | S2.39; p. 173 | verified | Rootcause investigation is Analyze. |
| 437 | S2.46; p. 175 | verified | LeanSixSigma combineswasteandvariation reduction. |
| 438 | S2.47; p. 175 | verified | Correction phase developscountermeasures inguideframework. |
| 439 | S2.52; p. 176 | verified | Splittingtables is datatransformation. |
| 440 | S2.67; p. 180 | verified | Excessstockanddegradation indicateinventorywaste. |
| 441 | S2.81; p. 183 | verified | Evidence-basedrootcause work supportsprevention. |
| 442 | S2.85; p. 185 | corrected | Seriousdefect classification isguide-specificlargeeconomicloss category. Change: Seriousdefectcategoryisnotuniversal. |
| 443 | S2.91; p. 186 | corrected | Legallyrequiredinspection isnecessarynon-value-added, notcustomervaluebydefault. Change: Legalnecessitydoesnotmakeinspectioncustomer-value-added. |
| 444 | S2.116; p. 193 | corrected | 90/95/99 arebenchmarkcomponents forabout85%OEE; idealis100%. Change: IdealOEEis100%;listedvaluesareconventionalbenchmark,notuniqueideal. |
| 445 | S2.119; p. 193 | verified | Required validatedaddressfields areerrorproofing. |
| 446 | S2.129; p. 196 | verified | Tree structure models hierarchicalevents. |
| 447 | S2.136; p. 198 | verified | Histogramcompares distributionagainst target. |
| 448 | S2.142; p. 200 | verified | In lean terminology, muda is waste: activity that consumes resources without creating customer value. |
| 449 | S2.149; p. 202 | verified | Incrementalworkplaceimprovements arekaizen. |
| 450 | S2.154; p. 203 | corrected | SMEDis Shingochangeovermethod. Change: Misleading ownershipattributionofToyotaProductionSystem. |
| 451 | S2.167; p. 206 | verified | Colorwayfinding isvisualcontrol. |
| 452 | S2.179; p. 209 | verified | PDPC anticipatesimplementationfailureandresponses. |
| 453 | S2.180; p. 209 | verified | RFID supports identityandmovementtracking. |
| 454 | S2.198; p. 214 | corrected | PDCA isiterativefour-phaseframework;PDSArelatednotidentical. Change: PDCAandPDSAaredistinctrelatedcycles. |
| 455 | S2.205; p. 216 | verified | Wrong-itemreturns incurdefectcorrectionwaste. |
| 456 | S2.210; p. 217 | corrected | Shingo converts internalsetup toexternal; stemwasreversed. Change: StemreversesSMEDconversiondirection. |
| 457 | S2.1; p. 163 | corrected | Square root of sum of squared component SDs. Independently computed 1.0926569681286071; checked against the selected answer. Change: WorkedvarianceandSDarithmeticallywrongdespitecorrectkey. |
| 458 | S2.6; p. 164 | corrected | OQ establishes qualifiedranges/worstcase, notallimaginableconditions. Change: Qualificationdoesnotcoverallpossiblemanufacturingconditions. |
| 459 | S2.18; p. 167 | verified | Bothendsfit failsno-gocriterion. |
| 460 | S2.23; p. 169 | corrected | XbarRR chartmostlywithinlimits indicatespoor discriminationforstudiedparts. Change: Gageconclusiondependsonpartselectionandstudycontext. |
| 461 | S2.26; p. 170 | verified | F atAQL1.5 single normal redirects G32. |
| 462 | S2.34; p. 171 | verified | HigherdashedOC favorsproduceracceptance. |
| 463 | S2.40; p. 173 | corrected | Poisson approximation, mean=80*.025. Independently computed 0.6766764161830634; checked against the selected answer. Change: Percentage/fractionambiguityandlostexponents. |
| 464 | S2.43; p. 174 | verified | Reproducibility isprecisioncomponent. |
| 465 | S2.48; p. 175 | corrected | Measurementassurance includesoperator/procedureeffects beyondcalibration. Change: Multiplegeneralbenefitscouldansweroriginalstem. |
| 466 | S2.50; p. 176 | verified | Readable scale helps use, not automatic accuracy. |
| 467 | S2.55; p. 177 | verified | Calibration control includes equipment capability, standards and procedures. |
| 468 | S2.59; p. 178 | corrected | Plug limitgage checks bore; genericmicrometercouldalso measureinside, narrowstem. Change: Inside micrometers can also measure internal dimensions. |
| 469 | S2.63; p. 179 | verified | Continuousproduction modeluses typeB OC. |
| 470 | S2.65; p. 180 | verified | Total observedvariance needs part-to-partcomponent notgiven. |
| 471 | S2.73; p. 182 | verified | Increasingc weaklyincreases acceptance; nondegeneratebinomialgivesstrictincrease. |
| 472 | S2.78; p. 183 | verified | CMM accommodatescomplexgeometry. |
| 473 | S2.80; p. 183 | corrected | Consumer risk isacceptanceat specifiedrejectablequality. Change: Consumer-risk definition referenced LTPD ambiguously. |
| 474 | S2.89; p. 185 | verified | Graniteflatstablecorrosion-resistantreference; environmentalcontrolstillnecessary. |
| 475 | S2.96; p. 187 | verified | Penetrantdetects surface-openingflaws onnonporousaluminum. |
| 476 | S2.102; p. 189 | verified | Consistentcalibrationoffset issystematicerror. |
| 477 | S2.103; p. 189 | corrected | Unilateral specification limits. Independently computed [10.0, 10.002]; checked against the selected answer. Change: Malformed unilateral tolerance typography. |
| 478 | S2.110; p. 191 | corrected | Artifactkilogramstatementneeds explicitlyhistoricalperiod. Change: Obsolete claim nowmadeexplicitlyhistorical. |
| 479 | S2.115; p. 192 | corrected | Biaschanges overtimeonlyif same stable referenceartifactused. Change: Changingpartscouldconfoundstabilityassessment. |
| 480 | S2.126; p. 196 | verified | CodeN n500 atAQL1%=Ac10Re11. |
| 481 | S2.130; p. 197 | verified | Firststage3<6<7 requirescontinuation. |
| 482 | S2.137; p. 198 | corrected | First-stage decision P(X≤2)+P(X≥5); Bin(75,.015). Independently computed 0.9021964854906527; checked against the selected answer. Change: Wrongdefectrateusedinnumericalsolution;lostsubscripts. |
| 483 | S2.143; p. 200 | verified | Highdefectratecanfavorfullscreeningwhenfeasible. |
| 484 | S2.152; p. 202 | corrected | Variables give quantitativeproximity; attributecountsstillprovidequalityinformation. Change: Attributecountsdo providequalityinformation. |
| 485 | S2.3; p. 163 | verified | Seriesfailsupononecomponentfailure. |
| 486 | S2.10; p. 165 | verified | Bathtubthirdregioniswear-out. |
| 487 | S2.15; p. 166 | verified | 3/1000=.3%, lowestband andcoldstart=>Low. |
| 488 | S2.16; p. 166 | verified | Maximum product of three 1–10 scales. Independently computed 1000.0; checked against the selected answer. |
| 489 | S2.24; p. 169 | verified | Prototypeis workingmodel stage. |
| 490 | S2.32; p. 171 | corrected | Minorclassificationrequiresthat delaydoesnotimpairessentialfunction. Change: Occasionalslowingmaybemajordependingonseverity. |
| 491 | S2.35; p. 172 | corrected | Exponential CDF at MTTF. Independently computed 0.6321205588285577; checked against the selected answer. Change: Ambiguousexponentialnotation. |
| 492 | S2.42; p. 174 | corrected | Exponential failure percent. Independently computed 85.11419191966668; checked against the selected answer. Change: Damagedfailureprobabilityformula. |
| 493 | S2.56; p. 177 | corrected | Hazard=f/R hasunitinverse-time andconditionsonsurvival. Change: Hazarddenominatorhadwrongunits. |
| 494 | S2.58; p. 178 | corrected | TraditionalRPNusesS,O,Dratings. Change: Three ratingsapplytotraditionalRPN,notallriskdefinitions. |
| 495 | S2.62; p. 179 | verified | Alias/confoundingmakes effectsindistinguishable. |
| 496 | S2.71; p. 181 | verified | Component/vendor/shipping recordsestablishtraceability. |
| 497 | S2.72; p. 181 | verified | 2-of-3 independent system. Independently computed 0.99275; checked against the selected answer. |
| 498 | S2.74; p. 182 | corrected | CTQs translateneeds intomeasurableoutputrequirements. Change: Vaguecorrectanswerandotherpossiblebenefits. |
| 499 | S2.77; p. 182 | verified | Mixed-level full factorial count. Independently computed 48.0; checked against the selected answer. |
| 500 | S2.79; p. 183 | corrected | Total exposure / failures, rounded to whole hours. Independently computed 133.92857142857142; checked against the selected answer. Change: Prematurefailure-rateroundingproducedwrongroundedMTTF. |
| 501 | S2.82; p. 183 | verified | Customerorderpullsproduction. |
| 502 | S2.84; p. 184 | verified | Availability MTBF/(MTBF+MTTR). Independently computed 0.963020030816641; checked against the selected answer. |
| 503 | S2.88; p. 185 | corrected | Equal/closeRPNs shouldnottriggerautomaticomissionofoccurrence. Change: Blindlydiscardingoccurrenceisnotgenerallyvalidriskprioritization. |
| 504 | S2.97; p. 188 | verified | Effect sparsitymeansfewactiveeffectsusuallyloworder. |
| 505 | S2.105; p. 190 | verified | R(t)=4890/5000 isprobabilityT>t. |
| 506 | S2.112; p. 192 | verified | Contourplot mapsfittedresponse forfactoroptimization. |
| 507 | S2.117; p. 193 | verified | Weibullshape<1 modelsearlydecreasinghazard. |
| 508 | S2.118; p. 193 | verified | Three independent parallel components. Independently computed 0.99996; checked against the selected answer. |
| 509 | S2.122; p. 195 | verified | Fractionaldesign tradesrunreductionforaliasing. |
| 510 | S2.123; p. 195 | corrected | Age-basedpreventivereplacementmostsuitedtoincreasinghazard;avoidblanketno-maintenanceclaim. Change: Blanketclaimthatpreventivemaintenancecannothelpunknown/constanthazard. |
| 511 | S2.138; p. 199 | corrected | Exponential CDF at mean lifetime. Independently computed 0.6321205588285577; checked against the selected answer. Change: Ambiguousexponentialnotation. |
| 512 | S2.141; p. 200 | corrected | FMEA isproactive;effortvariesnotnecessarilyexpensive. Change: FMEAexpenseclaimwasabsolute. |
| 513 | S2.145; p. 200 | verified | Narrowfactor range canhideeffects. |
| 514 | S2.148; p. 201 | verified | Requirementsandconstraintsare designinputs. |
| 515 | S2.150; p. 202 | verified | CTQdriverbridgesneedandmeasurablecharacteristic. |
| 516 | S2.155; p. 203 | corrected | Availability from accumulated exposure and repair time. Independently computed 0.9377093101138647; checked against the selected answer. Change: Unstatedoperatingexposureandprematurerounding. |
| 517 | S2.158; p. 204 | verified | Bathtubuseful-liferegionapproximatelyconstanthazard. |
| 518 | S2.162; p. 205 | verified | ResolutionIV two-factoraliases mayincludeother two-factors. |
| 519 | S2.174; p. 207 | verified | ShortestdefiningwordCEFGhaslength4. |
| 520 | S2.177; p. 208 | corrected | Exponential failure percent. Independently computed 71.34952031398099; checked against the selected answer. Change: Ambiguousexponentialnotation. |
| 521 | S2.183; p. 210 | verified | Quality ispositivecustomervalueamongchoices. |
| 522 | S2.184; p. 210 | corrected | All seven F tests have p>.05. Independently computed [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; checked against the selected answer. Change: Nonsignificanceisnotproofabsenceofeffects. |
| 523 | S2.186; p. 211 | verified | Keyedone-positionassemblypreventsassemblyerror. |
| 524 | S2.202; p. 215 | verified | Three independent series components. Independently computed 0.86526; checked against the selected answer. |
| 525 | S2.203; p. 215 | verified | DatumB issecondary inframe. |
| 526 | S2.204; p. 215 | corrected | Run-to-failureavoids scheduledreplacement; no universalmaximumuptime. Change: Run-to-failuredoesnotguaranteemaximumruntime. |
| 527 | S2.207; p. 216 | verified | Atleast3of6working is k-out-of-n. |
| 528 | S2.208; p. 216 | corrected | 2^(8-2)=64 quarter-fraction;repairambiguous exponent. Change: Missingexponentparentheses. |
| 529 | S2.209; p. 216 | verified | Criticalitycombinesseverityandfrequency. |
| 530 | S2.2; p. 163 | verified | Filingerrorcountisdiscreteattribute. |
| 531 | S2.5; p. 163 | corrected | SE=5.5/sqrt32. Independently computed 0.9722718241315028; checked against the selected answer. Change: Missingradicalmakeskeyequivalenttoincorrectdistractor. |
| 532 | S2.8; p. 164 | verified | Operator follows controlplanreactionprocess. |
| 533 | S2.9; p. 165 | verified | New subgroup mean inside, range outside. Independently computed [1.0, 1.0]; checked against the selected answer. |
| 534 | S2.14; p. 166 | verified | p.23>.10 nonreject; notstatisticallysignificantdifference. |
| 535 | S2.21; p. 168 | verified | Weibullplotapproximatelylinear supportsmodel. |
| 536 | S2.22; p. 168 | corrected | Wald 90% interval. Independently computed [0.03915899334752432, 0.17512672093818996]; checked against the selected answer. Change: Methodunspecifiedandpatientcountmustbebinary. |
| 537 | S2.25; p. 169 | corrected | Standard normal interval probability. Independently computed 0.5651784607287008; checked against the selected answer. Change: Use unrounded cumulative probabilities before the final rounding. |
| 538 | S2.29; p. 170 | verified | Calendar-dateintervalscalehasarbitraryzero. |
| 539 | S2.31; p. 171 | corrected | Undercontrolis failuretorespond, notfailuretoadjustwithoutinvestigation. Change: Signalrequiresinvestigationandreactionplan,notautomaticadjustment. |
| 540 | S2.33; p. 171 | verified | 3⁵meansfivefactorsatthreelevels=243. |
| 541 | S2.36; p. 172 | verified | StoreB largerIQR/spread; boxplotnotproofbellshape. |
| 542 | S2.37; p. 173 | corrected | Nonparallelresponsesuggestinteraction; plotnotp-valuetest. Change: Interactionplotnotastatisticalsignificancetest. |
| 543 | S2.41; p. 174 | verified | One-sample z with known sigma. Independently computed 12.393546707863734; checked against the selected answer. |
| 544 | S2.44; p. 174 | verified | Plotpaireddata beforeregressing. |
| 545 | S2.45; p. 175 | verified | Intersection of independent events. Independently computed 0.055799999999999995; checked against the selected answer. |
| 546 | S2.53; p. 176 | verified | Unstableprocessprecludesreliablepredictivecapability. |
| 547 | S2.54; p. 177 | verified | Strongnegativeplot bestr=-.90;outside[-1,1] impossible. |
| 548 | S2.57; p. 178 | verified | Required n rounded upward. Independently computed 664.0; checked against the selected answer. |
| 549 | S2.61; p. 179 | corrected | np upper limit versus new count. Independently computed 1.0; checked against the selected answer. Change: Two truechoices:outofcontrolandLCL0. |
| 550 | S2.64; p. 179 | corrected | ccharttrend meets6point rule; stateappliedrule. Change: Stateusedsupplementarytrendrule. |
| 551 | S2.66; p. 180 | verified | Normal issymmetricamonglistedmodels. |
| 552 | S2.69; p. 181 | verified | Predicted cholesterol. Independently computed 184.0; checked against the selected answer. |
| 553 | S2.75; p. 182 | corrected | Lower-tail variance chi-square decision. Independently computed 1.0; checked against the selected answer. Change: Chisquarevarianceinferenceassumesnormalpopulation;tailnotationambiguous. |
| 554 | S2.76; p. 182 | verified | Normal tail beyond 4.5 sigma, parts per million. Independently computed 3.39767315663897; checked against the selected answer. |
| 555 | S2.83; p. 184 | verified | Chi-square independence from original counts. Independently computed 0.7569428915696559; checked against the selected answer. |
| 556 | S2.86; p. 185 | corrected | CLTneedsfinitevarianceandsufficientn; n50notuniversallyenough. Change: Finitevariance/CLTsample-sizeconditionsomitted. |
| 557 | S2.87; p. 185 | corrected | c-chart UCL. Independently computed 12.82982517268779; checked against the selected answer. Change: Inspectionunitunclearbetweenscreenanddailygroup. |
| 558 | S2.93; p. 186 | corrected | Normal standard-deviation 99% CI. Independently computed [0.8849816245638318, 3.576301815051116]; checked against the selected answer. Change: Clarify lower/upperquantileconvention. |
| 559 | S2.94; p. 187 | corrected | Nineabove-centerpoints signalunderninepointrule;stateit. Change: Stateusedsupplementaryrunrule. |
| 560 | S2.95; p. 187 | verified | Intercept of fitted line. Independently computed -19.0; checked against the selected answer. |
| 561 | S2.98; p. 188 | verified | Mutually exclusive union. Independently computed 0.53; checked against the selected answer. |
| 562 | S2.99; p. 188 | verified | Power=1-beta. Independently computed 0.85; checked against the selected answer. |
| 563 | S2.101; p. 189 | verified | Weaknegativepattern bestr=-.39. |
| 564 | S2.104; p. 189 | verified | Mode of waiting-time data. Independently computed 5.0; checked against the selected answer. |
| 565 | S2.106; p. 190 | corrected | Cpk minimum one-sided index. Independently computed 0.682539682539682; checked against the selected answer. Change: Specifyactualindexandstabilityassumption. |
| 566 | S2.109; p. 191 | corrected | GOF original counts [22,34,47,45]. Independently computed 10.756756756756756; checked against the selected answer. Change: Restore missing null-hypothesis subscripts in answer choices. |
| 567 | S2.111; p. 191 | verified | Shortout-of-controlARLmeansfastdetection. |
| 568 | S2.113; p. 192 | verified | Normal sampling mean lower tail n=9. Independently computed 0.00819753592459727; checked against the selected answer. |
| 569 | S2.114; p. 192 | verified | SPCdoesnotidentifyrootcausebyitself. |
| 570 | S2.120; p. 194 | verified | Sample-derivedsummaryisstatistic. |
| 571 | S2.124; p. 195 | verified | PowerisprobabilityrejectfalseH0atstatedalternative. |
| 572 | S2.125; p. 195 | corrected | Noapparentlinearpatternsupportsnearzero,notexactr0fromvisual. Change: Plotdoesnotestablishexactcorrelationzero. |
| 573 | S2.127; p. 196 | verified | 50independentBernoulli.01countsarebinomial. |
| 574 | S2.128; p. 196 | corrected | Normal specification probability using unrounded z scores. Independently computed 0.0692559715389609; checked against the selected answer. Change: Avoid premature z-score rounding in the numerical answer and worked solution. |
| 575 | S2.132; p. 197 | verified | npusesbinomialdefective-unitcount. |
| 576 | S2.133; p. 197 | verified | Conditional probability day given nonconforming. Independently computed 0.13157894736842105; checked against the selected answer. |
| 577 | S2.134; p. 198 | corrected | 95% t interval from raw eight diameters. Independently computed [0.1833793740946517, 0.18937062590534834]; checked against the selected answer. Change: Keep the exact sample mean in the t-interval calculation. |
| 578 | S2.139; p. 199 | corrected | Regression F test df=(1,14). Independently computed 1.0; checked against the selected answer. Change: Causalwording,missinginterceptsubscriptsandroundedpzero. |
| 579 | S2.140; p. 199 | corrected | u lower limit truncated at zero. Independently computed 0.0; checked against the selected answer. Change: Nonnegativetruncationisnotgenericall-control-chartproperty. |
| 580 | S2.144; p. 200 | corrected | Nonnormalcapabilitymethodsarevalid; normalneededonlyfornormal-tailinterpretation. Change: Incorrectclaimthatallcapabilityanalysisrequiresnormality. |
| 581 | S2.146; p. 201 | verified | Histogramrighttailindicatespositiveskew. |
| 582 | S2.147; p. 201 | verified | tdf→infinityconvergestostandardnormal. |
| 583 | S2.153; p. 202 | corrected | Two-sample z statistic. Independently computed -5.3979403626358335; checked against the selected answer. Change: Detachedsubscriptsinstem. |
| 584 | S2.156; p. 203 | verified | Agecanbemodeledcontinuously;householdsizeiscount. |
| 585 | S2.157; p. 203 | verified | Residualnormalprobabilityplotchecksnormal-errorassumption. |
| 586 | S2.159; p. 204 | verified | Variance E(X²)-E(X)². Independently computed 0.5771000000000001; checked against the selected answer. |
| 587 | S2.164; p. 205 | corrected | Classicalregressioninferenceassumptionsnotrequirementsforcomputingleastsquares. Change: OLScomputabilityversusclassicalinferenceassumptions. |
| 588 | S2.165; p. 205 | verified | SE=sqrt(variance/n). Independently computed 1.8819316317727024; checked against the selected answer. |
| 589 | S2.168; p. 206 | verified | canduPoissoncountmodels. |
| 590 | S2.169; p. 206 | corrected | Normalityisnotaprerequisiteforeveryanalysis;scopequestionproperly. Change: Normalitytestnotmandatorybeforealldataanalysis. |
| 591 | S2.170; p. 206 | corrected | Normal specification probability using unrounded z scores. Independently computed 0.9763803865178895; checked against the selected answer. Change: Avoid premature z-score rounding in the numerical answer and worked solution. |
| 592 | S2.172; p. 207 | verified | Factor/interaction F tests from original mean squares. Independently computed [1.0, 0.0, 0.0]; checked against the selected answer. |
| 593 | S2.175; p. 208 | corrected | Pearson r from four raw data pairs. Independently computed 0.9601393568897659; checked against the selected answer. Change: Syyandworkedcorrelationarithmeticallyinconsistent. |
| 594 | S2.178; p. 208 | verified | Extremehighsalariesfavorresistantmedianfortypicalemployee. |
| 595 | S2.182; p. 209 | corrected | Rationalsubgroupsdo notartificiallymaximizeobservedvariation. Change: Subgroupingdoesnotcherry-picksmallorlargeobservedvariation. |
| 596 | S2.185; p. 210 | corrected | Two-sided t critical df=23. Independently computed 2.0686576104190486; checked against the selected answer. Change: Specifyone-sampletnormalityassumptions. |
| 597 | S2.187; p. 211 | verified | Paired t interval from original table. Independently computed [-0.1974769267929084, 0.31747692679290795]; checked against the selected answer. |
| 598 | S2.188; p. 211 | verified | Exponential survival mean=4 at t=5. Independently computed 0.2865047968601901; checked against the selected answer. |
| 599 | S2.189; p. 212 | verified | Levels = df+1. Independently computed [6.0, 5.0]; checked against the selected answer. |
| 600 | S2.191; p. 212 | verified | Sample variance ddof=1. Independently computed 4.458666666666666; checked against the selected answer. |
| 601 | S2.192; p. 212 | verified | Moving-range limits n=2. Independently computed [0.0, 5.71725]; checked against the selected answer. |
| 602 | S2.193; p. 213 | corrected | UseACForlagplot;trendor smoothingalonecanmislead. Change: Trendanalysis/smoothingisnotaspecificautocorrelationdiagnostic. |
| 603 | S2.194; p. 213 | corrected | Stablehumidityfluctuationsmaycommoncause;commoncausecanbereduced. Change: Toolwearandhumidityclassificationdependscontext;commoncauseisnotuncontrollable. |
| 604 | S2.195; p. 213 | verified | FifthpointaboveUCLsignalsinstability. |
| 605 | S2.197; p. 214 | corrected | Classicalvariance-ratioFtestneedsindependentnormalsamples. Change: Fvariance-testdistributionneedsnormalityandindependence. |
| 606 | S2.199; p. 214 | corrected | Cpk minimum one-sided index. Independently computed 0.8333333333333333; checked against the selected answer. Change: Detachedcapabilitysubscriptsinoptions. |
| 607 | S2.211; p. 217 | corrected | Poisson mean = variance = SD squared. Independently computed 9.2416; checked against the selected answer. Change: KeycontradictedPoissonmean-varianceidentityandownsolution. |
| 608 | S2.160; p. 204 | corrected | Aperformancegapisaproblemevenifcauseknown;frameinvestigativecontext. Change: Knowncausecanstillbeaproblem. |
| 609 | S2.163; p. 205 | corrected | Specifyequal-probabilityrecordsamplingratherthanlotacceptancedecision. Change: Samplingobjectiveandframeunspecified. |
| 610 | S2.173; p. 207 | corrected | Cycle 40 meets takt 36000/750. Independently computed 1.0; checked against the selected answer. Change: Capacityclaimneedsnettimeandcycleassumptions. |
| 611 | S2.121; p. 194 | corrected | Remainingaftertreatmentisresidualrisk;materialrisknotmaterial-typeonly. Change: Materialriskincorrectlydefinedasriskofthematerial. |
| 612 | S2.200; p. 214 | verified | Evaluatingsparepartconformanceisappraisal. |
| 613 | S2.216; p. 218 | verified | TraditionalRPNisFMEAoutput. |
