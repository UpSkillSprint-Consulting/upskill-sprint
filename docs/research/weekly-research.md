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

## Pick template (copy this for each pick)

```markdown
#### <Ticker headline, your own words, under 60 characters>
- **Link:** <https://doi.org/... or journal / arXiv abstract URL>
- **Published:** YYYY-MM-DD · <venue>
- **What it is:** <two plain sentences>
- **Plant problem it solves:** <one or two sentences>
- **Evidence:** High | Medium | Low — <why>
- **Workflow fit:** Excel: <...> · Minitab: <menu path> · Python: <libraries>
- **Steel and pipe relevance:** <or "none">
- **Exam angle:** CSSBB / CQE / CRE — <topic>; good site lesson? yes/no
- **Status:** Proposed | Verified | Published to ticker | Rejected (<reason>)
```

---

## Week of 2026-11-13

### GPT picks
_GPT: add up to 3 picks here by Thursday 2026-11-12._

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
- **Link:** https://arxiv.org/abs/2611.00806
- **Published:** 2026-10-31 · arXiv (cs.LG); accepted at IEEE BigData 2026
- **What it is:** A way to predict slow or costly lab measurements from in-line sensor data. One stable regression model does the main prediction, and two small online correctors adjust it as equipment wears, gets maintained or is re-tuned.
- **Plant problem it solves:** Prediction models (soft sensors) that quietly lose accuracy between recalibrations.
- **Evidence:** Medium. Two real semiconductor production datasets, with chronological blind tests. Accepted at a conference. The abstract gives no sample sizes and there is no public code.
- **Workflow fit:** Excel: rolling-window LINEST plus an EWMA chart of the residuals · Minitab: Stat → Regression → Fit Regression Model, then Stat → Control Charts → Time-Weighted Charts → EWMA on the residuals · Python: scikit-learn `SGDRegressor` (`partial_fit`), `river`
- **Steel and pipe relevance:** Direct analogue: predicting yield, tensile or Charpy results from mill data before the lab result comes back.
- **Exam angle:** CSSBB regression and residual monitoring. Good site lesson: yes ("Is my prediction model still good?").
- **Status:** Published to ticker (PR #392)

#### Pooling step-stress accelerated life tests (proportional hazards)
- **Link:** https://arxiv.org/abs/2610.34231
- **Published:** 2026-10 · arXiv
- **What it is:** A meta-analysis method that combines interval-monitored step-stress accelerated life tests to predict reliability.
- **Plant problem it solves:** Reliability prediction when several small accelerated tests exist but none is large enough on its own.
- **Evidence:** Unrated. The abstract couldn't be opened (arXiv rate limit).
- **Workflow fit:** Minitab: Stat → Reliability/Survival → Accelerated Life Testing · Python: `lifelines`, `reliability`
- **Steel and pipe relevance:** Possible for coating or weld fatigue testing. Unconfirmed.
- **Exam angle:** CRE accelerated testing. Good site lesson: maybe, after checking.
- **Status:** Rejected (link couldn't be verified this week; re-check 2026-11-13)

### Combined ranking
| Rank | Headline | Contributor | Evidence | Status |
|---|---|---|---|---|
| 1 | Virtual metrology that keeps up as equipment drifts | Claude | Medium | Published to ticker (PR #392) |
| — | Pooling step-stress accelerated life tests | Claude | Unrated | Rejected (unverified) |

### Notes
- Thin week. Only one pick was verified.
