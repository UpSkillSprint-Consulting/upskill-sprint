# Weekly Research Log — shared by Claude and GPT

This file is where Claude and GPT each add their weekly research picks for UpSkill Sprint.
Ernest reviews them. Claude publishes the best ones to the site ticker every Friday.

This file is internal. `docs/` is not published to upskillsprint.com.

---

## How it works

| When | Who | What |
|---|---|---|
| Monday – Thursday | **GPT** | Adds up to 3 picks under the current week, in the **GPT picks** section. Open a PR into `main` or push to the open `research/week-YYYY-MM-DD` branch. |
| Friday morning (America/Regina) | **Claude** (scheduled run) | 1. Reads GPT's picks and opens every link to check it. 2. Adds Claude's own picks. 3. Fills in the **Combined ranking**. 4. Publishes the top 2–3 High/Medium picks to `site-updates.json` in the weekly ticker PR. |
| Friday, after the PR | **Ernest** | Reviews and merges. Nothing reaches the site until he does. |

### Rules for every pick (both contributors)

1. **Real, recent, and checkable.** Published in the past 7 days (30 if the week is thin). Give a link that goes straight to the paper: the DOI first, then the journal page or the arXiv abstract. No vendor marketing and no textbook rehashes.
2. **Your own words.** Never copy paper titles or abstracts. The ticker headline must be under 60 characters.
3. **Honest evidence rating.** High, Medium or Low, with the reason: peer review, real vs. simulated data, sample size, industrial case.
4. **Unverified means unpublished.** Claude opens every link before it goes on the site. A pick whose link doesn't load, or doesn't match what's described, is marked `Rejected` with the reason. Nothing is guessed.
5. **No duplicates.** If both picked the same paper, keep one entry and credit both.
6. **Only add your own section.** Don't edit or delete the other contributor's entries. Use **Notes** to disagree.

### Preferred sources

Journal of Quality Technology, Technometrics, Quality Engineering, QREI, IISE Transactions, arXiv stat.AP / stat.ME, NIST, ASQ, and Minitab and JMP release notes.

### Topics

- **Core:** process capability (non-normal, small-sample, autocorrelated) · regression (model selection, regularization, diagnostics, prediction intervals) · DOE/ANOVA (screening, DSD, RSM, optimal and split-plot designs, mixed models) · measurement systems (Gage R&R, attribute agreement, destructive-test MSA for Charpy/tensile/hardness, GUM uncertainty) · anomaly detection (SPC vs. ML, multivariate monitoring, change-point detection).
- **Extended:** CUSUM/EWMA and run-rule ARL · reliability (Weibull, accelerated life, degradation) · predictive quality and virtual metrology in metals · causal and Bayesian root-cause methods · acceptance sampling · robust and nonparametric methods · manufacturing data quality.

---

## Pick format (required, for both contributors)

Every pick is **one heading plus one fenced `yaml` block** with exactly the fields below, in this order.
Claude copies `ticker_text` and `link` straight onto the site, so a pick in any other format is sent back, not published.

### The block

````markdown
#### <same text as ticker_text>
```yaml
pick_id: 2026-11-13-gpt-weibull-small-samples
contributor: GPT
ticker_text: "Weibull fits that hold up with only 5 failures"
link: https://doi.org/10.1080/00224065.2026.0000000
link_type: doi
published: 2026-11-10
venue: Journal of Quality Technology
peer_reviewed: yes
data: real
sample_size: "3 field datasets, 5–12 failures each"
evidence: High
evidence_why: "Peer reviewed; tested on real field-failure data, not only simulation."
limitations: "Assumes a single failure mode; no comparison with Bayesian methods."
readiness: Worth piloting
topic: reliability
what_it_is: "Two plain sentences on what the method does."
plant_problem: "One or two sentences on the plant problem it solves."
excel: "How to do it, or approximate it, in Excel (functions)."
minitab: "Stat > Reliability/Survival > Distribution Analysis (Right Censoring) > Parametric Distribution Analysis"
python: "reliability, lifelines"
steel_pipe: "none"
exam: [CRE, CQE]
exam_topic: "Life data analysis with small samples"
lesson_idea: yes
status: Proposed
```
````

(The example values above are made up to show the shape. Don't copy them.)

### Field rules

| Field | Rule | Goes onto the ticker as |
|---|---|---|
| `pick_id` | `<week date>-<gpt or claude>-<2–4 word slug>`, lowercase with hyphens. Unique and never reused. | Claude turns it into the ticker id `<Friday date>-research-<slug>` |
| `contributor` | `GPT` or `Claude` | Credit in the PR description |
| `ticker_text` | **Under 60 characters**, in double quotes. Plain language, your own words. Not the paper title and no words copied from it. States the benefit, e.g. "Spot gauge drift before it fails a Gage R&R". No final period, no hype words ("revolutionary", "breakthrough"), no emoji. | `text` |
| `link` | `https://` only. The first available of: **DOI** (`https://doi.org/...`), then the journal article page, then the **arXiv abstract** (`https://arxiv.org/abs/XXXX.XXXXX`, never `/pdf/`). No Google Scholar, ResearchGate, paywall-login, shortened or tracking links. | `href` |
| `link_type` | `doi`, `journal` or `arxiv` | — |
| `published` | `YYYY-MM-DD`, the online or v1 date. Must be in the past 7 days (30 if the week is thin). | Used for the date check |
| `venue` | Journal name, `arXiv`, `NIST`, `ASQ`, `Minitab release notes` or `JMP release notes` | — |
| `peer_reviewed` | `yes` or `no` (arXiv preprints are `no`) | Used for evidence |
| `data` | `real`, `simulated` or `both` | Used for evidence |
| `sample_size` | Short, in quotes, or `"not stated"` | — |
| `evidence` | `High`, `Medium` or `Low` (see the scale below) | Only High and Medium can go on the ticker |
| `evidence_why` | One sentence | PR description |
| `limitations` | Key assumptions and weaknesses, in quotes. Flag any data leakage, post-hoc thresholds, random train/test splits on time-ordered data, unverified distribution assumptions, unstable measurement systems, or claims based only on point estimates. Use `"none found"` only if you looked. | Brief to Ernest |
| `readiness` | `Ready to apply`, `Worth piloting` or `Worth watching` | Brief to Ernest; ranking |
| `topic` | One of: `capability`, `regression`, `doe`, `msa`, `anomaly`, `spc-charts`, `reliability`, `predictive-quality`, `root-cause`, `sampling`, `robust`, `data-quality` | Used for ranking and variety |
| `what_it_is` | Two plain sentences | Brief to Ernest |
| `plant_problem` | One or two sentences | Brief to Ernest |
| `excel` / `minitab` / `python` | Short, concrete. Minitab as a menu path with `>`. Use `"none"` if there isn't one. | Brief to Ernest |
| `steel_pipe` | Steel, pipe or metals relevance, or `"none"` | Brief to Ernest |
| `exam` | A list from `CSSBB`, `CQE`, `CRE`, `CSSGB`, `CMQ/OE`, `CQA`, or `[]` | Brief to Ernest |
| `exam_topic` | Short | Brief to Ernest |
| `lesson_idea` | `yes` or `no` | Lesson backlog |
| `status` | **Contributors always write `Proposed`.** Only Claude changes it, to `Verified`, `Published to ticker (PR #n)` or `Rejected: <reason>`. | — |

### Evidence scale

- **High:** peer reviewed, **and** tested on real industrial or field data (or an official NIST/ASQ standard or release).
- **Medium:** peer reviewed with simulation only, **or** a preprint tested on real industrial data.
- **Low:** a preprint with simulation only, a small or unclear sample, or no validation.

### Checklist before you submit

- [ ] At most 3 picks, under the current week's section for your contributor, in the format above.
- [ ] You opened every `link` yourself. It loads and is the paper you describe.
- [ ] `ticker_text` is under 60 characters (count it) and is in your own words.
- [ ] `published` is inside the window.
- [ ] No pick duplicates one already in this file, in this week or an earlier one.
- [ ] Every field is present. Use `"none"`, `"not stated"` or `[]`; never leave a field blank or delete it.
- [ ] Valid YAML: two-space indentation, text values in double quotes, no tabs.
- [ ] Nothing changed outside your own section.

---

## Week of 2026-12-04

### GPT picks
_GPT adds up to 3 picks here by Thursday 2026-12-03._

### Claude picks
_Claude adds these in the Friday run._

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Readiness | Status |
|---|---|---|---|---|---|

### Notes

---

## Week of 2026-11-27

### GPT picks
None this week.

### Claude picks

#### Test steel strength models on grades they haven't seen
```yaml
pick_id: 2026-11-27-claude-steel-family-holdout
contributor: Claude
ticker_text: "Test steel strength models on grades they haven't seen"
link: https://arxiv.org/abs/2611.06953
link_type: arxiv
published: 2026-11-05
venue: arXiv
peer_reviewed: no
data: real
sample_size: "1,636 tensile records across 594 grades and 17 families; 27 sources; 60 lab tests from 68 heats in the top-quality tier"
evidence: Medium
evidence_why: "Preprint, but built on real measured tensile data and audited across four different hold-out schemes."
limitations: "Not peer reviewed (only a short demo version is in IJCAI-26 proceedings); data are compiled published tables and lab tests, not one mill's production stream; restricted source data not released; per-heat predictions needed to recheck the uncertainty; compliance score not checked against real pass/fail; LLM interface not user-tested. Published date estimated from the arXiv ID (abstract date line could not be read)."
readiness: Ready to apply
topic: predictive-quality
what_it_is: "A steel tensile-strength prediction system that combines metallurgical features, gradient boosting and conformal prediction intervals. Its main finding is how much reported accuracy depends on what is held out: random rows, grade, steel family or data source."
plant_problem: "A strength model that scores well in a random split can fall apart on a new grade or a new supplier's data, and its prediction intervals stop covering the real values."
excel: "Add Grade/Family/Source columns; hold out a whole family or source as the test sheet; compare RSQ and the share of actuals inside the interval"
minitab: "Stat > Regression > Fit Regression Model; then Stat > Regression > Regression > Predict for prediction intervals on a held-out worksheet; the built-in K-fold validation uses random folds, so build the group hold-out by hand"
python: "scikit-learn (GroupKFold, LeaveOneGroupOut, GradientBoostingRegressor), catboost, mapie (conformal intervals)"
steel_pipe: "Direct fit: tensile and yield prediction by grade, heat and mill source for plate, coil and pipe."
exam: [CSSBB, CQE]
exam_topic: "Regression validation, prediction intervals and model generalization"
lesson_idea: yes
status: "Published to ticker (PR #429)"
```

#### Charpy curve models lose accuracy on brand-new steels
```yaml
pick_id: 2026-11-27-claude-charpy-transition-curve-ml
contributor: Claude
ticker_text: "Charpy curve models lose accuracy on brand-new steels"
link: https://www.mdpi.com/2075-4701/16/11/1269
link_type: journal
published: 2026-11-19
venue: Metals (MDPI)
peer_reviewed: yes
data: real
sample_size: "604 Charpy V-notch results, 58 steels, 40 publications; external test on 4 in-house cast steels, 2 specimens per temperature at 4 temperatures"
evidence: Medium
evidence_why: "Peer reviewed with real Charpy data, but the database is compiled from the literature and the external test is only 4 steels with 2 specimens per temperature."
limitations: "Headline R-squared of 0.71–0.89 comes from random splits that leak same-steel data; on unseen steels R-squared drops to 0.12–0.32 and transition-temperature error is 35–41 °C; tuning folds overlap reporting folds; unreported elements coded as zero; sub-size specimens not converted; simple in-house-only baselines matched the best fine-tuned model; no upper-shelf data in-house."
readiness: Worth piloting
topic: predictive-quality
what_it_is: "The authors trained models to predict the full Charpy ductile-to-brittle transition curve from chemistry and heat treatment, comparing direct prediction of impact energy with models that fit the four parameters of a tanh curve. The curve-constrained model held up best on four new cast steels, but every model lost most of its accuracy on steels it had not seen."
plant_problem: "Estimating impact toughness and transition temperature for a new grade or heat-treatment before running a full temperature series, and knowing how far to trust that estimate."
excel: "Fit the tanh transition curve with Solver (minimize SSE on A, B, T0, C); hold out whole steels when checking any prediction"
minitab: "Stat > Regression > Nonlinear Regression (tanh curve per steel); Stat > Regression > Fit Regression Model for the composition model"
python: "scipy.optimize.curve_fit, scikit-learn (GroupKFold by steel), pytorch"
steel_pipe: "Direct fit: Charpy transition curves for line-pipe, plate and cast steels; supports deciding which test temperatures to run."
exam: [CQE, CSSBB]
exam_topic: "Nonlinear regression, model validation, destructive testing"
lesson_idea: yes
status: "Published to ticker (PR #429)"
```

#### Pinpoint when a sensor curve's shape changed
```yaml
pick_id: 2026-11-27-claude-sensor-curve-change-point
contributor: Claude
ticker_text: "Pinpoint when a sensor curve's shape changed"
link: https://arxiv.org/abs/2611.13464
link_type: arxiv
published: 2026-11-10
venue: arXiv
peer_reviewed: no
data: both
sample_size: "3,400 simulated sequences; injection-pressure curves from 204 molding cycles; UCI hydraulic rig benchmark of 80 curves per valve state"
evidence: Medium
evidence_why: "Preprint tested on real industrial curve data (injection molding) as well as simulation."
limitations: "Not peer reviewed; detects a single mean change only; permutation p-values assume exchangeable cycles, but the molding data are strongly autocorrelated (lag-1 about 0.9), so its p-values are descriptive only; the hydraulic change is constructed, not an observed fault; full data section not read. Published date estimated from the arXiv ID (abstract date line could not be read)."
readiness: Worth watching
topic: anomaly
what_it_is: "A change-point method for processes where each cycle produces a whole curve (a pressure or force profile). It learns which part of the curve to watch and then runs a CUSUM scan to find the cycle where the process changed."
plant_problem: "Finding when a press, roll or forming profile shifted after the fact, when summary numbers like peak or mean look normal but the curve shape moved."
excel: "none (approximate: pick a feature such as the value at a fixed time point, then a cumulative-sum column of deviations from the Phase I mean and find its peak)"
minitab: "Stat > Control Charts > Time-Weighted Charts > CUSUM on a chosen curve feature; no functional change-point tool in Minitab"
python: "numpy, pytorch, ruptures (classical change-point comparison)"
steel_pipe: "Possible fit for forming-press, expander or hydrotest pressure-time curves; not tested on metals data."
exam: [CSSBB, CQE]
exam_topic: "CUSUM, change-point detection, Phase I/II monitoring"
lesson_idea: no
status: "Published to ticker (PR #429)"
```

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Readiness | Status |
|---|---|---|---|---|---|
| 1 | Test steel strength models on grades they haven't seen | Claude | Medium | Ready to apply | Published to ticker (PR #429) |
| 2 | Charpy curve models lose accuracy on brand-new steels | Claude | Medium | Worth piloting | Published to ticker (PR #429) |
| 3 | Pinpoint when a sensor curve's shape changed | Claude | Medium | Worth watching | Published to ticker (PR #429) |

### Notes
- GPT added no picks and opened no `research/week-2026-11-27` PR, so Claude opened `ticker/weekly-2026-11-27`.
- Thin week: no qualifying quality-journal paper surfaced in the past 7 days, so the window was widened to 30 days.
- arXiv abstract pages for 2611.06953 and 2611.13464 loaded and match the descriptions, but the "Submitted on" line could not be read. Both IDs are November 2026, so they are inside the 30-day window; the `published` dates are estimates from the ID sequence.
- Charpy paper: journal page opened and checked (online 2026-11-19). The DOI printed there is 10.3390/met16111269; the doi.org redirect could not be opened in the automated check, so the journal page is the link.
- Two of this week's three picks repeat last week's grouped-validation lesson (GPT pick, PR #413) on steel data. Together they make a strong case for a site lesson on validating predictive-quality models by heat, grade and source.
- Checked and dropped: arXiv 2611.33582 (explainable change-point authorization) and 2611.34228 (generative change-point detection), pages would not load, so not assessed.

---

## Week of 2026-11-20

### GPT picks

#### Stop row-level leakage in manufacturing models
```yaml
pick_id: 2026-11-20-gpt-grouped-model-validation
contributor: GPT
ticker_text: "Stop row-level leakage in manufacturing models"
link: https://doi.org/10.3390/info17111095
link_type: doi
published: 2026-11-03
venue: Information 17(11), 1095
peer_reviewed: yes
data: simulated
sample_size: "27 specimens x 3 sections; 40 main replications; 20 selection replications; 300 interval replications"
evidence: Medium
evidence_why: "Peer-reviewed methodological review with reproducible simulations, but no new prospective industrial validation."
limitations: "Narrative rather than systematic review; no formal risk-of-bias scoring; simulated effect sizes may not transfer to mill data; grouped CV can be conservative for sparse DOE grids; few independent groups make metrics and intervals unstable."
readiness: Ready to apply
topic: regression
what_it_is: "Shows why random row splits overstate performance when repeated measurements share a specimen, tool, batch or production unit. It recommends grouped and nested validation, plus blocked or forward validation for sequential data."
plant_problem: "Predictive models for tensile, chemistry and dimensional outcomes can appear accurate because related rows leak across train and test sets. The method aligns validation with the heat, coil, specimen or campaign that will be new at deployment."
excel: "Add Heat/Coil/Specimen/Campaign and Date/Sequence columns; create untouched whole-group and later-period holdouts"
minitab: "Stat > Regression > Fit Regression Model; store predictions and residuals, then validate on a separate group-held-out or later worksheet"
python: "scikit-learn Pipeline, GroupKFold, LeaveOneGroupOut, nested grouped CV, blocked time splits and group bootstrap"
steel_pipe: "Validate tensile, nitrogen, Charpy and dimensional models by heat, coil, pipe, test coupon or production campaign rather than database row."
exam: [CSSBB, CQE]
exam_topic: "Regression validation, data leakage and prediction uncertainty"
lesson_idea: yes
status: "Published to ticker (PR #413)"
```

#### Watch mean and spread with fewer measurements
```yaml
pick_id: 2026-11-20-gpt-adaptive-joint-monitoring
contributor: GPT
ticker_text: "Watch mean and spread with fewer measurements"
link: https://doi.org/10.1002/qre.70472
link_type: doi
published: 2026-11-16
venue: Quality and Reliability Engineering International
peer_reviewed: yes
data: both
sample_size: "Probability-based performance calculations; textbook manufacturing example; observation count not stated"
evidence: Medium
evidence_why: "Peer reviewed and compared analytically with established charts, but the manufacturing example is textbook-derived rather than independent prospective plant validation."
limitations: "Accessible record does not state the full shift grid or example size; textbook data only; performance may change with estimated Phase I parameters, non-normality, autocorrelation and measurement error; a local pilot must freeze warning limits before chronological evaluation."
readiness: Worth piloting
topic: spc-charts
what_it_is: "A joint mean-and-variability chart begins with one sample and requests a second or third sample only when the statistic enters warning regions. It aims to improve detection while limiting the average inspection burden."
plant_problem: "Costly dimensional, tensile or chemistry measurements may not justify a large sample at every epoch, yet simultaneous centre and spread shifts still require prompt detection."
excel: "Use AVERAGE, STDEV.S, standardized statistics, MAX and IF logic; simulate false alarms and average observations before use"
minitab: "Stat > Control Charts > Variables Charts for Subgroups > Xbar-S; use Calc > Calculator for the joint statistic and retain Xbar-S as the benchmark"
python: "NumPy and SciPy simulation of subgroup sizes, warning limits, ARL, median run length, false alarms and average observations"
steel_pipe: "Pilot offline on a costly dimensional CTQ or laboratory response where both the centreline and variability can drift."
exam: [CSSBB, CQE]
exam_topic: "Adaptive sampling and joint monitoring of location and dispersion"
lesson_idea: yes
status: Verified
```

### Claude picks

#### Test a big forging's core, not just its surface
```yaml
pick_id: 2026-11-20-claude-forging-through-section-case
contributor: Claude
ticker_text: "Test a big forging's core, not just its surface"
link: https://www.mdpi.com/1996-1944/19/21/4482
link_type: journal
published: 2026-10-24
venue: Materials (MDPI)
peer_reviewed: yes
data: real
sample_size: "1 industrial 341 mm AISI 316 forging; 12 tensile bars (4 at each of 3 radial positions); 3 corrosion coupons; 3 microhardness indents per position"
evidence: Medium
evidence_why: "Peer reviewed and built on a real industrial non-conformance, but it is one component with no control part and very few specimens per position."
limitations: "Single forging, no control; no internal temperature record, so the furnace over-hold could not be confirmed as the cause; only 3 radial positions (one residual df in the trend fit); tensile and metallography locations don't match; grain-size uncertainty not recoverable; unexplained UTS scatter at mid-radius; one corrosion coupon per position."
readiness: Ready to apply
topic: root-cause
what_it_is: "A plant investigated a large stainless forging that sat in the furnace about 22 hours instead of 1.5, testing tensile, hardness, grain size, chemistry and corrosion at the surface, mid-radius and centre. Core yield strength came out about 36% below the near-surface value, with no chemical segregation or sensitization found."
plant_problem: "Deciding what to test, and where, after a heat-treatment deviation on a heavy section, when surface coupons alone can make the part look fine."
excel: "AVERAGE/STDEV.S by position; Data Analysis > ANOVA: Single Factor across radial positions; LINEST or SLOPE for property vs. radius"
minitab: "Stat > ANOVA > One-Way (yield by position); Graph > Interval Plot; Stat > Regression > Fitted Line Plot (property vs. r/R)"
python: "pandas, scipy.stats (f_oneway), statsmodels (ols)"
steel_pipe: "Direct fit for heavy forgings, thick-wall pipe and bar after a soak or anneal deviation: plan sampling across the section before signing off."
exam: [CQE, CSSBB]
exam_topic: "Root cause investigation, sampling plan design, one-way ANOVA, nonconforming material disposition"
lesson_idea: yes
status: "Published to ticker (PR #413)"
```

#### Watch sensor readings move together, not one by one
```yaml
pick_id: 2026-11-20-claude-copula-multivariate-chart
contributor: Claude
ticker_text: "Watch sensor readings move together, not one by one"
link: https://arxiv.org/abs/2611.23820
link_type: arxiv
published: 2026-11-18
venue: arXiv (stat.AP)
peer_reviewed: no
data: both
sample_size: "2 small real datasets (water quality n=30+25, d=2; bimetal thermostats n=28+28, d=3); simulation with Phase I n of 50–1000 and d of 2–20"
evidence: Low
evidence_why: "Preprint; the real datasets are small textbook-style illustrations with no ARL reported, so the performance claims rest on simulation."
limitations: "Not peer reviewed; Shewhart-type, so small sustained shifts are better caught by MEWMA (the authors' own simulation shows this for shifts of 1 sigma or less); in-control ARL came out about half the target at d=3; assumes independent observations, autocorrelated sensor streams left for future work; copula choice adds model uncertainty; only 2 of 5 water variables used."
readiness: Worth watching
topic: anomaly
what_it_is: "A multivariate control chart that models how several variables depend on each other with a copula, so it does not need the data to be multivariate normal. It flags points that fall outside a joint tolerance region and shows them next to the usual one-variable charts."
plant_problem: "Correlated sensor signals (temperatures, pressures, chemistry) that are skewed or bounded, where Hotelling T-squared is badly calibrated and separate X-charts miss a change in how the variables move together."
excel: "none (approximate with CORREL/RSQ on Phase I data and individual charts; the copula fit needs R or Python)"
minitab: "Stat > Control Charts > Multivariate Charts > T-squared Generalized Variance (the normal-theory comparator); no copula chart in Minitab"
python: "copulae or pyvinecopulib, scipy.stats, numpy"
steel_pipe: "Possible fit for correlated furnace or caster sensors with skewed distributions; not tested on metals data."
exam: [CSSBB, CQE]
exam_topic: "Multivariate control charts, Hotelling T-squared, ARL"
lesson_idea: no
status: Verified
```

#### Forecasting cold-weather toughness loss in steel
```yaml
pick_id: 2026-11-20-claude-pinn-toughness-corrosion
contributor: Claude
ticker_text: "Forecasting cold-weather toughness loss in steel"
link: https://www.mdpi.com/2075-4701/16/11/1265
link_type: journal
published: 2026-11-18
venue: Metals (MDPI)
peer_reviewed: yes
data: both
sample_size: "2–3 lab Charpy results per bar size and temperature; 3-year training set is simulated (digital twin), 30-year forecasts not field-validated"
evidence: Low
evidence_why: "Peer reviewed, but the model is trained on simulated data and checked against only a handful of real Charpy results."
limitations: "Training data simulated, and the stated point count doesn't match 3 years of hourly data; Charpy sample sizes of 2–3 per condition, one non-standard specimen size; 30-year and bridge-case results are extrapolation with no field check; the 10-year maintenance-free claim rests on kinetic parameters not shown."
readiness: Worth watching
topic: reliability
what_it_is: "A neural network constrained by corrosion and toughness-transition physics predicts corrosion depth and remaining Charpy energy for a low-temperature corrosion-resistant steel from temperature, humidity, stress and freeze-thaw cycles. The authors report lower error than a plain neural network."
plant_problem: "Estimating how much impact toughness a cold-climate steel loses over its service life, for warranty and maintenance planning."
excel: "none (a simple Arrhenius or power-law fit with LINEST on log data is the honest spreadsheet stand-in)"
minitab: "Stat > Reliability/Survival > Accelerated Life Testing (Arrhenius) as the classical comparison"
python: "pytorch or deepxde, numpy"
steel_pipe: "Charpy toughness of low-temperature structural and line-pipe steels in corrosive service."
exam: [CRE]
exam_topic: "Degradation and accelerated-life models (Arrhenius)"
lesson_idea: no
status: Verified
```

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Readiness | Status |
|---|---|---|---|---|---|
| 1 | Stop row-level leakage in manufacturing models | GPT | Medium | Ready to apply | Published to ticker (PR #413) |
| 2 | Test a big forging's core, not just its surface | Claude | Medium | Ready to apply | Published to ticker (PR #413) |
| 3 | Watch mean and spread with fewer measurements | GPT | Medium | Worth piloting | Verified (held off the ticker, see Notes) |
| 4 | Watch sensor readings move together, not one by one | Claude | Low | Worth watching | Verified (Low, not ticker-eligible) |
| 5 | Forecasting cold-weather toughness loss in steel | Claude | Low | Worth watching | Verified (Low, not ticker-eligible) |

### Notes
- GPT's PR (#413) was opened after Claude's scheduled run, which had already opened #412. Claude's work was moved onto GPT's branch so there is one PR this week; #412 is closed in favour of #413.
- GPT pick 1 (grouped validation): the DOI resolves to the MDPI Information article (17(11), 1095, online 2026-11-03), and it is the paper described. Window widened to 30 days (thin week). Medium fits the scale: peer-reviewed journal, simulation only, no new data.
- GPT pick 2 (triple-sampling max chart): the DOI and Wiley article page both refused the automated check, so the paper was confirmed through its Crossref record (QREI, online 2026-11-16, joint mean-and-variability triple sampling chart, compared with double-sampling and Shewhart max charts). Because the link itself could not be opened, it stays off the ticker this week under rule 4; Ernest can add it after opening the DOI himself.
- Disagreement on GPT pick 2: the abstract says the method was applied to "real data obtained from an industrial manufacturing process", not a textbook example as the entry says. The comparisons are on ARL, average number of observations to signal and extra quadratic loss. If the industrial data hold up in the full text, the evidence could be High rather than Medium.
- Forging case link is the journal page (opened and checked). DOI printed there: 10.3390/ma19214482.
- The copula chart preprint shows a "Received 2021" line in its template; the arXiv v1 date is 2026-11-18, which is what counts here.
- Checked and dropped: a hot-rolling ridge-defect classifier (Eng. Appl. of AI, online 2026-06-20) and a hot-rolling ML review (Frontiers in Materials, 2026-07-22), both outside 30 days; a GLM change-point CUSUM preprint (arXiv 2610.16616, simulation only, dated before the window); a QREI Wiener-degradation paper whose page wouldn't load.
- Housekeeping: last week's two Claude picks still read `status: Proposed` although the ranking shows them published in PR #407. Left as is (past week).

---

## Week of 2026-11-13

### GPT picks
#### Carry gage uncertainty into process decisions
```yaml
pick_id: 2026-11-13-gpt-gage-decision-handoff
contributor: GPT
ticker_text: "Carry gage uncertainty into process decisions"
link: https://arxiv.org/abs/2611.11743
link_type: arxiv
published: 2026-11-09
venue: Measurement
peer_reviewed: yes
data: both
sample_size: "Retained-study count not stated; 25-page structured review"
evidence: Low
evidence_why: "Accepted peer-reviewed synthesis with manufacturing focus, but it adds no prospective industrial validation of the proposed decision-handoff framework."
limitations: "Integrative rather than exhaustive; retained-study count not stated; evidence is mainly analytical or simulation-based, prospective multi-setting validation is thin, and many mechanisms assume univariate continuous data with additive independent measurement error."
readiness: Ready to apply
topic: msa
what_it_is: "A decision-audit framework keeps calibration, Gage R&R, drift and Phase I estimation uncertainty visible as data move into capability and monitoring. It separates known or calibrated inputs from plug-in estimates and fully propagated uncertainty."
plant_problem: "Capability or control-chart decisions can look more certain than the gage and Phase I evidence justify. The framework shows where to carry uncertainty, guard bands, replication and requalification triggers."
excel: "Add source, status, bias, R&R, uncertainty, validity date and downstream-decision columns; bootstrap borderline decisions"
minitab: "Stat > Quality Tools > Gage Study; Stat > Quality Tools > Capability Analysis"
python: "statsmodels, scipy, numpy; bootstrap or hierarchical variance-component propagation"
steel_pipe: "Audit nitrogen, tensile and dimensional decisions so measurement uncertainty remains linked to release, chart and requalification rules."
exam: [CSSBB, CQE]
exam_topic: "Measurement systems, capability and uncertainty propagation"
lesson_idea: yes
status: "Rejected: link couldn't be verified (arXiv rate-limited both checks on 2026-11-13); also rated Low, so not ticker-eligible"
```

### Claude picks

#### Why a bigger sample can't fix a weak gage
```yaml
pick_id: 2026-11-13-claude-gage-misclassification-feasibility
contributor: Claude
ticker_text: "Why a bigger sample can't fix a weak gage"
link: https://www.mdpi.com/2673-8244/6/4/85
link_type: journal
published: 2026-11-12
venue: Metrology (MDPI)
peer_reviewed: yes
data: both
sample_size: "600 real parts vs a CMM reference, 2 micrometers, 3 tolerance widths; 5M-run Monte Carlo checks"
evidence: High
evidence_why: "Peer reviewed and tested on 600 real machined parts measured against a CMM reference, with simulation used only to confirm the models."
limitations: "Reference parts were deliberately weighted to near-limit parts (2/3), so the aggregate risk numbers won't transfer directly to a real production mix; CMM treated as the truth; bootstrap intervals leave out error-distribution and CMM calibration uncertainty; assumes normal measurement error; data only on request."
readiness: Worth piloting
topic: msa
what_it_is: "Puts numbers on how often a gage wrongly rejects good parts and wrongly accepts bad ones, and on whether the true defect rate can be recovered from inspection data. It shows that once the gage is too coarse for the tolerance, no amount of extra production sampling makes the capability decision reliable."
plant_problem: "Tight-tolerance characteristics where inspection rejects and capability claims are driven as much by gage error as by the process, and the instinct is to 'just take more samples'."
excel: "NORM.DIST / NORM.S.DIST for false-accept and false-reject at the spec limits given process and gage sigma; a quick RAND()-based Monte Carlo sheet; CHISQ.INV for the sample-size check"
minitab: "Stat > Quality Tools > Gage Study > Gage R&R Study (Crossed), then Stat > Quality Tools > Capability Analysis > Normal; Calc > Random Data > Normal for a misclassification simulation"
python: "numpy, scipy.stats (norm, multivariate_normal, chi2)"
steel_pipe: "OD, wall thickness and thread gauging on pipe, where tolerances are tight relative to micrometer and ring-gauge error."
exam: [CQE, CSSBB]
exam_topic: "Measurement error, guard bands, producer's and consumer's risk"
lesson_idea: yes
status: Proposed
```

#### Fix the gage first, then prove the Cpk gain
```yaml
pick_id: 2026-11-13-claude-thread-msa-spc-case
contributor: Claude
ticker_text: "Fix the gage first, then prove the Cpk gain"
link: https://www.mdpi.com/2673-8244/6/4/81
link_type: journal
published: 2026-11-03
venue: Metrology (MDPI)
peer_reviewed: yes
data: real
sample_size: "18 baseline and 35 follow-up readings; two 10x3x2 Gage R&R studies; one part number"
evidence: Medium
evidence_why: "Peer-reviewed case on real shop-floor data, but one part, very few subgroups and a gage that still failed AIAG criteria."
limitations: "Baseline not in control, so before-indices are indicative only; 6 and 7 subgroups (trial limits, short-term capability); different subgroup sizes before and after; Gage R&R still ~46% of tolerance with ndc < 2, so the Cpk includes measurement error; mean shift not significant at subgroup level."
readiness: Ready to apply
topic: capability
what_it_is: "A small machine shop combined Gage R&R, a GUM uncertainty budget, X-bar/R charts and Cp/Cpk with confidence intervals to fix a thread pitch-diameter problem on a stainless fitting. Cpk went from 0.18 to 1.40 after a new insert grade, a standard finishing pass and gage verification."
plant_problem: "Showing that an improvement is real when the gage is marginal and only a few subgroups are available, and reporting capability with honest confidence intervals."
excel: "AVERAGE/STDEV.S by subgroup, Cpk formula, CHISQ.INV for Cp confidence limits; T.TEST or F.TEST for before/after"
minitab: "Stat > Quality Tools > Gage Study > Gage R&R Study (Crossed) (ANOVA method); Stat > Control Charts > Variables Charts for Subgroups > Xbar-R; Stat > Quality Tools > Capability Analysis > Normal (Options > Include confidence intervals)"
python: "scipy, statsmodels (ANOVA), pandas"
steel_pipe: "Same pattern as thread gauging on OCTG connections: verify the gage against blocks before trusting a capability gain."
exam: [CSSBB, CQE]
exam_topic: "MSA, control charts, capability with confidence intervals, DMAIC case"
lesson_idea: yes
status: Proposed
```

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Readiness | Status |
|---|---|---|---|---|---|
| 1 | Why a bigger sample can't fix a weak gage | Claude | High | Worth piloting | Published to ticker (PR #407) |
| 2 | Fix the gage first, then prove the Cpk gain | Claude | Medium | Ready to apply | Published to ticker (PR #407) |
| — | Carry gage uncertainty into process decisions | GPT | Low | Ready to apply | Rejected (unverified) |

### Notes
- GPT's pick could not be opened: arXiv returned a rate-limit error on two separate attempts, so it stays unpublished under rule 4. It was rated Low anyway, so it wasn't ticker-eligible this week. Re-check next week if GPT still wants it.
- On GPT's pick: `venue: Measurement` and `peer_reviewed: yes` sit oddly with an arXiv link. If the paper is accepted in *Measurement*, the DOI should be the link.
- Claude's links point to the journal article pages, which were opened and checked. The DOIs (10.3390/metrology6040085 and 10.3390/metrology6040081) are printed on those pages, but doi.org couldn't be reached from the checker, so the journal page was used as the confirmed link.
- The thread case study was published 2026-11-03, outside the 7-day window; the window was widened to 30 days because the week was thin.
- Last week's rejected step-stress ALT pick (arXiv 2610.34231) still couldn't be opened. Dropping it.

---

## Week of 2026-11-06

### GPT picks
_None. The shared log started after this week's run._

### Claude picks

#### Virtual metrology that keeps up as equipment drifts
```yaml
pick_id: 2026-11-06-claude-streaming-virtual-metrology
contributor: Claude
ticker_text: "Virtual metrology that keeps up as equipment drifts"
link: https://arxiv.org/abs/2611.00806
link_type: arxiv
published: 2026-10-31
venue: arXiv (cs.LG); accepted at IEEE BigData 2026
peer_reviewed: yes
data: real
sample_size: "2 semiconductor production datasets; sizes not stated"
evidence: Medium
evidence_why: "Conference peer review and real production data with chronological blind tests, but no sample sizes and no public code."
limitations: "Semiconductor data only; no sample sizes or code, so results can't be reproduced; gains reported as point estimates."
readiness: Worth piloting
topic: predictive-quality
what_it_is: "Predicts slow or costly lab measurements from in-line sensor data. One stable regression model does the main prediction, and two small online correctors adjust it as equipment wears, gets maintained or is re-tuned."
plant_problem: "Prediction models (soft sensors) that quietly lose accuracy between recalibrations."
excel: "Rolling-window LINEST, plus an EWMA chart of the residuals"
minitab: "Stat > Regression > Fit Regression Model, then Stat > Control Charts > Time-Weighted Charts > EWMA on the residuals"
python: "scikit-learn SGDRegressor (partial_fit), river"
steel_pipe: "Direct analogue: predicting yield, tensile or Charpy results from mill data before the lab result comes back."
exam: [CSSBB]
exam_topic: "Regression and residual monitoring"
lesson_idea: yes
status: Published to ticker (PR #392)
```

#### Pooling step-stress accelerated life tests
```yaml
pick_id: 2026-11-06-claude-pooled-step-stress-alt
contributor: Claude
ticker_text: "Pooling small accelerated life tests"
link: https://arxiv.org/abs/2610.34231
link_type: arxiv
published: "2026-10 (exact date not verified)"
venue: arXiv
peer_reviewed: no
data: "not stated"
sample_size: "not stated"
evidence: Low
evidence_why: "Unverified: the abstract couldn't be opened (arXiv rate limit)."
limitations: "not stated"
readiness: Worth watching
topic: reliability
what_it_is: "A meta-analysis method that combines interval-monitored step-stress accelerated life tests to predict reliability."
plant_problem: "Reliability prediction when several small accelerated tests exist but none is large enough on its own."
excel: "none"
minitab: "Stat > Reliability/Survival > Accelerated Life Testing"
python: "lifelines, reliability"
steel_pipe: "Possibly coating or weld fatigue testing; unconfirmed."
exam: [CRE]
exam_topic: "Accelerated life testing"
lesson_idea: no
status: "Rejected: link couldn't be verified this week; re-check 2026-11-13"
```

### Combined ranking
| Rank | Headline | Contributor | Evidence | Status |
|---|---|---|---|---|
| 1 | Virtual metrology that keeps up as equipment drifts | Claude | Medium | Published to ticker (PR #392) |
| — | Pooling small accelerated life tests | Claude | Low | Rejected (unverified) |

### Notes
- Thin week. Only one pick was verified.
