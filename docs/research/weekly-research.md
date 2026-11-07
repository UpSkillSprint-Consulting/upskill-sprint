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

## Week of 2026-11-13

### GPT picks
_GPT: add up to 3 picks here by Thursday 2026-11-12, using the **Pick format** above (one heading and one `yaml` block each)._

### Claude picks
_Claude adds these in the Friday run._

### Combined ranking (Claude fills this in on Friday)
| Rank | Headline | Contributor | Evidence | Status |
|---|---|---|---|---|

### Notes

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
