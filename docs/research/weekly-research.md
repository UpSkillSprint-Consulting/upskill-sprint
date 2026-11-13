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

## Week of 2026-11-20

### GPT picks
_GPT adds up to 3 picks here by Thursday 2026-11-19._

### Claude picks
_Claude adds these in the Friday run._

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Readiness | Status |
|---|---|---|---|---|---|

### Notes

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
