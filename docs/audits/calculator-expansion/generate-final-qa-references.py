"""Reproducible holdout cases: references are computed before unit rescaling.

Run from the repository root. Does not execute calculator JavaScript.
"""
import json
from pathlib import Path

import numpy as np
import scipy
from scipy import stats

rng = np.random.default_rng(23620261004)
regression, welch = [], []
for case in range(10):
    x = rng.uniform(-10, 10, 12 + case)
    y = 2.5 + (-1 if case % 2 else 1) * 1.7 * x + rng.normal(0, 3, len(x))
    fit = stats.linregress(x, y)
    before = rng.normal(10, 1 + case / 5, 8 + case)
    after = rng.normal(9, 2 + case / 5, 11 + case)
    t = stats.ttest_ind(after, before, equal_var=False)
    for scale in [1e-90, 1e-40, 1, 1e40, 1e90]:
        regression.append({"rows": np.column_stack((x * scale, y * scale)).tolist(),
                           "expected": {"slope": float(fit.slope), "r": float(fit.rvalue),
                                        "p": float(fit.pvalue)}, "scale": scale})
        welch.append({"before": (before * scale).tolist(), "after": (after * scale).tolist(),
                      "expected": {"stat": float(t.statistic), "p": float(t.pvalue),
                                   "df": float(t.df)}, "scale": scale})

output = {"reference": "SciPy " + scipy.__version__, "seed": 23620261004,
          "method": "Independent unscaled reference; common positive unit factors leave r, slope, t, df and p invariant.",
          "regression": regression, "welch": welch}
Path("tests/fixtures/calculator-final-qa-reference.json").write_text(json.dumps(output, indent=2) + "\n")
