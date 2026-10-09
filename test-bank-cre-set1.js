/*
 * ASQ CRE Exam Set 1 — original questions written to the 2025 CRE Body of Knowledge.
 * Batch 1 of 15: III.A.1–III.A.3 (basic statistics, probability, distributions).
 * Batch 2 of 15: III.A.4–III.A.7 (probability functions, sampling plans, SPC/capability,
 *                confidence and tolerance intervals).
 *
 * Every calculated answer is recomputed independently in tests/test-bank-cre-set1.test.js.
 * Notation follows The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting &
 * McShane-Vaughn, 2025): Weibull shape β and scale η; lognormal μ and σ on the ln scale.
 * Visuals with a "cre-" type are drawn by test-bank-cre-ui.js; all others use engine renderers.
 */
(function(global){
  'use strict';
  // Every formula, symbol and variable is LaTeX: inline \( … \), display \[ … \] (docs/LESSON_CREATION_GUIDE.md §22).
  // The engine typesets the quiz view, revealed answers, review cards and retry feedback via window.UpskillMath.
  global.CRE_SET1=[
  {
    "qid": "cre:set-1:b01-q01",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.1",
      "topic": "Sampling distribution of the mean and the central limit theorem"
    },
    "difficulty": "Easy",
    "cognitive": "Apply",
    "questionType": "Calculation and concept",
    "quantitative": true,
    "stem": "Fatigue-test lives of a welded bracket are strongly right-skewed, with a population standard deviation of \\(\\sigma = 18000\\) cycles. An engineer will report the mean life \\(\\bar{x}\\) of \\(n = 36\\) randomly selected specimens. Which statement correctly describes the sampling distribution of \\(\\bar{x}\\)?",
    "options": [
      "It is centered on \\(\\mu\\), has a standard error of 3,000 cycles, and is approximately normal.",
      "It is centered on \\(\\mu\\), has a standard error of 18,000 cycles, and is right-skewed like the population.",
      "It is centered on \\(\\mu\\), has a standard error of 500 cycles, and is approximately normal.",
      "It is centered on \\(\\mu\\), has a standard error of 3,000 cycles, and stays right-skewed because the central limit theorem requires a normal population."
    ],
    "answer": 0,
    "why": "<p>The central limit theorem says the distribution of sample means approaches a normal shape as \\(n\\) grows, whatever the shape of the population, and \\(n = 36\\) is usually large enough. Its spread is the standard error:</p><p>\\[\\begin{aligned}\\sigma_{\\bar{x}} &= \\frac{\\sigma}{\\sqrt{n}} \\\\ &= \\frac{18000}{\\sqrt{36}} \\\\ &= 3000 \\text{ cycles}\\end{aligned}\\]</p><p>where \\(\\sigma\\) is the population standard deviation, \\(n\\) is the sample size and \\(\\mu\\) is the population mean. Individual lives stay skewed; only the means become approximately normal.</p><p><b>A. Centered on \\(\\mu\\), standard error 3,000 cycles, approximately normal.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Basic Statistics — expectation and the central limit theorem.</span></p>",
    "optionRationales": [
      "Correct. \\(\\sigma/\\sqrt{n} = 18000/6 = 3000\\) cycles, and the central limit theorem makes \\(\\bar{x}\\) approximately normal for \\(n = 36\\).",
      "This is the spread and shape of individual lives (the population), not of \\(\\bar{x}\\).",
      "Divides by \\(n\\) instead of \\(\\sqrt{n}\\): \\(18000/36 = 500\\). The standard error uses the square root of the sample size.",
      "The central limit theorem does not need a normal population; that independence from the parent shape is the whole point of the theorem."
    ],
    "keyPoint": "The standard error is \\(\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}\\), and sample means are approximately normal for large \\(n\\) whatever the population shape.",
    "trap": "Dividing by \\(n\\) instead of \\(\\sqrt{n}\\), or assuming the means keep the population’s skew.",
    "formula": "\\(\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n} = 18000/\\sqrt{36} = 3000\\) cycles",
    "assumptions": [
      "Specimens are a simple random sample from one population.",
      "n = 36 is large enough for the central limit theorem to apply."
    ],
    "estimatedMinutes": 1,
    "keywords": [
      "central limit theorem",
      "standard error",
      "sampling distribution",
      "population versus sample"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Basic Statistics",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Basic Statistics — the central limit theorem",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q02",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.2",
      "topic": "Conditional probability and independence from a contingency table"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "The table summarizes the confirmed failure mode of 400 field returns of a valve actuator built at two plants. A newly returned unit is found to have corrosion. What is the probability that it was built at the South plant, and what does that result show about plant and failure mode?",
    "chart": {
      "type": "data-table",
      "title": "Field returns by plant and confirmed failure mode",
      "columns": [
        "Plant",
        "Seal leak",
        "Corrosion",
        "Electrical",
        "Total"
      ],
      "rows": [
        [
          "North",
          "90",
          "30",
          "80",
          "200"
        ],
        [
          "South",
          "60",
          "70",
          "70",
          "200"
        ],
        [
          "Total",
          "150",
          "100",
          "150",
          "400"
        ]
      ]
    },
    "options": [
      "0.175; plant and failure mode are independent because each plant shipped half of the returns.",
      "0.35; plant and failure mode are dependent because corrosion makes up 35% of South returns.",
      "0.70; plant and failure mode are dependent because \\(\\Pr(\\text{South} \\mid \\text{Corrosion})\\) differs from \\(\\Pr(\\text{South})\\).",
      "0.70; plant and failure mode are independent because both plants returned exactly 200 units."
    ],
    "answer": 2,
    "why": "<p>Condition on the corrosion column:</p><p>\\[\\begin{aligned}\\Pr(S \\mid C) &= \\frac{\\Pr(S \\cap C)}{\\Pr(C)} \\\\ &= \\frac{70/400}{100/400} \\\\ &= 0.70\\end{aligned}\\]</p><p>where \\(S\\) is \"built at the South plant\", \\(C\\) is \"corrosion\", \\(\\Pr(A \\mid B)\\) is the probability of \\(A\\) given \\(B\\) and \\(\\cap\\) means both events occur. With no information about the failure mode, \\(\\Pr(S) = 200/400 = 0.50\\). Because knowing the mode changes the probability (\\(0.70 \\ne 0.50\\)), the events are dependent: corrosion is concentrated at the South plant. Equal plant totals only mean the marginal probabilities are equal; they say nothing about independence.</p><p><b>C. 0.70; dependent because \\(\\Pr(\\text{South} \\mid \\text{Corrosion}) \\ne \\Pr(\\text{South})\\).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Basic Probability Concepts, Equation 6.11 and Examples 6.25–6.26 (conditional probability with a contingency table).</span></p>",
    "optionRationales": [
      "\\(70/400 = 0.175\\) is the joint probability \\(\\Pr(\\text{South} \\cap \\text{Corrosion})\\), not the conditional probability asked for.",
      "\\(70/200 = 0.35\\) reverses the condition: it is \\(\\Pr(\\text{Corrosion} \\mid \\text{South})\\), not \\(\\Pr(\\text{South} \\mid \\text{Corrosion})\\).",
      "Correct. \\(70/100 = 0.70\\), which differs from the marginal \\(\\Pr(\\text{South}) = 0.50\\), so the events are dependent.",
      "The probability is right but the conclusion is wrong. Equal marginal totals do not show independence; compare the conditional with the marginal."
    ],
    "keyPoint": "Independence holds only if \\(\\Pr(A \\mid B) = \\Pr(A)\\). Compare the conditional probability with the unconditional one.",
    "trap": "Using the joint cell over the grand total, or conditioning on the wrong event.",
    "formula": "\\(\\Pr(\\text{South} \\mid \\text{Corr}) = \\Pr(\\text{South} \\cap \\text{Corr})/\\Pr(\\text{Corr}) = 0.70\\); \\(\\Pr(\\text{South}) = 0.50\\)",
    "assumptions": [
      "Each return has exactly one confirmed failure mode."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "conditional probability",
      "independence",
      "contingency table",
      "joint probability"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Basic Probability Concepts",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Basic Probability Concepts — conditional probability",
        "example": "Examples 6.25–6.26"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q03",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.2",
      "topic": "Bayes’ theorem with a probability tree: escapes from a two-stage screen"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "Incoming power modules are screened as shown in the probability tree. Any module rejected by Screen 1 is retested by Screen 2. For a module of a given true condition, the two screen results are independent, and Screen 2 has the same detection and false-reject probabilities as Screen 1. Only modules rejected by both screens are scrapped; all others ship. What is the expected latent-defect level among shipped modules, in defective parts per million (ppm)?",
    "chart": {
      "type": "cre-prob-tree",
      "title": "Two-stage screen for a latent defect",
      "altText": "Probability tree. A module carries the latent defect with probability 0.03 or is good with probability 0.97. A defective module is rejected by Screen 1 with probability 0.92 and passes with 0.08; if rejected, Screen 2 rejects it with 0.92 and passes it with 0.08. A good module is rejected by Screen 1 with probability 0.04 and passes with 0.96; if rejected, Screen 2 rejects it with 0.04 and passes it with 0.96. Modules rejected twice are scrapped; all others ship.",
      "root": "Module",
      "children": [
        {
          "label": "Latent defect",
          "p": "0.03",
          "children": [
            {
              "label": "Screen 1 reject",
              "p": "0.92",
              "children": [
                {
                  "label": "Screen 2 reject",
                  "p": "0.92",
                  "outcome": "Scrap"
                },
                {
                  "label": "Screen 2 pass",
                  "p": "0.08",
                  "outcome": "Ship"
                }
              ]
            },
            {
              "label": "Screen 1 pass",
              "p": "0.08",
              "outcome": "Ship"
            }
          ]
        },
        {
          "label": "Good",
          "p": "0.97",
          "children": [
            {
              "label": "Screen 1 reject",
              "p": "0.04",
              "children": [
                {
                  "label": "Screen 2 reject",
                  "p": "0.04",
                  "outcome": "Scrap"
                },
                {
                  "label": "Screen 2 pass",
                  "p": "0.96",
                  "outcome": "Ship"
                }
              ]
            },
            {
              "label": "Screen 1 pass",
              "p": "0.96",
              "outcome": "Ship"
            }
          ]
        }
      ]
    },
    "options": [
      "2,400 ppm",
      "2,466 ppm",
      "4,608 ppm",
      "4,736 ppm"
    ],
    "answer": 3,
    "why": "<p>A defective module ships on two paths: it passes Screen 1, or Screen 1 rejects it and Screen 2 passes it. Every module that is not scrapped ships. Bayes’ theorem then gives the defect level among shipped modules:</p><p>The two defective ship paths contribute \\(0.03 \\times 0.08 = 0.0024\\) and \\(0.03 \\times 0.92 \\times 0.08 = 0.002208\\). The scrapped fractions are \\(0.03 \\times 0.92^2 = 0.025392\\) (defective) and \\(0.97 \\times 0.04^2 = 0.001552\\) (good), \\(0.026944\\) in total.</p><p>\\[\\begin{aligned}\\Pr(D \\cap S) &= 0.004608 \\\\ \\Pr(S) &= 1 - 0.026944 \\\\ &= 0.973056 \\\\ \\Pr(D \\mid S) &= \\frac{0.004608}{0.973056} \\\\ &= 0.004736\\end{aligned}\\]</p><p>where \\(D\\) is the event that a module carries the latent defect and \\(S\\) is the event that it ships. \\(0.004736 \\times 10^{6} \\approx 4736\\) ppm. As an expected-frequency check, per 10,000 modules about 46.1 defective modules ship among 9,730.6 shipped.</p><p><b>D. 4,736 ppm</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Basic Probability Concepts, Equations 6.11–6.12 and Examples 6.30–6.32 (tree diagrams and expected frequencies).</span></p>",
    "optionRationales": [
      "Counts only defective modules that escape Screen 1, \\(0.03 \\times 0.08 = 0.0024\\). It misses the defective modules that Screen 2 passes and does not divide by \\(\\Pr(\\text{Ship})\\).",
      "Divides the Screen 1 escape path alone by \\(\\Pr(\\text{Ship})\\): \\(0.0024/0.973 \\approx 0.002466\\). It still misses the defective modules passed by Screen 2.",
      "\\(\\Pr(D \\cap \\text{Ship}) = 0.004608\\) is a joint probability over all modules. The question asks for the level among shipped modules, so divide by \\(\\Pr(\\text{Ship}) = 0.973\\).",
      "Correct. \\(0.004608/0.973056 = 0.004736\\), or about 4,736 ppm."
    ],
    "keyPoint": "Outgoing quality is a conditional probability, \\(\\Pr(D \\mid \\text{Ship})\\): add every path where a defective unit ships, then divide by the total probability of shipping.",
    "trap": "Missing the defective units that the second screen passes back, or forgetting to normalize by the shipped population.",
    "formula": "\\(\\Pr(D \\mid \\text{Ship}) = \\dfrac{\\Pr(D)(1 - d^2)}{1 - \\Pr(D)d^2 - \\Pr(G)f^2}\\), with detection \\(d = 0.92\\) and false-reject \\(f = 0.04\\)",
    "assumptions": [
      "Screen results are conditionally independent given the module’s true condition.",
      "A module rejected by Screen 1 and passed by Screen 2 ships."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Bayes theorem",
      "probability tree",
      "expected frequency tree",
      "outgoing quality",
      "screening escapes"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Basic Probability Concepts",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Basic Probability Concepts — tree diagrams",
        "example": "Examples 6.30–6.32"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q04",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Poisson distribution for spares provisioning"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A remote compressor station is resupplied only at the interval shown in the planning sheet. Seal failures occur at a constant rate, and each failed seal is replaced immediately from on-site stock. Using the Poisson distribution, what is the minimum number of spare seals to stock so that the probability that a seal fails when no spare is left (failures before resupply exceed the stock) is no more than 5%?",
    "chart": {
      "type": "data-table",
      "title": "Station spares planning sheet",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Compressors running continuously",
          "4"
        ],
        [
          "Seals per compressor",
          "1"
        ],
        [
          "Seal MTBF (constant failure rate)",
          "2,400 h"
        ],
        [
          "Mean time to replace a seal",
          "6 h"
        ],
        [
          "Resupply interval",
          "2,100 h"
        ],
        [
          "Required protection against stock-out",
          "95%"
        ]
      ]
    },
    "options": [
      "3",
      "4",
      "7",
      "8"
    ],
    "answer": 2,
    "why": "<p>The expected number of seal failures across the station during the resupply interval is</p><p>\\[\\begin{aligned}\\lambda t &= \\frac{n\\,t}{\\text{MTBF}} \\\\ &= \\frac{4(2100)}{2400} = 3.5\\end{aligned}\\]</p><p>where \\(n\\) is the number of seals in service, \\(t\\) is the resupply interval and \\(\\lambda\\) is each seal’s failure rate. The 6 h replacement time is not needed. Stock \\(s\\) spares so that \\(\\Pr(X \\le s) \\ge 0.95\\), where \\(X\\) is the Poisson number of failures. From the cumulative Poisson table at \\(\\lambda t = 3.5\\): \\(\\Pr(X \\le 6) = 0.9347\\), short of 0.95, and \\(\\Pr(X \\le 7) = 0.9733\\), which meets it. So \\(s = 7\\).</p><p><b>C. 7</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.39–6.40 (Poisson); Appendix C.2, Cumulative Poisson Distribution Table.</span></p>",
    "optionRationales": [
      "Uses one compressor, \\(\\lambda t = 2100/2400 = 0.875\\), instead of all four seals in service.",
      "Stocks the expected number of failures, rounded up. With \\(\\lambda t = 3.5\\), four spares give only \\(\\Pr(X \\le 4) = 0.725\\).",
      "Correct. \\(\\Pr(X \\le 6) = 0.935 \\lt 0.95\\) and \\(\\Pr(X \\le 7) = 0.973 \\ge 0.95\\).",
      "Off by one: requires \\(\\Pr(X \\le s - 1) \\ge 0.95\\). With \\(s\\) spares, up to \\(s\\) failures can be covered, so the condition is \\(\\Pr(X \\le s) \\ge 0.95\\)."
    ],
    "keyPoint": "For spares, find the smallest \\(s\\) with cumulative Poisson \\(\\Pr(X \\le s)\\) at or above the required protection, using the combined expected failures \\(\\lambda t\\) of every unit in service.",
    "trap": "Using one unit’s failure rate, or stocking only the mean number of failures.",
    "formula": "\\(\\lambda t = n t/\\text{MTBF} = 3.5\\); smallest \\(s\\) with \\(\\Pr(X \\le s \\mid 3.5) \\ge 0.95\\) is \\(s = 7\\)",
    "assumptions": [
      "Failures follow a homogeneous Poisson process.",
      "Replacement seals have the same constant failure rate.",
      "Replacement time is negligible relative to the interval."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Poisson distribution",
      "spares provisioning",
      "constant failure rate",
      "cumulative Poisson table"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — Poisson",
        "example": "Examples 6.39–6.40; Appendix C.2"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q05",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Binomial distribution for an at-least-k-of-n requirement"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A pipeline leak-detection array uses 12 identical sensors that fail independently. The safety case is met if at least 10 sensors are still working at the end of a one-year inspection interval. Each sensor has a one-year reliability of 0.95. What is the probability that the array meets the safety case at the end of the interval?",
    "options": [
      "0.0988",
      "0.5987",
      "0.8816",
      "0.9804"
    ],
    "answer": 3,
    "why": "<p>The number of working sensors \\(X\\) is binomial with \\(n = 12\\) and \\(p = 0.95\\):</p><p>\\[\\Pr(X = x) = \\binom{12}{x} p^{x} q^{12-x}\\]</p><p>where \\(p = 0.95\\) is each sensor’s one-year reliability, \\(q = 1 - p\\) and \\(\\binom{12}{x}\\) counts the ways to choose which \\(x\\) sensors work. \"At least 10\" adds three terms:</p><p>\\[\\begin{aligned}\\Pr(10) &= 0.0988 \\\\ \\Pr(11) &= 0.3413 \\\\ \\Pr(12) &= 0.5404 \\\\ \\Pr(X \\ge 10) &= 0.9804\\end{aligned}\\]</p><p><b>D. 0.9804</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.33–6.34 (binomial); Appendix B.2, Cumulative Binomial Distribution Table.</span></p>",
    "optionRationales": [
      "This is \\(\\Pr(X = 10)\\) only. \"At least 10\" also includes 11 and 12 working sensors.",
      "\\(0.95^{10} = 0.5987\\) treats 10 particular sensors as a series system and ignores that any 10 of the 12 will do.",
      "This is \\(\\Pr(X \\ge 11)\\). It drops the case where exactly 10 sensors survive.",
      "Correct. \\(\\Pr(10) + \\Pr(11) + \\Pr(12) = 0.0988 + 0.3413 + 0.5404 = 0.9804\\)."
    ],
    "keyPoint": "\"At least \\(k\\) of \\(n\\)\" is a cumulative binomial: sum \\(\\Pr(X = x)\\) from \\(x = k\\) to \\(n\\).",
    "trap": "Taking only the single term \\(\\Pr(X = k)\\), or treating the \\(k\\) sensors as a series system.",
    "formula": "\\(\\Pr(X \\ge 10) = \\sum_{x=10}^{12} \\binom{12}{x}(0.95)^{x}(0.05)^{12-x}\\)",
    "assumptions": [
      "Sensor failures are independent.",
      "All sensors share the same one-year reliability."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "binomial distribution",
      "k-out-of-n",
      "independent trials",
      "cumulative probability"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — binomial",
        "example": "Examples 6.33–6.34; Appendix B.2"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q06",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Weibull conditional reliability for a fleet already in service"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Software output interpretation, calculation",
    "quantitative": true,
    "stem": "Life data for a gearbox bearing were fitted with the two-parameter Weibull model shown in the output. Forty bearings in the field have each run 500 hours without failure. How many of these 40 bearings are expected to fail during their next 500 hours of operation?",
    "chart": {
      "type": "data-table",
      "title": "Distribution Analysis: Bearing life (h) — Weibull, least squares estimates",
      "columns": [
        "Parameter",
        "Estimate"
      ],
      "rows": [
        [
          "Shape \\(\\beta\\)",
          "1.8"
        ],
        [
          "Scale \\(\\eta\\)",
          "2,000 h"
        ],
        [
          "Mean (MTTF)",
          "1,778.6 h"
        ],
        [
          "B10 life",
          "572.9 h"
        ],
        [
          "Failures / suspensions",
          "14 / 6"
        ]
      ]
    },
    "options": [
      "6.8",
      "7.4",
      "8.8",
      "10.0"
    ],
    "answer": 1,
    "why": "<p>These bearings have already survived 500 h, so use conditional reliability with the fitted \\(\\beta = 1.8\\) and \\(\\eta = 2000\\):</p><p>\\[\\begin{aligned}R(t) &= e^{-(t/\\eta)^{\\beta}} \\\\ R(1000) &= e^{-0.2872} = 0.7504 \\\\ R(500) &= e^{-0.0825} = 0.9209 \\\\ R_c &= R(1000)/R(500) \\\\ &= 0.8149 \\\\ N_f &= 40(1 - R_c) \\\\ &= 7.4\\end{aligned}\\]</p><p>where \\(\\beta\\) is the Weibull shape, \\(\\eta\\) is the scale (characteristic life), \\(R(t)\\) is reliability at age \\(t\\), \\(R_c\\) is the conditional reliability for the next 500 h and \\(N_f\\) is the expected number of the 40 bearings that fail. Because \\(\\beta \\gt 1\\) the hazard rises with age, so these used bearings are about 2.3 times as likely to fail in the next 500 h as new ones (0.185 versus 0.079).</p><p><b>B. 7.4</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.42–6.44 (Weibull calculations).</span></p>",
    "optionRationales": [
      "\\(40[F(1000) - F(500)] = 40(0.9209 - 0.7504) = 6.8\\) is the unconditional chance that a new bearing fails between 500 h and 1,000 h. These bearings are known to have survived 500 h, so divide by \\(R(500)\\).",
      "Correct. \\(40[1 - R(1000)/R(500)] = 40(0.1851) = 7.4\\).",
      "\\(40[1 - e^{-500/2000}] = 8.8\\) treats the scale \\(\\eta\\) as an exponential MTBF. The output shows wear-out (\\(\\beta = 1.8\\)), so the exponential model does not apply.",
      "\\(40[1 - R(1000)] = 10.0\\) uses the unconditional probability of failing by 1,000 h. That includes failures in the first 500 h, which these bearings have already survived."
    ],
    "keyPoint": "For units already in service, use conditional reliability \\(R(T + t)/R(T)\\). Only the exponential (\\(\\beta = 1\\)) is memoryless.",
    "trap": "Using the unconditional window \\(F(1000) - F(500)\\) without dividing by \\(R(500)\\), or treating \\(\\eta\\) as an exponential MTBF.",
    "formula": "\\(E[\\text{failures}] = N\\left[1 - R(T + t)/R(T)\\right]\\), with \\(R(t) = \\exp[-(t/\\eta)^{\\beta}]\\)",
    "assumptions": [
      "The two-parameter Weibull fit is adequate.",
      "Field use matches the test conditions.",
      "Failed bearings are not replaced during the 500 h window."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Weibull",
      "conditional reliability",
      "wear-out",
      "memoryless property"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — Weibull",
        "example": "Examples 6.42–6.44"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q07",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Lognormal percentile (B10 life)"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "Cycles to failure of a solder joint in thermal cycling are lognormally distributed. The fitted parameters of \\(\\ln(\\text{cycles})\\) are \\(\\mu = 8.987\\) and \\(\\sigma = 0.60\\). What is the B10 life, the number of cycles by which 10% of joints are expected to fail?",
    "options": [
      "2,980 cycles",
      "3,710 cycles",
      "7,998 cycles",
      "17,260 cycles"
    ],
    "answer": 1,
    "why": "<p>For a lognormal, \\(\\ln T\\) is normal with mean \\(\\mu\\) and standard deviation \\(\\sigma\\). The 10th percentile of \\(\\ln T\\) uses \\(z_{0.10} = -1.2816\\):</p><p>\\[\\begin{aligned}y &= \\mu + z_{0.10}\\,\\sigma \\\\ &= 8.987 - 0.769 \\\\ &= 8.218 \\\\ \\text{B10} &= e^{y} \\approx 3710\\end{aligned}\\]</p><p>where \\(T\\) is cycles to failure, \\(y = \\ln(\\text{B10})\\), \\(z_{0.10}\\) is the standard normal value with 10% below it, \\(1.2816 \\times 0.60 = 0.769\\), and B10 is in cycles. Using \\(z = 1.28\\) from the table gives the same rounded value.</p><p><b>B. 3,710 cycles</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.47–6.48 (lognormal); Appendix D, Cumulative Standard Normal Table.</span></p>",
    "optionRationales": [
      "Uses \\(z = 1.645\\), which gives the 5th percentile (B5 life), not the 10th.",
      "Correct. \\(\\exp(8.987 - 1.2816 \\times 0.60) \\approx 3710\\) cycles.",
      "\\(e^{\\mu} \\approx 7998\\) is the median life (B50), not the B10 life.",
      "Adds \\(1.2816\\sigma\\) instead of subtracting it, which gives the 90th percentile."
    ],
    "keyPoint": "Lognormal percentiles: work on the \\(\\ln\\) scale with the normal \\(z\\) value, then exponentiate.",
    "trap": "Using the 5% \\(z\\) value, or adding \\(z\\sigma\\) for a lower-tail percentile.",
    "formula": "\\(\\text{B10} = \\exp(\\mu - 1.2816\\,\\sigma) \\approx 3710\\) cycles",
    "assumptions": [
      "The lognormal model fits the solder-joint data."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "lognormal",
      "B10 life",
      "percentile",
      "thermal cycling"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — lognormal",
        "example": "Examples 6.47–6.48; Appendix D"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q08",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.1",
      "topic": "Nonparametric Kaplan-Meier estimate with suspensions"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Ten prototype pumps were run on a test stand. Some were removed early for unrelated reasons (suspensions), and the test ended at 800 hours. Using the Kaplan-Meier (product-limit) method, what is the estimated reliability at 750 hours?",
    "chart": {
      "type": "data-table",
      "title": "Prototype pump test log (10 units)",
      "columns": [
        "Unit",
        "Hours",
        "Status"
      ],
      "rows": [
        [
          "P‑07",
          "150",
          "Failed"
        ],
        [
          "P‑02",
          "230",
          "Suspended (removed for fixture rework)"
        ],
        [
          "P‑09",
          "310",
          "Failed"
        ],
        [
          "P‑04",
          "400",
          "Failed"
        ],
        [
          "P‑01",
          "480",
          "Suspended (removed for teardown study)"
        ],
        [
          "P‑10",
          "560",
          "Failed"
        ],
        [
          "P‑05",
          "600",
          "Suspended (stand power loss)"
        ],
        [
          "P‑03",
          "720",
          "Failed"
        ],
        [
          "P‑06",
          "800",
          "Survived to end of test"
        ],
        [
          "P‑08",
          "800",
          "Survived to end of test"
        ]
      ]
    },
    "options": [
      "0.20",
      "0.36",
      "0.405",
      "0.50"
    ],
    "answer": 1,
    "why": "<p>Kaplan-Meier multiplies \\((n_i - d_i)/n_i\\) at each failure time, where \\(n_i\\) is the number still at risk just before failure time \\(t_i\\) and \\(d_i\\) is the number failing then. Suspended units leave the risk set without counting as failures:</p><p>\\[\\begin{aligned}\\hat{R}(150) &= 9/10 = 0.9 \\\\ \\hat{R}(310) &= 0.9(7/8) = 0.7875 \\\\ \\hat{R}(400) &= \\cdots(6/7) = 0.675 \\\\ \\hat{R}(560) &= \\cdots(4/5) = 0.54 \\\\ \\hat{R}(720) &= \\cdots(2/3) = 0.36\\end{aligned}\\]</p><p>Each \\(\\cdots\\) is the estimate on the line above. The suspensions at 230 h, 480 h and 600 h each reduce the risk set by one. No other events occur before 750 h, so \\(\\hat{R}(750) = 0.36\\).</p><p><b>B. 0.36</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Basic Statistics (parametric versus nonparametric) and Examples 6.59–6.62 (Kaplan-Meier).</span></p>",
    "optionRationales": [
      "Counts every suspension as a failure: \\(1 - 8/10 = 0.20\\). That understates reliability badly.",
      "Correct. \\(0.9 \\times \\tfrac{7}{8} \\times \\tfrac{6}{7} \\times \\tfrac{4}{5} \\times \\tfrac{2}{3} = 0.36\\).",
      "Misses the 600 h suspension, leaving 4 at risk at 720 h: \\(0.54 \\times 3/4 = 0.405\\).",
      "\\(1 - 5/10 = 0.50\\) keeps the suspended units in the denominator as if they had been observed to 750 h."
    ],
    "keyPoint": "In Kaplan-Meier, suspensions shrink the risk set but never count as failures.",
    "trap": "Treating suspensions as failures, or as survivors to the evaluation time.",
    "formula": "\\(\\hat{R}(t) = \\prod_{t_i \\le t} \\dfrac{n_i - d_i}{n_i}\\)",
    "assumptions": [
      "Suspensions are unrelated to the pump failure mechanism (non-informative censoring)."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Kaplan-Meier",
      "product-limit estimator",
      "censored data",
      "suspensions",
      "nonparametric"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Basic Statistics; Kaplan-Meier",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Kaplan-Meier analysis",
        "example": "Examples 6.59–6.62"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q09",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Chi-square goodness of fit to a Poisson model"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, hypothesis test",
    "quantitative": true,
    "stem": "An engineer wants to check whether solder voids per circuit board follow a Poisson distribution before using that model for reliability predictions. The counts for 100 boards are shown (no board had more than 5 voids), and the Poisson mean is estimated from these same data. Expected cell counts must be at least 5. Which statement correctly reports the chi-square goodness-of-fit test at \\(\\alpha = 0.05\\)?",
    "chart": {
      "type": "data-table",
      "title": "Solder voids per board (100 boards)",
      "columns": [
        "Voids per board",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "rows": [
        [
          "Number of boards",
          "27",
          "46",
          "13",
          "9",
          "4",
          "1"
        ]
      ]
    },
    "options": [
      "\\(\\chi^2 = 6.81\\) with 3 degrees of freedom (critical value 7.815): fail to reject the Poisson model.",
      "\\(\\chi^2 = 7.28\\) with 3 degrees of freedom (critical value 7.815): fail to reject the Poisson model.",
      "\\(\\chi^2 = 8.55\\) with 3 degrees of freedom (critical value 7.815): reject the Poisson model.",
      "\\(\\chi^2 = 6.81\\) with 2 degrees of freedom (critical value 5.991): reject the Poisson model."
    ],
    "answer": 3,
    "why": "<p>Step 1, estimate the Poisson mean from the counts:</p><p>Counting voids board by board gives 120 voids on 100 boards:</p><p>\\[\\hat{\\lambda} = \\frac{120}{100} = 1.2\\]</p><p>Step 2, expected counts \\(E = 100\\Pr(X = k \\mid 1.2)\\) are 30.12, 36.14, 21.69 and 8.67 for 0 to 3 voids, and only 3.38 for 4 or more. Because 3.38 is below 5, pool into a \"3 or more\" cell (observed 14, expected 12.05). Step 3 and Step 4:</p><p>\\[\\begin{aligned}\\chi^2 &= \\sum \\frac{(O - E)^2}{E} \\\\ &= 6.81 \\\\ \\nu &= k - 1 - m = 2 \\\\ \\chi^2_{0.05,\\,2} &= 5.991\\end{aligned}\\]</p><p>The four cell contributions are 0.323, 2.688, 3.479 and 0.315, where \\(O\\) and \\(E\\) are observed and expected counts, \\(k\\) is the number of cells after pooling, \\(m\\) is the number of parameters estimated from the data and \\(\\nu\\) is the degrees of freedom. Since \\(6.81 \\gt 5.991\\), reject the Poisson model (\\(p \\approx 0.033\\)).</p><p><b>D. \\(\\chi^2 = 6.81\\) with 2 df: reject.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Example 6.51 (chi-square goodness of fit) and Appendix G, Chi-Square Distribution Table.</span></p>",
    "optionRationales": [
      "The statistic is right but the degrees of freedom are wrong. Estimating \\(\\lambda\\) from the same data costs one more: \\(\\nu = 4 - 1 - 1 = 2\\), not 3.",
      "Does not pool the \"4 or more\" cell, whose expected count is 3.38 (below 5). That gives 5 cells and a different statistic.",
      "Divides by the observed counts instead of the expected counts: \\(\\sum (O - E)^2/O = 8.55\\). The statistic always uses \\(E\\) in the denominator.",
      "Correct. With pooled cells \\(\\chi^2 = 6.81 \\gt 5.991\\), the critical value for 2 degrees of freedom."
    ],
    "keyPoint": "Goodness-of-fit degrees of freedom are \\(k - 1 - m\\); pool cells until every expected count is at least 5.",
    "trap": "Forgetting to subtract a degree of freedom for the estimated mean, which flips the decision here.",
    "formula": "\\(\\chi^2 = \\sum (O - E)^2/E\\), \\(\\nu = k - 1 - m\\)",
    "assumptions": [
      "Boards are independent.",
      "The expected-count rule of at least 5 per cell is applied before computing the statistic."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "chi-square goodness of fit",
      "Poisson",
      "degrees of freedom",
      "pooling cells",
      "estimated parameter"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — chi-square goodness of fit",
        "example": "Example 6.51; Appendix G"
      }
    ]
  },
  {
    "qid": "cre:set-1:b01-q10",
    "set": 1,
    "batch": 1,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Reading a Weibull probability plot and interpreting the shape parameter"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": true,
    "stem": "Ten failure times of a new electronic control unit are plotted on Weibull probability paper with the fitted line shown. Reading the fitted line, which conclusion and action are most appropriate?",
    "chart": {
      "type": "cre-weibull-plot",
      "title": "Weibull probability plot — control unit failures (10 units, median ranks)",
      "altText": "Weibull probability plot with time in hours on a log scale from 1 to 10,000 and unreliability from 1% to 99%. Ten points at 5.4 h (6.7%), 27.4 h (16.3%), 99.4 h (26.0%), 180 h (35.6%), 383 h (45.2%), 568 h (54.8%), 1,154 h (64.4%), 1,728 h (74.0%), 3,412 h (83.7%) and 7,063 h (93.3%) fall close to a straight fitted line. The line crosses 10% unreliability at about 11 hours and the 63.2% reference line at 1,000 hours.",
      "xTicks": [
        1,
        10,
        100,
        1000,
        10000
      ],
      "yTicks": [
        1,
        5,
        10,
        20,
        30,
        50,
        63.2,
        80,
        90,
        99
      ],
      "points": [
        [
          5.4,
          6.7
        ],
        [
          27.4,
          16.3
        ],
        [
          99.4,
          26
        ],
        [
          180,
          35.6
        ],
        [
          383,
          45.2
        ],
        [
          568,
          54.8
        ],
        [
          1154,
          64.4
        ],
        [
          1728,
          74
        ],
        [
          3412,
          83.7
        ],
        [
          7063,
          93.3
        ]
      ],
      "line": {
        "beta": 0.5,
        "eta": 1000
      },
      "xLabel": "Time to failure (hours, log scale)",
      "yLabel": "Unreliability (%)"
    },
    "options": [
      "\\(\\beta \\approx 0.5\\): the hazard rate is decreasing (early-life failures). Fixed-interval preventive replacement would not help; investigate manufacturing escapes and consider burn-in or ESS.",
      "\\(\\beta \\approx 1.15\\): the hazard rate is nearly constant. Failures are random, so run the units to failure and keep spares.",
      "\\(\\beta \\approx 0.5\\): the hazard rate is decreasing. Lengthen the preventive replacement interval so units are replaced less often but still before they fail.",
      "\\(\\beta \\approx 2.0\\): the hazard rate is increasing (wear-out). Set a preventive replacement interval at the B10 life read from the plot."
    ],
    "answer": 0,
    "why": "<p>On Weibull paper the slope of the fitted line is \\(\\beta\\). Read two points from the line: it crosses the dashed 63.2% line at \\(\\eta \\approx 1000\\) h and the 10% line at about 11 h. Then</p><p>\\[\\begin{aligned}y &= \\ln[-\\ln(1 - F)] \\\\ \\beta &= \\frac{y_2 - y_1}{\\ln t_2 - \\ln t_1} \\\\ &= \\frac{0 - (-2.250)}{6.908 - 2.398} \\\\ &\\approx 0.50\\end{aligned}\\]</p><p>where \\(F_1 = 0.10\\) at \\(t_1 = 11\\) h and \\(F_2 = 0.632\\) at \\(t_2 = 1000\\) h, and \\(y\\) is the vertical Weibull-paper scale. When \\(\\beta \\lt 1\\) the hazard rate decreases with age, which signals infant mortality from defects that escaped manufacturing. Replacing a unit early swaps it for a new one with a higher hazard, so time-based preventive replacement makes things worse. The right response is to find and remove the defect source and, until then, screen with burn-in or ESS.</p><p><b>A. \\(\\beta \\approx 0.5\\), decreasing hazard: investigate escapes and consider burn-in or ESS.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions (Weibull) and Examples 6.54–6.57 (distribution identification).</span></p>",
    "optionRationales": [
      "Correct. The slope is about 0.5, so \\(\\beta \\lt 1\\) and the hazard is decreasing; preventive replacement would only add early failures.",
      "Mixes logarithm bases: the vertical axis is \\(\\ln[-\\ln(1 - F)]\\) but \\(\\log_{10}\\) was used on the time axis, giving \\(2.25/1.955 \\approx 1.15\\).",
      "The slope and hazard are read correctly, but the action is wrong. With \\(\\beta \\lt 1\\) a replacement unit has a higher hazard than the one it replaces, so any time-based replacement adds failures; it also leaves the escape source in place.",
      "A slope of 2 would be a steep line. This line rises only about 2.25 units on the \\(\\ln\\) scale across two decades of time."
    ],
    "keyPoint": "\\(\\beta\\) is the slope on Weibull paper: \\(\\beta \\lt 1\\) means a decreasing hazard (infant mortality), \\(\\beta = 1\\) constant, \\(\\beta \\gt 1\\) wear-out.",
    "trap": "Using \\(\\log_{10}\\) for time while the vertical axis uses natural logs, or keeping any time-based replacement when \\(\\beta \\lt 1\\).",
    "formula": "\\(\\beta = \\dfrac{\\ln[-\\ln(1 - F_2)] - \\ln[-\\ln(1 - F_1)]}{\\ln t_2 - \\ln t_1}\\)",
    "assumptions": [
      "A single failure mode is present.",
      "The points follow the fitted straight line without curvature."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Weibull probability plot",
      "shape parameter",
      "infant mortality",
      "burn-in",
      "bathtub curve"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Distributions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Distributions — Weibull; distribution identification",
        "example": "Examples 6.54–6.57"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q11",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.4",
      "topic": "Conditional reliability from a hazard function (cumulative hazard)"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Field data for a hydraulic seal give the hazard function shown. The hazard rate is constant until 1,000 hours and then rises linearly. A seal has already run 800 hours without failing. What is the probability that it survives to 1,500 hours?",
    "chart": {
      "type": "cre-xy-plot",
      "eyebrow": "Hazard function",
      "title": "Hydraulic seal hazard rate",
      "altText": "Hazard rate in failures per 10,000 hours against operating time from 0 to 2,000 hours. The rate is constant at 4 from 0 to 1,000 hours, then rises in a straight line to 14 at 1,500 hours and 24 at 2,000 hours.",
      "xTicks": [
        0,
        250,
        500,
        750,
        1000,
        1250,
        1500,
        1750,
        2000
      ],
      "yTicks": [
        0,
        5,
        10,
        15,
        20,
        25
      ],
      "series": [
        {
          "label": "h(t)",
          "points": [
            [
              0,
              4
            ],
            [
              1000,
              4
            ],
            [
              1500,
              14
            ],
            [
              2000,
              24
            ]
          ]
        }
      ],
      "markers": [
        {
          "x": 1000,
          "y": 4,
          "label": "4 per 10,000 h"
        },
        {
          "x": 1500,
          "y": 14,
          "label": "14 per 10,000 h"
        }
      ],
      "xLabel": "Operating time (hours)",
      "yLabel": "Hazard rate (failures per 10,000 h)"
    },
    "options": [
      "0.375",
      "0.427",
      "0.589",
      "0.638"
    ],
    "answer": 2,
    "why": "<p>For a unit that has survived to age \\(t_0\\), conditional reliability uses only the cumulative hazard accumulated between \\(t_0\\) and \\(t\\):</p><p>\\[\\begin{aligned}R(t \\mid t_0) &= e^{-\\Delta H} \\\\ \\Delta H &= H(t) - H(t_0) \\\\ A_1 &= 0.0004(200) \\\\ &= 0.08 \\\\ A_2 &= 500(0.0009) \\\\ &= 0.45 \\\\ \\Delta H &= 0.53 \\\\ R &= e^{-0.53} \\\\ &= 0.589\\end{aligned}\\]</p><p>where \\(R\\) is \\(R(1500 \\mid 800)\\), \\(\\Delta H\\) is the cumulative hazard added between \\(t_0 = 800\\) h and \\(t = 1500\\) h, \\(H(t) = \\int_0^{t} h(u)\\,du\\) is the area under the hazard curve and \\(h(t)\\) is per hour (4 and 14 failures per 10,000 h at 1,000 h and 1,500 h). \\(A_1\\) is the rectangle from 800 to 1,000 h; \\(A_2\\) is the trapezoid from 1,000 to 1,500 h, whose average height is \\((0.0004 + 0.0014)/2 = 0.0009\\) per hour. Survival to 800 h is already known, so the hazard before 800 h no longer matters.</p><p><b>C. 0.589</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Functions (hazard, cumulative hazard and conditional reliability).</span></p>",
    "optionRationales": [
      "\\(e^{-0.0014 \\times 700} = 0.375\\) applies the end-point hazard to the whole remaining 700 h. The hazard only reaches that value at 1,500 h.",
      "\\(e^{-0.85} = 0.427\\) is the reliability of a new seal at 1,500 h. It ignores the 800 h already survived.",
      "Correct. \\(H(1500) - H(800) = 0.08 + 0.45 = 0.53\\), so \\(R = e^{-0.53} = 0.589\\).",
      "\\(e^{-0.45} = 0.638\\) counts only the rising section and drops the 200 h of constant hazard from 800 h to 1,000 h."
    ],
    "keyPoint": "Conditional reliability \\(R(t \\mid t_0) = \\exp\\{-[H(t) - H(t_0)]\\}\\): integrate the hazard only over the remaining interval.",
    "trap": "Using the reliability of a new unit, or applying the end-point hazard to the whole interval.",
    "formula": "\\(R(t \\mid t_0) = \\exp[-(H(t) - H(t_0))]\\), \\(H(1500) - H(800) = 0.53\\)",
    "assumptions": [
      "The hazard function shown applies to every seal from time zero, and the seal is not repaired or renewed."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "hazard function",
      "cumulative hazard",
      "conditional reliability",
      "reliability function",
      "wear-out"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Functions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Functions — hazard and cumulative hazard",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q12",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.4",
      "topic": "Hazard rate from PDF and CDF output; distinguishing f(t) from h(t)"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Software output interpretation, calculation",
    "quantitative": true,
    "stem": "A life-data package reports the probability density \\(f(t)\\) and cumulative distribution \\(F(t)\\) shown for a pump impeller. A colleague notes that \\(f(t)\\) peaks near 600 hours and concludes that the impeller’s failure rate falls after that. What is the hazard rate at 800 hours, and which conclusion about the failure rate is correct?",
    "chart": {
      "type": "data-table",
      "title": "Distribution Analysis: Impeller life — table of probabilities",
      "columns": [
        "Time (h)",
        "PDF \\(f(t)\\)",
        "CDF \\(F(t)\\)"
      ],
      "rows": [
        [
          "200",
          "0.000565",
          "0.0733"
        ],
        [
          "400",
          "0.000733",
          "0.2061"
        ],
        [
          "600",
          "0.000757",
          "0.3570"
        ],
        [
          "800",
          "0.000695",
          "0.5033"
        ],
        [
          "1,000",
          "0.000589",
          "0.6321"
        ]
      ]
    },
    "options": [
      "\\(h(800) \\approx 6.95 \\times 10^{-4}\\) per hour; the failure rate is decreasing because \\(f(t)\\) falls after 600 h.",
      "\\(h(800) \\approx 1.40 \\times 10^{-3}\\) per hour; the failure rate is increasing (wear-out), because \\(f(t)/[1 - F(t)]\\) rises at every time in the table.",
      "\\(h(800) \\approx 1.40 \\times 10^{-3}\\) per hour; the failure rate is decreasing because \\(f(t)\\) falls after 600 h.",
      "\\(h(800) \\approx 6.29 \\times 10^{-4}\\) per hour; the failure rate is roughly constant because \\(F(t)/t\\) changes little after 600 h."
    ],
    "answer": 1,
    "why": "<p>The hazard rate is the failure density divided by the fraction still surviving:</p><p>\\[\\begin{aligned}h(t) &= \\frac{f(t)}{1 - F(t)} \\\\ h(800) &= \\frac{0.000695}{0.4967} \\\\ &= 1.40 \\times 10^{-3}\\end{aligned}\\]</p><p>where \\(f(t)\\) is the probability density, \\(F(t)\\) the cumulative fraction failed, \\(R(t) = 1 - F(t)\\) the reliability and \\(h(t)\\) is per hour. Across the table \\(h(t) = 0.61, 0.92, 1.18, 1.40\\) and \\(1.60 \\times 10^{-3}\\) per hour, so the failure rate keeps increasing. \\(f(t)\\) falls after 600 h only because fewer units remain to fail; the survivors are failing at a rising rate.</p><p><b>B. \\(1.40 \\times 10^{-3}\\) per hour, increasing.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Functions (PDF, CDF and hazard function).</span></p>",
    "optionRationales": [
      "Reads \\(f(800)\\) as the hazard rate. The PDF is the unconditional failure density; the hazard is conditional on survival.",
      "Correct. \\(h(t) = f(t)/[1 - F(t)]\\) rises from \\(6.1 \\times 10^{-4}\\) to \\(1.60 \\times 10^{-3}\\) per hour across the table.",
      "The hazard value is right, but the trend is taken from \\(f(t)\\) instead of \\(h(t)\\).",
      "\\(F(800)/800 = 6.29 \\times 10^{-4}\\) is an average fraction failed per hour, not the instantaneous hazard rate."
    ],
    "keyPoint": "\\(h(t) = f(t)/R(t)\\). A falling PDF does not mean a falling failure rate.",
    "trap": "Reading the trend of the PDF as the trend of the hazard rate.",
    "formula": "\\(h(t) = f(t)/[1 - F(t)]\\)",
    "assumptions": [
      "The fitted distribution describes impeller life."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "hazard function",
      "probability density function",
      "cumulative distribution function",
      "wear-out"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Probability Functions",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability Functions — PDF, CDF and hazard",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q13",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.5",
      "topic": "Zero-failure Weibull demonstration: solving for test time"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A zero-failure reliability demonstration is planned using the requirements in the table. Each test station holds one unit, and all units must start together. Prior life data show that the failure mechanism follows a Weibull distribution with the shape parameter given. How long must each unit run, with no failures, to demonstrate the requirement?",
    "chart": {
      "type": "data-table",
      "title": "Demonstration test plan — actuator",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Required reliability",
          "0.95 at 2,000 h"
        ],
        [
          "Required confidence",
          "90%"
        ],
        [
          "Known Weibull shape \\(\\beta\\)",
          "1.5"
        ],
        [
          "Test stations available (one unit each)",
          "12"
        ],
        [
          "Cost per test unit",
          "$1,850"
        ]
      ]
    },
    "options": [
      "7,480 h",
      "4,820 h",
      "8,000 h",
      "14,470 h"
    ],
    "answer": 1,
    "why": "<p>For a zero-failure Weibull test with known \\(\\beta\\), testing \\(n\\) units for \\(k\\) times the mission time demonstrates the requirement when \\(n\\,k^{\\beta}\\ln R \\le \\ln(1 - C)\\). Fix \\(n = 12\\) and solve for \\(k\\):</p><p>\\[\\begin{aligned}k^{\\beta} &= \\frac{\\ln(1 - C)}{n\\,\\ln R} \\\\ &= \\frac{\\ln 0.10}{12\\,\\ln 0.95} \\\\ &= 3.741 \\\\ k &= 3.741^{1/1.5} \\\\ &= 2.410 \\\\ t_{\\text{test}} &= 2.410(2000) \\\\ &= 4820 \\text{ h}\\end{aligned}\\]</p><p>where \\(C\\) is the required confidence, \\(R\\) the required reliability at the mission time of 2,000 h, \\(\\beta\\) the Weibull shape, \\(n\\) the number of units on test and \\(k = t_{\\text{test}}/t_{\\text{mission}}\\). Because the mechanism wears out (\\(\\beta \\gt 1\\)), each extra hour of test counts for more than the last, so the time needed grows more slowly than the 3.741 ratio.</p><p><b>B. 4,820 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Sampling Plans for Statistics and Reliability Testing, Examples 6.64–6.66.</span></p>",
    "optionRationales": [
      "Uses \\(k = 3.741\\) directly, as if \\(\\beta = 1\\): \\(3.741 \\times 2000 = 7480\\) h. That ignores the wear-out shape.",
      "Correct. \\(k^{1.5} = \\ln 0.10/(12 \\ln 0.95) = 3.741\\), so \\(k = 2.410\\) and \\(t = 4820\\) h.",
      "Runs the 45-unit mission-time plan (\\(\\ln 0.10/\\ln 0.95 = 44.9\\)) as four successive groups of 12 for 2,000 h each. Units that start later do not share the same test conditions, and the stem requires one simultaneous run.",
      "Raises the ratio to the power \\(\\beta\\) instead of \\(1/\\beta\\): \\(3.741^{1.5} \\times 2000 = 14470\\) h."
    ],
    "keyPoint": "With \\(n\\) fixed, solve \\(k = [\\ln(1 - C)/(n \\ln R)]^{1/\\beta}\\); the test-time ratio scales with the \\(1/\\beta\\) power.",
    "trap": "Ignoring \\(\\beta\\), or raising the ratio to \\(\\beta\\) instead of \\(1/\\beta\\).",
    "formula": "\\(k = \\left[\\frac{\\ln(1 - C)}{n \\ln R}\\right]^{1/\\beta}\\), \\(t_{\\text{test}} = k\\,t_{\\text{mission}}\\)",
    "assumptions": [
      "β is known and the same at test and use conditions.",
      "Units are tested at use conditions (no acceleration)."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "reliability demonstration",
      "zero-failure test",
      "success run",
      "Weibull",
      "test time extension"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Sampling Plans for Statistics and Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Sampling plans — zero-failure and extended-time tests",
        "example": "Examples 6.64–6.66"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q14",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.5",
      "topic": "Binomial demonstration plans: sample size and producer’s risk"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A customer requires a demonstration that a relay has reliability of at least 0.90 for one mission, at 90% confidence. The team compares a zero-failure plan (accept if \\(c = 0\\) relays fail) with a plan that accepts if no more than \\(c = 1\\) relay fails. Using the binomial distribution, what is the minimum sample size of each plan, and what is the probability that each plan accepts a relay design whose true mission reliability is 0.97?",
    "options": [
      "\\(c = 0\\): 22 relays, accepted with probability 0.51. \\(c = 1\\): 37 relays, accepted with probability 0.69.",
      "\\(c = 0\\): 22 relays, accepted with probability 0.51. \\(c = 1\\): 38 relays, accepted with probability 0.31.",
      "\\(c = 0\\): 22 relays, accepted with probability 0.49. \\(c = 1\\): 38 relays, accepted with probability 0.32.",
      "\\(c = 0\\): 22 relays, accepted with probability 0.51. \\(c = 1\\): 38 relays, accepted with probability 0.68."
    ],
    "answer": 3,
    "why": "<p>Each plan needs the smallest \\(n\\) for which a design that only just fails the requirement (\\(p = 0.10\\)) passes with probability no more than \\(1 - C = 0.10\\):</p><p>\\[\\begin{aligned}0.90^{n} &\\le 0.10 \\\\ n &\\ge \\frac{\\ln 0.10}{\\ln 0.90} \\\\ &= 21.9 \\Rightarrow 22\\end{aligned}\\]</p><p>for the zero-failure plan. For the \\(c = 1\\) plan:</p><p>\\[\\begin{aligned}P_n &= q^{n} + n\\,p\\,q^{n-1} \\\\ P_{37} &= 0.1036 \\\\ P_{38} &= 0.0953\\end{aligned}\\]</p><p>where \\(p = 1 - R = 0.10\\), \\(q = 0.90\\) and \\(P_n = \\Pr(X \\le 1)\\) with \\(n\\) relays on test, so 38 relays are needed. Then evaluate each plan at the true reliability 0.97 (\\(p_1 = 0.03\\)):</p><p>\\[\\begin{aligned}A_0 &= 0.97^{22} \\\\ &= 0.51 \\\\ A_1 &= 0.97^{38} \\\\ &\\quad + 38(0.03)(0.97)^{37} \\\\ &= 0.314 + 0.369 \\\\ &= 0.68\\end{aligned}\\]</p><p>where \\(p_1\\) is the true failure probability per mission and \\(A_0\\) and \\(A_1\\) are the probabilities that the \\(c = 0\\) and \\(c = 1\\) plans accept the design. Both plans give the customer the same protection, but the zero-failure plan rejects a genuinely good (0.97) design about half the time. Allowing one failure costs 16 more relays and raises the chance of accepting it to about two in three.</p><p><b>D. 22 relays at 0.51; 38 relays at 0.68.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Sampling Plans for Statistics and Reliability Testing (Examples 6.64–6.66) and Confidence Intervals (Example 6.84).</span></p>",
    "optionRationales": [
      "Uses the chi-square (Poisson) approximation for the \\(c = 1\\) size: \\(\\chi^2_{0.10,\\,4}/(2 \\times 0.1054) = 36.9\\), so 37. The exact binomial calculation asked for gives \\(\\Pr(X \\le 1) = 0.104 \\gt 0.10\\) at \\(n = 37\\).",
      "Counts only the zero-failure outcome for the \\(c = 1\\) plan: \\(0.97^{38} = 0.31\\). The plan also accepts when exactly one relay fails.",
      "Reports the probability of rejection (\\(1 - 0.51\\) and \\(1 - 0.68\\)) instead of acceptance.",
      "Correct. 22 and 38 relays; acceptance probabilities \\(0.97^{22} = 0.51\\) and \\(\\Pr(X \\le 1 \\mid 38, 0.03) = 0.68\\)."
    ],
    "keyPoint": "Size each plan at the requirement (\\(\\Pr(X \\le c \\mid n, 1 - R) \\le 1 - C\\)), then judge it by its OC curve: allowing failures costs units but lowers the producer’s risk.",
    "trap": "Using the Poisson approximation when the binomial is specified, or forgetting the one-failure term when computing acceptance.",
    "formula": "\\(\\sum_{x=0}^{c} \\binom{n}{x}p^{x}q^{\\,n-x} \\le 1 - C\\); \\(\\Pr(\\text{accept}) = \\sum_{x=0}^{c} \\binom{n}{x}p_1^{x}(1 - p_1)^{n-x}\\)",
    "assumptions": [
      "Each relay is an independent pass/fail trial with the same reliability."
    ],
    "estimatedMinutes": 7,
    "keywords": [
      "binomial",
      "success run",
      "allowed failures",
      "reliability demonstration",
      "OC curve",
      "producer’s risk"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Sampling Plans for Statistics and Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Sampling plans — binomial demonstration with failures",
        "example": "Examples 6.64–6.66, 6.84"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q15",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.6",
      "topic": "Long-term capability (Ppk) and expected nonconformance"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Software output interpretation, calculation",
    "quantitative": true,
    "stem": "A capability study on the diameter of a bearing journal produced the output shown. Undersized journals are the reliability concern, because they loosen and fret in service. Based on long-term (overall) performance, what proportion of journals is expected to fall below the lower specification limit?",
    "chart": {
      "type": "data-table",
      "title": "Process Capability Report: Journal diameter (mm)",
      "columns": [
        "Statistic",
        "Value"
      ],
      "rows": [
        [
          "LSL",
          "24.950"
        ],
        [
          "USL",
          "25.100"
        ],
        [
          "Sample mean",
          "25.012"
        ],
        [
          "StDev (within)",
          "0.0140"
        ],
        [
          "StDev (overall)",
          "0.0227"
        ],
        [
          "\\(C_p\\) / \\(C_{pk}\\)",
          "1.79 / 1.48"
        ],
        [
          "\\(P_p\\) / \\(P_{pk}\\)",
          "1.10 / 0.91"
        ]
      ]
    },
    "options": [
      "5 ppm",
      "53 ppm",
      "3,155 ppm",
      "3,210 ppm"
    ],
    "answer": 2,
    "why": "<p>Long-term performance uses the overall standard deviation:</p><p>\\[\\begin{aligned}z_L &= \\frac{\\bar{x} - \\text{LSL}}{\\sigma_o} \\\\ &= \\frac{25.012 - 24.950}{0.0227} \\\\ &= 2.73 \\\\ p_L &= \\Phi(-2.73) = 0.00316\\end{aligned}\\]</p><p>where \\(\\bar{x}\\) is the process mean, \\(\\sigma_o\\) the overall standard deviation, \\(\\Phi\\) the standard normal CDF and \\(p_L\\) the fraction below the LSL. This matches \\(P_{pk} = z_L/3 = 0.91\\). The answer is about 3,155 ppm. The large gap between \\(C_{pk} = 1.48\\) and \\(P_{pk} = 0.91\\) shows the process drifts between subgroups, so the within-subgroup figure badly understates the undersize risk.</p><p><b>C. 3,155 ppm</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Statistical Process Control and Capability Studies, Example 6.80; Appendix D.</span></p>",
    "optionRationales": [
      "Uses the within-subgroup standard deviation (\\(z = 4.43\\)), which describes short-term potential, not long-term performance.",
      "This is the expected fraction above the USL (\\(z = 3.88\\)). The concern is undersized journals.",
      "Correct. \\(z_L = 0.062/0.0227 = 2.731\\) and \\(\\Phi(-2.731) \\approx 0.003155\\), or 3,155 ppm. Working from the rounded \\(P_{pk} = 0.91\\) (\\(z = 2.73\\)) gives about 3,170 ppm, still nearest this option.",
      "Adds both tails (3,155 + 53 ppm). Only the lower tail is asked for."
    ],
    "keyPoint": "\\(P_p\\) and \\(P_{pk}\\) use the overall standard deviation and predict long-term nonconformance; on the side of interest \\(z = 3P_{pk}\\).",
    "trap": "Using the within-subgroup \\(\\sigma\\) for long-term prediction, or reporting both tails when one is asked.",
    "formula": "\\(z_L = (\\bar{x} - \\text{LSL})/\\sigma_{\\text{overall}} = 3P_{pk}\\); fraction below LSL \\(= \\Phi(-z_L)\\)",
    "assumptions": [
      "Diameter is approximately normal.",
      "The study period represents long-term variation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "process capability",
      "Ppk",
      "Cpk",
      "nonconformance",
      "ppm"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Statistical Process Control and Capability Studies",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "SPC and capability studies — Cp, Cpk, Pp, Ppk",
        "example": "Example 6.80; Appendix D"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q16",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.6",
      "topic": "Control chart selection with varying subgroup sizes"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A final-inspection station records the proportion of circuit cards with one or more nonconformities. The number of cards inspected changes from day to day. Using the week shown as the baseline, which control chart should be used, and which day or days signal?",
    "chart": {
      "type": "data-table",
      "title": "Final inspection — circuit cards",
      "columns": [
        "Day",
        "Cards inspected",
        "Nonconforming cards",
        "Total nonconformities"
      ],
      "rows": [
        [
          "Mon",
          "120",
          "4",
          "6"
        ],
        [
          "Tue",
          "100",
          "9",
          "14"
        ],
        [
          "Wed",
          "200",
          "17",
          "22"
        ],
        [
          "Thu",
          "180",
          "4",
          "6"
        ],
        [
          "Fri",
          "150",
          "3",
          "5"
        ],
        [
          "Sat",
          "250",
          "3",
          "7"
        ]
      ]
    },
    "options": [
      "\\(np\\) chart with \\(\\bar{n} = 167\\); UCL \\(\\approx 14.3\\) nonconforming cards; only Wednesday (17) signals.",
      "\\(p\\) chart using the average subgroup size; UCL \\(\\approx 0.086\\); only Tuesday (0.090) signals.",
      "\\(u\\) chart of nonconformities per card; only Tuesday (0.140, above its 0.134 limit) signals.",
      "\\(p\\) chart with limits for each day’s subgroup size; only Wednesday (0.085, above its 0.082 limit) signals. Tuesday (0.090) is inside its 0.099 limit."
    ],
    "answer": 3,
    "why": "<p>The characteristic is the proportion of nonconforming cards, an attribute, and the subgroup size varies from 100 to 250, so a \\(p\\) chart with limits computed for each subgroup is the right choice:</p><p>\\[\\begin{aligned}\\bar{p} &= 40/1000 = 0.040 \\\\ \\text{UCL}_i &= \\bar{p} + 3\\sqrt{\\bar{p}\\,\\bar{q}/n_i} \\\\ \\text{UCL}_{\\text{Tue}} &= 0.040 + 0.059 \\\\ &= 0.099 \\\\ \\text{UCL}_{\\text{Wed}} &= 0.040 + 0.042 \\\\ &= 0.082\\end{aligned}\\]</p><p>where \\(\\bar{p}\\) is the baseline proportion nonconforming, \\(\\bar{q} = 1 - \\bar{p} = 0.960\\) and \\(n_i\\) is the number of cards inspected that day (100 on Tuesday, 200 on Wednesday). Tuesday’s proportion is \\(9/100 = 0.090\\), below its limit. Wednesday’s is \\(17/200 = 0.085\\), above its tighter limit, so Wednesday is the only signal. A single average-\\(n\\) limit (0.086) reverses both conclusions: it flags the small Tuesday sample and misses the large Wednesday one.</p><p><b>D. \\(p\\) chart with per-day limits; only Wednesday signals.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Statistical Process Control, Examples 6.76–6.79 (p, np, c and u charts).</span></p>",
    "optionRationales": [
      "An \\(np\\) chart needs a constant subgroup size. With sizes from 100 to 250, a count limit built on the average size is not valid, even though it happens to flag Wednesday here.",
      "Average-\\(n\\) limits are only an approximation when subgroup sizes are similar. Here the shortcut flags small-sample Tuesday (0.090 is inside its own 0.099 limit) and misses Wednesday (0.085 against its own 0.082 limit).",
      "A \\(u\\) chart tracks nonconformities per card. The characteristic is nonconforming cards, which is a \\(p\\)-chart problem.",
      "Correct. \\(\\bar{p} = 0.040\\); \\(\\text{UCL}_{\\text{Tue}} = 0.099\\) and \\(\\text{UCL}_{\\text{Wed}} = 0.082\\); only Wednesday is above its limit."
    ],
    "keyPoint": "Nonconforming units with varying \\(n\\): use a \\(p\\) chart with limits recomputed for each subgroup size. Average-\\(n\\) limits can both create and hide signals.",
    "trap": "Using an average \\(n\\) when subgroup sizes vary widely, using \\(np\\) (requires constant \\(n\\)), or charting defects instead of defectives.",
    "formula": "\\(\\text{UCL}_i = \\bar{p} + 3\\sqrt{\\bar{p}(1 - \\bar{p})/n_i}\\)",
    "assumptions": [
      "The baseline week is in statistical control."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "p chart",
      "variable subgroup size",
      "attribute control chart",
      "np chart",
      "u chart"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Statistical Process Control",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "SPC — attribute control charts",
        "example": "Examples 6.76–6.79"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q17",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.7",
      "topic": "Chi-square MTBF bound: planning additional test time"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Eight power supplies were tested at use conditions. Each failed unit was repaired immediately and returned to test, and the test ended on a pre-planned date. The customer requires a one-sided 90% lower confidence bound on MTBF of at least 2,000 h. Assuming a constant failure rate, if testing resumes under the same rules and no further failures occur, how many more total unit-hours of testing are needed?",
    "chart": {
      "type": "data-table",
      "title": "Power supply test summary",
      "columns": [
        "Position",
        "Hours on test",
        "Failures"
      ],
      "rows": [
        [
          "PS-1",
          "1,800",
          "1"
        ],
        [
          "PS-2",
          "1,500",
          "0"
        ],
        [
          "PS-3",
          "1,500",
          "0"
        ],
        [
          "PS-4",
          "1,400",
          "1"
        ],
        [
          "PS-5",
          "1,600",
          "0"
        ],
        [
          "PS-6",
          "1,500",
          "0"
        ],
        [
          "PS-7",
          "1,200",
          "1"
        ],
        [
          "PS-8",
          "1,500",
          "0"
        ]
      ]
    },
    "options": [
      "None: the current 90% lower bound (2,255 h) already exceeds 2,000 h.",
      "About 1,360 h more.",
      "About 3,510 h more.",
      "About 14,720 h more."
    ],
    "answer": 1,
    "why": "<p>Total test time so far is \\(T = 12000\\) h with \\(r = 3\\) failures. The test is time-terminated (it stops on a date, not at a failure), so the lower bound uses \\(2r + 2 = 8\\) degrees of freedom. The current bound is \\(24000/13.362 = 1796\\) h, short of the requirement. Solve for the total time needed:</p><p>\\[\\begin{aligned}\\frac{2T}{\\chi^2_{0.10,\\,8}} &\\ge 2000 \\\\ T_{\\text{req}} &= \\frac{2000(13.362)}{2} \\\\ &= 13362 \\text{ h} \\\\ \\Delta T &= 13362 - 12000 \\\\ &= 1362 \\text{ h}\\end{aligned}\\]</p><p>where \\(\\Delta T\\) is the additional unit-hours needed, \\(T\\) is the total unit-hours on test, \\(r\\) the number of failures and \\(\\alpha = 0.10\\) for a one-sided 90% bound. With no further failures, about 1,360 more unit-hours (for example, 170 more hours on each of the eight positions) meets the requirement.</p><p><b>B. About 1,360 h more.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Confidence and Tolerance Intervals, Example 6.95 (confidence interval for an exponential mean); Appendix G.</span></p>",
    "optionRationales": [
      "Uses \\(2r = 6\\) degrees of freedom (\\(\\chi^2 = 10.645\\)), the failure-terminated formula: \\(24000/10.645 = 2255\\) h. This test ends at a planned time, so 8 degrees of freedom apply.",
      "Correct. \\(T_{\\text{req}} = 2000 \\times 13.362/2 = 13362\\) h, which is 1,362 h more than the 12,000 h already run.",
      "Uses \\(\\chi^2_{0.05,\\,8} = 15.507\\), the value for a two-sided 90% interval: \\(T_{\\text{req}} = 15507\\) h.",
      "Drops the factor 2 in \\(2T\\): \\(T_{\\text{req}} = 2000 \\times 13.362 = 26724\\) h."
    ],
    "keyPoint": "Time-terminated: \\(\\text{MTBF}_L = 2T/\\chi^2_{\\alpha,\\,2r+2}\\). To plan more testing, solve for \\(T\\) with the planned number of failures.",
    "trap": "Using \\(2r\\) degrees of freedom on a time-terminated test, the two-sided chi-square value, or dropping the 2 in \\(2T\\).",
    "formula": "\\(T_{\\text{req}} = \\text{MTBF}_{\\text{req}}\\,\\chi^2_{\\alpha,\\,2r+2}/2\\)",
    "assumptions": [
      "Constant failure rate.",
      "Repairs restore units to as-good-as-new condition."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "MTBF",
      "chi-square",
      "confidence bound",
      "time-terminated test",
      "test planning",
      "exponential"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Confidence and Tolerance Intervals",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Confidence intervals — exponential mean",
        "example": "Example 6.95; Appendix G"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q18",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.7",
      "topic": "One-sided normal tolerance bound: decision and sample size"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "A random sample of 20 pipe-body tensile tests gives a mean yield strength of 74.6 ksi and a standard deviation of 2.1 ksi, and the data are approximately normal. The specified minimum yield strength is 68 ksi. A customer asks for 95% confidence that at least 99% of production meets the minimum. Using the factors shown, is the requirement demonstrated? If the sample mean and standard deviation stayed the same, what is the smallest tabled sample size that would demonstrate it?",
    "chart": {
      "type": "data-table",
      "title": "One-sided normal tolerance factors (95% confidence)",
      "columns": [
        "Sample size \\(n\\)",
        "\\(k\\) for 95% coverage",
        "\\(k\\) for 99% coverage"
      ],
      "rows": [
        [
          "15",
          "2.566",
          "3.520"
        ],
        [
          "20",
          "2.396",
          "3.295"
        ],
        [
          "25",
          "2.292",
          "3.158"
        ],
        [
          "30",
          "2.220",
          "3.064"
        ]
      ]
    },
    "options": [
      "Not demonstrated: the lower tolerance bound is 67.7 ksi. With the same mean and standard deviation, 30 is the smallest tabled sample size that would demonstrate it (68.2 ksi).",
      "Not demonstrated: the lower tolerance bound is 67.7 ksi. With the same mean and standard deviation, a sample of 25 would demonstrate it, because its bound rounds to 68.0 ksi.",
      "Demonstrated: the lower bound \\(\\bar{x} - 2.326s\\) is 69.7 ksi, so 99% of production exceeds 68 ksi with no further testing.",
      "Demonstrated: the 95% lower confidence bound on the mean is 73.8 ksi, well above 68 ksi, so no further testing is needed."
    ],
    "answer": 0,
    "why": "<p>The requirement is about the population (99% coverage) with 95% confidence, so it calls for a one-sided tolerance bound:</p><p>\\[\\begin{aligned}L &= \\bar{x} - k\\,s \\\\ L_{20} &= 74.6 - 3.295(2.1) \\\\ &= 67.68 \\\\ L_{25} &= 74.6 - 3.158(2.1) \\\\ &= 67.97 \\\\ L_{30} &= 74.6 - 3.064(2.1) \\\\ &= 68.17\\end{aligned}\\]</p><p>where \\(\\bar{x}\\) is the sample mean, \\(s\\) the sample standard deviation and \\(k\\) (subscript \\(n\\)) the tabled factor for 99% coverage at 95% confidence. The bound must reach 68 ksi, so \\(k \\le (74.6 - 68)/2.1 = 3.143\\). The factor for \\(n = 25\\) (3.158) is just above that: its bound of 67.97 ksi only rounds to 68.0. The smallest tabled size that passes is \\(n = 30\\).</p><p><b>A. Not demonstrated; \\(n = 30\\) is the smallest tabled size that would demonstrate it.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Confidence and Tolerance Intervals, Example 6.88 (confidence interval versus tolerance interval); Appendix I.1.</span></p>",
    "optionRationales": [
      "Correct. \\(L_{20} = 67.7\\) ksi fails; \\(k \\le 3.143\\) is first met at \\(n = 30\\) (\\(L = 68.17\\) ksi).",
      "\\(L_{25} = 74.6 - 3.158(2.1) = 67.97\\) ksi, which rounds to 68.0 but is still below the 68 ksi minimum. Compare unrounded values against a limit.",
      "\\(z_{0.01} = 2.326\\) gives the 1st percentile only if \\(\\mu\\) and \\(\\sigma\\) were known. With \\(n = 20\\), the tolerance factor 3.295 must be used.",
      "A confidence bound on the mean says where the average is, not where 99% of individual pipes are."
    ],
    "keyPoint": "Coverage of individuals with confidence needs a tolerance bound, \\(\\bar{x} - k\\,s\\). The largest allowable factor, \\((\\bar{x} - L_{\\text{spec}})/s\\), tells you the sample size needed.",
    "trap": "Rounding 67.97 to 68.0 and calling it a pass; using \\(z\\) or a confidence bound on the mean instead of the tolerance factor.",
    "formula": "\\(L = \\bar{x} - k(n, p, \\gamma)\\,s\\); demonstrated if \\(k \\le (\\bar{x} - L_{\\text{spec}})/s = 3.143\\)",
    "assumptions": [
      "Yield strength is normally distributed.",
      "The 20 tests are a random sample of production."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "tolerance interval",
      "tolerance factor",
      "confidence interval",
      "yield strength",
      "coverage",
      "sample size"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Confidence and Tolerance Intervals",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Confidence and tolerance intervals — normal",
        "example": "Example 6.88; Appendix I.1"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q19",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.7",
      "topic": "Using a lower confidence bound on Weibull reliability"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Software output interpretation, decision",
    "quantitative": true,
    "stem": "A program must show that a valve actuator has reliability of at least 0.90 at 900 hours, with 95% confidence. A Weibull analysis of test data produced the survival table shown; 900 hours is not tabulated. Interpolating linearly between tabulated times, which conclusion is correct?",
    "chart": {
      "type": "data-table",
      "title": "Distribution Analysis: Actuator — table of survival probabilities (Weibull)",
      "columns": [
        "Time (h)",
        "Reliability estimate",
        "95% lower bound (one-sided)"
      ],
      "rows": [
        [
          "500",
          "0.981",
          "0.952"
        ],
        [
          "750",
          "0.958",
          "0.912"
        ],
        [
          "1,000",
          "0.927",
          "0.874"
        ],
        [
          "1,250",
          "0.889",
          "0.826"
        ]
      ]
    },
    "options": [
      "Not demonstrated: the interpolated 95% lower bound at 900 h is about 0.889. The data support \\(R \\ge 0.90\\) at 95% confidence only to about 830 h.",
      "Demonstrated: the interpolated reliability estimate at 900 h is about 0.939, which exceeds 0.90.",
      "Demonstrated: the last tabulated time at or below 900 h is 750 h, where the 95% lower bound (0.912) exceeds 0.90.",
      "Not demonstrated: the requirement is judged at the next tabulated time, 1,000 h, where the lower bound (0.874) shows that 12.6% of actuators will fail."
    ],
    "answer": 0,
    "why": "<p>A requirement stated \"with 95% confidence\" is met only if the one-sided 95% lower confidence bound reaches the target at the required time. Interpolate the lower bound between 750 h and 1,000 h:</p><p>\\[\\begin{aligned}R_L(900) &\\approx 0.912 - 0.023 \\\\ &= 0.889 \\lt 0.90 \\\\ t^{*} &\\approx 750 + 79 \\\\ &= 829 \\text{ h}\\end{aligned}\\]</p><p>where \\(0.023 = (150/250)(0.912 - 0.874)\\) is the fall in the bound over the first 150 h of the 750 to 1,000 h step, \\(79 = 250(0.012/0.038)\\) is the time taken for the bound to fall the further 0.012 to 0.90, \\(R_L(t)\\) is the one-sided 95% lower confidence bound on reliability at time \\(t\\) and \\(t^{*}\\) is the time at which it falls to 0.90. The requirement is not demonstrated at 900 h, even though the point estimate there is about 0.94. More units or more test time would narrow the interval.</p><p><b>A. Not demonstrated at 900 h; supported only to about 830 h.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Confidence and Tolerance Intervals (Weibull, normal and lognormal intervals), Examples 6.83–6.84.</span></p>",
    "optionRationales": [
      "Correct. \\(R_L(900) \\approx 0.889 \\lt 0.90\\); the bound crosses 0.90 at about 830 h.",
      "A point estimate carries no confidence statement. The requirement explicitly asks for 95% confidence.",
      "Reliability falls with time, so passing at 750 h says nothing about 900 h. The check must be made at the required time.",
      "The conclusion is right but the reasoning is not. Judging at 1,000 h tests a harder requirement than the one asked, and a confidence bound is not a prediction that exactly 12.6% will fail."
    ],
    "keyPoint": "Compare the requirement with the lower confidence bound at the required time and confidence, not with the point estimate or a neighboring tabulated time.",
    "trap": "Accepting on the point estimate, or judging at the nearest tabulated time instead of the required time.",
    "formula": "Demonstrated if \\(R_L(t;\\,95\\%) \\ge R_{\\text{required}}\\) at the required \\(t\\)",
    "assumptions": [
      "The Weibull model fits the test data.",
      "Test conditions represent use conditions."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "confidence bound",
      "reliability demonstration",
      "Weibull",
      "point estimate",
      "interpolation"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Confidence and Tolerance Intervals",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Confidence intervals for reliability",
        "example": "Examples 6.83–6.84"
      }
    ]
  },
  {
    "qid": "cre:set-1:b02-q20",
    "set": 1,
    "batch": 2,
    "sub": "cre-statistics",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.5",
      "topic": "Representative and randomized sampling for a life test"
    },
    "difficulty": "Easy",
    "cognitive": "Apply",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A plastic pump housing is molded in a three-cavity tool on two shifts, using resin from two approved suppliers. Thirty housings will be selected for an accelerated life test that will support a field reliability claim. Which sampling approach is most appropriate?",
    "options": [
      "Select housings at random within each combination of cavity, shift and resin supplier, roughly in proportion to production.",
      "Use the first 30 housings molded after tool qualification, because they are closest to nominal dimensions.",
      "Use housings from the cavity with the best dimensional capability, to reduce noise in the test results.",
      "Use 30 housings from one shift and one resin lot, so that the test isolates the design from process variation."
    ],
    "answer": 0,
    "why": "<p>A field reliability claim must represent every source of variation the field will see. Stratifying by cavity, shift and resin supplier, then selecting at random within each stratum, keeps the sample representative and lets differences between strata show up. Each of the other plans picks a convenient or best-case subset and would bias the life estimate upward.</p><p><b>A. Random selection within each cavity, shift and resin combination.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Sampling Plans for Statistics and Reliability Testing (representative and randomized sampling).</span></p>",
    "optionRationales": [
      "Correct. Stratified random sampling covers the production variation that the reliability claim must include.",
      "Early, freshly qualified parts are a best-case convenience sample, not a picture of steady production.",
      "Choosing the best cavity biases the result upward and hides cavity-to-cavity effects.",
      "Removing process variation from the sample also removes it from the claim, which then no longer describes field units."
    ],
    "keyPoint": "Sample across every production stratum the claim covers, and randomize within each stratum.",
    "trap": "Picking convenient or best-case parts for a reliability claim.",
    "formula": null,
    "assumptions": [
      "All cavities, shifts and resin suppliers supply field units."
    ],
    "estimatedMinutes": 1,
    "keywords": [
      "representative sampling",
      "stratified random sampling",
      "life test planning",
      "bias"
    ],
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "sourceSection": "Chapter 6 - Sampling Plans for Statistics and Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Sampling plans — representative and randomized sampling",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q21",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.1",
      "topic": "Limits of warranty data as a reliability source"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "Warranty claims for a water-heater control are shown by month in service, per 1,000 units in service. The warranty lasts 12 months. What is the best interpretation of the drop after month 12, and what should the reliability engineer do next?",
    "chart": {
      "type": "cre-xy-plot",
      "eyebrow": "Warranty claims by age",
      "title": "Claims per 1,000 units in service",
      "altText": "Claims per 1,000 units in service against month in service from 1 to 18. Claims start at 9.5 in month 1, fall to about 2.4 by month 5, rise steadily from 2.4 in month 7 to 3.5 in month 12, then drop to between 0.3 and 0.6 from month 13 to month 18. A marker shows that the 12-month warranty ends at month 12.",
      "xTicks": [
        0,
        3,
        6,
        9,
        12,
        15,
        18
      ],
      "yTicks": [
        0,
        2,
        4,
        6,
        8,
        10
      ],
      "series": [
        {
          "label": "Claims per 1,000",
          "points": [
            [
              1,
              9.5
            ],
            [
              2,
              5.1
            ],
            [
              3,
              3.2
            ],
            [
              4,
              2.6
            ],
            [
              5,
              2.4
            ],
            [
              6,
              2.5
            ],
            [
              7,
              2.4
            ],
            [
              8,
              2.6
            ],
            [
              9,
              2.8
            ],
            [
              10,
              3.0
            ],
            [
              11,
              3.2
            ],
            [
              12,
              3.5
            ],
            [
              13,
              0.6
            ],
            [
              14,
              0.4
            ],
            [
              15,
              0.5
            ],
            [
              16,
              0.3
            ],
            [
              17,
              0.4
            ],
            [
              18,
              0.3
            ]
          ]
        }
      ],
      "markers": [
        {
          "x": 12,
          "y": 3.5,
          "label": "Warranty ends"
        }
      ],
      "xLabel": "Month in service",
      "yLabel": "Claims per 1,000 units"
    },
    "options": [
      "The control enters its useful-life period after 12 months, so its hazard falls; no further action is needed.",
      "Claims stop being captured when warranty coverage ends. The rise in months 7 to 12 suggests wear-out, so gather post-warranty field or service data before judging late-life reliability.",
      "Claims stop being captured when warranty coverage ends. Months 5 to 12 are a stable useful-life period, so fit an exponential model to those months and extrapolate it past the warranty.",
      "Infant mortality ends at month 12, so the low rate after that is the true constant failure rate."
    ],
    "answer": 1,
    "why": "<p>The drop happens at exactly the age where warranty coverage ends, for every production lot, so it reflects the data source, not the product. Failures after month 12 are no longer claimed, so warranty data are effectively censored at 12 months. The rising rate from month 7 to month 12 is the real signal: it points to an emerging wear-out mechanism. Service records, parts sales, telemetry or a field follow-up study are needed to see late-life behavior.</p><p><b>B. Coverage ends, so claims stop; gather post-warranty data before judging late life.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Sources and Uses of Reliability Data — warranty data and field service data.</span></p>",
    "optionRationales": [
      "The rate was rising, not falling, from month 7 to month 12. Nothing in the product changes at month 13; only the reporting does.",
      "Correct. The cliff coincides with the end of coverage, and the pre-cliff trend points to wear-out.",
      "The censoring diagnosis is right, but the hazard is not stable: claims rise steadily from 2.4 to 3.5 per 1,000 between months 7 and 12. An exponential (constant-rate) extrapolation would understate late-life failures.",
      "The early-life decline ended by about month 5. The drop at month 12 is a reporting cutoff, not a change in hazard."
    ],
    "keyPoint": "Warranty data stop at the end of coverage; a drop at that age is a data artifact, not a reliability improvement.",
    "trap": "Reading the end of warranty reporting as a falling hazard or a design fix.",
    "formula": null,
    "assumptions": [
      "Claims are counted by age in service, and coverage is the same for all units."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "warranty data",
      "field data",
      "censoring",
      "wear-out",
      "data source limitations"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Sources and uses of reliability data — warranty data",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q22",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.1",
      "topic": "Normalizing field failures by exposure and comparing rates"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Two product lines of a pump controller are compared using field returns and operating hours from IoT telemetry. Returns diagnosed as \"no fault found\" (NFF) are not failures. Which line has the higher field failure rate, and is the difference statistically significant at the 5% level?",
    "chart": {
      "type": "data-table",
      "title": "Field data by product line",
      "columns": [
        "Product line",
        "Units in service",
        "Mean operating hours (telemetry)",
        "Returns",
        "No fault found"
      ],
      "rows": [
        [
          "Line A",
          "600",
          "1,200",
          "38",
          "8"
        ],
        [
          "Line B",
          "1,500",
          "400",
          "52",
          "7"
        ]
      ]
    },
    "options": [
      "Line A, because 5.0% of its units have failed, versus 3.0% for Line B; the difference is significant.",
      "Line B, with 86.7 versus 52.8 failures per \\(10^{6}\\) unit-hours; the difference is significant.",
      "Line B, with 75.0 versus 41.7 confirmed failures per \\(10^{6}\\) unit-hours; the difference is significant at the 5% level (\\(z \\approx 2.5\\)).",
      "Line B, with 75.0 versus 41.7 confirmed failures per \\(10^{6}\\) unit-hours, but the difference is not significant at the 5% level, because the two 95% confidence intervals for the rates overlap."
    ],
    "answer": 2,
    "why": "<p>Compare failure rates per unit of exposure, using confirmed failures only:</p><p>\\[\\begin{aligned}T_A &= 600(1200) = 720000 \\\\ T_B &= 1500(400) = 600000 \\\\ \\lambda_A &= \\frac{38 - 8}{720000} = 41.7 \\times 10^{-6} \\\\ \\lambda_B &= \\frac{52 - 7}{600000} = 75.0 \\times 10^{-6}\\end{aligned}\\]</p><p>where \\(T\\) is total unit-hours in service and \\(\\lambda\\) is confirmed failures per unit-hour. To test whether the rates differ, condition on the 75 confirmed failures. If the rates were equal, each failure would fall in Line B with probability equal to Line B’s share of the exposure:</p><p>\\[\\begin{aligned}\\pi_0 &= \\frac{600000}{1320000} = 0.4545 \\\\ E &= 75(0.4545) = 34.1 \\\\ z &= \\frac{45 - 34.1}{\\sqrt{75(0.4545)(0.5455)}} \\\\ &= \\frac{10.9}{4.31} = 2.53\\end{aligned}\\]</p><p>where \\(\\pi_0\\) is Line B’s share of total exposure, \\(E\\) the expected number of Line B failures under equal rates and \\(z\\) the normal-approximation test statistic. Since \\(2.53 \\gt 1.96\\) (two-sided \\(p \\approx 0.011\\); the exact binomial test gives 0.014), Line B’s rate is significantly higher. The individual 95% intervals (about 28 to 59 and 55 to 100 per \\(10^{6}\\) h) do overlap, but overlapping intervals do not show that two rates are equal.</p><p><b>C. Line B, 75.0 versus 41.7 per \\(10^{6}\\) unit-hours; significant (\\(z \\approx 2.5\\)).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Sources and Uses of Reliability Data — IoT and big data; data normalization. Ch. 6, Hypothesis Testing and Interval Estimation Methodology Overview.</span></p>",
    "optionRationales": [
      "Fraction of units failed ignores how long the units have run. Line A has three times the exposure per unit.",
      "Counts NFF returns as failures. NFF units were returned but had no confirmed fault.",
      "Correct. \\(\\lambda_B/\\lambda_A = 1.8\\), and the conditional test gives \\(z = 2.53\\), \\(p \\approx 0.01\\).",
      "Overlap of two separate 95% intervals is a much stricter test than a direct comparison. The direct test of the difference gives \\(z = 2.53\\), \\(p \\approx 0.01\\)."
    ],
    "keyPoint": "Normalize field failures by exposure, exclude NFF, and compare rates with a direct test; overlapping confidence intervals do not prove equality.",
    "trap": "Using fraction failed, counting NFF returns, or reading overlapping confidence intervals as \"no difference\".",
    "formula": "\\(\\lambda = r/T\\); \\(z = (r_B - r\\pi_0)/\\sqrt{r\\pi_0(1 - \\pi_0)}\\), \\(\\pi_0 = T_B/(T_A + T_B)\\)",
    "assumptions": [
      "Telemetry hours are accurate and failures follow a roughly constant rate over the exposure observed.",
      "Failures are independent across units."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "normalization",
      "exposure",
      "failure rate",
      "IoT telemetry",
      "no fault found",
      "comparing rates"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Sources and uses of reliability data — IoT and normalization",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q23",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.2",
      "topic": "Classifying censored data from periodic inspections"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "Seven actuators were life-tested. The stand was scheduled to check each unit at 250, 500, 750 and 1,000 hours, and a failure alarm also recorded the exact time of some failures. How should the results be entered for life-data analysis?",
    "chart": {
      "type": "data-table",
      "title": "Actuator life test log",
      "columns": [
        "Unit",
        "Finding"
      ],
      "rows": [
        [
          "U1",
          "Found failed at the 250 h inspection"
        ],
        [
          "U2",
          "Running at 250 h; found failed at 500 h"
        ],
        [
          "U3",
          "Failure alarm logged at 610 h"
        ],
        [
          "U4",
          "Running at every inspection; test ended at 1,000 h"
        ],
        [
          "U5",
          "Removed at 400 h for an unrelated fixture fault"
        ],
        [
          "U6",
          "Running at 750 h; found failed at 1,000 h"
        ],
        [
          "U7",
          "Stand outage: the 250 h inspection was skipped; found failed at 500 h"
        ]
      ]
    },
    "options": [
      "U1 and U7 are left-censored (at 250 h and 500 h); U2 and U6 are interval-censored; U3 is an exact failure; U4 and U5 are right-censored (at 1,000 h and 400 h).",
      "U1 is left-censored at 250 h; U2, U6 and U7 are interval-censored (U7 between 250 h and 500 h); U3 is an exact failure; U4 and U5 are right-censored.",
      "U1 and U7 are left-censored (at 250 h and 500 h); U2 and U6 are interval-censored; U3 is an exact failure; U4 is right-censored; U5 is dropped because its removal was unrelated to the failure mode.",
      "U1 and U7 are left-censored (at 250 h and 500 h); U2 and U6 are interval-censored; U3 is an exact failure; U4 is right-censored at 1,000 h and U5 at 250 h, its last passed inspection."
    ],
    "answer": 0,
    "why": "<p>Each record must say only what is known. U1 failed some time before its first check (left-censored at 250 h). U7 was never checked at 250 h, so its failure is only known to fall before 500 h: it is left-censored at 500 h, not interval-censored between 250 h and 500 h. U2 failed between 250 h and 500 h, and U6 between 750 h and 1,000 h (interval-censored). U3’s alarm gives an exact time. U4 survived the whole test, and U5 was removed while still working at 400 h, so both are right-censored (suspensions) at their own removal times. Suspensions stay in the analysis: they carry information that the unit survived to that time.</p><p><b>A. U1 and U7 left; U2 and U6 interval; U3 exact; U4 and U5 right-censored.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Types of Data — censored and complete data.</span></p>",
    "optionRationales": [
      "Correct. Each unit is entered with exactly what is known about its failure time: before 250 h (U1), before 500 h (U7), within an inspection interval (U2, U6), exactly (U3), or after the removal time (U4, U5).",
      "U7 was never seen running at 250 h, so its failure could have happened at any time before 500 h. Placing it in 250 to 500 h assumes an inspection that did not happen.",
      "Dropping U5 throws away the information that it survived 400 h and biases the life estimate downward. Removal for an unrelated reason is a right-censored suspension.",
      "U5 was running when it was removed at 400 h, so it is right-censored at 400 h. Censoring it at 250 h discards 150 h of known survival."
    ],
    "keyPoint": "Exact, right-, left- and interval-censored records each carry different information; keep suspensions in the analysis.",
    "trap": "Using the inspection time as the failure time, or deleting units that were removed without failing.",
    "formula": null,
    "assumptions": [
      "Unit U5’s removal was unrelated to its condition (non-informative censoring)."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "censoring",
      "interval censoring",
      "left censoring",
      "suspensions",
      "life data"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Types of data — censored and complete data",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q24",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.2",
      "topic": "Cox proportional hazards: confidence interval and break-even covariate value"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Software output interpretation, calculation",
    "quantitative": true,
    "stem": "A Cox proportional hazards model was fitted to valve-seat life data with suspensions, using coating and operating temperature as covariates. What is the 95% confidence interval for the hazard ratio of the new coating, and above what operating temperature does a new-coating valve have a higher hazard than an old-coating valve at 60 °C?",
    "chart": {
      "type": "data-table",
      "title": "Cox regression: valve-seat life",
      "columns": [
        "Term",
        "coef",
        "exp(coef)",
        "SE(coef)",
        "p"
      ],
      "rows": [
        [
          "New coating (1 = yes, 0 = no)",
          "−0.693",
          "0.500",
          "0.210",
          "0.001"
        ],
        [
          "Temperature (per 10 °C above 60 °C)",
          "0.405",
          "1.499",
          "0.150",
          "0.007"
        ]
      ]
    },
    "options": [
      "Coating hazard ratio 0.33 to 0.75; above about 70 °C.",
      "Coating hazard ratio 0.33 to 0.75; above about 77 °C.",
      "Coating hazard ratio 0.09 to 0.91; above about 77 °C.",
      "Coating hazard ratio 0.33 to 0.75; above about 80 °C."
    ],
    "answer": 1,
    "why": "<p>Cox model confidence intervals are built on the coefficient scale and then exponentiated:</p><p>\\[\\begin{aligned}\\hat{\\beta} &= -0.693 \\pm 0.412 \\\\ &= (-1.105,\\; -0.281) \\\\ e^{-1.105} &= 0.33 \\\\ e^{-0.281} &= 0.75\\end{aligned}\\]</p><p>where \\(\\hat{\\beta} = -0.693\\) is the coating coefficient and \\(0.412 = 1.96 \\times 0.210\\) is \\(z_{0.025}\\) times its standard error. Exponentiating the two ends gives the hazard-ratio interval, 0.33 to 0.75. The interval excludes 1, so the coating benefit is significant. Covariate effects add on the log-hazard scale, so the new coating breaks even when the temperature term cancels it, \\(-0.693 + 0.405\\,x = 0\\):</p><p>\\[\\begin{aligned}0.405\\,x &= 0.693 \\\\ x &= 1.71 \\\\ T &= 60 + 10x \\\\ &= 77 \\text{ °C}\\end{aligned}\\]</p><p>where \\(x\\) is the number of 10 °C steps above 60 °C and \\(T\\) the break-even operating temperature. Above about 77 °C, the extra temperature more than offsets the coating’s halving of the hazard.</p><p><b>B. 0.33 to 0.75; above about 77 °C.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Types of Data — data analysis tools (survival analysis and the Cox proportional hazards model).</span></p>",
    "optionRationales": [
      "Assumes one 10 °C step (a 50% increase) cancels the coating’s 50% reduction. On the hazard scale that gives \\(0.5 \\times 1.5 = 0.75\\), not 1.",
      "Correct. \\(\\exp(-0.693 \\pm 1.96 \\times 0.210) = (0.33, 0.75)\\), and \\(0.693/0.405 = 1.71\\) steps, so about 77 °C.",
      "Applies \\(\\pm 1.96\\,\\text{SE}\\) to \\(\\exp(\\text{coef})\\) instead of to the coefficient: \\(0.500 \\pm 0.41\\). Cox intervals are symmetric on the log scale, not the hazard-ratio scale.",
      "Treats the temperature effect as adding 50% of the baseline per step (\\(0.5[1 + 0.5x] = 1\\) gives \\(x = 2\\)). Effects multiply: \\(0.5 \\times 1.499^{x} = 1\\) gives \\(x = 1.71\\)."
    ],
    "keyPoint": "In a Cox model, effects add on the log-hazard scale and multiply on the hazard-ratio scale. Build confidence intervals on the coefficient and exponentiate.",
    "trap": "Building the interval on exp(coef), or treating hazard-ratio effects as additive.",
    "formula": "\\(\\text{HR} = \\exp(\\sum \\beta_j x_j)\\); 95% CI \\(= \\exp(\\hat{\\beta} \\pm 1.96\\,\\text{SE})\\)",
    "assumptions": [
      "The proportional-hazards assumption holds for both covariates.",
      "The temperature effect is log-linear across 60 °C to 80 °C."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "Cox proportional hazards",
      "hazard ratio",
      "confidence interval",
      "covariates",
      "survival analysis"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Types of data — survival analysis and the Cox model",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q25",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.2",
      "topic": "Scales of measurement"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "An engineer computes an Arrhenius acceleration factor between a 125 °C test and 55 °C use. A colleague asks why the temperatures must be converted to kelvin first. Which statement gives the correct reason?",
    "options": [
      "Kelvin values are larger numbers, which reduces rounding error in the exponent.",
      "The Boltzmann constant is published only in SI units, so any SI temperature unit would work.",
      "Celsius is an ordinal scale, so even differences between Celsius temperatures are not meaningful.",
      "Celsius is an interval scale with an arbitrary zero, so ratios of Celsius temperatures are meaningless; the Arrhenius model needs absolute temperature on a ratio scale."
    ],
    "answer": 3,
    "why": "<p>Celsius has an arbitrary zero, so it is an interval scale: differences are meaningful but ratios and reciprocals are not. The Arrhenius model uses \\(1/T\\), which needs absolute temperature, a ratio scale with a true zero: \\(T_{\\text{K}} = T_{^{\\circ}\\text{C}} + 273.15\\).</p><p><b>D. Celsius is an interval scale; the model needs a ratio scale (kelvin).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Types of Data — measurement scales (Table 7.4).</span></p>",
    "optionRationales": [
      "Rounding is not the issue; a model using \\(1/T\\) in Celsius gives wrong answers, not imprecise ones.",
      "Celsius is also an SI-derived unit. The issue is the zero point, not the unit system.",
      "Celsius is interval, not ordinal: differences such as 10 °C are meaningful.",
      "Correct. Ratios and reciprocals of temperature need an absolute (ratio-scale) temperature."
    ],
    "keyPoint": "Match the analysis to the measurement scale: ratios need a ratio scale with a true zero.",
    "trap": "Treating Celsius as a ratio scale, or confusing interval with ordinal.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "measurement scales",
      "interval scale",
      "ratio scale",
      "Arrhenius",
      "absolute temperature"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Types of data — measurement scales",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q26",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.3",
      "topic": "Choosing a data collection method for time-to-failure data"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A reliability engineer needs time-to-failure data for the main bearings in a fleet of 40 wind turbines. Today, site technicians record failures in a monthly paper report with the date only and a free-text description. Which change best meets the analysis need?",
    "options": [
      "Add each turbine’s operating hours, read from its hour meter, to the monthly paper report, and keep the free-text description so that technicians can describe each failure in their own words.",
      "Capture each stoppage automatically from the turbine controller with a time stamp and operating hours, and record the failure mode from a defined code list in the maintenance system.",
      "Move the paper report from monthly to weekly so that the failure dates are more accurate.",
      "Use the turbine manufacturer’s warranty claims as the time-to-failure source."
    ],
    "answer": 1,
    "why": "<p>Life-data analysis needs operating time to failure (or to suspension) for every unit, and a consistent failure-mode classification. Automated capture from the controller gives exact, time-stamped operating hours without transcription error, and a defined code list makes modes comparable across sites. The other options keep the recall, calendar-time or coverage problems.</p><p><b>B. Automated, time-stamped capture with operating hours and coded failure modes.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Data Collection Methods; Sources and Uses of Reliability Data — manual versus automated systems.</span></p>",
    "optionRationales": [
      "This adds the time base but keeps manual monthly transcription and free-text failure descriptions. Bearing failures cannot be reliably separated by mode, so the life data would mix mechanisms.",
      "Correct. It records operating time and a consistent failure mode for every event.",
      "More frequent paper reports improve dates a little but still miss operating hours and consistent coding.",
      "Warranty claims stop at the end of coverage and rarely record operating hours, so most bearing life would be censored."
    ],
    "keyPoint": "Choose collection methods that capture operating time to failure, suspensions and coded failure modes for every unit.",
    "trap": "Settling for calendar dates, recall or warranty data when operating-hour data can be captured automatically.",
    "formula": null,
    "assumptions": [
      "The turbine controllers log stoppages and operating hours."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "data collection",
      "automated monitoring",
      "CMMS",
      "failure codes",
      "operating hours"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Data collection methods",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q27",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.4",
      "topic": "Bad actor analysis with a Pareto cut"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A plant loses production whenever a transfer pump is down for an unplanned repair. Over the last year the eight pumps recorded the data shown. A bad actor analysis ranks the pumps by unplanned downtime and targets the pumps at the top of the Pareto, down to the point where they account for at least 70% of unplanned downtime. Which pumps should it target?",
    "chart": {
      "type": "data-table",
      "title": "Transfer pumps — last 12 months",
      "columns": [
        "Pump",
        "Failures",
        "Total downtime (h)",
        "Planned overhaul (h)",
        "Unplanned MTTR (h)"
      ],
      "rows": [
        [
          "P-101",
          "14",
          "120",
          "0",
          "8.6"
        ],
        [
          "P-102",
          "6",
          "45",
          "0",
          "7.5"
        ],
        [
          "P-103",
          "5",
          "310",
          "150",
          "32.0"
        ],
        [
          "P-104",
          "3",
          "30",
          "0",
          "10.0"
        ],
        [
          "P-105",
          "4",
          "260",
          "0",
          "65.0"
        ],
        [
          "P-106",
          "9",
          "55",
          "0",
          "6.1"
        ],
        [
          "P-107",
          "2",
          "25",
          "0",
          "12.5"
        ],
        [
          "P-108",
          "7",
          "155",
          "0",
          "22.1"
        ]
      ]
    },
    "options": [
      "P-101, P-106 and P-108, the pumps with the most failures.",
      "P-103, P-105 and P-108, which account for 72.5% of total downtime.",
      "P-105, P-103, P-108 and P-101.",
      "P-105, P-103, P-108 and P-107, the four pumps with the longest unplanned MTTR."
    ],
    "answer": 2,
    "why": "<p>Remove the planned overhaul hours, rank by unplanned downtime, and accumulate:</p><p>\\[\\begin{aligned}\\text{Unplanned} &= 1000 - 150 \\\\ &= 850 \\text{ h} \\\\ \\text{P-105} &= 260 \\;(30.6\\%) \\\\ +\\,\\text{P-103} &= 420 \\;(49.4\\%) \\\\ +\\,\\text{P-108} &= 575 \\;(67.6\\%) \\\\ +\\,\\text{P-101} &= 695 \\;(81.8\\%)\\end{aligned}\\]</p><p>where each line is the cumulative unplanned downtime in hours and its share of 850 h. The top three reach only 67.6%, so P-101 is needed to pass 70%. P-101 has a short repair time but fails most often (14 times), so its downtime comes from frequency rather than duration.</p><p><b>C. P-105, P-103, P-108 and P-101.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Data Use — bad actor analysis; Pareto analysis.</span></p>",
    "optionRationales": [
      "Failure count ignores repair duration. P-106 has 9 failures but only 55 h of downtime.",
      "Includes P-103’s 150 h planned overhaul, which does not count as lost production. On unplanned downtime these three pumps reach only 67.6%.",
      "Correct. Ranked by unplanned downtime, the cumulative share reaches 81.8% at the fourth pump, P-101.",
      "MTTR ranks repair duration per failure and ignores how often a pump fails. P-107 (25 h) contributes far less downtime than P-101 (120 h)."
    ],
    "keyPoint": "Rank bad actors by the loss that matters (unplanned downtime), after removing planned work, then cut the Pareto at the stated threshold.",
    "trap": "Including planned overhaul hours, or ranking by failure count or MTTR instead of downtime.",
    "formula": "Cumulative share \\(= \\sum_{\\text{ranked}} \\text{downtime}_i / \\sum \\text{downtime}\\)",
    "assumptions": [
      "Lost production is proportional to unplanned downtime; planned overhauls are scheduled during planned outages."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "bad actor analysis",
      "Pareto",
      "downtime",
      "MTTR",
      "planned maintenance",
      "prioritization"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Data summary and reporting — bad actor analysis",
        "example": "Examples 7.1, 7.4"
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q28",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.2",
      "topic": "Life table from a Nevada chart"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The Nevada chart shows warranty claims for a small appliance by production month and claim month. Units ship at the start of their production month, every claim is a failure, each claimed unit leaves the population at risk (it is not replaced), and data are complete through April 30. Pooling all cohorts by month in service (life-table method), what is the estimated probability that a unit fails within its first three months in service?",
    "chart": {
      "type": "data-table",
      "title": "Nevada chart: warranty claims",
      "columns": [
        "Production month",
        "Units shipped",
        "Claims in Jan",
        "Claims in Feb",
        "Claims in Mar",
        "Claims in Apr"
      ],
      "rows": [
        [
          "Jan",
          "1,000",
          "80",
          "50",
          "40",
          "30"
        ],
        [
          "Feb",
          "1,000",
          "—",
          "90",
          "45",
          "35"
        ],
        [
          "Mar",
          "1,000",
          "—",
          "—",
          "70",
          "55"
        ],
        [
          "Apr",
          "1,000",
          "—",
          "—",
          "—",
          "100"
        ]
      ]
    },
    "options": [
      "14.88%",
      "16.33%",
      "17.21%",
      "18.26%"
    ],
    "answer": 2,
    "why": "<p>Read each row along its diagonal to convert claim months into months in service. Then, for each month in service, divide the claims by the units still at risk from every cohort that has reached that age:</p><p>Month 1: all four cohorts are at risk (4,000 units) and 80 + 90 + 70 + 100 = 340 fail. Month 2: only the January to March cohorts have reached it; 920 + 910 + 930 = 2,760 are still at risk and 50 + 45 + 55 = 150 fail. Month 3: only January and February; 870 + 865 = 1,735 at risk and 40 + 35 = 75 fail.</p><p>\\[\\begin{aligned}h_1 &= 340/4000 = 0.0850 \\\\ h_2 &= 150/2760 = 0.0543 \\\\ h_3 &= 75/1735 = 0.0432\\end{aligned}\\]</p><p>\\[\\begin{aligned}F(3) &= 1 - \\prod_{j=1}^{3}(1 - h_j) \\\\ &= 1 - 0.8279 \\\\ &= 0.1721\\end{aligned}\\]</p><p>where \\(h_j\\) is the conditional probability of failing in month \\(j\\) of service, given survival to its start, \\(F(3)\\) is the probability of failing within three months, and \\(0.915 \\times 0.9457 \\times 0.9568 = 0.8279\\). The April cohort contributes only to \\(h_1\\), and the March cohort only to \\(h_1\\) and \\(h_2\\).</p><p><b>C. 17.21%</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Types of Data — data analysis tools (Nevada chart analysis, survival analysis, Table 7.6).</span></p>",
    "optionRationales": [
      "\\(595/4000\\): all claims over all units, mixing cohorts that have had one to four months of exposure.",
      "Uses units shipped as each denominator (\\(150/3000\\), \\(75/2000\\)) instead of the units still at risk.",
      "Correct. \\(1 - (0.915)(0.9457)(0.9568) = 0.1721\\).",
      "Adds the monthly hazards (\\(0.0850 + 0.0543 + 0.0432\\)). Conditional probabilities must be combined through survival, not summed."
    ],
    "keyPoint": "Turn a Nevada chart into age-based hazards with the correct risk set at each age, then multiply survival probabilities.",
    "trap": "Dividing by units shipped instead of units at risk, mixing exposure ages, or summing conditional probabilities.",
    "formula": "\\(F(k) = 1 - \\prod_{j=1}^{k}(1 - h_j)\\), \\(h_j = d_j/n_j\\)",
    "assumptions": [
      "Claims are first failures and each claimed unit leaves the risk set.",
      "Censoring happens only at the April 30 data cutoff."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "Nevada chart",
      "life table",
      "warranty analysis",
      "hazard",
      "risk set"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Types of data — Nevada chart analysis",
        "example": "Table 7.6"
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q29",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.5",
      "topic": "Selecting a failure analysis technique"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "Several molded power modules failed thermal cycling with intermittent open circuits. The failure analyst suspects delamination between the mold compound and the die paddle and wants to confirm it without opening the packages. Which technique should be used first?",
    "options": [
      "Scanning acoustic microscopy (SAM).",
      "Scanning electron microscopy (SEM) of a polished cross-section.",
      "X-ray radiography of the modules.",
      "Infrared thermography of a powered module."
    ],
    "answer": 0,
    "why": "<p>SAM sends ultrasound through the package and images internal interfaces. An air gap at a delaminated interface reflects strongly, so SAM shows delamination nondestructively and maps where it is. Destructive methods such as cross-sectioning and SEM come later, once SAM has shown where to cut.</p><p><b>A. Scanning acoustic microscopy (SAM).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Failure Analysis Methods (SEM, SAM, infrared inspection, radiography, mechanical testing).</span></p>",
    "optionRationales": [
      "Correct. SAM detects internal delamination without opening the package.",
      "SEM needs a cross-section, which destroys the evidence elsewhere in the part. Use it after SAM locates the defect.",
      "X-ray is non-destructive and shows wire bonds and die-attach voids well, but a delamination is a very thin air gap with almost no density contrast, so X-ray usually misses it. SAM is highly sensitive to such gaps.",
      "Infrared thermography finds hot spots on a powered part; it cannot reliably image a thin internal gap, especially one that only opens intermittently."
    ],
    "keyPoint": "Start failure analysis with nondestructive methods matched to the suspected mechanism; SAM is the standard tool for package delamination.",
    "trap": "Jumping to a destructive method before nondestructive inspection has located the defect.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "failure analysis",
      "scanning acoustic microscopy",
      "delamination",
      "nondestructive testing",
      "SEM"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Failure analysis methods",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b03-q30",
    "set": 1,
    "batch": 3,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.6",
      "topic": "Closing the FRACAS loop"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "The FRACAS summary for a hospital medication cart is shown. Leadership asks why the same failures keep returning even though every report is closed. Which assessment is most complete?",
    "chart": {
      "type": "data-table",
      "title": "FRACAS summary — medication cart",
      "columns": [
        "Report",
        "Failure mode",
        "Root cause recorded",
        "Action taken",
        "Closed on",
        "Recurrences since closure"
      ],
      "rows": [
        [
          "FR-211",
          "Drawer seal leak",
          "O-ring compound swells in the cleaning agent",
          "O-ring material changed",
          "Implementation",
          "3"
        ],
        [
          "FR-214",
          "Connector fretting",
          "Not determined",
          "Connectors replaced on affected carts",
          "Implementation",
          "2"
        ],
        [
          "FR-219",
          "Caster bearing noise",
          "Defective supplier lot",
          "Lot quarantined",
          "Implementation",
          "4"
        ],
        [
          "FR-222",
          "Display flicker",
          "Firmware timing race",
          "Firmware 2.3 released",
          "30-day field check passed",
          "0"
        ]
      ]
    },
    "options": [
      "Technicians should report minor issues too, so that recurrence trends show up sooner in the FRACAS database.",
      "Every recurring report was closed at implementation. Adding a 30-day effectiveness check before closure will fix the problem, because the root causes and actions recorded are adequate.",
      "FR-219 should be escalated to the supplier with a corrective action request, because a bad lot is a supplier problem. The other recurrences are random and need no further action.",
      "Close reports only after effectiveness is verified with data, and reopen FR-214 and FR-219 for root-cause analysis: connector replacement is remedial and lot quarantine is containment."
    ],
    "answer": 3,
    "why": "<p>Two separate weaknesses show in the table. First, the closure rule: every recurring report closed at implementation, while the only report verified in the field (FR-222) has not recurred. Second, the actions themselves: FR-214 has no root cause and only replaced parts (a remedial action), and FR-219 quarantined one lot (containment), which protects against that lot but not against the next one. FR-211 has a plausible root cause, but three recurrences show the action is not effective. Verification before closure would have caught this.</p><p><b>D. Verify effectiveness before closure, and reopen the reports whose actions were remedial or containment only.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Failure Reporting, Analysis, and Corrective Action System (FRACAS), Example 7.7.</span></p>",
    "optionRationales": [
      "More reports do not stop recurrence; the loop is not being closed on the reports already raised.",
      "Verification would expose the problem but not fix it. FR-214 and FR-219 record no root-cause correction, so a 30-day check would simply fail.",
      "FR-219 does need a supplier corrective action, but FR-211 and FR-214 recur for systematic reasons: an ineffective action and an undetermined root cause.",
      "Correct. It fixes the closure rule and identifies that two of the actions were never corrective in the first place."
    ],
    "keyPoint": "A FRACAS closes the loop only when a root-cause corrective action is verified effective. Remedial repairs and containment do not prevent recurrence.",
    "trap": "Treating parts replacement or lot quarantine as corrective action, or assuming that adding a verification step alone fixes recurrence.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 3,
    "keywords": [
      "FRACAS",
      "closed loop",
      "corrective action",
      "containment",
      "remedial action",
      "effectiveness verification"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "FRACAS",
        "example": "Example 7.7"
      }
    ]
  }
];
})(window);
