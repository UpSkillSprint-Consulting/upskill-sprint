/*
 * ASQ CRE Exam Set 1 — original questions written to the 2025 CRE Body of Knowledge.
 * Batch 1 of 15: III.A.1–III.A.3 (basic statistics, probability, distributions).
 * Batch 2 of 15: III.A.4–III.A.7 (probability functions, sampling plans, SPC/capability,
 *                confidence and tolerance intervals).
 * Batch 3 of 15: III.B.1–III.B.6 (data management).
 * Batch 4 of 15: III remainder (III.A.1, A.3, A.7; III.B.4) and IV.A.1–IV.A.5 (reliability planning).
 * Batch 5 of 15: IV.A.1–IV.A.2 (test strategy, HALT, attribute data) and IV.B.1–IV.B.6 (reliability testing).
 * Batch 6 of 15: IV.B.1–IV.B.6 (accelerated, screening, demonstration, degradation, software) and IV.C.1–IV.C.2.
 * Batch 7 of 15: IV.C.1–IV.C.5 (block diagrams, physics of failure, failure models, prediction, prototyping).
 * Batch 8 of 15: II.A.1–II.A.3 (identification) and II.B.1–II.B.3, II.B.5 (FTA, FMEA/FMECA, common cause, risk matrix).
 * Batch 9 of 15: II.A.1–II.A.3 (PRA, risk evaluation, risk types) and II.B.1–II.B.6 (FTA, FHA, FMEA, common cause, design trade-offs).
 * Batch 10 of 15: II.C (mitigation: 4 Ts, ALARP/ALARA/ALAP, residual and secondary risk) and I.A.2, I.A.5, I.A.7–I.A.9 (leadership foundations).
 * Batch 11 of 15: I.A.1, I.A.3, I.A.4, I.A.6, I.A.9 (leadership foundations) and I.B.1–I.B.4 (terminology, requirements, CAPA, RCA).
 * Batch 12 of 15: I.B.1, I.B.3–I.B.10 (lifecycle cost, maintainability economics, cost of poor reliability, quality triangle, DMAIC, systems integration).
 * Batch 13 of 15: I.A.5, I.A.7, I.B.1, I.B.2 (Domain I complete) and V.A.1–V.A.5 (verification, stress-strength, DOE, optimization, human factors).
 * Batch 14 of 15: V.A.3, V.A.6, V.A.7 (DOE, testability, FEA), V.B.1–V.B.2 (derating, COTS, RCM) and V.C.1–V.C.2 (spares, repair or replace, proof testing).
 * Batch 15 of 15: V.A.1–V.A.3, V.A.7 (evaluation types, lognormal interference, ANOVA, cascading targets), V.B.2 and V.C.1–V.C.3 (warranties, PM, MTTR allocation, crews). Set 1 complete at 150.
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
  },
  {
    "qid": "cre:set-1:b04-q31",
    "set": 1,
    "batch": 4,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.1",
      "topic": "Nonparametric (Kaplan–Meier) versus parametric estimation"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "Ten units of a new shaft seal were put on a 1,000-hour test. The log is shown. The customer asks for two figures: the reliability at 1,000 hours, and the reliability at the 5,000-hour service interval. Which response is correct?",
    "chart": {
      "type": "data-table",
      "title": "Shaft seal test log",
      "columns": [
        "Unit",
        "Hours",
        "Status"
      ],
      "rows": [
        [
          "S1",
          "310",
          "Failed"
        ],
        [
          "S2",
          "400",
          "Removed: test rig fault (seal still working)"
        ],
        [
          "S3",
          "520",
          "Failed"
        ],
        [
          "S4",
          "650",
          "Removed for a teardown inspection (seal still working)"
        ],
        [
          "S5",
          "780",
          "Failed"
        ],
        [
          "S6 to S10",
          "1,000",
          "Running when the test ended"
        ]
      ]
    },
    "options": [
      "Reliability at 1,000 h is 0.700. Reliability at 5,000 h should come from a Weibull model fitted to the three failures, after its fit has been checked.",
      "Reliability at 1,000 h is 0.656. Reliability at 5,000 h is also about 0.656, because the Kaplan–Meier curve stays flat after the last failure.",
      "Reliability at 1,000 h is 0.656. Reliability at 5,000 h is about 0.12, found by compounding the 1,000 h result over five 1,000 h periods.",
      "Reliability at 1,000 h is 0.656. Reliability at 5,000 h needs a parametric model, such as a Weibull fit checked against the data."
    ],
    "answer": 3,
    "why": "<p>The Kaplan–Meier estimate multiplies the conditional survival at each failure, using the number of units still at risk just before it. A removed unit leaves the risk set after its removal time, but it still counts as surviving up to that time:</p><p>\\[\\begin{aligned}\\hat{R}(310) &= 9/10 = 0.900 \\\\ \\hat{R}(520) &= 0.900(7/8) \\\\ &= 0.7875 \\\\ \\hat{R}(780) &= 0.7875(5/6) \\\\ &= 0.656\\end{aligned}\\]</p><p>where \\(\\hat{R}(t)\\) is the Kaplan–Meier reliability estimate just after time \\(t\\); 8 units are at risk at 520 h because S1 failed and S2 was removed, and 6 are at risk at 780 h. No failures occur between 780 h and 1,000 h, so \\(\\hat{R}(1000) = 0.656\\).</p><p>A nonparametric estimate exists only over the observed time range. It says nothing about 5,000 h, five times longer than any unit ran. Reaching that far needs a parametric distribution, chosen and checked against the data, and the customer should be told the answer is an extrapolation.</p><p><b>D. 0.656; 5,000 h needs a checked parametric model.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Basic Statistics (parametric and nonparametric methods) and Reliability Distribution Estimation Using the Kaplan-Meier Method; Ch. 7, Parametric and Nonparametric Statistics.</span></p>",
    "optionRationales": [
      "\\(1 - 3/10 = 0.700\\) treats the two removed units as if they had survived the whole 1,000 h. They left the test at 400 h and 650 h.",
      "The 1,000 h figure is right, but a Kaplan–Meier curve ends at the last observation. Holding it flat to 5,000 h assumes no failures in a period nobody observed.",
      "\\(0.656^{5} = 0.12\\) assumes every 1,000 h period has the same survival, which is a constant-hazard (exponential) model adopted without checking it. Three failures cannot support that assumption.",
      "Correct. \\(\\hat{R}(1000) = (9/10)(7/8)(5/6) = 0.656\\), and only a parametric model can extrapolate past the test."
    ],
    "keyPoint": "Kaplan–Meier handles suspensions without assuming a distribution, but it cannot extrapolate. Extrapolation requires a parametric model whose fit has been checked.",
    "trap": "Ignoring suspensions, assuming a constant hazard without checking it, or extending a nonparametric curve beyond the data.",
    "formula": "\\(\\hat{R}(t) = \\prod_{t_i \\le t}\\left(1 - \\frac{d_i}{n_i}\\right)\\)",
    "assumptions": [
      "Removals were unrelated to the seal condition (non-informative censoring)."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Kaplan-Meier",
      "nonparametric",
      "parametric",
      "suspensions",
      "extrapolation"
    ],
    "sourceSection": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Reliability distribution estimation using the Kaplan-Meier method",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q32",
    "set": 1,
    "batch": 4,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.3",
      "topic": "Reading a lognormal probability plot"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Failure times for a solder joint were plotted on lognormal probability paper, and the fitted line is shown. The line crosses 50% at 2,000 hours and 84.1% at 5,000 hours. What is the B10 life, the time by which 10% of joints are expected to fail?",
    "chart": {
      "type": "cre-lognormal-plot",
      "title": "Solder joint life: lognormal probability plot",
      "altText": "Lognormal probability plot of twelve solder-joint failure times, from about 500 hours to about 8,400 hours, plotted against median-rank unreliability from 5.6% to 94.4%. A straight fitted line runs through the points. Marked points on the line: 50% unreliability at 2,000 hours and 84.1% at 5,000 hours.",
      "xTicks": [
        100,
        200,
        500,
        1000,
        2000,
        5000,
        10000,
        20000
      ],
      "yTicks": [
        1,
        5,
        10,
        20,
        30,
        50,
        70,
        80,
        90,
        95,
        99
      ],
      "points": [
        [
          500,
          5.6
        ],
        [
          700,
          13.7
        ],
        [
          1020,
          21.8
        ],
        [
          1190,
          29.8
        ],
        [
          1550,
          37.9
        ],
        [
          1790,
          46.0
        ],
        [
          2240,
          54.0
        ],
        [
          2550,
          62.1
        ],
        [
          3410,
          70.2
        ],
        [
          3960,
          78.2
        ],
        [
          5610,
          86.3
        ],
        [
          8380,
          94.4
        ]
      ],
      "line": {
        "median": 2000,
        "sigma": 0.9163
      },
      "markers": [
        {
          "t": 2000,
          "f": 50,
          "label": "50% at 2,000 h"
        },
        {
          "t": 5000,
          "f": 84.1,
          "label": "84.1% at 5,000 h"
        }
      ],
      "xLabel": "Hours to failure (log scale)",
      "yLabel": "Unreliability, % (normal scale)"
    },
    "options": [
      "443 h",
      "618 h",
      "925 h",
      "6,470 h"
    ],
    "answer": 1,
    "why": "<p>On lognormal paper the line is the normal distribution of \\(\\ln t\\). The 50% point gives the median, and the 84.1% point is one log-standard deviation above it:</p><p>\\[\\begin{aligned}\\sigma &= \\ln\\left(\\frac{t_{84.1}}{t_{50}}\\right) \\\\ &= \\ln 2.5 = 0.916 \\\\ \\ln t_{10} &= \\ln 2000 - 1.2816\\,\\sigma \\\\ &= 7.601 - 1.174 \\\\ &= 6.427 \\\\ t_{10} &= e^{6.427} = 618 \\text{ h}\\end{aligned}\\]</p><p>where \\(t_{50}\\) is the median life, \\(t_{84.1}\\) the time at 84.1% unreliability, \\(\\sigma\\) the standard deviation of \\(\\ln t\\), \\(1.2816\\) the standard normal value with 10% below it and \\(t_{10}\\) the B10 life. Equivalently, \\(t_{10} = 2000 \\times 0.309\\).</p><p><b>B. 618 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions (lognormal) and Probability Plots and Assessing Goodness-of-Fit.</span></p>",
    "optionRationales": [
      "Uses \\(z = 1.645\\), the 5% point: \\(2000\\,e^{-1.645(0.916)} = 443\\) h. That is the B5 life.",
      "Correct. \\(t_{10} = 2000\\,e^{-1.2816(0.916)} = 618\\) h.",
      "Uses \\(z = 0.8416\\), the 20% point: \\(2000\\,e^{-0.8416(0.916)} = 925\\) h. That is the B20 life.",
      "Adds \\(1.2816\\,\\sigma\\) instead of subtracting it: \\(2000\\,e^{1.174} = 6470\\) h is the B90 life."
    ],
    "keyPoint": "On lognormal paper, \\(\\sigma = \\ln(t_{84.1}/t_{50})\\) and \\(t_p = t_{50}\\,e^{z_p \\sigma}\\).",
    "trap": "Using the z value for the wrong percentile, or adding instead of subtracting.",
    "formula": "\\(t_p = t_{50}\\exp(z_p\\,\\sigma)\\), \\(z_{0.10} = -1.2816\\)",
    "assumptions": [
      "Life is lognormal, as the straight-line fit indicates."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "lognormal",
      "probability plot",
      "B10 life",
      "percentile",
      "median"
    ],
    "sourceSection": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Probability distributions — lognormal; probability plots",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q33",
    "set": 1,
    "batch": 4,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "A. Basic Concepts",
      "code": "III.A.7",
      "topic": "Demonstrating a percentile life from Weibull confidence bounds"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Software output interpretation, decision",
    "quantitative": false,
    "stem": "A requirement says that no more than 10% of fuel pumps may fail before 3,000 hours, demonstrated with 95% confidence. A Weibull analysis of life-test data produced the table of percentiles shown, with a two-sided 90% confidence interval. Which conclusion is correct?",
    "chart": {
      "type": "data-table",
      "title": "Table of percentiles: Weibull fit, two-sided 90% confidence interval",
      "columns": [
        "Percent",
        "Percentile (h)",
        "Lower (h)",
        "Upper (h)"
      ],
      "rows": [
        [
          "1",
          "1,330",
          "640",
          "2,760"
        ],
        [
          "5",
          "3,050",
          "1,880",
          "4,950"
        ],
        [
          "10",
          "4,400",
          "2,950",
          "6,560"
        ]
      ]
    },
    "options": [
      "Demonstrated: the B10 estimate of 4,400 h is well above 3,000 h.",
      "Demonstrated: a one-sided 95% bound is less conservative than the two-sided 90% interval shown, so the true one-sided bound on B10 lies above 2,950 h and clears 3,000 h.",
      "Not demonstrated: the lower limit of a two-sided 90% interval is a one-sided 95% lower bound, and for B10 it is 2,950 h, below 3,000 h.",
      "Demonstrated: the B5 estimate of 3,050 h exceeds 3,000 h, so fewer than 5% of pumps fail before 3,000 h."
    ],
    "answer": 2,
    "why": "<p>A two-sided 90% interval leaves 5% in each tail, so its lower limit is exactly a one-sided 95% lower confidence bound. The requirement is about the 10th percentile, so read the B10 row. The bound is 2,950 h, which is short of 3,000 h, so the requirement is not demonstrated even though the point estimate is 4,400 h. More test time or more units would narrow the interval.</p><p><b>C. Not demonstrated: the B10 one-sided 95% bound is 2,950 h.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 6, Confidence and Tolerance Intervals (Weibull intervals; one-sided and two-sided bounds).</span></p>",
    "optionRationales": [
      "A point estimate carries no confidence statement; the requirement asks for 95% confidence.",
      "The two are the same bound. Each tail of a two-sided 90% interval holds 5%, so its lower limit is the one-sided 95% bound.",
      "Correct. The two-sided 90% lower limit on B10 (2,950 h) is the one-sided 95% bound, and it falls short of 3,000 h.",
      "The B5 row is a point estimate with no confidence attached, and its own lower bound (1,880 h) is far below 3,000 h. The requirement concerns B10 at 95% confidence."
    ],
    "keyPoint": "The lower limit of a two-sided \\(100(1 - 2\\alpha)\\%\\) interval is a one-sided \\(100(1 - \\alpha)\\%\\) bound. Check the percentile that matches the requirement.",
    "trap": "Using the point estimate, believing the one-sided bound is looser, or reading the wrong percentile row.",
    "formula": null,
    "assumptions": [
      "The Weibull model fits the test data."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "confidence bound",
      "Weibull",
      "percentile",
      "B10",
      "one-sided bound"
    ],
    "sourceSection": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 6 - Probability and Statistics for Reliability, Basic Concepts",
        "section": "Confidence and tolerance intervals — Weibull intervals",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q34",
    "set": 1,
    "batch": 4,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.4",
      "topic": "Comparing life data with box-and-whisker plots"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "Thirty bearings from each of three suppliers were run to failure on the same rig. The box plots show cycles to failure. The requirement is that at least 75% of bearings exceed 40,000 cycles, and warranty cost is driven by the earliest failures. Which supplier should be chosen?",
    "chart": {
      "type": "cre-box-plot",
      "title": "Bearing cycles to failure by supplier",
      "eyebrow": "Box-and-whisker plots",
      "altText": "Box plots of cycles to failure in thousands. Supplier A: minimum 22, first quartile 35, median 48, third quartile 60, maximum 75. Supplier B: lower whisker 30, first quartile 44, median 52, third quartile 62, upper whisker 85, with one outlier at 12. Supplier C: minimum 38, first quartile 43, median 47, third quartile 51, maximum 57. A dashed line marks 40.",
      "xTicks": [
        0,
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
      ],
      "groups": [
        {
          "label": "Supplier A",
          "min": 22,
          "q1": 35,
          "median": 48,
          "q3": 60,
          "max": 75,
          "outliers": []
        },
        {
          "label": "Supplier B",
          "min": 30,
          "q1": 44,
          "median": 52,
          "q3": 62,
          "max": 85,
          "outliers": [
            12
          ]
        },
        {
          "label": "Supplier C",
          "min": 38,
          "q1": 43,
          "median": 47,
          "q3": 51,
          "max": 57,
          "outliers": []
        }
      ],
      "refLines": [
        {
          "x": 40,
          "label": "40,000 cycles"
        }
      ],
      "xLabel": "Cycles to failure (thousands)"
    },
    "options": [
      "Supplier C: its first quartile is above 40,000 cycles, and its shortest life (38,000 cycles) is the longest of the three, with no outliers.",
      "Supplier B: it has the highest median and third quartile, so its bearings give the longest life on average.",
      "Supplier B: its first quartile (44,000 cycles) is above Supplier C’s (43,000 cycles), so more of its bearings exceed 40,000 cycles.",
      "Either B or C: both first quartiles exceed 40,000 cycles, and a box plot cannot show early failures."
    ],
    "answer": 0,
    "why": "<p>The first quartile is the life that 75% of bearings exceed, so the requirement is met when the box starts to the right of 40,000 cycles. Suppliers B and C both pass; A does not (35,000). The tiebreaker is the early tail. Supplier B has an outlier at 12,000 cycles and a lower whisker reaching 30,000 cycles, so it produces the earliest, warranty-driving failures. Supplier C is tightly grouped, with its shortest life at 38,000 cycles. Its lower median does not matter for this requirement.</p><p><b>A. Supplier C.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Data Summary and Reporting — data visualization techniques (box-and-whisker plots, Example 7.5).</span></p>",
    "optionRationales": [
      "Correct. C meets the 75% requirement and has the best early tail, which drives warranty cost.",
      "A high median and upper quartile describe typical and long lives. The requirement and the warranty cost depend on the lower tail, where B has the earliest failure.",
      "Both first quartiles clear 40,000 cycles, so both meet the 75% requirement. The 1,000-cycle difference in first quartiles does not outweigh B’s early outlier.",
      "Box plots do show early failures: the lower whisker and the plotted outlier at 12,000 cycles are exactly that."
    ],
    "keyPoint": "Match the box-plot feature to the requirement: quartiles for coverage, whiskers and outliers for early failures, the median for typical life.",
    "trap": "Choosing on the median, or overlooking an outlier in the lower tail.",
    "formula": null,
    "assumptions": [
      "All bearings were tested under the same conditions."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "box plot",
      "five-number summary",
      "outliers",
      "supplier comparison",
      "data visualization"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Data summary and reporting — data visualization techniques",
        "example": "Example 7.5"
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q35",
    "set": 1,
    "batch": 4,
    "sub": "cre-statistics",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "III. Probability and Statistics for Reliability",
      "subdomain": "B. Data Management",
      "code": "III.B.4",
      "topic": "Data integrity before trusting an AI analysis"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "An AI analytics tool screened 40 vibration readings from pump bearings and reported almost no relationship between vibration and operating hours (\\(r = 0.01\\)). It recommends dropping vibration from the predictive-maintenance model. The readings are plotted with the tool’s fitted line. What should the reliability engineer do?",
    "chart": {
      "type": "cre-xy-plot",
      "title": "Bearing vibration against operating hours",
      "eyebrow": "Scatter plot",
      "legend": true,
      "altText": "Scatter plot of 40 vibration readings in millimetres per second against operating hours from 0 to 8,000. Thirty-two readings rise steadily from about 1 at 200 hours to about 4.5 at 8,000 hours. Eight readings between 6,250 and 7,350 hours are exactly 0.0. The AI tool’s dashed fitted line is almost flat at about 1.9.",
      "xTicks": [
        0,
        1000,
        2000,
        3000,
        4000,
        5000,
        6000,
        7000,
        8000
      ],
      "yTicks": [
        0,
        1,
        2,
        3,
        4,
        5
      ],
      "series": [
        {
          "label": "Vibration readings",
          "line": false,
          "points": [
            [
              230,
              1.1
            ],
            [
              240,
              1.1
            ],
            [
              290,
              1.1
            ],
            [
              480,
              0.9
            ],
            [
              540,
              1.3
            ],
            [
              1400,
              2.0
            ],
            [
              1450,
              1.3
            ],
            [
              1700,
              2.0
            ],
            [
              1760,
              1.8
            ],
            [
              1880,
              1.7
            ],
            [
              1960,
              2.4
            ],
            [
              2130,
              2.1
            ],
            [
              2190,
              1.7
            ],
            [
              2370,
              2.1
            ],
            [
              2540,
              2.3
            ],
            [
              2560,
              2.1
            ],
            [
              3080,
              2.6
            ],
            [
              3670,
              2.6
            ],
            [
              3840,
              2.9
            ],
            [
              3850,
              3.1
            ],
            [
              4080,
              2.7
            ],
            [
              4140,
              2.9
            ],
            [
              4210,
              2.8
            ],
            [
              4220,
              2.9
            ],
            [
              4520,
              2.7
            ],
            [
              4980,
              3.1
            ],
            [
              5050,
              3.2
            ],
            [
              5080,
              3.5
            ],
            [
              5110,
              3.6
            ],
            [
              5600,
              3.2
            ],
            [
              6250,
              0.0
            ],
            [
              6380,
              0.0
            ],
            [
              6420,
              0.0
            ],
            [
              6610,
              0.0
            ],
            [
              6670,
              0.0
            ],
            [
              7010,
              0.0
            ],
            [
              7200,
              0.0
            ],
            [
              7350,
              0.0
            ],
            [
              7910,
              4.5
            ],
            [
              7960,
              4.5
            ]
          ]
        },
        {
          "label": "AI tool fitted line",
          "dashed": true,
          "showPoints": false,
          "points": [
            [
              0,
              1.92
            ],
            [
              8000,
              1.97
            ]
          ]
        }
      ],
      "xLabel": "Operating hours",
      "yLabel": "Vibration velocity (mm/s RMS)"
    },
    "options": [
      "Accept the result: a correlation this close to zero shows vibration is not a useful wear indicator for these bearings.",
      "Remove the readings that lie more than two standard deviations from the fitted line, then refit, so that the AI model is not distorted by noise.",
      "Treat the eight 0.0 readings as suspected sensor or logger dropouts, confirm them against the logger records, exclude them with the reason documented, and then refit.",
      "Log-transform the vibration readings to reduce the influence of the extreme values, then let the AI tool refit the relationship."
    ],
    "answer": 2,
    "why": "<p>A running bearing cannot have zero vibration, and eight readings of exactly 0.0 clustered in one period of operating hours point to a data-collection fault, not physics. Those points sit at the highest operating hours, where true vibration is highest, so they flatten the fitted line and pull the correlation to almost zero. The other 32 readings rise steadily with hours. Data integrity must be checked before any analysis, human or AI, is trusted: confirm the dropouts in the logger records, exclude them with a documented reason, and refit. The Handbook also notes that AI methods need large, clean training sets and are not appropriate for every situation.</p><p><b>C. Treat the zeros as suspected dropouts, confirm, exclude with documentation, refit.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 7, Data Summary and Reporting — data usability and data analysis (accuracy, integrity, AI); data visualization techniques (scatter plots).</span></p>",
    "optionRationales": [
      "The correlation is computed on corrupted data. The scatter plot shows a strong upward pattern once the impossible zeros are set aside.",
      "The zeros are far from the true trend but close to the flat, distorted line, so a residual rule based on that line keeps them and may remove good readings instead.",
      "Correct. It checks integrity first, documents the exclusion and then reanalyzes.",
      "The logarithm of 0.0 is undefined, and a transformation would hide a data-integrity problem rather than fix it."
    ],
    "keyPoint": "Assess accuracy and integrity before analysis. Physically impossible values are data faults to investigate, not outliers to trim or transform.",
    "trap": "Trusting an AI summary statistic without plotting the data, or \"cleaning\" with a rule built on the distorted fit.",
    "formula": null,
    "assumptions": [
      "The pumps ran continuously while the readings were taken."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "data integrity",
      "scatter plot",
      "correlation",
      "artificial intelligence",
      "sensor dropout"
    ],
    "sourceSection": "Chapter 7 - Data Management",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 7 - Data Management",
        "section": "Data summary and reporting — data usability and data analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q36",
    "set": 1,
    "batch": 4,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.1",
      "topic": "Reliability growth (TAAF): Duane model projection"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A pump controller is in a test, analyze and fix (TAAF) program. Each cycle accumulated 15,000 equivalent unit-hours, and design fixes were made between cycles. Using the Duane model, with the growth rate estimated from the first and third cumulative points, how many more test hours are needed to reach an instantaneous (current) MTBF of 2,500 hours if the same growth rate continues?",
    "chart": {
      "type": "data-table",
      "title": "TAAF program results (equivalent unit-hours and failures in each cycle)",
      "columns": [
        "Cycle",
        "Unit-hours",
        "Failures"
      ],
      "rows": [
        [
          "1",
          "15,000",
          "18"
        ],
        [
          "2",
          "15,000",
          "11"
        ],
        [
          "3",
          "15,000",
          "7"
        ]
      ]
    },
    "options": [
      "About 20,100 more hours",
      "About 39,500 more hours",
      "About 84,500 more hours",
      "About 249,000 more hours"
    ],
    "answer": 1,
    "why": "<p>Duane plots the cumulative MTBF against cumulative test time on log–log scales. First the cumulative points and the growth rate:</p><p>\\[\\begin{aligned}\\theta_{C,1} &= 15000/18 \\\\ &= 833.3 \\\\ \\theta_{C,3} &= 45000/36 \\\\ &= 1250 \\\\ b &= \\frac{\\log 1.5}{\\log 3} \\\\ &= 0.369\\end{aligned}\\]</p><p>where \\(\\theta_{C,1}\\) and \\(\\theta_{C,3}\\) are the cumulative MTBFs after cycles 1 and 3, \\(\\theta_C(T)\\) is the cumulative MTBF (total time divided by total failures) after \\(T\\) unit-hours, \\(b\\) is the growth rate, \\(1.5 = 1250/833.3\\) and \\(3 = 45000/15000\\). The instantaneous MTBF is \\(\\theta = \\theta_C/(1 - b)\\), now \\(1250/0.631 = 1981\\) h. To reach 2,500 h:</p><p>\\[\\begin{aligned}\\theta_C &= 2500(1 - b) \\\\ &= 1577 \\\\ T &= 45000(1.262)^{1/b} \\\\ &= 45000(1.262)^{2.71} \\\\ &= 84500 \\\\ \\Delta T &= 84500 - 45000 \\\\ &= 39500 \\text{ h}\\end{aligned}\\]</p><p>where \\(1.262 = 1577/1250\\) is the growth still needed in cumulative MTBF, \\(T\\) is the cumulative test time needed and \\(\\Delta T\\) the additional time. Growth is slow at this rate: a 26% rise in current MTBF needs nearly as much test time again as has been spent so far.</p><p><b>B. About 39,500 more hours.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Reliability Growth Testing (Duane model; method of Example 8.1).</span></p>",
    "optionRationales": [
      "Uses the exponent \\(1/(1 - b)\\) instead of \\(1/b\\). Cumulative failures grow as \\(T^{1 - b}\\), but cumulative MTBF grows as \\(T^{b}\\), so projecting MTBF needs \\(1/b\\).",
      "Correct. \\(b = 0.369\\), the target cumulative MTBF is 1,577 h, \\(T = 84500\\) h, so about 39,500 more hours.",
      "84,500 h is the total cumulative test time needed. The 45,000 h already run count toward it, so only about 39,500 more hours are needed.",
      "Sets the cumulative MTBF, rather than the instantaneous MTBF, equal to 2,500 h: \\(45000(2)^{2.71}\\). The current MTBF is higher than the cumulative by the factor \\(1/(1 - b)\\)."
    ],
    "keyPoint": "Duane: \\(\\theta_C \\propto T^{b}\\) and the instantaneous MTBF is \\(\\theta_C/(1 - b)\\). Convert the target before projecting the test time.",
    "trap": "Confusing cumulative with instantaneous MTBF, or extrapolating growth linearly.",
    "formula": "\\(b = \\log(\\theta_{C2}/\\theta_{C1})/\\log(T_2/T_1)\\); \\(\\theta = \\theta_C/(1 - b)\\); \\(T = T_0(\\theta_C/\\theta_{C0})^{1/b}\\)",
    "assumptions": [
      "The Duane growth rate stays constant and the TAAF process continues as before."
    ],
    "estimatedMinutes": 7,
    "keywords": [
      "reliability growth",
      "Duane model",
      "TAAF",
      "instantaneous MTBF",
      "cumulative MTBF"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Reliability growth testing",
        "example": "Example 8.1"
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q37",
    "set": 1,
    "batch": 4,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.5",
      "topic": "Building the test environment into the plan"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "A reliability test plan for a vehicle-mounted electronic module is summarized below. In service, the module sees road vibration and daily temperature cycling at the same time. Which revision to the plan is most needed before testing begins?",
    "chart": {
      "type": "data-table",
      "title": "Module test plan",
      "columns": [
        "Item",
        "Field condition or requirement",
        "Planned test"
      ],
      "rows": [
        [
          "Temperature",
          "−30 °C to +70 °C, cycling daily while the vehicle vibrates",
          "Thermal cycling, −40 °C to +85 °C, 500 cycles"
        ],
        [
          "Vibration",
          "Road vibration whenever the vehicle runs",
          "Random vibration, 6 Grms for 24 h, run after thermal cycling ends"
        ],
        [
          "Humidity",
          "Up to 95% relative humidity, condensing",
          "85 °C and 85% relative humidity for 1,000 h"
        ],
        [
          "Chamber thermocouples and accelerometers",
          "Calibration interval: 12 months",
          "Last calibrated 30 months ago"
        ]
      ]
    },
    "options": [
      "Run vibration before thermal cycling so that the harsher stress comes first, and extend the humidity test to 2,000 h.",
      "Recalibrate the chamber instruments, then run the plan as written, with thermal cycling followed by vibration.",
      "Double the number of modules on the thermal leg and drop the vibration leg, because temperature dominates electronics failures.",
      "Apply thermal cycling and vibration at the same time, and recalibrate the chamber instruments before the test starts."
    ],
    "answer": 3,
    "why": "<p>The test environment should reflect how the stresses act in use. The field applies vibration and temperature cycling at the same time, and their combined effect (for example, on solder joints) can differ from applying them one after the other, where the order itself changes the result. A combined-environment test (CERT) removes that problem. Separately, results are only valid if the test equipment is accurate: instruments 18 months past their calibration interval must be recalibrated before the test, not after.</p><p><b>D. Combine thermal cycling and vibration, and recalibrate first.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Test Environment (combined environmental reliability testing, calibration); Environmental Factors and Use Conditions.</span></p>",
    "optionRationales": [
      "Any sequential order still separates stresses that act together in the field, and a longer humidity test does not address either real gap.",
      "Recalibration fixes one gap, but running the stresses one after the other still misses failures caused by their combined effect in service.",
      "Dropping vibration removes a field stress altogether; the plan should match the use environment, not a general rule about electronics.",
      "Correct. It matches the combined field environment and makes the measurements trustworthy before testing starts."
    ],
    "keyPoint": "Build the test environment from the use environment, including stresses that act together, and verify test-equipment calibration before testing.",
    "trap": "Testing combined field stresses sequentially, or running a test on overdue calibration.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "test environment",
      "combined environment",
      "CERT",
      "calibration",
      "vibration",
      "thermal cycling"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Test environment",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q38",
    "set": 1,
    "batch": 4,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.2",
      "topic": "Usage severity and zero-failure test planning"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A dishwasher door latch must meet the reliability requirement shown for heavy users, defined as the 90th-percentile user. A zero-failure test will cycle each latch on a rig. Using the planning data, what is the minimum number of latches that must complete the test with no failures?",
    "chart": {
      "type": "data-table",
      "title": "Latch test planning data",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Warranty life",
          "5 years (260 weeks)"
        ],
        [
          "Use at the 10th, 50th and 90th percentile user",
          "2, 5 and 9 cycles per week"
        ],
        [
          "Reliability requirement",
          "0.95 at warranty life for the 90th-percentile user"
        ],
        [
          "Confidence",
          "90%"
        ],
        [
          "Known Weibull shape \\(\\beta\\)",
          "2"
        ],
        [
          "Rig limit per latch",
          "4,000 cycles"
        ]
      ]
    },
    "options": [
      "5",
      "16",
      "27",
      "45"
    ],
    "answer": 1,
    "why": "<p>First convert the requirement into cycles for the heavy user, then use the zero-failure plan with test-time extension:</p><p>\\[\\begin{aligned}t &= 9 \\times 260 = 2340 \\text{ cycles} \\\\ k &= \\frac{4000}{2340} = 1.709 \\\\ n &= \\frac{\\ln(1 - C)}{k^{\\beta}\\,\\ln R} \\\\ &= \\frac{\\ln 0.10}{1.709^{2}\\,\\ln 0.95} \\\\ &= \\frac{-2.303}{2.922(-0.0513)} \\\\ &= 15.4\\end{aligned}\\]</p><p>where \\(t\\) is the warranty life in cycles for the 90th-percentile user, \\(k\\) the ratio of test cycles to required cycles, \\(\\beta\\) the Weibull shape, \\(R\\) the required reliability and \\(C\\) the confidence. Round up: 16 latches.</p><p><b>B. 16</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Customer Profiles; Planning Zero-Failure Tests to Estimate Reliability (Example 8.2); Environmental Factors and Use Conditions.</span></p>",
    "optionRationales": [
      "Uses the 50th-percentile user (\\(5 \\times 260 = 1300\\) cycles, \\(k = 3.08\\)): \\(n = 4.7\\), so 5. The requirement is set for heavy users.",
      "Correct. \\(t = 2340\\) cycles, \\(k = 1.709\\), \\(n = 15.4\\), so 16 latches.",
      "Uses \\(k\\) instead of \\(k^{\\beta}\\): \\(\\ln 0.10/(1.709 \\ln 0.95) = 26.3\\), so 27.",
      "Ignores the test extension (\\(k = 1\\)): \\(\\ln 0.10/\\ln 0.95 = 44.9\\), so 45."
    ],
    "keyPoint": "Set the test length from the use profile the requirement names, then reduce the sample size by \\(k^{\\beta}\\) for testing beyond the required life.",
    "trap": "Using the median user, scaling by \\(k\\) instead of \\(k^{\\beta}\\), or ignoring the extension.",
    "formula": "\\(n = \\ln(1 - C)/(k^{\\beta}\\ln R)\\), \\(k = t_{\\text{test}}/t_{\\text{required}}\\)",
    "assumptions": [
      "Rig cycles are equivalent to field cycles.",
      "The Weibull shape is known and the same on the rig and in service."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "customer usage profile",
      "duty cycle",
      "zero-failure test",
      "Weibull",
      "sample size"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Customer profiles; planning zero-failure tests",
        "example": "Example 8.2"
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q39",
    "set": 1,
    "batch": 4,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.3",
      "topic": "Gathering expert judgment on failure consequences"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A team must rank the consequences of eight failure modes of a new infusion pump. In past meetings, one senior designer has dominated the discussion. Which technique collects expert judgment anonymously, over several rounds, until the experts reach consensus?",
    "chart": null,
    "options": [
      "Delphi method",
      "Brainstorming session",
      "Probability and impact (PI) matrix",
      "Five whys"
    ],
    "answer": 0,
    "why": "<p>The Delphi method sends a questionnaire to each expert, anonymizes and summarizes the responses, and repeats the rounds until consensus forms. Because no one sees who said what, it avoids groupthink and the influence of dominant personalities. It takes longer than a meeting but gives each expert time to think.</p><p><b>A. Delphi method</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Failure Consequence (Delphi method, PI matrix, FMEA).</span></p>",
    "optionRationales": [
      "Correct. Anonymous, iterative rounds that converge on consensus.",
      "A brainstorming session is a group meeting, where a dominant voice can steer the result.",
      "A PI matrix displays risks by likelihood and impact once they have been judged; it does not collect the judgments.",
      "Five whys is a root cause technique, not a way to pool expert opinion on consequences."
    ],
    "keyPoint": "Delphi: anonymous, iterative expert rounds that avoid groupthink and dominant personalities.",
    "trap": "Choosing a group meeting technique, or a display tool, for the task of gathering judgments.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "failure consequence",
      "Delphi method",
      "expert judgment",
      "groupthink"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Failure consequence",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b04-q40",
    "set": 1,
    "batch": 4,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.4",
      "topic": "Turning a warranty requirement into a life requirement"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation, decision",
    "quantitative": true,
    "stem": "A product has a 2-year warranty, and the failure criterion is that no more than 10% of units may fail within the warranty. Life data from the previous model fit a Weibull distribution with \\(\\beta = 1.5\\). Marketing wants to quote the requirement as a mean time to failure (MTTF). What is the minimum MTTF consistent with the warranty requirement?",
    "chart": null,
    "options": [
      "1.8 years",
      "7.0 years",
      "8.1 years",
      "19.0 years"
    ],
    "answer": 2,
    "why": "<p>The requirement fixes the 10th percentile (B10) at 2 years. Solve for the scale \\(\\eta\\), then convert to the mean:</p><p>\\[\\begin{aligned}t_{10} &= \\eta\\,(-\\ln 0.90)^{1/\\beta} \\\\ 2 &= \\eta\\,(0.10536)^{0.667} \\\\ \\eta &= 2/0.2228 = 8.98 \\\\ \\text{MTTF} &= \\eta\\,\\Gamma\\left(1 + \\frac{1}{\\beta}\\right) \\\\ &= 8.98(0.9027) \\\\ &= 8.1 \\text{ years}\\end{aligned}\\]</p><p>where \\(t_{10}\\) is the B10 life, \\(\\eta\\) the Weibull scale, \\(\\beta\\) the shape and \\(\\Gamma\\) the gamma function. A requirement on a low percentile becomes a much longer mean when life varies widely, which is why failure criteria should be stated as a percentile, not as a mean.</p><p><b>C. 8.1 years</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Failure Criteria (time requirements, lower percentile versus mean life).</span></p>",
    "optionRationales": [
      "Treats the 2-year warranty as the characteristic life \\(\\eta\\): \\(2\\,\\Gamma(1.667) = 1.8\\) years. At \\(\\eta\\), 63.2% of units have failed, far more than 10%.",
      "Treats the median life as the mean: \\(8.98(\\ln 2)^{0.667} = 7.0\\) years. For \\(\\beta = 1.5\\) the mean is longer than the median.",
      "Correct. \\(\\eta = 8.98\\) years and \\(\\text{MTTF} = 8.98\\,\\Gamma(1.667) = 8.1\\) years.",
      "Assumes an exponential life: \\(2/(-\\ln 0.90) = 19.0\\) years. The wear-out shape (\\(\\beta = 1.5\\)) concentrates failures later, so the mean needed is far shorter."
    ],
    "keyPoint": "State failure criteria as a low percentile tied to the warranty. The equivalent mean depends strongly on the distribution shape.",
    "trap": "Assuming an exponential distribution, or confusing the median or scale with the mean.",
    "formula": "\\(t_p = \\eta(-\\ln(1 - p))^{1/\\beta}\\); \\(\\text{MTTF} = \\eta\\,\\Gamma(1 + 1/\\beta)\\)",
    "assumptions": [
      "The new model keeps the Weibull shape of the previous model."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "failure criteria",
      "warranty",
      "B10 life",
      "MTTF",
      "Weibull"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Failure criteria",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q41",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.1",
      "topic": "Classifying reliability tests by development phase"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A motor drive is in full production. Each month, a sample from that month’s build is life-tested, and that month’s lots are released for shipment only if the sample passes. Using the Handbook’s classification of reliability tests by product phase, which category of test is this?",
    "chart": null,
    "options": [
      "Product development test",
      "Reliability performance (qualification) test",
      "Reliability verification test",
      "Reliability acceptance test"
    ],
    "answer": 3,
    "why": "<p>The Handbook classifies reliability tests by the phase in which they run. Reliability acceptance tests are run during production to show that the design’s reliability parameters have been maintained, so that current production can ship. That is exactly this monthly sample-and-release test.</p><p><b>D. Reliability acceptance test</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Reliability Test Strategies (product development, performance, acceptance and verification tests).</span></p>",
    "optionRationales": [
      "Product development tests run on prototypes to cause failures and improve the design, not to release production lots.",
      "A performance (qualification) test runs once the design is complete, to show that it meets requirements under stated conditions. It does not release monthly production.",
      "A verification (compliance) test formally demonstrates a stated parameter, such as MTBF at a given confidence, against acceptable and rejectable values. It is not a monthly gate on releasing production lots.",
      "Correct. It runs during production and confirms that the qualified reliability is maintained before lots ship."
    ],
    "keyPoint": "Development tests improve the design; performance tests qualify it; acceptance tests confirm that production maintains it; verification tests formally demonstrate a parameter.",
    "trap": "Confusing a production acceptance test with a formal verification (compliance) test.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "test strategy",
      "reliability acceptance test",
      "qualification test",
      "verification test",
      "product development test"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Reliability test strategies",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q42",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.2",
      "topic": "Interpreting HALT operating and destruct limits"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "Early prototypes of an outdoor sensor hub completed HALT. The results are summarized below. Which conclusion is correct?",
    "chart": {
      "type": "data-table",
      "title": "HALT results: outdoor sensor hub prototype",
      "columns": [
        "Stress",
        "Design specification",
        "Operating limit found",
        "Destruct limit found"
      ],
      "rows": [
        [
          "Cold step",
          "−20 °C",
          "−25 °C",
          "−40 °C"
        ],
        [
          "Hot step",
          "+70 °C",
          "+105 °C",
          "+130 °C"
        ],
        [
          "Random vibration",
          "5 Grms",
          "30 Grms",
          "45 Grms"
        ],
        [
          "Rapid thermal transitions",
          "15 °C per minute",
          "60 °C per minute",
          "Not reached"
        ]
      ]
    },
    "options": [
      "Cold is the weak link: the unit stops operating only 5 °C beyond its specification, so find the root cause and improve the design.",
      "The hub’s MTBF can be estimated from the step at which each stress first caused a failure, scaled back to the specification.",
      "Vibration is the weak link, because its 45 Grms destruct limit is the smallest number in the table.",
      "Every operating limit lies beyond its specification, so the design is robust and no change is needed."
    ],
    "answer": 0,
    "why": "<p>HALT pushes stress beyond the design limits to find the weakest link and widen the margins before release. The margin that matters is how far each operating limit lies beyond its specification: hot has 35 °C, vibration 25 Grms, thermal transitions 45 °C per minute, but cold only 5 °C. Field temperatures in the tail of the distribution could reach that, so cold is the weak link to root-cause and fix. HALT records stress levels, not times to failure, and its failures are not typical of use, so it cannot give MTBF or failure rate.</p><p><b>A. Cold is the weak link; fix it, and do not estimate reliability from HALT.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, HALT Tests; Ch. 8, Highly Accelerated Life Test (HALT).</span></p>",
    "optionRationales": [
      "Correct. The cold margin (5 °C) is far smaller than the others, and HALT results are for improvement, not estimation.",
      "HALT records stress levels, not times to failure, and its failure modes are not typical of use, so MTBF cannot be calculated from it.",
      "Limits in different units cannot be compared by their raw numbers. Vibration’s operating limit is six times its specification, a wide margin.",
      "Passing the specification is not the goal of HALT. A 5 °C cold margin leaves little protection against stresses in the tail of the field distribution."
    ],
    "keyPoint": "Read HALT results as margins between the specification and the operating and destruct limits. Fix the smallest margin; never estimate reliability from HALT.",
    "trap": "Calculating MTBF from HALT, or comparing limits in different units by their raw numbers.",
    "formula": null,
    "assumptions": [
      "Failures at each limit were confirmed by failure analysis."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "HALT",
      "operating limit",
      "destruct limit",
      "design margin",
      "environmental stress"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "HALT tests",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q43",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "A. Planning",
      "code": "IV.A.1",
      "topic": "Pass/fail (attribute) test data and a binomial reliability bound"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Thirty relays were cycled 500 times together in an environmental chamber. The relays were not monitored individually; when the test ended, one relay had failed. Using the table, what can be stated with 90% confidence about relay reliability at 500 cycles?",
    "chart": {
      "type": "data-table",
      "title": "Cumulative binomial probabilities for 30 relays with at most one failure",
      "columns": [
        "Failure probability \\(p\\)",
        "\\(\\Pr(X \\le 1)\\)"
      ],
      "rows": [
        [
          "0.08",
          "0.296"
        ],
        [
          "0.10",
          "0.184"
        ],
        [
          "0.12",
          "0.110"
        ],
        [
          "0.13",
          "0.084"
        ],
        [
          "0.14",
          "0.064"
        ]
      ]
    },
    "options": [
      "Reliability at 500 cycles is at least about 0.876.",
      "Reliability at 500 cycles is at least 0.926, from the zero-failure result \\(0.10^{1/30}\\).",
      "Reliability at 500 cycles is 0.967, so a 0.95 requirement has been demonstrated with 90% confidence.",
      "MTBF is at least about 3,860 cycles, from the chi-square bound on 15,000 relay-cycles with one failure."
    ],
    "answer": 0,
    "why": "<p>Without individual monitoring, nobody knows when the relay failed, only that it failed within 500 cycles. That is attribute (pass/fail) data, so reliability at the test length comes from the binomial distribution. The one-sided 90% upper bound on the failure probability is the \\(p\\) at which one or fewer failures has probability 0.10. Interpolate in the table between \\(p = 0.12\\) (0.110) and \\(p = 0.13\\) (0.084), where 0.010 is the distance from 0.110 down to 0.100 and 0.026 the drop across the interval:</p><p>\\[\\begin{aligned}p_U &\\approx 0.12 + 0.01\\left(\\frac{0.010}{0.026}\\right) \\\\ &= 0.124 \\\\ R_L &= 1 - p_U = 0.876\\end{aligned}\\]</p><p>where \\(p_U\\) is the upper confidence bound on the probability that a relay fails within 500 cycles and \\(R_L\\) the lower bound on reliability at 500 cycles. The point estimate is \\(29/30 = 0.967\\), but with 90% confidence only about 0.876 is demonstrated.</p><p><b>A. At least about 0.876, a binomial bound on pass/fail data.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 8, Reliability Test Strategies (attribute and variables data; one-shot and chamber testing); Ch. 6, Confidence Intervals for proportions.</span></p>",
    "optionRationales": [
      "Correct. Pass/fail data give a binomial bound: \\(p_U \\approx 0.124\\), so \\(R_L \\approx 0.876\\).",
      "The zero-failure formula applies only when no unit fails. Here one relay failed.",
      "\\(29/30 = 0.967\\) is a point estimate with no confidence attached; its 90% lower bound is about 0.876, below 0.95.",
      "A chi-square MTBF bound needs time-to-failure data. The failure time is unknown, so only pass/fail data at 500 cycles exist."
    ],
    "keyPoint": "When failure times are unknown, the test gives attribute data: bound reliability at the test length with the binomial, not an MTBF.",
    "trap": "Treating chamber pass/fail results as time data, or quoting the point estimate as if it carried confidence.",
    "formula": "Find \\(p_U\\) with \\(\\Pr(X \\le c \\mid n, p_U) = 1 - C\\); \\(R_L = 1 - p_U\\)",
    "assumptions": [
      "The 30 relays are a random sample, and failures are independent."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "attribute data",
      "pass/fail test",
      "binomial",
      "confidence bound",
      "reliability demonstration"
    ],
    "sourceSection": "Chapter 8 - Reliability Planning",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 8 - Reliability Planning",
        "section": "Reliability test strategies — attribute and variables data",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q44",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.1",
      "topic": "Arrhenius acceleration and a zero-failure MTBF bound"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A power-supply controller was tested at high temperature using the plan shown, with no failures. Assume the Arrhenius model applies, the failure mechanism is the same at both temperatures, and the failure rate is constant. What is the one-sided 90% lower confidence bound on MTBF at the use temperature?",
    "chart": {
      "type": "data-table",
      "title": "Accelerated life test summary",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Use temperature",
          "55 °C"
        ],
        [
          "Test temperature",
          "125 °C"
        ],
        [
          "Activation energy",
          "0.70 eV"
        ],
        [
          "Boltzmann constant",
          "\\(8.617 \\times 10^{-5}\\) eV/K"
        ],
        [
          "Units on test",
          "20"
        ],
        [
          "Test duration",
          "1,000 h each, time-terminated"
        ],
        [
          "Failures",
          "0"
        ]
      ]
    },
    "options": [
      "About 337,000 h",
      "About 518,000 h",
      "About 675,000 h",
      "About 1,550,000 h"
    ],
    "answer": 2,
    "why": "<p>First find the acceleration factor, using absolute temperatures:</p><p>\\[\\begin{aligned}T_U &= 328.15 \\text{ K} \\\\ T_S &= 398.15 \\text{ K} \\\\ \\text{AF} &= e^{(E_A/k)(1/T_U - 1/T_S)} \\\\ &= e^{8123(0.000536)} \\\\ &= 77.7\\end{aligned}\\]</p><p>where \\(T_U\\) and \\(T_S\\) are the use and test temperatures in kelvin, \\(E_A\\) is the activation energy, \\(k\\) is Boltzmann’s constant, \\(8123 = 0.70/8.617 \\times 10^{-5}\\) and \\(0.000536 = 1/328.15 - 1/398.15\\). Then convert test time to equivalent use time and apply the chi-square bound for a time-terminated test with \\(r = 0\\):</p><p>\\[\\begin{aligned}T_{eq} &= 77.7 \\times 20 \\times 1000 \\\\ &= 1.554 \\times 10^{6} \\text{ h} \\\\ \\text{MTBF}_L &= \\frac{2T_{eq}}{\\chi^2_{0.10,\\,2}} \\\\ &= \\frac{3.107 \\times 10^{6}}{4.605} \\\\ &= 675000 \\text{ h}\\end{aligned}\\]</p><p>where \\(T_{eq}\\) is the equivalent unit-hours at use conditions, and \\(\\chi^2_{0.10,\\,2} = 4.605\\) uses \\(2r + 2 = 2\\) degrees of freedom.</p><p><b>C. About 675,000 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Accelerated Life Tests — the Arrhenius model (Equation 9.1); Ch. 6, Intervals Using the Exponential Distribution.</span></p>",
    "optionRationales": [
      "Drops the 2 in \\(2T_{eq}\\): \\(1.554 \\times 10^{6}/4.605\\).",
      "Uses \\(\\chi^2_{0.05,\\,2} = 5.991\\), the value for a two-sided 90% interval, instead of the one-sided 4.605.",
      "Correct. \\(\\text{AF} = 77.7\\), \\(T_{eq} = 1.554 \\times 10^{6}\\) h, and \\(2T_{eq}/4.605 = 675000\\) h.",
      "Reports the equivalent unit-hours, \\(T_{eq} = 1.554 \\times 10^{6}\\) h, as the bound. With zero failures there is no point estimate, and a 90% bound needs the chi-square factor \\(2/4.605\\)."
    ],
    "keyPoint": "Arrhenius needs kelvin and the stated activation energy. Multiply test time by AF and units, then bound MTBF with \\(\\chi^2_{\\alpha,\\,2r+2}\\).",
    "trap": "Quoting equivalent test time as the MTBF bound, dropping the factor 2, or using the two-sided chi-square value.",
    "formula": "\\(\\text{AF} = \\exp[(E_A/k)(1/T_U - 1/T_S)]\\); \\(\\text{MTBF}_L = 2\\,\\text{AF}\\,n\\,t/\\chi^2_{\\alpha,\\,2r+2}\\)",
    "assumptions": [
      "The Arrhenius model holds with the stated activation energy.",
      "The failure rate is constant at use conditions."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "accelerated life test",
      "Arrhenius",
      "acceleration factor",
      "chi-square",
      "zero-failure test"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Accelerated life tests — Arrhenius model",
        "example": "Example 9.1"
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q45",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.1",
      "topic": "Inverse power law with a change of failure mode"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "Motor windings rated for 24 V were life-tested at three higher voltages. The B10 life and the failure mode confirmed by failure analysis are shown. Using the inverse power law, what is the estimated B10 life at the rated 24 V?",
    "chart": {
      "type": "data-table",
      "title": "Voltage-accelerated life test: motor windings",
      "columns": [
        "Test voltage",
        "B10 life (h)",
        "Failure mode confirmed by analysis"
      ],
      "rows": [
        [
          "36 V",
          "2,400",
          "Insulation breakdown"
        ],
        [
          "48 V",
          "760",
          "Insulation breakdown"
        ],
        [
          "60 V",
          "90",
          "Connector arcing"
        ]
      ]
    },
    "options": [
      "About 3,600 h",
      "About 12,100 h",
      "About 32,500 h",
      "About 38,400 h"
    ],
    "answer": 1,
    "why": "<p>Acceleration is valid only while the failure mode stays the same. The 60 V results show a new mode (connector arcing), so they must be excluded, and the exponent comes from the two insulation-breakdown levels:</p><p>\\[\\begin{aligned}\\frac{L_{36}}{L_{48}} &= \\left(\\frac{48}{36}\\right)^{b} \\\\ b &= \\frac{\\ln(2400/760)}{\\ln(48/36)} \\\\ &= \\frac{1.150}{0.288} = 4.0 \\\\ L_{24} &= 2400\\left(\\frac{36}{24}\\right)^{4.0} \\\\ &= 2400(5.06) \\\\ &= 12100 \\text{ h}\\end{aligned}\\]</p><p>where \\(L_V\\) is the B10 life at voltage \\(V\\) and \\(b\\) is the power-law exponent. The 60 V failures belong to a separate distribution and need their own analysis.</p><p><b>B. About 12,100 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Accelerated Life Tests — the power law model (Equation 9.2) and the requirement that failure modes stay the same.</span></p>",
    "optionRationales": [
      "Assumes life is inversely proportional to voltage (\\(b = 1\\)): \\(2400(36/24) = 3600\\) h. The data give \\(b = 4.0\\).",
      "Correct. \\(b = 4.0\\) from the 36 V and 48 V insulation failures, so \\(L_{24} = 2400(1.5)^{4} = 12100\\) h.",
      "Fits \\(b\\) from the 36 V and 60 V points (\\(b = 6.43\\)), mixing two failure modes.",
      "Applies the 48-to-24 V ratio to the 36 V life: \\(2400(48/24)^{4} = 38400\\) h. The ratio must start from the voltage whose life is used."
    ],
    "keyPoint": "Accelerate only within one failure mode: drop stress levels where analysis shows a new mechanism, then fit the model to the rest.",
    "trap": "Including a stress level with a different failure mode, or pairing a life with the wrong stress ratio.",
    "formula": "\\(L_U/L_S = (V_S/V_U)^{b}\\); \\(b = \\ln(L_1/L_2)/\\ln(V_2/V_1)\\)",
    "assumptions": [
      "The power-law exponent is constant from 24 V to 48 V."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "inverse power law",
      "accelerated life test",
      "failure mode",
      "acceleration factor",
      "B10 life"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Accelerated life tests — power law model",
        "example": "Example 9.2"
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q46",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.2",
      "topic": "Prerequisites for HASS"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A new controller went straight from design to production without HALT. Solder-paste height has a \\(C_{pk}\\) of 0.85, and field returns show early-life solder failures. Management proposes highly accelerated stress screening (HASS) of every unit at stresses beyond the design specification to remove the weak units. What should the reliability engineer recommend?",
    "chart": null,
    "options": [
      "Proceed with HASS on every unit, because a screen beyond the specification will remove the units made defective by the low process capability.",
      "Replace HASS with a highly accelerated stress audit (HASA) on a sample of units, which costs less than screening every unit.",
      "Run HASS at stresses below the field environment, so that the screen cannot damage any good units.",
      "Run HALT and bring the solder process into capability before starting HASS, using a conventional ESS within design limits meanwhile."
    ],
    "answer": 3,
    "why": "<p>HASS stresses can exceed the design specification, so it is safe only when HALT has shown the design has margin beyond those stresses; otherwise the screen can damage or weaken good units. HASS is also meant to detect a shift in a process already shown to be capable and in control, not to compensate for an incapable one: with a \\(C_{pk}\\) of 0.85, the defects must be fixed at the source. Meanwhile, a conventional ESS within design limits can catch early-life failures.</p><p><b>D. Run HALT and fix the process before HASS; use ESS meanwhile.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Stress Screening — environmental stress screening and highly accelerated stress screening (HASS, HASA).</span></p>",
    "optionRationales": [
      "HASS cannot make an incapable process acceptable, and without HALT its stresses may damage good units.",
      "HASA is a sampling audit used after a HASS program has shown the process is in control. It would let early failures escape from an incapable process.",
      "A screen below field stress does not precipitate latent defects that field stress would reveal, so it would remove few weak units.",
      "Correct. HALT first, a capable process, then HASS; ESS within limits protects customers in the meantime."
    ],
    "keyPoint": "HASS requires a HALT-proven design and a capable, in-control process. It detects process shifts; it does not fix an incapable process.",
    "trap": "Using screening to inspect quality into an incapable process.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "HASS",
      "HALT",
      "ESS",
      "HASA",
      "process capability"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Stress screening — HASS",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q47",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.3",
      "topic": "Producer’s and consumer’s risks of a fixed-time test"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A customer proposes a fixed-time compliance test: accumulate 12,000 unit-hours and accept if two or fewer failures occur. The acceptable MTBF is 6,000 h and the rejectable MTBF is 2,000 h. The plan’s operating characteristic (OC) curve is shown. What are the producer’s and consumer’s risks, and how should the plan be judged?",
    "chart": {
      "type": "cre-xy-plot",
      "title": "OC curve: 12,000 unit-hours, accept on two or fewer failures",
      "eyebrow": "Operating characteristic curve",
      "altText": "Probability of accepting against true MTBF from 1,000 to 10,000 hours. The curve rises from almost 0 at 1,000 hours, through about 0.06 at 2,000 hours and about 0.5 at 4,500 hours, to about 0.68 at 6,000 hours and 0.88 at 10,000 hours. Markers show the rejectable MTBF (2,000 h) and the acceptable MTBF (6,000 h).",
      "xTicks": [
        0,
        2000,
        4000,
        6000,
        8000,
        10000
      ],
      "yTicks": [
        0,
        0.2,
        0.4,
        0.6,
        0.8,
        1
      ],
      "series": [
        {
          "label": "Probability of acceptance",
          "points": [
            [
              1000,
              0.001
            ],
            [
              1500,
              0.014
            ],
            [
              2000,
              0.062
            ],
            [
              2500,
              0.143
            ],
            [
              3000,
              0.238
            ],
            [
              3500,
              0.334
            ],
            [
              4000,
              0.423
            ],
            [
              4500,
              0.502
            ],
            [
              5000,
              0.57
            ],
            [
              5500,
              0.628
            ],
            [
              6000,
              0.677
            ],
            [
              6500,
              0.718
            ],
            [
              7000,
              0.753
            ],
            [
              7500,
              0.783
            ],
            [
              8000,
              0.809
            ],
            [
              8500,
              0.831
            ],
            [
              9000,
              0.849
            ],
            [
              9500,
              0.866
            ],
            [
              10000,
              0.879
            ]
          ],
          "showPoints": false
        }
      ],
      "markers": [
        {
          "x": 2000,
          "y": 0.062,
          "label": "Rejectable MTBF"
        },
        {
          "x": 6000,
          "y": 0.677,
          "label": "Acceptable MTBF"
        }
      ],
      "xLabel": "True MTBF (h)",
      "yLabel": "Probability of acceptance"
    },
    "options": [
      "Producer’s risk about 0.06 and consumer’s risk about 0.32. The plan favors the producer.",
      "Producer’s risk about 0.68 and consumer’s risk about 0.06. The plan is too strict for the producer.",
      "Producer’s risk about 0.32 and consumer’s risk about 0.94. The plan protects neither party.",
      "Producer’s risk about 0.32 and consumer’s risk about 0.06. The plan protects the customer but is unfair to the producer."
    ],
    "answer": 3,
    "why": "<p>With a constant failure rate, the number of failures in the test is Poisson with mean \\(T/m\\). Evaluate the acceptance probability at the two MTBF values:</p><p>\\[\\begin{aligned}\\mu_0 &= 12000/6000 = 2 \\\\ P_0 &= \\Pr(X \\le 2 \\mid \\mu_0) \\\\ &= 0.677 \\\\ \\alpha &= 1 - P_0 = 0.32 \\\\ \\mu_1 &= 12000/2000 = 6 \\\\ \\beta &= \\Pr(X \\le 2 \\mid \\mu_1) \\\\ &= 0.062\\end{aligned}\\]</p><p>where \\(\\mu_0\\) and \\(\\mu_1\\) are the expected numbers of failures at the acceptable and rejectable MTBF, \\(P_0\\) is the probability of accepting at the acceptable MTBF, \\(\\alpha\\) is the producer’s risk (rejecting a design that meets the acceptable MTBF) and \\(\\beta\\) the consumer’s risk (accepting one at the rejectable MTBF). A plan with \\(\\alpha\\) about 0.32 is too short: with a discrimination ratio of 3, a plan such as 9,300 h for a 3,000 h requirement with five allowed failures (IEC 61124 B.7) holds both risks near 0.10.</p><p><b>D. Producer’s risk about 0.32, consumer’s risk about 0.06; lengthen the test.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Qualification/Demonstration Testing — OC curves, fixed-time test plans (Example 9.5, Table 9.1).</span></p>",
    "optionRationales": [
      "Swaps the two risks. The producer’s risk is evaluated at the acceptable MTBF, the consumer’s at the rejectable MTBF.",
      "Reads the acceptance probability at the acceptable MTBF (0.68) as the producer’s risk. The producer’s risk is the probability of rejecting there: \\(1 - 0.677 = 0.32\\).",
      "Reports the probability of rejecting at the rejectable MTBF (0.94) as the consumer’s risk. The consumer’s risk is the probability of accepting there, 0.06.",
      "Correct. \\(\\alpha = 1 - 0.677 = 0.32\\) and \\(\\beta = 0.062\\); the plan is lopsided against the producer."
    ],
    "keyPoint": "Producer’s risk: probability of rejecting at the acceptable value. Consumer’s risk: probability of accepting at the rejectable value. Both come from the OC curve.",
    "trap": "Swapping the risks, or reading the probability of rejection where the probability of acceptance is needed.",
    "formula": "\\(\\alpha = 1 - \\Pr(X \\le c \\mid T/m_0)\\), \\(\\beta = \\Pr(X \\le c \\mid T/m_1)\\)",
    "assumptions": [
      "Constant failure rate (exponential times between failures)."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "OC curve",
      "producer’s risk",
      "consumer’s risk",
      "fixed-time test",
      "discrimination ratio"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Qualification/demonstration testing — fixed-time test plans",
        "example": "Example 9.5"
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q48",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.4",
      "topic": "Degradation data: pseudo-failure times"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Five brake pads were measured for wear on a road-load rig. A pad fails when its wear reaches 8.0 mm. The established wear model for this material is a straight line through the origin, fitted to each pad’s three readings. How many pads are projected to reach the failure threshold before the 40,000 km warranty?",
    "chart": {
      "type": "data-table",
      "title": "Pad wear (mm) by distance",
      "columns": [
        "Pad",
        "5,000 km",
        "10,000 km",
        "15,000 km"
      ],
      "rows": [
        [
          "Pad 1",
          "0.75",
          "1.55",
          "2.30"
        ],
        [
          "Pad 2",
          "0.80",
          "1.70",
          "2.80"
        ],
        [
          "Pad 3",
          "0.95",
          "2.05",
          "3.20"
        ],
        [
          "Pad 4",
          "0.65",
          "1.30",
          "1.95"
        ],
        [
          "Pad 5",
          "1.15",
          "2.30",
          "3.45"
        ]
      ]
    },
    "options": [
      "0",
      "1",
      "2",
      "3"
    ],
    "answer": 2,
    "why": "<p>For a line through the origin, the least-squares slope is the sum of distance times wear divided by the sum of squared distances. With distances in thousands of km:</p><p>\\[\\begin{aligned}\\hat{s} &= \\frac{\\sum d_i w_i}{\\sum d_i^{2}} \\\\ &= \\frac{5w_1 + 10w_2 + 15w_3}{350} \\\\ L &= 8.0/\\hat{s}\\end{aligned}\\]</p><p>where \\(d_i\\) is the distance, \\(w_i\\) the wear at that distance, \\(\\hat{s}\\) the wear rate in mm per 1,000 km and \\(L\\) the projected distance to 8.0 mm. The projected lives are about 52,100 km (Pad 1), 44,400 km (Pad 2), 38,200 km (Pad 3), 61,500 km (Pad 4) and 34,800 km (Pad 5). Pads 3 and 5 reach 8.0 mm before 40,000 km.</p><p>\\[\\begin{aligned}\\hat{s}_3 &= \\frac{4.75 + 20.5 + 48.0}{350} \\\\ &= 0.209 \\\\ L_3 &= 8.0/0.209 \\\\ &= 38200 \\text{ km}\\end{aligned}\\]</p><p>where \\(\\hat{s}_3\\) and \\(L_3\\) are the wear rate and projected life of Pad 3, the closest call.</p><p><b>C. 2</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Degradation (wear-to-failure) testing — extrapolating to a failure threshold with a linear model.</span></p>",
    "optionRationales": [
      "No pad has reached 8.0 mm yet, but degradation testing projects each pad’s path to the threshold instead of waiting for failures.",
      "Uses only the first reading for Pad 3 (\\(0.95/5 = 0.19\\), so 42,100 km). The model is fitted to all three readings.",
      "Correct. Pads 3 (38,200 km) and 5 (34,800 km) are projected to fail within the warranty.",
      "Projects Pad 2 from its last interval alone, where wear was fastest, giving 38,600 km. The stated model uses all three readings."
    ],
    "keyPoint": "Degradation testing turns wear paths into pseudo-failure times by extrapolating each unit to the failure threshold with the agreed model.",
    "trap": "Waiting for actual failures, or projecting from one interval instead of the fitted model.",
    "formula": "\\(\\hat{s} = \\sum d_i w_i/\\sum d_i^{2}\\); \\(L = w_{\\text{fail}}/\\hat{s}\\)",
    "assumptions": [
      "Rig kilometres equal field kilometres.",
      "Wear stays linear through the origin up to 8.0 mm."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "degradation testing",
      "wear-to-failure",
      "pseudo-failure time",
      "linear model",
      "failure threshold"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Degradation",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q49",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.5",
      "topic": "Software availability from outage minutes"
    },
    "difficulty": "Easy",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A cloud scheduling service ran for a 30-day month (43,200 minutes) with the outages shown. Using the Handbook’s post-release availability metric, what was the availability for the month?",
    "chart": {
      "type": "data-table",
      "title": "Service outages this month",
      "columns": [
        "Outage",
        "Cause",
        "Duration (min)"
      ],
      "rows": [
        [
          "1",
          "Memory leak after an update",
          "60"
        ],
        [
          "2",
          "Database connection pool exhausted",
          "45"
        ],
        [
          "3",
          "Unhandled exception in the booking API",
          "25"
        ]
      ]
    },
    "options": [
      "99.10%",
      "99.70%",
      "99.76%",
      "99.86%"
    ],
    "answer": 1,
    "why": "<p>Availability compares outage time with total operating time:</p><p>\\[\\begin{aligned}A &= \\left(1 - \\frac{t_o}{t_p}\\right) \\times 100\\% \\\\ &= \\left(1 - \\frac{130}{43200}\\right) \\times 100\\% \\\\ &= 99.70\\%\\end{aligned}\\]</p><p>where \\(A\\) is the availability for the month, \\(t_o = 60 + 45 + 25 = 130\\) is the total outage time in minutes and \\(t_p = 43200\\) is the operating time in minutes.</p><p><b>B. 99.70%</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Software/Firmware Reliability — software design reliability (availability metric, Figure 9.10).</span></p>",
    "optionRationales": [
      "Counts only business hours as operating time (\\(30 \\times 8 \\times 60 = 14400\\) minutes). The service ran around the clock, so the month has 43,200 operating minutes.",
      "Correct. \\(1 - 130/43200 = 0.9970\\).",
      "Counts only the two outages longer than 30 minutes (105 minutes). Every outage counts against availability.",
      "Uses only the longest outage (60 minutes)."
    ],
    "keyPoint": "Software availability is \\(A = (1 - t_{\\text{outage}}/t_{\\text{operation}}) \\times 100\\%\\), counting every outage.",
    "trap": "Leaving out short outages or rounding durations.",
    "formula": "\\(A = (1 - t_{\\text{outage}}/t_{\\text{operation}}) \\times 100\\%\\)",
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "software availability",
      "outage",
      "software reliability metrics"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Software/firmware reliability — software design reliability",
        "example": "Figure 9.10"
      }
    ]
  },
  {
    "qid": "cre:set-1:b05-q50",
    "set": 1,
    "batch": 5,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.6",
      "topic": "Matching software test methods to their purpose"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "The test plan for infusion-pump firmware includes the four activities shown. Which set of labels is correct?",
    "chart": {
      "type": "data-table",
      "title": "Firmware test activities",
      "columns": [
        "Activity",
        "What the team does"
      ],
      "rows": [
        [
          "1",
          "Writes tests from the source code so that every branch of the dose-limit routine executes"
        ],
        [
          "2",
          "Runs tests weighted by how often nurses use each function, and uses the results to estimate field failure intensity"
        ],
        [
          "3",
          "Deliberately corrupts pressure-sensor inputs to confirm that the error handler alarms and stops the pump"
        ],
        [
          "4",
          "Reruns the full existing test suite after every defect fix"
        ]
      ]
    },
    "options": [
      "1 white-box; 2 operational profile; 3 fault injection; 4 regression",
      "1 black-box; 2 operational profile; 3 stress testing; 4 regression",
      "1 white-box; 2 black-box; 3 fault injection; 4 verification",
      "1 gray-box; 2 performance testing; 3 built-in testing; 4 regression"
    ],
    "answer": 0,
    "why": "<p>White-box tests are designed from knowledge of the internal structure, aiming to cover all paths and branches. Operational profile testing exercises the software as users actually use it; because the remaining faults are met at random in use, its results support a quantitative reliability estimate. Fault-injection testing deliberately introduces faults or bad inputs to check error handling. Regression testing reruns earlier tests after a change to confirm that nothing that worked has been broken.</p><p><b>A. 1 white-box; 2 operational profile; 3 fault injection; 4 regression</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Software Testing (white-box, black-box, gray-box, operational profile, fault-injection, regression testing).</span></p>",
    "optionRationales": [
      "Correct. Each activity matches its method.",
      "Activity 1 uses knowledge of the code, so it is white-box, not black-box; activity 3 injects faults rather than raising load.",
      "Activity 2 is black-box in a broad sense, but weighting by use to estimate field failure intensity is specifically operational profile testing; rerunning the suite after a fix is regression testing.",
      "Gray-box testing focuses on interfaces during integration, and built-in testing is self-test logic inside the product, not a test the team runs."
    ],
    "keyPoint": "White-box covers code paths; operational profile testing mirrors real use and supports reliability estimates; fault injection tests error handling; regression testing protects working functions after changes.",
    "trap": "Calling any test of external behavior black-box, or confusing fault injection with stress testing.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "software testing",
      "white-box",
      "operational profile",
      "fault injection",
      "regression testing"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Software testing",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q51",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.1",
      "topic": "Temperature–humidity acceleration (Arrhenius–Peck)"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "An outdoor controller is qualified with a temperature–humidity test using the conditions shown. Using the Arrhenius–Peck model, how many years of field life does 1,000 hours of testing represent?",
    "chart": {
      "type": "data-table",
      "title": "Temperature–humidity test conditions",
      "columns": [
        "Item",
        "Field",
        "Test"
      ],
      "rows": [
        [
          "Temperature",
          "40 °C",
          "85 °C"
        ],
        [
          "Relative humidity",
          "70%",
          "85%"
        ],
        [
          "Activation energy",
          "0.75 eV",
          "0.75 eV"
        ],
        [
          "Humidity exponent (Peck)",
          "−2.66",
          "−2.66"
        ],
        [
          "Field operation",
          "24 h per day, all year",
          "—"
        ]
      ]
    },
    "options": [
      "2.2 years",
      "3.8 years",
      "4.6 years",
      "6.3 years"
    ],
    "answer": 3,
    "why": "<p>The Arrhenius–Peck acceleration factor is the product of a humidity term and a temperature term:</p><p>\\[\\begin{aligned}\\text{AF}_H &= (70/85)^{-2.66} \\\\ &= 1.68 \\\\ \\text{AF}_T &= e^{(E_A/k)\\Delta} \\\\ &= e^{8703(0.000401)} \\\\ &= 32.9 \\\\ \\text{AF} &= 1.68 \\times 32.9 \\\\ &= 55.1\\end{aligned}\\]</p><p>where \\(\\text{AF}_H\\) is the humidity term (field over test relative humidity, raised to the Peck exponent), \\(\\text{AF}_T\\) the Arrhenius term, \\(E_A = 0.75\\) eV, \\(k = 8.617 \\times 10^{-5}\\) eV/K, \\(T_U = 313.15\\) K and \\(T_S = 358.15\\) K, so \\(8703 = 0.75/k\\) and \\(\\Delta = 1/T_U - 1/T_S = 0.000401\\). Then:</p><p>\\[\\begin{aligned}t_{\\text{field}} &= 55.1 \\times 1000 \\\\ &= 55100 \\text{ h} \\\\ &= 55100/8760 \\\\ &= 6.3 \\text{ years}\\end{aligned}\\]</p><p>where \\(t_{\\text{field}}\\) is the equivalent field time and 8,760 is the number of hours in a year of continuous operation.</p><p><b>D. 6.3 years</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Accelerated Life Tests — multiple-stress tests, Arrhenius–Peck model (Equation 9.3, Example 9.3).</span></p>",
    "optionRationales": [
      "Inverts the humidity term (\\(1/1.68\\)), so humidity appears to slow the test down: \\(32.9/1.68 \\times 1000/8760 = 2.2\\) years.",
      "Uses the Arrhenius term alone (\\(\\text{AF} = 32.9\\)) and ignores the extra humidity in the test.",
      "Multiplies by the plain humidity ratio \\(85/70 = 1.21\\) instead of raising it to the Peck exponent.",
      "Correct. \\(\\text{AF} = 1.68 \\times 32.9 = 55.1\\), so 1,000 h equals about 6.3 years."
    ],
    "keyPoint": "Arrhenius–Peck: \\(\\text{AF} = (\\text{RH}_{\\text{use}}/\\text{RH}_{\\text{test}})^{-2.66} \\times \\exp[(E_A/k)(1/T_U - 1/T_S)]\\), with temperatures in kelvin.",
    "trap": "Dropping or inverting the humidity term, or using the plain humidity ratio without the exponent.",
    "formula": "\\(\\text{AF} = (\\text{RH}_U/\\text{RH}_S)^{-2.66}\\exp[(E_A/k)(1/T_U - 1/T_S)]\\)",
    "assumptions": [
      "The same failure mechanism operates in the field and in the test."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Peck model",
      "temperature-humidity",
      "acceleration factor",
      "Arrhenius",
      "multiple-stress test"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Accelerated life tests — multiple-stress tests",
        "example": "Example 9.3"
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q52",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.1",
      "topic": "Activation energy from two stress levels, then extrapolation"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "Capacitors were life-tested at two temperatures. Failure analysis confirmed the same failure mechanism at both, and the Weibull shapes were equal. Assuming the Arrhenius model, estimate the B10 life at the 40 °C use temperature.",
    "chart": {
      "type": "data-table",
      "title": "Two-temperature life test: capacitors",
      "columns": [
        "Test temperature",
        "B10 life (h)",
        "Failure mechanism",
        "Weibull shape"
      ],
      "rows": [
        [
          "125 °C",
          "600",
          "Dielectric breakdown",
          "1.8"
        ],
        [
          "85 °C",
          "4,800",
          "Dielectric breakdown",
          "1.8"
        ]
      ]
    },
    "options": [
      "About 38,400 h",
      "About 49,800 h",
      "About 94,000 h",
      "About 108,600 h"
    ],
    "answer": 2,
    "why": "<p>The ratio of lives at the two test temperatures gives the activation energy:</p><p>\\[\\begin{aligned}\\text{AF}_1 &= 4800/600 = 8 \\\\ \\Delta_1 &= 1/T_{85} - 1/T_{125} \\\\ &= 0.0002805 \\\\ E_A &= k \\ln 8/\\Delta_1 \\\\ &= 0.639 \\text{ eV}\\end{aligned}\\]</p><p>where \\(\\text{AF}_1\\) is the acceleration factor between the two test temperatures, \\(T_{85} = 358.15\\) K, \\(T_{125} = 398.15\\) K and \\(k = 8.617 \\times 10^{-5}\\) eV/K. Then extrapolate from 85 °C to the 313.15 K use temperature:</p><p>\\[\\begin{aligned}\\Delta_2 &= 1/313.15 - 1/358.15 \\\\ &= 0.000401 \\\\ \\text{AF}_2 &= e^{(E_A/k)\\Delta_2} \\\\ &= e^{7413(0.000401)} \\\\ &= 19.6 \\\\ L_{40} &= 4800(19.6) \\\\ &= 94000 \\text{ h}\\end{aligned}\\]</p><p>where \\(7413 = 0.639/k\\), \\(\\text{AF}_2\\) is the acceleration factor between 40 °C and 85 °C and \\(L_{40}\\) the B10 life at use. Equal shapes and the same mechanism are what justify applying one acceleration factor to every percentile.</p><p><b>C. About 94,000 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Accelerated Life Tests — Arrhenius model (Equation 9.1); verifying the acceleration factor with several stress levels.</span></p>",
    "optionRationales": [
      "Applies the same factor of 8 once more for the step from 85 °C down to 40 °C (\\(4800 \\times 8\\)). The acceleration factor depends on the change in \\(1/T\\) in kelvin, which differs between the two steps.",
      "Assumes the same factor of 8 for every 40 °C step (\\(8^{45/40}\\)). Equal steps in Celsius do not give equal factors; the factor depends on \\(1/T\\) in kelvin.",
      "Correct. \\(E_A = 0.639\\) eV and \\(\\text{AF} = 19.6\\), so \\(L_{40} = 94000\\) h.",
      "Uses the rule of thumb that life doubles every 10 °C (\\(2^{4.5} = 22.6\\)). The test data define the activation energy, so the rule is not needed and overstates the life."
    ],
    "keyPoint": "With the same mechanism at two stress levels, estimate the activation energy from the data, then extrapolate in 1/T (kelvin).",
    "trap": "Extrapolating linearly or in equal Celsius steps, or falling back on the 10 °C rule when data give the activation energy.",
    "formula": "\\(E_A = k\\ln(L_1/L_2)/(1/T_1 - 1/T_2)\\); \\(L_U = L_S\\exp[(E_A/k)(1/T_U - 1/T_S)]\\)",
    "assumptions": [
      "The Arrhenius model holds from 40 °C to 125 °C for this mechanism."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "activation energy",
      "Arrhenius",
      "acceleration factor",
      "extrapolation",
      "B10 life"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Accelerated life tests — Arrhenius model",
        "example": "Example 9.1"
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q53",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.2",
      "topic": "Effect of burn-in on early field failures"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A module population has early-life failures described by a Weibull distribution with the parameters shown. Every module will receive a 168-hour burn-in, and only survivors ship. What fraction of shipped modules is expected to fail in their first 2,000 hours of service?",
    "chart": {
      "type": "data-table",
      "title": "Burn-in planning data",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Weibull shape \\(\\beta\\)",
          "0.4"
        ],
        [
          "Weibull scale \\(\\eta\\)",
          "50,000 h"
        ],
        [
          "Burn-in",
          "168 h at use conditions"
        ],
        [
          "Field period of interest",
          "First 2,000 h of service"
        ]
      ]
    },
    "options": [
      "9.7%",
      "15.1%",
      "16.7%",
      "24.1%"
    ],
    "answer": 2,
    "why": "<p>Shipped modules have already survived 168 h, so the field failure fraction is a conditional probability:</p><p>\\[\\begin{aligned}R(t) &= e^{-(t/\\eta)^{\\beta}} \\\\ R(168) &= e^{-(0.00336)^{0.4}} \\\\ &= 0.9026 \\\\ R(2168) &= e^{-(0.04336)^{0.4}} \\\\ &= 0.7520 \\\\ F &= 1 - \\frac{R(2168)}{R(168)} \\\\ &= 1 - 0.8332 \\\\ &= 16.7\\%\\end{aligned}\\]</p><p>where \\(R(t)\\) is the reliability at age \\(t\\) in hours and \\(F\\) the fraction of shipped modules failing in their first 2,000 h. Without burn-in, \\(1 - R(2000) = 24.1\\%\\) would fail, so the burn-in removes about a third of early field failures at the cost of a 9.7% burn-in fallout.</p><p><b>C. 16.7%</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Stress Screening (burn-in and the early-failure part of the bathtub curve); Ch. 6, Probability Functions (conditional reliability).</span></p>",
    "optionRationales": [
      "\\(1 - R(168) = 9.7\\%\\) is the fraction that fails during burn-in, not in service.",
      "Takes \\(F(2168) - F(168) = 0.248 - 0.097\\) without dividing by \\(R(168)\\). That is the fraction of all built modules failing in service; for shipped modules it must be conditioned on surviving burn-in.",
      "Correct. \\(1 - R(2168)/R(168) = 16.7\\%\\).",
      "\\(1 - R(2000) = 24.1\\%\\) ignores the burn-in entirely."
    ],
    "keyPoint": "After burn-in, field reliability is conditional: \\(R(t \\mid t_b) = R(t_b + t)/R(t_b)\\). A decreasing hazard (\\(\\beta \\lt 1\\)) is what makes burn-in worthwhile.",
    "trap": "Ignoring the burn-in, forgetting to divide by the burn-in survival, or quoting burn-in fallout as field failures.",
    "formula": "\\(F = 1 - R(t_b + t)/R(t_b)\\), \\(R(t) = e^{-(t/\\eta)^{\\beta}}\\)",
    "assumptions": [
      "Burn-in at use conditions ages modules exactly as field service would."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "burn-in",
      "infant mortality",
      "conditional reliability",
      "Weibull",
      "stress screening"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Stress screening",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q54",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.3",
      "topic": "Reading a sequential (PRST) demonstration test"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A probability ratio sequential test (PRST) has an acceptable MTBF of 4,000 h, a rejectable MTBF of 2,000 h and \\(\\alpha = \\beta = 0.10\\). Its decision lines are \\(r = \\pm 3.17 + 3.607 \\times 10^{-4}\\,T\\), where \\(r\\) is the number of failures and \\(T\\) the cumulative test hours. After 15,000 hours there have been 4 failures. What is the decision now, and if testing continues without another failure, about how many more hours are needed to accept?",
    "chart": {
      "type": "cre-xy-plot",
      "title": "Sequential test plan: decision lines",
      "eyebrow": "Sequential test (PRST)",
      "legend": true,
      "altText": "Number of failures against cumulative test hours from 0 to 30,000. The reject line rises from 3.2 failures at 0 hours to 14 failures at 30,000 hours. The accept line rises from 0 failures at about 8,800 hours to 7.7 failures at 30,000 hours. The region between the lines is continue testing. A marker shows the current result: 4 failures at 15,000 hours, between the lines.",
      "xTicks": [
        0,
        5000,
        10000,
        15000,
        20000,
        25000,
        30000
      ],
      "yTicks": [
        0,
        2,
        4,
        6,
        8,
        10,
        12,
        14
      ],
      "series": [
        {
          "label": "Reject line",
          "points": [
            [
              0,
              3.17
            ],
            [
              30000,
              13.99
            ]
          ],
          "showPoints": false
        },
        {
          "label": "Accept line",
          "dashed": true,
          "points": [
            [
              8789,
              0
            ],
            [
              30000,
              7.65
            ]
          ],
          "showPoints": false
        }
      ],
      "markers": [
        {
          "x": 15000,
          "y": 4,
          "label": "Now: 4 failures at 15,000 h"
        }
      ],
      "xLabel": "Cumulative test time (h)",
      "yLabel": "Number of failures"
    },
    "options": [
      "Continue testing; accept if no further failure occurs in about 4,900 more hours.",
      "Accept now: the point estimate, \\(15000/4 = 3750\\) h, is much closer to 4,000 h than to 2,000 h.",
      "Reject now: four failures is already more than the plan’s accept number at 15,000 h.",
      "Continue testing; accept if no further failure occurs in about 19,900 more hours."
    ],
    "answer": 0,
    "why": "<p>At 15,000 h the two lines bound the decision:</p><p>\\[\\begin{aligned}s &= 3.607 \\times 10^{-4} \\\\ r_{\\text{acc}} &= -3.17 + 15000s \\\\ &= 2.24 \\\\ r_{\\text{rej}} &= 3.17 + 15000s \\\\ &= 8.58\\end{aligned}\\]</p><p>where \\(s\\) is the slope of both lines, and \\(r_{\\text{acc}}\\) and \\(r_{\\text{rej}}\\) are the accept and reject boundaries. Accept needs \\(r \\le 2.24\\) and reject needs \\(r \\ge 8.58\\); with \\(r = 4\\), the result lies between the lines, so testing continues. With no more failures, acceptance comes when the accept line reaches 4:</p><p>\\[\\begin{aligned}4 &= -3.17 + sT \\\\ T &= 7.17/s \\\\ &= 19880 \\text{ h} \\\\ \\Delta T &= 19880 - 15000 \\\\ &= 4880 \\text{ h}\\end{aligned}\\]</p><p>where \\(T\\) is the cumulative time at which 4 failures meets the accept line and \\(\\Delta T\\) the additional time. The slope comes from \\((1/m_1 - 1/m_0)/\\ln(m_0/m_1)\\) and the intercepts from \\(\\ln[(1 - \\beta)/\\alpha]/\\ln(m_0/m_1)\\).</p><p><b>A. Continue; accept after about 4,900 more failure-free hours.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Qualification/Demonstration Testing — sequential test plans (PRST), Figure 9.9.</span></p>",
    "optionRationales": [
      "Correct. 4 failures is between the lines at 15,000 h; the accept line reaches 4 at about 19,900 h.",
      "A sequential test decides only from its boundaries. A point estimate does not account for the agreed risks.",
      "Exceeding the accept boundary means continue, not reject. Rejection needs the reject line, about 8.6 failures at 15,000 h.",
      "19,880 h is the total cumulative time at which 4 failures meets the accept line. 15,000 h have already run, so only about 4,900 more are needed."
    ],
    "keyPoint": "A sequential test has three regions: accept below the accept line, reject above the reject line, continue between them.",
    "trap": "Deciding from a point estimate, or treating \"above the accept line\" as reject.",
    "formula": "\\(r = \\pm\\frac{\\ln[(1 - \\beta)/\\alpha]}{\\ln(m_0/m_1)} + \\frac{1/m_1 - 1/m_0}{\\ln(m_0/m_1)}\\,T\\)",
    "assumptions": [
      "Constant failure rate; \\(\\alpha = \\beta\\), so the two intercepts are equal and opposite."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "sequential test",
      "PRST",
      "reliability demonstration",
      "accept line",
      "reject line"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Qualification/demonstration testing — sequential test plans",
        "example": "Figure 9.9"
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q55",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.3",
      "topic": "Choosing a fixed-time plan from IEC 61124"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A supplier must demonstrate an acceptable MTBF of 2,500 h against a rejectable MTBF of 1,250 h, with producer’s and consumer’s risks of 10% each. Twelve units will run on a replacement test. Using the excerpt of fixed-time plans shown, what are the required cumulative test time, the allowable number of failures, and the calendar time per unit?",
    "chart": {
      "type": "data-table",
      "title": "Fixed-time test plans (excerpt, IEC 61124)",
      "columns": [
        "Plan",
        "\\(\\alpha\\) (%)",
        "\\(\\beta\\) (%)",
        "Discrimination ratio \\(D\\)",
        "Test time \\(T/m_0\\)",
        "Allowable failures \\(c\\)"
      ],
      "rows": [
        [
          "B.5",
          "10",
          "10",
          "1.5",
          "32.14",
          "39"
        ],
        [
          "B.6",
          "10",
          "10",
          "2",
          "9.47",
          "13"
        ],
        [
          "B.7",
          "10",
          "10",
          "3",
          "3.10",
          "5"
        ],
        [
          "B.8",
          "10",
          "10",
          "5",
          "1.08",
          "2"
        ]
      ]
    },
    "options": [
      "23,675 h with up to 13 failures; about 1,970 h per unit.",
      "11,838 h with up to 13 failures; about 990 h per unit.",
      "7,750 h with up to 5 failures; about 650 h per unit.",
      "80,350 h with up to 39 failures; about 6,700 h per unit."
    ],
    "answer": 0,
    "why": "<p>The discrimination ratio is \\(m_0/m_1 = 2500/1250 = 2\\), so with 10% risks the plan is B.6:</p><p>\\[\\begin{aligned}T &= 9.47\\,m_0 = 9.47(2500) \\\\ &= 23675 \\text{ h} \\\\ t &= 23675/12 = 1973 \\text{ h}\\end{aligned}\\]</p><p>where \\(T\\) is the cumulative test time, \\(m_0\\) the acceptable MTBF and \\(t\\) the calendar time per position for 12 units on a replacement test. The plan accepts with 13 or fewer failures.</p><p><b>A. 23,675 h, 13 failures, about 1,970 h per unit.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Qualification/Demonstration Testing — fixed-time test plans (Table 9.1, Example 9.6).</span></p>",
    "optionRationales": [
      "Correct. Plan B.6: \\(T = 9.47 \\times 2500\\), \\(c = 13\\), and \\(23675/12 = 1973\\) h.",
      "Multiplies the factor by the rejectable MTBF (\\(9.47 \\times 1250\\)). The table expresses test time in multiples of \\(m_0\\).",
      "Uses plan B.7, which is for a discrimination ratio of 3: \\(3.10 \\times 2500\\).",
      "Uses plan B.5, which is for a discrimination ratio of 1.5."
    ],
    "keyPoint": "Pick the plan by risks and discrimination ratio \\(D = m_0/m_1\\); test time is \\(T = (T/m_0) \\times m_0\\). A smaller \\(D\\) needs far more test time.",
    "trap": "Multiplying by the rejectable MTBF, or choosing the plan for the wrong discrimination ratio.",
    "formula": "\\(D = m_0/m_1\\); \\(T = (T/m_0)\\,m_0\\); time per unit \\(= T/n\\)",
    "assumptions": [
      "Constant failure rate; failed units are replaced at once."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "fixed-time test",
      "IEC 61124",
      "discrimination ratio",
      "compliance test",
      "MTBF demonstration"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Qualification/demonstration testing — fixed-time test plans",
        "example": "Example 9.6"
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q56",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.4",
      "topic": "Extrapolating a degradation path to a failure threshold"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "An LED luminaire fails when its light output falls to 70% of initial output (L70). After 6,000 hours of testing, the output is 96% of initial. Light output for this design is known to follow an exponential decay, \\(\\Phi(t) = e^{-\\alpha t}\\). What is the projected L70 life?",
    "chart": null,
    "options": [
      "45,000 h",
      "52,400 h",
      "101,900 h",
      "177,000 h"
    ],
    "answer": 1,
    "why": "<p>Fit the decay rate from the 6,000-hour reading, then solve for the time at 70%:</p><p>\\[\\begin{aligned}\\alpha &= \\frac{-\\ln 0.96}{6000} \\\\ &= 6.80 \\times 10^{-6} \\text{ per h} \\\\ t_{70} &= \\frac{-\\ln 0.70}{\\alpha} \\\\ &= \\frac{0.3567}{6.80 \\times 10^{-6}} \\\\ &= 52400 \\text{ h}\\end{aligned}\\]</p><p>where \\(\\Phi(t)\\) is the fraction of initial light output at time \\(t\\), \\(\\alpha\\) the decay rate and \\(t_{70}\\) the projected L70 life.</p><p><b>B. 52,400 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Degradation (wear-to-failure) testing — linear, exponential and power-law degradation models.</span></p>",
    "optionRationales": [
      "Extrapolates linearly (4% lost per 6,000 h, so 30% at 45,000 h). The stated model is exponential, whose loss per hour slows as output falls.",
      "Correct. \\(\\alpha = 6.80 \\times 10^{-6}\\) per hour and \\(t_{70} = 52400\\) h.",
      "Solves for half the initial output (\\(-\\ln 0.50/\\alpha\\), the L50 life) instead of 70%.",
      "Solves for output falling to 30% (\\(-\\ln 0.30/\\alpha\\)) instead of to 70%."
    ],
    "keyPoint": "Degradation testing projects a measured characteristic to its failure threshold with the agreed degradation model, without waiting for failures.",
    "trap": "Using a straight line when the model is exponential, or misreading the threshold.",
    "formula": "\\(\\Phi(t) = e^{-\\alpha t}\\); \\(t_{70} = -\\ln 0.70/\\alpha\\)",
    "assumptions": [
      "The exponential decay model holds to 70% output."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "degradation testing",
      "LED lumen maintenance",
      "L70",
      "exponential model",
      "extrapolation"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Degradation",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q57",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.5",
      "topic": "Jelinski–Moranda software reliability model"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A Jelinski–Moranda model was fitted to failure data from system testing of navigation software. Using the estimates shown, what is the current failure intensity, and how many more faults must be found and fixed to reach the target?",
    "chart": {
      "type": "data-table",
      "title": "Jelinski–Moranda model estimates",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Estimated initial faults \\(N\\)",
          "80"
        ],
        [
          "Failure intensity per remaining fault \\(\\phi\\)",
          "0.0005 per CPU-hour"
        ],
        [
          "Faults found and fixed so far",
          "62"
        ],
        [
          "Target failure intensity",
          "0.004 per CPU-hour"
        ]
      ]
    },
    "options": [
      "0.031 per CPU-hour; 10 more faults.",
      "0.009 per CPU-hour; 10 more faults.",
      "0.009 per CPU-hour; 8 more faults.",
      "0.040 per CPU-hour; 72 more faults."
    ],
    "answer": 1,
    "why": "<p>In the Jelinski–Moranda model each remaining fault contributes the same failure intensity \\(\\phi\\):</p><p>\\[\\begin{aligned}\\lambda &= \\phi(N - k) \\\\ &= 0.0005(80 - 62) \\\\ &= 0.009 \\\\ N - k^{*} &\\le 0.004/0.0005 \\\\ &= 8 \\\\ k^{*} - k &= 72 - 62 \\\\ &= 10\\end{aligned}\\]</p><p>where \\(\\lambda\\) is the current failure intensity in failures per CPU-hour, \\(k\\) the number of faults fixed so far and \\(k^{*}\\) the number that must be fixed for no more than 8 faults to remain. The result relies on the model’s assumptions, notably that every fix is perfect and introduces no new faults.</p><p><b>B. 0.009 per CPU-hour; 10 more faults.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Software/Firmware Reliability — software reliability prediction (Jelinski–Moranda model and its assumptions).</span></p>",
    "optionRationales": [
      "Multiplies \\(\\phi\\) by the 62 faults already fixed. Only the remaining faults can still cause failures.",
      "Correct. \\(\\lambda = 0.0005 \\times 18 = 0.009\\); 8 faults may remain, so 10 more must be fixed.",
      "Eight is the number of faults that may remain at the target, not the number still to be fixed.",
      "Uses all 80 initial faults for the current intensity and the remaining count (\\(80 - 8\\)) as the work left."
    ],
    "keyPoint": "Jelinski–Moranda: failure intensity is proportional to the number of remaining faults, \\(\\lambda = \\phi(N - k)\\), assuming perfect fixes.",
    "trap": "Using faults found or initial faults instead of remaining faults.",
    "formula": "\\(\\lambda = \\phi(N - k)\\); faults to fix \\(= (N - \\lambda^{*}/\\phi) - k\\)",
    "assumptions": [
      "Jelinski–Moranda assumptions hold: equal fault contributions, random independent failures, negligible and perfect fixes."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "software reliability",
      "Jelinski-Moranda",
      "failure intensity",
      "reliability growth",
      "remaining faults"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Software/firmware reliability — software reliability prediction",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q58",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "B. Testing",
      "code": "IV.B.6",
      "topic": "Built-in testing"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "At every power-up, a ventilator’s firmware checks its own memory, verifies its sensors against reference values, and alerts the clinician if any check fails. Which type of software testing is this?",
    "chart": null,
    "options": [
      "Regression testing",
      "White-box testing",
      "Beta testing",
      "Built-in testing"
    ],
    "answer": 3,
    "why": "<p>Built-in testing is self-test logic designed into the product. It runs in operation, such as at power-up or periodically, and reports faults so that the system or user can respond. The other choices are activities performed by testers during development or release.</p><p><b>D. Built-in testing</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 9, Software Testing — built-in testing.</span></p>",
    "optionRationales": [
      "Regression testing reruns earlier tests after a change, during development.",
      "White-box testing is designed from the code structure by testers, not run by the product in service.",
      "Beta testing puts pre-release software in customers’ hands to find faults before release.",
      "Correct. Self-checks built into the product and run in operation are built-in testing."
    ],
    "keyPoint": "Built-in testing is self-test the product performs on itself in operation; the others are development or release test activities.",
    "trap": "Confusing a product feature (BIT) with a development test method.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "built-in testing",
      "BIT",
      "software testing",
      "self-test"
    ],
    "sourceSection": "Chapter 9 - Reliability Testing",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 9 - Reliability Testing",
        "section": "Software testing — built-in testing",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q59",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.1",
      "topic": "Series system with k-out-of-n and parallel stages"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A pump monitoring system works only if its power supply works, at least two of its three identical sensors work, and at least one of its two controllers works. Components fail independently, with the mission reliabilities shown. What is the system reliability?",
    "chart": {
      "type": "cre-rbd",
      "title": "Pump monitoring system",
      "altText": "Reliability block diagram with three stages in series. Stage 1: one power supply, reliability 0.99. Stage 2: three sensors in parallel, each 0.95, with at least 2 of 3 required. Stage 3: two controllers in parallel, each 0.97, with at least 1 of 2 required.",
      "stages": [
        {
          "label": "Power",
          "blocks": [
            {
              "label": "Power supply",
              "r": "0.99"
            }
          ]
        },
        {
          "label": "Sensors",
          "note": "2 of 3 required",
          "blocks": [
            {
              "label": "Sensor A",
              "r": "0.95"
            },
            {
              "label": "Sensor B",
              "r": "0.95"
            },
            {
              "label": "Sensor C",
              "r": "0.95"
            }
          ]
        },
        {
          "label": "Controllers",
          "note": "1 of 2 required",
          "blocks": [
            {
              "label": "Controller 1",
              "r": "0.97"
            },
            {
              "label": "Controller 2",
              "r": "0.97"
            }
          ]
        }
      ]
    },
    "options": [
      "0.848",
      "0.925",
      "0.982",
      "0.989"
    ],
    "answer": 2,
    "why": "<p>Evaluate each stage, then multiply the stages in series:</p><p>\\[\\begin{aligned}R_S &= 3(0.95)^{2}(0.05) \\\\ &\\quad + 0.95^{3} \\\\ &= 0.1354 + 0.8574 \\\\ &= 0.9928 \\\\ R_C &= 1 - 0.03^{2} \\\\ &= 0.9991 \\\\ R &= 0.99(0.9928)(0.9991) \\\\ &= 0.982\\end{aligned}\\]</p><p>where the two terms of \\(R_S\\) are the probabilities that exactly two or all three sensors work, \\(R_S\\) is the reliability of the 2-out-of-3 sensor stage, \\(R_C\\) that of the 1-out-of-2 controller stage and \\(R\\) the system reliability.</p><p><b>C. 0.982</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Reliability Block Diagrams and Models — series, parallel and k-out-of-n systems (Equation 10.3, Example 10.4).</span></p>",
    "optionRationales": [
      "Treats the sensors as a series stage (\\(0.95^{3}\\)), requiring all three.",
      "Treats the two controllers as a series stage (\\(0.97^{2}\\)), requiring both.",
      "Correct. \\(0.99 \\times 0.9928 \\times 0.9991 = 0.982\\).",
      "Treats the sensors as simple parallel (\\(1 - 0.05^{3}\\)), requiring only one of three."
    ],
    "keyPoint": "Build the system from its success logic: series stages multiply; a k-out-of-n stage uses the binomial sum; a 1-out-of-n stage is simple parallel.",
    "trap": "Treating a k-out-of-n stage as simple parallel or as series.",
    "formula": "\\(R_{k/n} = \\sum_{i=k}^{n}\\binom{n}{i}R^{i}(1 - R)^{n-i}\\); series \\(R = \\prod R_j\\)",
    "assumptions": [
      "Independent failures; identical sensors."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "reliability block diagram",
      "k-out-of-n",
      "series system",
      "parallel system",
      "redundancy"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Reliability block diagrams and models — k-out-of-n system",
        "example": "Example 10.4"
      }
    ]
  },
  {
    "qid": "cre:set-1:b06-q60",
    "set": 1,
    "batch": 6,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.2",
      "topic": "Identifying a failure mechanism from evidence"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, diagnosis",
    "quantitative": false,
    "stem": "Bolted flange joints on a hot-oil line leak after several months of service. The investigation findings are shown. Which failure mechanism best explains the leaks?",
    "chart": {
      "type": "data-table",
      "title": "Flange joint investigation",
      "columns": [
        "Finding",
        "Observation"
      ],
      "rows": [
        [
          "Operating temperature",
          "Steady 320 °C, no thermal cycling"
        ],
        [
          "Bolt torque at audit",
          "About 40% below the installation value on every leaking joint"
        ],
        [
          "Bolts and flanges",
          "No cracks, no fracture surfaces, no visible pitting or wall loss"
        ],
        [
          "Bolt length",
          "Unchanged within measurement resolution"
        ],
        [
          "Identical joints on a 60 °C water line in the same unit",
          "No torque loss, no leaks"
        ]
      ]
    },
    "options": [
      "Fatigue cracking of the bolts from cyclic thermal loading.",
      "Creep under constant strain (stress relaxation) of the hot bolted joints.",
      "General corrosion of the bolts, reducing their load-bearing area.",
      "Brittle fracture of the flange from a sudden overload."
    ],
    "answer": 1,
    "why": "<p>The joints are held at a fixed deformation (the bolts are tightened to a set stretch) and kept hot for months. With no cracks, no wall loss and no length change, the only change is a steady loss of clamping force, and only at high temperature. That is creep under constant strain, also called stress relaxation: the material relaxes while its deformation stays fixed, as in a bolt that gradually loosens. The identical joints on the 60 °C line, which keep their torque, confirm that temperature drives the mechanism.</p><p><b>B. Creep under constant strain (stress relaxation).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Physics of Failure and Failure Mechanisms — creep (creep under constant strain).</span></p>",
    "optionRationales": [
      "Fatigue needs cyclic stress and leaves cracks; the line runs at a steady temperature and no cracks were found.",
      "Correct. Clamping force falls at fixed deformation and high temperature, with no fracture or wall loss.",
      "No pitting or wall loss was found, and corrosion would not depend so strongly on the joint temperature here.",
      "A brittle fracture would leave a broken part. Nothing fractured."
    ],
    "keyPoint": "Creep can occur at constant stress (growing deformation) or at constant strain (relaxing stress); loosening bolted joints at high temperature are the classic constant-strain case.",
    "trap": "Assuming every loss of clamping force means fatigue or corrosion without matching the evidence.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "physics of failure",
      "creep",
      "stress relaxation",
      "bolted joint",
      "failure mechanism"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Physics of failure and failure mechanisms — creep",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q61",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.1",
      "topic": "Bridge system reliability by decomposition"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A cooling loop has two pump-and-valve paths with a crossover line between them, forming the bridge shown. Coolant reaches the outlet if any working route connects inlet to outlet. Components fail independently with the mission reliabilities shown. What is the system reliability?",
    "chart": {
      "type": "cre-rbd",
      "layout": "bridge",
      "title": "Cooling loop: bridge configuration",
      "altText": "Bridge reliability block diagram. Top path: Pump A (0.90) then Valve B (0.70). Bottom path: Pump C (0.70) then Valve D (0.90). Crossover E (0.80) connects the point between A and B to the point between C and D.",
      "bridge": {
        "A": {
          "label": "Pump A",
          "r": "0.90"
        },
        "B": {
          "label": "Valve B",
          "r": "0.70"
        },
        "C": {
          "label": "Pump C",
          "r": "0.70"
        },
        "D": {
          "label": "Valve D",
          "r": "0.90"
        },
        "E": {
          "label": "Crossover E",
          "r": "0.80"
        }
      }
    },
    "options": [
      "0.691",
      "0.863",
      "0.925",
      "0.941"
    ],
    "answer": 2,
    "why": "<p>A bridge has no series–parallel equivalent, so condition on the crossover E. If E works, the two pumps act in parallel and feed the two valves in parallel; if E fails, the system is two separate paths in parallel:</p><p>\\[\\begin{aligned}R_1 &= [1 - (0.10)(0.30)]^{2} \\\\ &= 0.97^{2} = 0.9409 \\\\ R_0 &= 1 - (1 - 0.63)^{2} \\\\ &= 0.8631 \\\\ R &= 0.80R_1 + 0.20R_0 \\\\ &= 0.7527 + 0.1726 \\\\ &= 0.925\\end{aligned}\\]</p><p>where \\(R_1\\) is the system reliability given E works, \\(R_0\\) given E fails, \\(0.10\\) and \\(0.30\\) are the failure probabilities of the two pumps (and, in the same pairing, of the two valves), and \\(0.63 = 0.90 \\times 0.70\\) is the reliability of each pump-and-valve path.</p><p><b>C. 0.925</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Reliability Block Diagrams and Models — bridge system; computation of reliability systems (conditioning on a component).</span></p>",
    "optionRationales": [
      "Puts E in series with the two separate paths: \\(0.80 \\times 0.8631\\). E is a redundant crossover, not a required element.",
      "Ignores the crossover: \\(1 - (1 - 0.63)^{2} = 0.863\\). E adds routes and raises reliability.",
      "Correct. \\(0.80(0.9409) + 0.20(0.8631) = 0.925\\).",
      "Assumes E never fails: \\(R_1 = 0.941\\). E works only with probability 0.80."
    ],
    "keyPoint": "Solve a bridge by conditioning on the bridging element: \\(R = R_E R_{\\text{system} \\mid E} + (1 - R_E) R_{\\text{system} \\mid \\bar{E}}\\).",
    "trap": "Ignoring the crossover, assuming it never fails, or placing it in series.",
    "formula": "\\(R = R_E\\,R(\\text{E works}) + (1 - R_E)\\,R(\\text{E fails})\\)",
    "assumptions": [
      "Independent component failures; the crossover can carry flow in either direction."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "bridge system",
      "reliability block diagram",
      "decomposition",
      "conditional probability",
      "redundancy"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Reliability block diagrams and models — bridge system",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q62",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.1",
      "topic": "Cold standby with an imperfect switch"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A booster station runs one pump, with an identical second pump in cold standby. Each pump has a constant failure rate of 1 per 2,000 h while running and does not fail while idle. The switch is needed only once, when the running pump fails, and the switchover then succeeds with probability 0.95. What is the probability that the station runs through a 1,000-hour mission?",
    "chart": {
      "type": "cre-rbd",
      "title": "Booster station",
      "altText": "Reliability block diagram with one stage of two pumps in parallel: Pump 1 operating and Pump 2 in cold standby, with a note that switchover reliability is 0.95.",
      "stages": [
        {
          "label": "Pumps",
          "note": "Cold standby; switchover reliability 0.95",
          "blocks": [
            {
              "label": "Pump 1 (running)",
              "r": "rate 1 per 2,000 h"
            },
            {
              "label": "Pump 2 (standby)",
              "r": "rate 1 per 2,000 h"
            }
          ]
        }
      ]
    },
    "options": [
      "0.845",
      "0.864",
      "0.895",
      "0.910"
    ],
    "answer": 2,
    "why": "<p>With exponential pumps, the station survives if the first pump lasts the mission, or if it fails, the switch works and the standby pump lasts the rest:</p><p>\\[\\begin{aligned}\\lambda t &= 1000/2000 = 0.5 \\\\ R &= e^{-\\lambda t}(1 + R_{sw}\\lambda t) \\\\ &= 0.6065(1 + 0.95 \\times 0.5) \\\\ &= 0.6065(1.475) \\\\ &= 0.895\\end{aligned}\\]</p><p>where \\(\\lambda\\) is each pump’s failure rate, \\(t\\) the mission time and \\(R_{sw}\\) the switchover reliability. The term \\(R_{sw}\\lambda t\\,e^{-\\lambda t}\\) is the probability that exactly one running failure occurs and the switch succeeds.</p><p><b>C. 0.895</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Reliability Block Diagrams and Models — standby systems (cold, warm and hot standby).</span></p>",
    "optionRationales": [
      "Treats the pumps as hot parallel: \\(1 - (1 - e^{-0.5})^{2} = 0.845\\). A cold standby pump does not age while idle, so it is better than hot redundancy.",
      "Multiplies the perfect-switch result by the switch reliability (\\(0.95 \\times 0.910\\)), as if the switch had to work even when no switchover is needed.",
      "Correct. \\(e^{-0.5}(1 + 0.95 \\times 0.5) = 0.895\\).",
      "Assumes a perfect switch: \\(e^{-0.5}(1 + 0.5) = 0.910\\)."
    ],
    "keyPoint": "Cold standby (exponential, two units): \\(R = e^{-\\lambda t}(1 + R_{sw}\\lambda t)\\). The switch matters only when a switchover is needed.",
    "trap": "Treating cold standby as hot parallel, ignoring the switch, or putting the switch in series.",
    "formula": "\\(R = e^{-\\lambda t}(1 + R_{sw}\\lambda t)\\)",
    "assumptions": [
      "Identical pumps; no failures while idle; one switchover attempt."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "standby redundancy",
      "cold standby",
      "switch reliability",
      "exponential",
      "redundancy"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Reliability block diagrams and models — standby systems",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q63",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.3",
      "topic": "Competing failure modes and conditional mission reliability"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A gearbox fails from either of two independent modes, shown in the table. A gearbox that has already run 3,000 hours without failure is assigned a 5,000-hour mission. What is the probability that it completes the mission?",
    "chart": {
      "type": "data-table",
      "title": "Gearbox failure modes",
      "columns": [
        "Mode",
        "Life distribution",
        "Parameters"
      ],
      "rows": [
        [
          "Gear tooth wear-out",
          "Weibull",
          "\\(\\beta = 3\\), \\(\\eta = 8000\\) h"
        ],
        [
          "Random bearing seizure",
          "Exponential",
          "\\(\\lambda = 2 \\times 10^{-5}\\) per h"
        ]
      ]
    },
    "options": [
      "0.313",
      "0.351",
      "0.388",
      "0.709"
    ],
    "answer": 1,
    "why": "<p>Independent competing modes act like components in series, so their cumulative hazards add. For a unit already at 3,000 h, use the hazard accumulated between 3,000 h and 8,000 h:</p><p>\\[\\begin{aligned}\\Delta H_W &= 1^{3} - 0.375^{3} \\\\ &= 1 - 0.0527 \\\\ &= 0.9473 \\\\ \\Delta H_E &= \\lambda(5000) \\\\ &= 0.10 \\\\ R &= e^{-(0.9473 + 0.10)} \\\\ &= 0.351\\end{aligned}\\]</p><p>where \\(\\Delta H_W\\) is the wear-out cumulative hazard over the mission, using \\(8000/\\eta = 1\\) and \\(3000/\\eta = 0.375\\); \\(\\Delta H_E\\) is the random-mode hazard with \\(\\lambda = 2 \\times 10^{-5}\\) per hour; and \\(R\\) is the conditional mission reliability.</p><p><b>B. 0.351</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Failure Models — failure distributions without additional factors (competing failure causes as a series system); Ch. 6, conditional reliability.</span></p>",
    "optionRationales": [
      "\\(R(8000) = e^{-(1 + 0.16)} = 0.313\\) is the probability that a new gearbox reaches 8,000 h; it ignores the 3,000 h already survived.",
      "Correct. \\(e^{-(0.9473 + 0.10)} = 0.351\\).",
      "Drops the random mode: \\(e^{-0.9473} = 0.388\\). Both modes act during the mission.",
      "Treats the gearbox as new for a 5,000 h mission: \\(e^{-(0.244 + 0.10)} = 0.709\\). With wear-out, age matters."
    ],
    "keyPoint": "Competing independent modes multiply reliabilities (add hazards). With a wear-out mode, mission reliability depends on age, so condition on the time already survived.",
    "trap": "Treating a worn unit as new, or dropping a mode.",
    "formula": "\\(R(t \\mid t_0) = \\exp\\{-[H_W(t) - H_W(t_0)] - \\lambda(t - t_0)\\}\\)",
    "assumptions": [
      "The two modes are independent."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "competing failure modes",
      "series system",
      "conditional reliability",
      "Weibull",
      "exponential"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Failure models — failure distributions without additional factors",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q64",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.3",
      "topic": "Eyring versus Arrhenius acceleration factor"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A metallization failure mechanism has a quasi-activation energy of 0.90 eV. Devices run at a 55 °C junction temperature in use and will be tested at 125 °C. Using the Eyring model with temperature exponent \\(m = 1\\), what is the acceleration factor?",
    "chart": null,
    "options": [
      "222",
      "269",
      "327",
      "612"
    ],
    "answer": 2,
    "why": "<p>The Eyring factor is the Arrhenius factor multiplied by the ratio of absolute temperatures raised to \\(m\\):</p><p>\\[\\begin{aligned}\\text{AF}_{Ar} &= e^{(E_a/k)(1/T_U - 1/T_S)} \\\\ &= e^{10444(0.0005357)} \\\\ &= 269 \\\\ \\text{AF}_{Ey} &= \\left(\\frac{T_S}{T_U}\\right)^{m}\\text{AF}_{Ar} \\\\ &= \\frac{398.15}{328.15}(269) \\\\ &= 327\\end{aligned}\\]</p><p>where \\(T_U = 328.15\\) K and \\(T_S = 398.15\\) K, \\(E_a = 0.90\\) eV, \\(k = 8.617 \\times 10^{-5}\\) eV/K, \\(10444 = 0.90/k\\) and \\(0.0005357 = 1/T_U - 1/T_S\\). The Eyring factor here is about 21% larger than the Arrhenius factor.</p><p><b>C. 327</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Failure Models — Eyring model and its relationship to the Arrhenius acceleration factor (Equation 10.10, Example 10.8).</span></p>",
    "optionRationales": [
      "Inverts the temperature ratio (\\(T_U/T_S\\)), which lowers instead of raises the factor.",
      "The Arrhenius factor alone. The Eyring model adds the \\((T_S/T_U)^{m}\\) term.",
      "Correct. \\(1.213 \\times 269 = 327\\).",
      "Uses Celsius temperatures in the ratio (\\(125/55 = 2.27\\)). Both Eyring terms need absolute temperature."
    ],
    "keyPoint": "Eyring: \\(\\text{AF}_{Ey} = (T_S/T_U)^{m}\\,\\text{AF}_{Ar}\\), with temperatures in kelvin; for \\(m\\) near 0 it reduces to Arrhenius.",
    "trap": "Inverting the temperature ratio, using Celsius in the ratio, or stopping at the Arrhenius factor.",
    "formula": "\\(\\text{AF}_{Ey} = (T_S/T_U)^{m}\\exp[(E_a/k)(1/T_U - 1/T_S)]\\)",
    "assumptions": [],
    "estimatedMinutes": 3,
    "keywords": [
      "Eyring model",
      "Arrhenius",
      "acceleration factor",
      "activation energy"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Failure models — Eyring model",
        "example": "Example 10.8"
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q65",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.3",
      "topic": "Coffin–Manson thermal cycling: fitting the exponent and extrapolating"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "Solder joints were thermally cycled at two temperature ranges until half had failed. In service, the joints see a 40 °C swing twice a day. Using the Coffin–Manson thermal cycling model fitted to the two test levels, how many years until half of the joints fail in service?",
    "chart": {
      "type": "data-table",
      "title": "Thermal cycling test results",
      "columns": [
        "Temperature swing \\(\\Delta T\\)",
        "Median cycles to failure"
      ],
      "rows": [
        [
          "140 °C",
          "1,200"
        ],
        [
          "100 °C",
          "2,750"
        ],
        [
          "Field: 40 °C, twice a day",
          "?"
        ]
      ]
    },
    "options": [
      "20.1 years",
      "36.0 years",
      "72.1 years",
      "82.6 years"
    ],
    "answer": 1,
    "why": "<p>Coffin–Manson for thermal cycling is a power law in the temperature range, \\(N = a\\,\\Delta T^{-b}\\). Fit \\(b\\) from the two test levels, then extrapolate to 40 °C:</p><p>\\[\\begin{aligned}b &= \\frac{\\ln(2750/1200)}{\\ln(140/100)} \\\\ &= \\frac{0.8293}{0.3365} = 2.465 \\\\ N_{40} &= 1200\\left(\\frac{140}{40}\\right)^{2.465} \\\\ &= 1200(21.9) \\\\ &= 26300 \\text{ cycles} \\\\ t &= \\frac{26300}{2 \\times 365} \\\\ &= 36.0 \\text{ years}\\end{aligned}\\]</p><p>where \\(N\\) is the median number of cycles to failure, \\(\\Delta T\\) the temperature range, \\(b\\) the fitted exponent and \\(t\\) the median life in years at two cycles a day.</p><p><b>B. 36.0 years</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Failure Models — Coffin–Manson thermal cycling relationship (Example 10.9).</span></p>",
    "optionRationales": [
      "Assumes a textbook exponent of 2 instead of fitting it: \\(1200(3.5)^{2}/730 = 20.1\\) years.",
      "Correct. \\(b = 2.465\\), \\(N_{40} = 26300\\) cycles, so 36.0 years at two cycles a day.",
      "Uses one cycle a day instead of two.",
      "Applies the 140-to-40 ratio to the 100 °C life: \\(2750(3.5)^{2.465}/730\\). The ratio must start from the level whose life is used."
    ],
    "keyPoint": "Coffin–Manson thermal cycling: \\(N = a\\,\\Delta T^{-b}\\). Fit \\(b\\) from at least two stress ranges, then scale from one test level with its own ratio.",
    "trap": "Assuming an exponent, pairing a life with the wrong ratio, or misconverting cycles to calendar time.",
    "formula": "\\(b = \\ln(N_2/N_1)/\\ln(\\Delta T_1/\\Delta T_2)\\); \\(N_U = N_1(\\Delta T_1/\\Delta T_U)^{b}\\)",
    "assumptions": [
      "The same fatigue mechanism operates from 40 °C to 140 °C ranges; dwell and ramp effects are ignored."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "Coffin-Manson",
      "thermal cycling",
      "solder fatigue",
      "power law",
      "extrapolation"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Failure models — Coffin-Manson model",
        "example": "Example 10.9"
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q66",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.2",
      "topic": "Corrosion growth under a varying temperature profile"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A buried steel tank wall corrodes at a constant rate at any fixed temperature (zero-order kinetics), with the rate following the Arrhenius relationship. Using the data shown, how many years until the corrosion depth reaches the allowable limit?",
    "chart": {
      "type": "data-table",
      "title": "Tank corrosion data",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Allowable corrosion depth",
          "0.50 mm"
        ],
        [
          "Corrosion rate at 20 °C",
          "0.010 mm per year"
        ],
        [
          "Activation energy",
          "0.40 eV"
        ],
        [
          "Soil temperature",
          "5 °C for half of each year, 35 °C for the other half (annual mean 20 °C)"
        ]
      ]
    },
    "options": [
      "23.1 years",
      "38.7 years",
      "50.0 years",
      "117.4 years"
    ],
    "answer": 1,
    "why": "<p>Because the rate depends exponentially on temperature, find the rate in each half-year, then add the depth grown in each:</p><p>\\[\\begin{aligned}r_5 &= 0.010\\,e^{4642\\Delta_5} \\\\ &= 0.010\\,e^{-0.854} \\\\ &= 0.00426 \\\\ r_{35} &= 0.010\\,e^{4642\\Delta_{35}} \\\\ &= 0.010\\,e^{0.771} \\\\ &= 0.0216 \\\\ r_{\\text{yr}} &= (0.00426 + 0.0216)/2 \\\\ &= 0.01294 \\\\ t &= 0.50/0.01294 \\\\ &= 38.7\\end{aligned}\\]</p><p>where \\(r_T\\) is the corrosion rate in mm per year at temperature \\(T\\) °C, \\(\\Delta_T = 1/293.15 - 1/(T + 273.15)\\), \\(4642 = 0.40/8.617 \\times 10^{-5}\\), \\(r_{\\text{yr}}\\) the average annual rate and \\(t\\) the life in years. The warm half-year does most of the damage.</p><p><b>B. 38.7 years</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Physics of Failure and Failure Mechanisms — corrosion (zero-order kinetics with an Arrhenius rate, combined across temperature intervals).</span></p>",
    "optionRationales": [
      "Uses the 35 °C rate for the whole year.",
      "Correct. The average annual rate is 0.01294 mm, so \\(0.50/0.01294 = 38.7\\) years.",
      "Uses the rate at the mean temperature (20 °C). Because the rate is exponential in temperature, the warm half-year adds more than the cold half-year saves, so the mean temperature overstates the life.",
      "Uses the 5 °C rate for the whole year."
    ],
    "keyPoint": "With an Arrhenius rate, compute damage in each temperature interval and add it; the rate at the average temperature understates the damage.",
    "trap": "Evaluating an exponential rate at the average temperature.",
    "formula": "\\(r(T) = r_0\\exp[(E_a/k)(1/T_0 - 1/T)]\\); depth \\(= \\sum r(T_i)\\,\\Delta t_i\\)",
    "assumptions": [
      "Zero-order (linear-in-time) corrosion at each temperature; uniform attack."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "corrosion",
      "physics of failure",
      "Arrhenius",
      "temperature profile",
      "damage accumulation"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Physics of failure — corrosion",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q67",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.4",
      "topic": "Parts count reliability prediction"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A controller board is predicted with a MIL-HDBK-217-style parts count method, using the base failure rates and \\(\\pi\\) factors shown (\\(\\pi_R = 1\\) for every part). Assuming a series model, what is the predicted MTBF of the board?",
    "chart": {
      "type": "data-table",
      "title": "Controller board parts list",
      "columns": [
        "Part",
        "Quantity",
        "Base rate \\(\\lambda_b\\) (per \\(10^{6}\\) h)",
        "\\(\\pi_E\\)",
        "\\(\\pi_Q\\)"
      ],
      "rows": [
        [
          "Microcontroller",
          "1",
          "0.050",
          "4",
          "2"
        ],
        [
          "Ceramic capacitor",
          "24",
          "0.0020",
          "4",
          "1"
        ],
        [
          "Film resistor",
          "40",
          "0.0012",
          "4",
          "1"
        ],
        [
          "Connector",
          "2",
          "0.030",
          "4",
          "1.5"
        ],
        [
          "Power MOSFET",
          "4",
          "0.012",
          "4",
          "2"
        ]
      ]
    },
    "options": [
      "About 654,000 h",
      "About 984,000 h",
      "About 1,452,000 h",
      "About 3,937,000 h"
    ],
    "answer": 0,
    "why": "<p>Each part’s predicted rate is \\(\\lambda_p = \\lambda_b\\pi_E\\pi_Q\\pi_R\\); multiply by the quantity and add, since the series model counts every part:</p><p>\\[\\begin{aligned}\\lambda &= 0.400 + 0.192 \\\\ &\\quad + 0.192 + 0.360 \\\\ &\\quad + 0.384 \\\\ &= 1.528 \\\\ \\text{MTBF} &= 10^{6}/1.528 \\\\ &= 654000 \\text{ h}\\end{aligned}\\]</p><p>where \\(\\lambda\\) is the board failure rate per \\(10^{6}\\) h and the five terms are the microcontroller (\\(1 \\times 0.050 \\times 4 \\times 2\\)), capacitors (\\(24 \\times 0.0020 \\times 4\\)), resistors (\\(40 \\times 0.0012 \\times 4\\)), connectors (\\(2 \\times 0.030 \\times 4 \\times 1.5\\)) and MOSFETs (\\(4 \\times 0.012 \\times 4 \\times 2\\)). A parts count result is a prediction for comparing designs and finding weak links, not a reliability estimate.</p><p><b>A. About 654,000 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Reliability Prediction Methods — part count predictions and part stress analysis (Examples 10.15–10.16).</span></p>",
    "optionRationales": [
      "Correct. \\(\\lambda = 1.528\\) per \\(10^{6}\\) h, so MTBF is about 654,000 h.",
      "Leaves out the quality factors \\(\\pi_Q\\).",
      "Counts each part type once instead of multiplying by its quantity.",
      "Uses the base rates alone, without quantities or \\(\\pi\\) factors."
    ],
    "keyPoint": "Parts count: \\(\\lambda_{\\text{board}} = \\sum n_i\\lambda_{b,i}\\pi_E\\pi_Q\\pi_R\\) under a series, constant-failure-rate model. It is a prediction, not an estimate from data.",
    "trap": "Forgetting quantities or adjustment factors.",
    "formula": "\\(\\lambda = \\sum n_i\\,\\lambda_{b,i}\\,\\pi_{E,i}\\,\\pi_{Q,i}\\,\\pi_{R,i}\\); \\(\\text{MTBF} = 1/\\lambda\\)",
    "assumptions": [
      "Series model with constant failure rates (the method’s assumptions, which the Handbook cautions are simplistic)."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "parts count",
      "MIL-HDBK-217",
      "reliability prediction",
      "pi factors",
      "MTBF"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Reliability prediction methods — part count predictions",
        "example": "Example 10.16"
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q68",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.4",
      "topic": "Simulating a failure time by inverse transform"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A Monte Carlo model of a conveyor draws idler-bearing failure times from a Weibull distribution with \\(\\beta = 2\\) and \\(\\eta = 5000\\) h. For one trial the random number from Uniform(0, 1) is \\(u = 0.75\\). Using the inverse transform method and setting the cumulative failure probability \\(F(t)\\) equal to \\(u\\), what failure time is simulated?",
    "chart": null,
    "options": [
      "5,890 h",
      "6,930 h",
      "9,610 h",
      "10,000 h"
    ],
    "answer": 0,
    "why": "<p>Set the Weibull CDF equal to the random number and solve for time:</p><p>\\[\\begin{aligned}u &= 1 - e^{-(t/\\eta)^{\\beta}} \\\\ t &= \\eta[-\\ln(1 - u)]^{1/\\beta} \\\\ &= 5000(1.386)^{0.5} \\\\ &= 5890 \\text{ h}\\end{aligned}\\]</p><p>where \\(u\\) is the uniform random number, \\(t\\) the simulated failure time, \\(\\eta\\) the scale and \\(\\beta\\) the shape. Repeating the draw many times builds the failure time distribution used in the system simulation.</p><p><b>A. 5,890 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Reliability Prediction Methods — simulating failure time with a known distribution (inverse transform, Example 10.11).</span></p>",
    "optionRationales": [
      "Correct. \\(5000(1.386)^{0.5} = 5890\\) h.",
      "Drops the shape parameter (\\(\\beta = 1\\)): \\(5000 \\ln 4 = 6930\\) h.",
      "Raises to the power \\(\\beta\\) instead of \\(1/\\beta\\): \\(5000(1.386)^{2}\\).",
      "Skips the logarithm: \\(5000[1/(1 - u)]^{1/\\beta} = 5000(2)\\)."
    ],
    "keyPoint": "Inverse transform: draw \\(u\\), then \\(t = F^{-1}(u)\\); for Weibull, \\(t = \\eta[-\\ln(1 - u)]^{1/\\beta}\\).",
    "trap": "Dropping the shape parameter, using the wrong exponent, or skipping the logarithm.",
    "formula": "\\(t = \\eta[-\\ln(1 - u)]^{1/\\beta}\\)",
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "Monte Carlo simulation",
      "inverse transform",
      "Weibull",
      "reliability prediction"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Reliability prediction methods — simulating failure time",
        "example": "Example 10.11"
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q69",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.5",
      "topic": "Correlating a digital model with prototype tests"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "A digital twin predicts the fatigue life of a pump housing. Physical prototypes were built and tested at the same five design points. Based on the results shown, which conclusion is best?",
    "chart": {
      "type": "data-table",
      "title": "Digital twin versus physical prototype (fatigue life, h)",
      "columns": [
        "Design point",
        "Digital prediction",
        "Physical test",
        "Physical / digital"
      ],
      "rows": [
        [
          "1",
          "1,200",
          "1,050",
          "0.875"
        ],
        [
          "2",
          "1,800",
          "1,560",
          "0.867"
        ],
        [
          "3",
          "2,500",
          "2,180",
          "0.872"
        ],
        [
          "4",
          "3,100",
          "2,700",
          "0.871"
        ],
        [
          "5",
          "4,000",
          "3,480",
          "0.870"
        ]
      ]
    },
    "options": [
      "The correlation is almost perfect, so the model can replace prototype testing as it stands.",
      "Each prediction differs from its test result, so the model should be set aside in favor of testing alone.",
      "Average the digital and physical lives at each point and report the averages as the life estimate.",
      "Physical life is consistently about 13% below prediction, so calibrate the model and keep verifying it."
    ],
    "answer": 3,
    "why": "<p>The physical-to-digital ratio is about 0.87 at every point, so the two sets are almost perfectly correlated: the model captures how design changes affect life. But physical life is consistently about 13% below the prediction. A model with a stable, systematic bias is useful once calibrated (for example, scaled by about 0.87), and the calibration should keep being checked as designs move away from the tested points. High correlation alone does not show accuracy.</p><p><b>D. Calibrate the model for its consistent 13% optimism.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Design Prototyping — correlation of physical prototypes and digital models (digital twins).</span></p>",
    "optionRationales": [
      "Correlation measures agreement in pattern, not in level. Uncalibrated, the model would overstate life.",
      "The errors are systematic, not random, which is exactly what calibration can correct.",
      "Averaging keeps half of the known bias and has no physical basis.",
      "Correct. The trend is right and the bias is consistent, so the model can be calibrated."
    ],
    "keyPoint": "Compare digital and physical results for both pattern (correlation) and level (bias). Correct a consistent bias by calibration and keep verifying.",
    "trap": "Treating high correlation as proof of accuracy, or discarding a model whose error is systematic.",
    "formula": null,
    "assumptions": [
      "The five design points span the range in which the model will be used."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "digital twin",
      "prototyping",
      "model validation",
      "calibration",
      "correlation"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Design prototyping — correlation of physical prototypes and digital models",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b07-q70",
    "set": 1,
    "batch": 7,
    "sub": "cre-testing",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "IV. Reliability Planning, Testing, and Modeling",
      "subdomain": "C. Modeling",
      "code": "IV.C.5",
      "topic": "Limits of rapid prototypes for reliability testing"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "A team plans to fatigue-test 3D-printed (fused deposition modeling) copies of an injection-molded nylon bracket to estimate the production bracket’s fatigue life. What is the main limitation?",
    "chart": null,
    "options": [
      "Printed parts cost too much to make enough samples for a meaningful fatigue test.",
      "Printed parts may not hold the bracket’s tolerances closely enough to fit the test fixture.",
      "The results will represent production as long as the parts are printed at 100% infill.",
      "Printed layers give a different internal structure and strength from the molded part, so fatigue results may not transfer."
    ],
    "answer": 3,
    "why": "<p>Additive manufacturing produces a different internal structure from extruded or molded material: layered, often with voids and direction-dependent strength. Rapid prototypes are valuable for checking form, fit and some failure modes, but test results tied to material structure, such as fatigue life, may not represent the production part.</p><p><b>D. Layered structure differs from the molded part, so fatigue results may not transfer.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 10, Design Prototyping — rapid prototyping technologies; prototyping advantages and limitations.</span></p>",
    "optionRationales": [
      "Fast, low-cost samples are one of the main advantages of rapid prototyping, not its limitation.",
      "Fit to the fixture is easy to check and correct; it does not undermine the fatigue result the way a different material structure does.",
      "Solid infill removes some voids, but the part is still built in layers with weaker bonds between them, so fatigue behavior can still differ from a molded part.",
      "Correct. The material structure differs, so structure-dependent results may not transfer."
    ],
    "keyPoint": "Rapid prototypes speed up design learning, but results that depend on material structure must be confirmed on production-representative parts.",
    "trap": "Assuming a printed part behaves like the production part.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "rapid prototyping",
      "3D printing",
      "fused deposition modeling",
      "prototype limitations"
    ],
    "sourceSection": "Chapter 10 - Reliability Modeling",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 10 - Reliability Modeling",
        "section": "Design prototyping — rapid prototyping technologies",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q71",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.1",
      "topic": "Building a P-diagram"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "A team builds a P-diagram for a solenoid flow-control valve before its design FMEA. Their classification of six items is shown. Which entry is misclassified?",
    "chart": {
      "type": "data-table",
      "title": "P-diagram entries: solenoid flow-control valve",
      "columns": [
        "Item",
        "Team’s classification"
      ],
      "rows": [
        [
          "Commanded flow setpoint",
          "Input signal"
        ],
        [
          "Spring stiffness",
          "Control factor"
        ],
        [
          "Seal material",
          "Control factor"
        ],
        [
          "Upstream fluid contamination",
          "Noise factor"
        ],
        [
          "Ambient temperature at the customer site",
          "Control factor"
        ],
        [
          "Seal leakage",
          "Error state"
        ]
      ]
    },
    "options": [
      "Spring stiffness as a control factor",
      "Upstream fluid contamination as a noise factor",
      "Seal leakage as an error state",
      "Ambient temperature at the customer site as a control factor"
    ],
    "answer": 3,
    "why": "<p>A P-diagram separates the input signal, the control factors the designer sets, the noise factors the designer cannot control (or chooses not to), the ideal output and the error states. The designer cannot set the temperature at a customer site, so it is a noise factor; the design must be robust to it. Treating it as controlled would hide a requirement, which is exactly what a P-diagram is meant to surface.</p><p><b>D. Ambient temperature at the customer site as a control factor</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Risk Management Techniques — P-diagrams.</span></p>",
    "optionRationales": [
      "Spring stiffness is a design parameter the engineer chooses, so it is a control factor.",
      "Contamination in the customer’s fluid is outside the designer’s control, so it is noise.",
      "Leakage is an unintended output of the valve, which is an error state.",
      "Correct. Customer-site temperature is noise; the designer can only make the valve robust to it."
    ],
    "keyPoint": "P-diagram: control factors are set by the designer; noise factors are not; error states are unintended outputs. Misclassifying noise as control hides requirements.",
    "trap": "Treating a use-environment condition as a design control.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "P-diagram",
      "noise factor",
      "control factor",
      "error state",
      "robust design"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Risk management techniques — P-diagrams",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q72",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.2",
      "topic": "Quantitative versus semi-quantitative risk ranking"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "A program ranks four risks with a five-by-five likelihood–severity score and also has quantitative estimates of annual probability and cost. Which risk has the largest expected annual loss, and what does the comparison show?",
    "chart": {
      "type": "data-table",
      "title": "Risk register: ordinal scores and quantitative estimates",
      "columns": [
        "Risk",
        "Annual probability",
        "Cost if it occurs",
        "Likelihood score",
        "Severity score",
        "Score product"
      ],
      "rows": [
        [
          "R1",
          "0.30",
          "$40,000",
          "5",
          "2",
          "10"
        ],
        [
          "R2",
          "0.02",
          "$2,000,000",
          "2",
          "5",
          "10"
        ],
        [
          "R3",
          "0.10",
          "$150,000",
          "4",
          "3",
          "12"
        ],
        [
          "R4",
          "0.005",
          "$600,000",
          "1",
          "4",
          "4"
        ]
      ]
    },
    "options": [
      "R2: its expected loss is the largest, though its score of 10 ranks below R3’s 12.",
      "R3: its score product of 12 is the highest, so its expected loss is the largest.",
      "R1: it is the most likely risk by far, so its expected loss is the largest.",
      "R1 and R2: their equal scores of 10 mean their expected losses are equal."
    ],
    "answer": 0,
    "why": "<p>Expected annual loss is probability times consequence:</p><p>\\[\\begin{aligned}L_1 &= 0.30(40000) = 12000 \\\\ L_2 &= 0.02(2000000) = 40000 \\\\ L_3 &= 0.10(150000) = 15000 \\\\ L_4 &= 0.005(600000) = 3000\\end{aligned}\\]</p><p>where \\(L_i\\) is the expected annual loss of risk \\(i\\) in dollars. R2 dominates, yet its score product (10) ranks below R3 (12) and ties R1. Ordinal scales compress consequences that differ by a factor of 50 into a few points, and multiplying ordinal ranks does not give a quantity. Semi-quantitative scores are useful for screening, but quantitative estimates should decide close or high-consequence cases.</p><p><b>A. R2; ordinal scores can misrank risks.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Risk Assessment — qualitative, quantitative and semi-quantitative methods; risk ranking; probabilistic risk assessment.</span></p>",
    "optionRationales": [
      "Correct. \\(0.02 \\times 2000000 = 40000\\) dollars a year, the largest of the four.",
      "R3’s expected loss is \\(0.10 \\times 150000 = 15000\\) dollars, well below R2’s. A higher ordinal product does not mean a higher expected loss.",
      "Likelihood alone ignores consequence: R1’s expected loss is \\(0.30 \\times 40000 = 12000\\) dollars.",
      "Equal ordinal products do not mean equal risks: R1 and R2 differ by more than a factor of three in expected loss."
    ],
    "keyPoint": "Expected loss is \\(p \\times C\\). Ordinal likelihood and severity scores are screening tools, and their product can misrank risks.",
    "trap": "Treating the product of ordinal ranks as a measure of risk.",
    "formula": "\\(L = p \\times C\\)",
    "assumptions": [
      "The probability and cost estimates are credible."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "risk assessment",
      "expected loss",
      "semi-quantitative",
      "risk ranking",
      "probabilistic risk assessment"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Risk assessment",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q73",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.3",
      "topic": "Classifying types of risk"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A reliability model for a pump overstated its mean life because one supplier’s data were entered in cycles while the model expected hours, and no one checked the units. Which type of risk does this represent?",
    "chart": null,
    "options": [
      "Operational (technical) risk",
      "Strategic (reputation) risk",
      "Financial risk",
      "Analytical risk"
    ],
    "answer": 3,
    "why": "<p>Analytical risk is the risk of losses from faulty analysis: incorrect computations, wrong methods or unit-conversion errors. The remedy is procedural: checks on computations, objective review of results and the right analytical competencies.</p><p><b>D. Analytical risk</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Types of Risk — analytical risks.</span></p>",
    "optionRationales": [
      "Operational risks arise in running the product or project, such as technical, schedule, safety and environmental risks. This error was in the analysis.",
      "A reputation impact might follow, but the risk itself arose from a flawed calculation.",
      "Financial losses may result, but the source of the risk is the analysis.",
      "Correct. A unit mix-up that corrupts a model is an analytical risk."
    ],
    "keyPoint": "Analytical risk comes from errors in analysis, such as wrong units, formulas or methods, and is controlled by review and verification of the analysis itself.",
    "trap": "Classifying a risk by its consequence rather than its source.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "types of risk",
      "analytical risk",
      "operational risk",
      "strategic risk"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Types of risk — analytical risks",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q74",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.1",
      "topic": "Fault tree evaluation with AND, OR and voting gates"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The fault tree shown models loss of cooling on a test rig. Basic events are independent, with the probabilities shown for one mission. What is the probability of the top event?",
    "chart": {
      "type": "cre-fault-tree",
      "title": "Loss of cooling",
      "altText": "Fault tree. Top event \"Loss of cooling\" is an OR gate with three inputs: \"No pumping\", \"Control fault\" and the basic event \"Valve stuck closed\" with probability 0.004. \"No pumping\" is an AND gate of \"Pump A fails\" (0.05) and \"Pump B fails\" (0.05). \"Control fault\" is a 2-out-of-3 voting gate of three sensor failures, each 0.02.",
      "root": {
        "label": "Loss of cooling",
        "gate": "OR",
        "children": [
          {
            "label": "No pumping",
            "gate": "AND",
            "children": [
              {
                "label": "Pump A fails",
                "p": "0.05"
              },
              {
                "label": "Pump B fails",
                "p": "0.05"
              }
            ]
          },
          {
            "label": "Control fault",
            "gate": "VOTE",
            "k": 2,
            "children": [
              {
                "label": "Sensor 1 fails",
                "p": "0.02"
              },
              {
                "label": "Sensor 2 fails",
                "p": "0.02"
              },
              {
                "label": "Sensor 3 fails",
                "p": "0.02"
              }
            ]
          },
          {
            "label": "Valve stuck closed",
            "p": "0.004"
          }
        ]
      }
    },
    "options": [
      "0.0065",
      "0.0077",
      "0.065",
      "0.102"
    ],
    "answer": 1,
    "why": "<p>Evaluate each gate from the bottom up, then combine the OR gate through its complement:</p><p>\\[\\begin{aligned}P_{\\text{AND}} &= 0.05^{2} = 0.0025 \\\\ P_{2/3} &= 3(0.02)^{2}(0.98) \\\\ &\\quad + 0.02^{3} \\\\ &= 0.001184 \\\\ P_{\\text{top}} &= 1 - \\textstyle\\prod(1 - P_i) \\\\ &= 1 - 0.99233 \\\\ &= 0.0077\\end{aligned}\\]</p><p>where \\(P_{\\text{AND}}\\) is the probability that both pumps fail, \\(P_{2/3}\\) that at least two of three sensors fail, \\(P_i\\) the three OR-gate inputs (so \\(\\prod(1 - P_i) = 0.9975 \\times 0.998816 \\times 0.996\\)) and \\(P_{\\text{top}}\\) the top event. The rare-event sum (\\(0.0025 + 0.001184 + 0.004 = 0.0077\\)) agrees because the inputs are small.</p><p><b>B. 0.0077</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Fault Tree Analysis — AND and OR gates; voting OR gates.</span></p>",
    "optionRationales": [
      "Treats the voting gate as an AND gate (all three sensors), which gives \\(0.02^{3}\\) and drops most of the control-fault probability.",
      "Correct. \\(1 - (0.9975)(0.998816)(0.996) = 0.0077\\).",
      "Treats the voting gate as an OR gate (any one sensor): \\(1 - 0.98^{3} = 0.0588\\).",
      "Treats the pump AND gate as an OR gate: \\(1 - 0.95^{2} = 0.0975\\)."
    ],
    "keyPoint": "AND: multiply probabilities; OR: \\(1 - \\prod(1 - p_i)\\); a k-of-n voting gate uses the binomial sum from \\(k\\) to \\(n\\).",
    "trap": "Reading a voting gate as AND or OR, or swapping AND and OR.",
    "formula": "\\(P_{\\text{AND}} = \\prod p_i\\); \\(P_{\\text{OR}} = 1 - \\prod(1 - p_i)\\); \\(P_{k/n} = \\sum_{i=k}^{n}\\binom{n}{i}p^{i}(1 - p)^{n-i}\\)",
    "assumptions": [
      "Independent basic events; no event appears twice in the tree."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "fault tree analysis",
      "AND gate",
      "OR gate",
      "voting gate",
      "top event"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Fault tree analysis — voting OR gates",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q75",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.1",
      "topic": "Repeated events and minimal cut sets in a fault tree"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "Two redundant pump trains each fail if their pump fails or if the shared power bus fails. The fault tree shown lists \"Shared power bus fails\" under both trains; it is the same physical event. With the probabilities shown, what is the probability of losing both trains?",
    "chart": {
      "type": "cre-fault-tree",
      "title": "Loss of both pump trains",
      "altText": "Fault tree. Top event \"Loss of both trains\" is an AND gate of \"Train A fails\" and \"Train B fails\". Each train is an OR gate of its own pump failure (0.05) and \"Shared power bus fails\" (0.01). The shared power bus event appears under both trains and is the same event.",
      "root": {
        "label": "Loss of both trains",
        "gate": "AND",
        "children": [
          {
            "label": "Train A fails",
            "gate": "OR",
            "children": [
              {
                "label": "Pump A fails",
                "p": "0.05"
              },
              {
                "label": "Shared power bus fails",
                "p": "0.01"
              }
            ]
          },
          {
            "label": "Train B fails",
            "gate": "OR",
            "children": [
              {
                "label": "Pump B fails",
                "p": "0.05"
              },
              {
                "label": "Shared power bus fails",
                "p": "0.01"
              }
            ]
          }
        ]
      }
    },
    "options": [
      "0.0025",
      "0.0035",
      "0.0125",
      "0.0595"
    ],
    "answer": 2,
    "why": "<p>A repeated event makes the two trains dependent, so the gate probabilities cannot simply be multiplied. Reduce the tree to its minimal cut sets first:</p><p>\\[\\begin{aligned}T &= (A + S)(B + S) \\\\ &= AB + S \\\\ P(T) &= P(S) \\\\ &\\quad + P(A)P(B)\\,q_S \\\\ &= 0.01 + 0.0025(0.99) \\\\ &= 0.0125\\end{aligned}\\]</p><p>where \\(A\\) and \\(B\\) are the pump failures, \\(S\\) the shared bus failure, \\(q_S = 1 - P(S) = 0.99\\) and \\(T\\) the top event; the minimal cut sets are \\(\\{S\\}\\) and \\(\\{A, B\\}\\). The single-event cut set \\(\\{S\\}\\) dominates: the shared bus defeats the redundancy.</p><p><b>C. 0.0125</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Fault Tree Analysis; Common Mode Failure Analysis (one cause defeating redundant elements).</span></p>",
    "optionRationales": [
      "Ignores the shared bus: \\(0.05^{2} = 0.0025\\).",
      "Multiplies the two train probabilities as if independent: \\(0.0595^{2} = 0.0035\\). The repeated event \\(S\\) is counted as two separate events.",
      "Correct. Minimal cut sets \\(\\{S\\}\\) and \\(\\{A, B\\}\\) give \\(0.01 + 0.0025(0.99) = 0.0125\\).",
      "\\(0.05 + 0.01 - 0.0005 = 0.0595\\) is the probability of losing one train, not both."
    ],
    "keyPoint": "When an event appears more than once in a fault tree, find the minimal cut sets (Boolean reduction) before calculating; multiplying gate probabilities double-counts it.",
    "trap": "Treating a repeated basic event as independent copies.",
    "formula": "\\((A + S)(B + S) = AB + S\\); \\(P = P(S) + P(A)P(B)[1 - P(S)]\\)",
    "assumptions": [
      "Pump failures and the bus failure are independent of each other."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "fault tree analysis",
      "minimal cut sets",
      "repeated event",
      "common cause",
      "Boolean reduction"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Fault tree analysis; common mode failure analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q76",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.2",
      "topic": "Prioritizing FMEA actions: severity versus RPN"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "A design FMEA for a vehicle brake module produced the ratings shown (1–10 scales). Company procedure follows action-priority logic: severity is considered first, then occurrence, then detection, rather than ranking by RPN. Which failure mode should receive action first?",
    "chart": {
      "type": "data-table",
      "title": "Design FMEA excerpt: brake module",
      "columns": [
        "Failure mode",
        "Effect",
        "Severity",
        "Occurrence",
        "Detection",
        "RPN"
      ],
      "rows": [
        [
          "M1: Cover rattles",
          "Noise noticed by most customers",
          "5",
          "7",
          "9",
          "315"
        ],
        [
          "M2: Brake line chafes through",
          "Loss of braking without warning",
          "10",
          "4",
          "6",
          "240"
        ],
        [
          "M3: Connector corrodes",
          "Intermittent warning lamp",
          "6",
          "6",
          "6",
          "216"
        ],
        [
          "M4: Label fades",
          "Regulatory marking illegible",
          "9",
          "2",
          "6",
          "108"
        ]
      ]
    },
    "options": [
      "M1, because it has the highest RPN (315).",
      "M2, because it has the highest severity, with an occurrence of 4.",
      "M3, because it has the highest severity times occurrence after M2.",
      "M4, because a regulatory effect outranks a safety effect."
    ],
    "answer": 1,
    "why": "<p>RPN multiplies three ordinal ranks, so a low-severity mode with poor detection can outscore a safety-critical one. Severity 9–10 entries, failures to meet safety or regulatory requirements, must be addressed first; action-priority logic gives a severity-10 mode high priority at any occurrence above the most remote. M2 combines the maximum severity with an occurrence of 4 and weak detection, so it comes first; M1, the RPN leader, is a quality annoyance.</p><p><b>B. M2: severity 10 comes first, not the RPN leader.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Failure Mode and Effects Analysis — severity ranking (Table 4.2); Fault Tree Analysis — action priority.</span></p>",
    "optionRationales": [
      "RPN hides severity: a noise complaint at 315 must not outrank loss of braking at 240.",
      "Correct. Severity 10 without warning, at occurrence 4, demands action first.",
      "Severity is considered before occurrence, and M3’s severity of 6 is far below M2’s 10; its severity-times-occurrence product (36) is also below M2’s (40).",
      "Severity 10 (safety without warning) ranks above 9 (regulatory with warning), and M4 also has the lowest occurrence."
    ],
    "keyPoint": "Prioritize by severity first, using action-priority logic, not RPN alone: safety and regulatory effects (9–10) come first.",
    "trap": "Ranking FMEA actions by RPN alone.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "FMEA",
      "RPN",
      "action priority",
      "severity",
      "design FMEA"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Failure mode and effects analysis — severity ranking",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q77",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.2",
      "topic": "Choosing the right type of FMEA"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "At the concept stage of a new aircraft cabin feature, only high-level requirements exist; no design, bill of materials or process has been chosen. The team wants to start an FMEA now. Which approach is appropriate?",
    "chart": null,
    "options": [
      "Start a functional FMEA on the requirements, rating severity now and leaving causes and occurrence for later.",
      "Start a design FMEA, rating occurrence and detection from similar products so that a full RPN is available now.",
      "Wait until design freeze, when the design is stable enough to support a complete design FMEA.",
      "Start a process FMEA, because the assembly steps will drive most of the feature’s failure modes."
    ],
    "answer": 0,
    "why": "<p>A functional (system) FMEA works from high-level requirements before any design exists: each failure mode is the failure to meet a requirement, and its effects and severity can be ranked. Causes, occurrence and detection depend on the design solution, so they cannot be assessed yet. Its value is shaping requirements early, when changes are cheap.</p><p><b>A. Functional (system) FMEA on the requirements.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Failure Mode and Effects Analysis — types of FMEAs (functional/system FMEA, Table 4.1).</span></p>",
    "optionRationales": [
      "Correct. It analyzes failure to meet each requirement and ranks severity, deferring cause, occurrence and detection.",
      "A design FMEA starts when the bill of materials is ready. Rating causes for a design that does not exist produces numbers without meaning.",
      "Starting an FMEA after design freeze is a warned-against mistake: the findings arrive too late to change the design cheaply.",
      "A process FMEA needs a process flow; none exists at the concept stage."
    ],
    "keyPoint": "Functional FMEA at concept (requirements, effects, severity); design FMEA when the BOM exists; process FMEA once the process flow exists.",
    "trap": "Forcing a full design FMEA, or waiting until design freeze.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "FMEA",
      "functional FMEA",
      "design FMEA",
      "process FMEA",
      "concept stage"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Failure mode and effects analysis — types of FMEAs",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q78",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.2",
      "topic": "FMECA criticality numbers"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "An FMECA in the MIL-STD-1629A style covers a hydraulic actuator with part failure rate \\(\\lambda_p = 40\\) per \\(10^{6}\\) h and a 500-hour mission. Using the mode data shown, what is the item criticality number for severity category I (catastrophic)?",
    "chart": {
      "type": "data-table",
      "title": "Actuator FMECA data",
      "columns": [
        "Failure mode",
        "Severity category",
        "Mode ratio \\(\\alpha\\)",
        "Loss probability \\(\\beta\\)"
      ],
      "rows": [
        [
          "External leak",
          "III (marginal)",
          "0.50",
          "0.10"
        ],
        [
          "Seizure",
          "I (catastrophic)",
          "0.30",
          "1.0"
        ],
        [
          "Slow response",
          "I (catastrophic)",
          "0.20",
          "0.50"
        ]
      ]
    },
    "options": [
      "0.008",
      "0.009",
      "0.010",
      "0.020"
    ],
    "answer": 0,
    "why": "<p>Each mode’s criticality number is the product of the loss probability, mode ratio, part failure rate and time; the item criticality for a category sums its modes:</p><p>\\[\\begin{aligned}C_m &= \\beta\\,\\alpha\\,\\lambda_p\\,t \\\\ \\lambda_p t &= (40 \\times 10^{-6})(500) \\\\ &= 0.02 \\\\ C_{\\text{seize}} &= 1.0(0.30)(0.02) \\\\ &= 0.006 \\\\ C_{\\text{slow}} &= 0.50(0.20)(0.02) \\\\ &= 0.002 \\\\ C_r(\\text{I}) &= 0.006 + 0.002 \\\\ &= 0.008\\end{aligned}\\]</p><p>where \\(C_m\\) is a mode criticality number, \\(\\beta\\) the probability that the mode causes the stated loss, \\(\\alpha\\) the fraction of the part’s failures in that mode and \\(C_r(\\text{I})\\) the item criticality for category I. The external leak belongs to category III and is reported separately.</p><p><b>A. 0.008</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, FMECA (criticality as severity and probability of occurrence); MIL-STD-1629A criticality numbers.</span></p>",
    "optionRationales": [
      "Correct. \\(0.006 + 0.002 = 0.008\\).",
      "Adds the category III leak (0.001). Item criticality is summed within a severity category.",
      "Leaves out the loss probability \\(\\beta\\): \\((0.30 + 0.20)(0.02)\\).",
      "Leaves out both \\(\\alpha\\) and \\(\\beta\\), using \\(\\lambda_p t = 0.02\\) for the whole item."
    ],
    "keyPoint": "FMECA: \\(C_m = \\beta\\alpha\\lambda_p t\\) for each mode; item criticality sums the modes within one severity category.",
    "trap": "Mixing severity categories or dropping a factor.",
    "formula": "\\(C_m = \\beta\\alpha\\lambda_p t\\); \\(C_r = \\sum C_m\\) within a severity category",
    "assumptions": [
      "Constant part failure rate."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "FMECA",
      "criticality number",
      "mode ratio",
      "severity category",
      "MIL-STD-1629"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Failure mode and effects analysis — FMECA",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q79",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.3",
      "topic": "Common cause failure in redundant systems"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "Two identical redundant pumps each have a probability of failing on demand of 0.02. Experience shows that 10% of pump failures come from a common cause that disables both pumps at once (a \\(\\beta\\)-factor model with \\(\\beta = 0.10\\)). What is the probability that both pumps fail on demand?",
    "chart": null,
    "options": [
      "0.00040",
      "0.00200",
      "0.00232",
      "0.0396"
    ],
    "answer": 2,
    "why": "<p>Split each pump’s failure probability into an independent part and a common cause part. The system fails if both pumps fail independently or if the common cause occurs:</p><p>\\[\\begin{aligned}Q_{\\text{ind}} &= (1 - \\beta)Q = 0.018 \\\\ Q_{\\text{ccf}} &= \\beta Q = 0.002 \\\\ Q_{\\text{sys}} &= Q_{\\text{ind}}^{2} + Q_{\\text{ccf}} \\\\ &= 0.000324 + 0.002 \\\\ &= 0.00232\\end{aligned}\\]</p><p>where \\(Q\\) is each pump’s failure-on-demand probability and \\(\\beta\\) the common cause fraction. The common cause term is six times the independent term: a small \\(\\beta\\) erodes most of the benefit of redundancy. Separation, diversity and protection against the shared cause are the remedies.</p><p><b>C. 0.00232</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Common Mode Failure Analysis (one cause defeating redundant elements); beta-factor model (IEC 61508-6).</span></p>",
    "optionRationales": [
      "Assumes fully independent pumps: \\(0.02^{2} = 0.0004\\). That ignores the common cause, which dominates.",
      "Keeps only the common cause term, \\(\\beta Q = 0.002\\), and drops the independent double failure.",
      "Correct. \\(0.018^{2} + 0.002 = 0.00232\\).",
      "Treats the pumps as if in series: \\(1 - 0.98^{2}\\). Either pump can still meet the demand."
    ],
    "keyPoint": "Common cause failures defeat redundancy: with a \\(\\beta\\)-factor model, \\(Q_{\\text{sys}} \\approx [(1 - \\beta)Q]^{2} + \\beta Q\\), usually dominated by \\(\\beta Q\\).",
    "trap": "Assuming redundant units fail independently.",
    "formula": "\\(Q_{\\text{sys}} = [(1 - \\beta)Q]^{2} + \\beta Q\\)",
    "assumptions": [
      "Identical pumps; the \\(\\beta\\)-factor model applies."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "common cause failure",
      "beta factor",
      "redundancy",
      "common mode failure"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Common mode failure analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b08-q80",
    "set": 1,
    "batch": 8,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.5",
      "topic": "Reading a risk assessment matrix"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "A program uses the risk assessment matrix shown (MIL-STD-882E style). Four hazards have been assessed: H1 catastrophic and remote; H2 marginal and frequent; H3 critical and occasional; H4 critical and probable. Which hazard has the highest risk level and should be addressed first?",
    "chart": {
      "type": "data-table",
      "title": "Risk assessment matrix",
      "columns": [
        "Probability",
        "Catastrophic (1)",
        "Critical (2)",
        "Marginal (3)",
        "Negligible (4)"
      ],
      "rows": [
        [
          "A: Frequent",
          "High",
          "High",
          "Serious",
          "Medium"
        ],
        [
          "B: Probable",
          "High",
          "High",
          "Serious",
          "Medium"
        ],
        [
          "C: Occasional",
          "High",
          "Serious",
          "Medium",
          "Low"
        ],
        [
          "D: Remote",
          "Serious",
          "Medium",
          "Medium",
          "Low"
        ],
        [
          "E: Improbable",
          "Medium",
          "Medium",
          "Medium",
          "Low"
        ]
      ]
    },
    "options": [
      "H1, because catastrophic severity places it in the High region.",
      "H2, because it is the most frequent hazard.",
      "H3, because critical severity at an occasional rate is the middle of the matrix.",
      "H4, because critical severity at a probable rate falls in the High region."
    ],
    "answer": 3,
    "why": "<p>The matrix combines severity and probability; neither alone sets the risk level. Reading the cells: H1 (catastrophic, remote) is Serious; H2 (marginal, frequent) is Serious; H3 (critical, occasional) is Serious; H4 (critical, probable) is High. H4 is the only High risk, so it is addressed first.</p><p><b>D. H4: High risk.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Risk Matrix; Hazard Analysis (risk matrix with scoring).</span></p>",
    "optionRationales": [
      "Catastrophic severity at a remote probability is Serious in this matrix, below High.",
      "A frequent marginal hazard is Serious, not High.",
      "Critical and occasional is Serious.",
      "Correct. Critical and probable is the only High cell among the four."
    ],
    "keyPoint": "A risk matrix ranks hazards by the combination of severity and likelihood; read the cell, not either axis alone.",
    "trap": "Ranking by severity alone or by likelihood alone.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "risk matrix",
      "hazard analysis",
      "MIL-STD-882E",
      "severity",
      "probability"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Risk matrix",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q81",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.2",
      "topic": "Probabilistic risk assessment with an event tree"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A probabilistic risk assessment for a boiler uses the event tree shown. Loss of feedwater occurs 0.5 times per year. The tree shows the cost of each damage outcome. What is the expected annual loss from loss-of-feedwater events?",
    "chart": {
      "type": "cre-prob-tree",
      "title": "Event tree: loss of feedwater (0.5 per year)",
      "altText": "Event tree starting from loss of feedwater, 0.5 times per year. The standby pump starts with probability 0.98 (no damage) or fails with probability 0.02. If it fails, the operator recovers with probability 0.90 (no damage) or fails with probability 0.10. If the operator fails, the relief valve opens with probability 0.99 (minor damage, $50,000) or fails with probability 0.01 (severe damage, $5,000,000).",
      "root": "Feedwater loss",
      "children": [
        {
          "label": "Pump starts",
          "p": "0.98",
          "outcome": "No damage"
        },
        {
          "label": "Pump fails",
          "p": "0.02",
          "children": [
            {
              "label": "Operator recovers",
              "p": "0.90",
              "outcome": "No damage"
            },
            {
              "label": "Operator fails",
              "p": "0.10",
              "children": [
                {
                  "label": "Relief opens",
                  "p": "0.99",
                  "outcome": "Minor $50k"
                },
                {
                  "label": "Relief fails",
                  "p": "0.01",
                  "outcome": "Severe $5M"
                }
              ]
            }
          ]
        }
      ]
    },
    "options": [
      "About $50",
      "About $100",
      "About $199",
      "About $995"
    ],
    "answer": 1,
    "why": "<p>Each damage sequence’s frequency is the initiating-event frequency times the branch probabilities along its path; the expected loss weights each by its cost:</p><p>\\[\\begin{aligned}f_m &= 0.5(0.02)(0.10)(0.99) \\\\ &= 9.9 \\times 10^{-4} \\\\ f_s &= 0.5(0.02)(0.10)(0.01) \\\\ &= 1.0 \\times 10^{-5} \\\\ L &= 9.9 \\times 10^{-4}(50000) \\\\ &\\quad + 10^{-5}(5000000) \\\\ &= 49.5 + 50.0 \\\\ &= 99.5\\end{aligned}\\]</p><p>where \\(f_m\\) and \\(f_s\\) are the minor and severe sequence frequencies per year and \\(L\\) the expected annual loss in dollars. The rare severe sequence contributes as much expected loss as the far more frequent minor one, which is why PRA characterizes risk by both severity and probability.</p><p><b>B. About $100</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Risk Assessment — probabilistic risk assessment (event trees, severity and probability, NUREG/CR-2300).</span></p>",
    "optionRationales": [
      "Counts only the severe sequence ($50); the minor sequence adds almost as much again.",
      "Correct. \\(49.5 + 50.0 = 99.5\\) dollars a year.",
      "Leaves out the initiating-event frequency of 0.5 per year, which doubles the answer.",
      "Leaves out the operator recovery branch, as if every pump failure led to damage."
    ],
    "keyPoint": "Event-tree PRA: each sequence frequency is the initiating frequency multiplied by its branch probabilities; expected loss is the sum of each frequency multiplied by its consequence.",
    "trap": "Dropping the initiating frequency or a mitigating branch, or counting only the worst outcome.",
    "formula": "\\(f_j = f_{IE}\\prod p_{\\text{branch}}\\); \\(L = \\sum f_j C_j\\)",
    "assumptions": [
      "Branch events are independent."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "probabilistic risk assessment",
      "event tree",
      "expected loss",
      "initiating event"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Risk assessment — probabilistic risk assessment",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q82",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.1",
      "topic": "Steps of a risk management framework"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "In a risk management framework such as ISO 31000, which step compares the analyzed risks against the organization’s risk criteria to decide which need treatment and in what priority?",
    "chart": null,
    "options": [
      "Risk identification",
      "Risk analysis",
      "Risk treatment",
      "Risk evaluation"
    ],
    "answer": 3,
    "why": "<p>ISO 31000 runs from identification (finding risks) to analysis (understanding their likelihood and consequences) to evaluation (comparing them with risk criteria to decide which need treatment and their priority), then treatment (selecting and applying controls), with monitoring and review throughout.</p><p><b>D. Risk evaluation</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Risk Management Techniques; Ch. 5, Risk Treatment (ISO 31000 framework).</span></p>",
    "optionRationales": [
      "Identification finds and describes risks; it does not rank them against criteria.",
      "Analysis estimates likelihood and consequence; deciding what needs treatment comes next.",
      "Treatment selects and implements controls after evaluation has decided what to treat.",
      "Correct. Evaluation compares analyzed risk with the criteria and sets priorities for treatment."
    ],
    "keyPoint": "ISO 31000 sequence: identify, analyze, evaluate (decide and prioritize), treat, with monitoring and review throughout.",
    "trap": "Confusing analysis (how big is the risk?) with evaluation (does it need treatment?).",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "ISO 31000",
      "risk evaluation",
      "risk management framework"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Risk management techniques",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q83",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "A. Identification",
      "code": "II.A.3",
      "topic": "Classifying operational, strategic, financial and cybersecurity risks"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "A reliability risk register for a connected heat pump contains the four entries shown. Which classification of the four entries is correct?",
    "chart": {
      "type": "data-table",
      "title": "Risk register excerpt",
      "columns": [
        "Entry",
        "Description"
      ],
      "rows": [
        [
          "1",
          "A late supplier delivery could push the qualification test back three months"
        ],
        [
          "2",
          "The over-the-air firmware channel does not authenticate updates"
        ],
        [
          "3",
          "A proposed refrigerant regulation could make the current design non-compliant"
        ],
        [
          "4",
          "The warranty reserve may be too small for the predicted failure rate"
        ]
      ]
    },
    "options": [
      "1 strategic; 2 operational; 3 cybersecurity; 4 financial",
      "1 operational; 2 strategic; 3 financial; 4 cybersecurity",
      "1 financial; 2 cybersecurity; 3 operational; 4 strategic",
      "1 operational; 2 cybersecurity; 3 strategic; 4 financial"
    ],
    "answer": 3,
    "why": "<p>Operational risks include technical, scheduling, safety and environmental risks, so a schedule slip is operational. An unauthenticated update channel is a cybersecurity risk, and it bears directly on reliability because a malicious or corrupt update can disable the product. Regulatory compliance is a strategic risk, along with brand, reputation and stakeholder risks. An under-funded warranty reserve is a financial risk.</p><p><b>D. 1 operational; 2 cybersecurity; 3 strategic; 4 financial</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 3, Types of Risk — operational, strategic, financial and cybersecurity risks.</span></p>",
    "optionRationales": [
      "A schedule slip is operational, and an unauthenticated update channel is a cybersecurity risk, not an operational one.",
      "Firmware authentication is cybersecurity; regulatory change is strategic, not financial.",
      "A schedule slip is operational, and a regulation change is strategic.",
      "Correct. Each entry matches its type."
    ],
    "keyPoint": "Operational: technical, schedule, safety, environmental. Strategic: brand, reputation, stakeholder, regulatory compliance. Plus financial, cybersecurity and analytical risks.",
    "trap": "Classifying by consequence (cost) rather than by the kind of risk.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "types of risk",
      "operational risk",
      "strategic risk",
      "cybersecurity risk",
      "financial risk"
    ],
    "sourceSection": "Chapter 3 - Risk Identification",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 3 - Risk Identification",
        "section": "Types of risk",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q84",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.4",
      "topic": "Functional hazard analysis"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "A functional hazard analysis (FHA) for a brake-by-wire system examines the function \"decelerate the vehicle on driver demand.\" The failure conditions listed so far are shown. Following MIL-STD-882E Task 208, what should the team add?",
    "chart": {
      "type": "data-table",
      "title": "FHA worksheet excerpt: decelerate on driver demand",
      "columns": [
        "Failure condition",
        "Effect",
        "Severity"
      ],
      "rows": [
        [
          "Loss of function: no braking on demand",
          "Collision",
          "Catastrophic"
        ],
        [
          "Degraded function: braking at reduced deceleration",
          "Longer stopping distance",
          "Critical"
        ],
        [
          "Malfunction: braking without driver demand",
          "Rear-end collision risk",
          "Critical"
        ]
      ]
    },
    "options": [
      "A detection rating for each failure condition, so that each row has a full risk priority number.",
      "The part numbers and suppliers of each brake actuator, so that each hazard traces to a component.",
      "Functioning out of time or out of sequence, such as braking that applies late or releases too early, so that every functional failure condition is covered.",
      "Occurrence ratings copied from the design FMEA, so that the FHA shows likelihood."
    ],
    "answer": 2,
    "why": "<p>An FHA is a top-down examination of system functions, run before a detailed design exists. For each function, MIL-STD-882E Task 208 asks about loss of function, degraded function, malfunction, and functioning out of time or out of sequence. The worksheet covers the first three; mistimed braking (applying late or releasing early) is missing. Hazard analysis classifies severity and likelihood but does not use a detection rating as an FMEA does.</p><p><b>C. Functioning out of time or out of sequence.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Hazard Analysis — functional hazard analysis (MIL-STD-882E Task 208).</span></p>",
    "optionRationales": [
      "Hazard analysis, unlike FMEA, does not use detection ratings.",
      "An FHA works at the function level, before component choices; part numbers belong in later, design-level analyses.",
      "Correct. Out-of-time or out-of-sequence functioning is the fourth failure-condition category.",
      "The FHA precedes and feeds the design FMEA; it does not borrow its ratings, and those ratings may not exist yet."
    ],
    "keyPoint": "FHA: for each function, consider loss, degradation, malfunction, and out-of-time or out-of-sequence operation; classify by severity, without detection ratings.",
    "trap": "Turning a hazard analysis into an FMEA with detection ratings, or descending to parts too early.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "hazard analysis",
      "functional hazard analysis",
      "MIL-STD-882E",
      "failure conditions"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Hazard analysis — functional hazard analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q85",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.3",
      "topic": "Reducing common cause failure in a redundant pair"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Calculation, decision",
    "quantitative": true,
    "stem": "A safety trip uses two identical pressure transmitters, either of which can trip the system. Each has a probability of failing on demand of 0.01, and a \\(\\beta\\)-factor of 0.10 applies: 10% of failures are common cause and fail both. Which single change gives the lowest probability that the trip fails on demand?",
    "chart": null,
    "options": [
      "Add a third identical transmitter in the same location, so that any one of three can trip; the common cause fraction stays at 0.10.",
      "Replace one transmitter with a different sensing technology on a separate impulse line, cutting the common cause fraction to 0.01.",
      "Buy a premium model for both positions, halving each transmitter’s failure probability to 0.005; the common cause fraction stays at 0.10.",
      "Calibrate twice as often, which halves the independent failures only; the common cause failures are unchanged."
    ],
    "answer": 1,
    "why": "<p>With a \\(\\beta\\)-factor model, \\(Q_{\\text{sys}} = [(1 - \\beta)Q]^{n} + \\beta Q\\) for \\(n\\) redundant units, any one of which suffices. Compare the four options with the present \\(0.009^{2} + 0.001 = 0.00108\\):</p><p>\\[\\begin{aligned}Q_A &= 0.009^{3} + 0.001 \\\\ &= 0.00100 \\\\ Q_B &= 0.0099^{2} + 0.0001 \\\\ &= 0.00020 \\\\ Q_C &= 0.0045^{2} + 0.0005 \\\\ &= 0.00052 \\\\ Q_D &= 0.0045^{2} + 0.001 \\\\ &= 0.00102\\end{aligned}\\]</p><p>where \\(Q\\) is each transmitter’s failure-on-demand probability and \\(\\beta\\) the common cause fraction. The common cause term \\(\\beta Q\\) dominates, so adding identical redundancy or reducing independent failures barely helps. Diversity and separation attack \\(\\beta\\) itself.</p><p><b>B. Diverse technology on a separate impulse line.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Common Mode Failure Analysis (shared causes defeating redundancy; separation and diversity); beta-factor model (IEC 61508-6).</span></p>",
    "optionRationales": [
      "A third identical unit shrinks only the already tiny independent term; \\(\\beta Q = 0.001\\) remains, so \\(Q_{\\text{sys}} \\approx 0.00100\\).",
      "Correct. Reducing \\(\\beta\\) to 0.01 cuts the dominant term tenfold: \\(Q_{\\text{sys}} \\approx 0.00020\\).",
      "Halving \\(Q\\) also halves \\(\\beta Q\\), giving 0.00052, which helps but is less than diversity.",
      "The common cause term is untouched, so \\(Q_{\\text{sys}} \\approx 0.00102\\)."
    ],
    "keyPoint": "When common cause dominates, more identical redundancy does little; diversity and physical separation reduce the common cause fraction itself.",
    "trap": "Adding identical redundancy to fix a common cause problem.",
    "formula": "\\(Q_{\\text{sys}} = [(1 - \\beta)Q]^{n} + \\beta Q\\)",
    "assumptions": [
      "The \\(\\beta\\)-factor model applies; other failure modes are unchanged."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "common cause failure",
      "beta factor",
      "diversity",
      "separation",
      "redundancy"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Common mode failure analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q86",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.1",
      "topic": "Success tree as the dual of a fault tree"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "The fault tree shown models loss of pumping. The team converts it to a success tree (STA) to show what must work. In the success tree, which gate combines the two pump trains, and what is the probability of system success?",
    "chart": {
      "type": "cre-fault-tree",
      "title": "Loss of pumping",
      "altText": "Fault tree. Top event \"Loss of pumping\" is an OR gate of \"Controller fails\" (0.005) and \"Both trains fail\". \"Both trains fail\" is an AND gate of \"Train A fails\" and \"Train B fails\". Each train fails is an OR gate of its pump failing (0.05) and its valve failing (0.02).",
      "root": {
        "label": "Loss of pumping",
        "gate": "OR",
        "children": [
          {
            "label": "Controller fails",
            "p": "0.005"
          },
          {
            "label": "Both trains fail",
            "gate": "AND",
            "children": [
              {
                "label": "Train A fails",
                "gate": "OR",
                "children": [
                  {
                    "label": "Pump A fails",
                    "p": "0.05"
                  },
                  {
                    "label": "Valve A fails",
                    "p": "0.02"
                  }
                ]
              },
              {
                "label": "Train B fails",
                "gate": "OR",
                "children": [
                  {
                    "label": "Pump B fails",
                    "p": "0.05"
                  },
                  {
                    "label": "Valve B fails",
                    "p": "0.02"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    "options": [
      "An OR gate; system success 0.990.",
      "An AND gate; system success 0.862.",
      "An AND gate; system success 0.990.",
      "An OR gate; system success 0.995."
    ],
    "answer": 0,
    "why": "<p>A success tree is the logical dual of the fault tree: each OR gate becomes an AND gate and each AND gate becomes an OR gate, with events replaced by their successes. \"Both trains fail\" (AND) becomes \"at least one train works\" (OR), and each train works only if its pump AND valve work:</p><p>\\[\\begin{aligned}R_{\\text{train}} &= 0.95(0.98) = 0.931 \\\\ R_{\\text{trains}} &= 1 - (1 - 0.931)^{2} \\\\ &= 0.99524 \\\\ R &= 0.995(0.99524) \\\\ &= 0.990\\end{aligned}\\]</p><p>where \\(R_{\\text{train}}\\) is the probability that one train works, \\(R_{\\text{trains}}\\) that at least one works and \\(R\\) the system success probability, which equals one minus the fault tree’s top-event probability.</p><p><b>A. An OR gate; 0.990.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Fault Tree Analysis — success tree analysis (STA).</span></p>",
    "optionRationales": [
      "Correct. The trains combine through an OR gate, and \\(R = 0.995 \\times 0.99524 = 0.990\\).",
      "Copies the fault tree’s AND gate into the success tree, which requires both trains to work: \\(0.995 \\times 0.931^{2} = 0.862\\).",
      "The probability is right, but the gate is not: needing both trains to work would be an AND gate and would give 0.862.",
      "Leaves out the controller, which must work in every success path: \\(R_{\\text{trains}} = 0.995\\)."
    ],
    "keyPoint": "Success tree = dual of the fault tree: OR ↔ AND, failures ↔ successes; its top probability is one minus the fault tree’s.",
    "trap": "Keeping the fault tree’s gates when converting, or dropping a series element.",
    "formula": "\\(R = R_C[1 - (1 - R_P R_V)^{2}]\\)",
    "assumptions": [
      "Independent basic events."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "success tree analysis",
      "fault tree analysis",
      "duality",
      "system reliability"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Fault tree analysis — success tree analysis",
        "example": "Example 4.3"
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q87",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.2",
      "topic": "Use FMEA from the user’s perspective"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "A team prepares a use FMEA (UFMEA) for a home dialysis machine from its operating instructions. Which entry is written correctly as a UFMEA failure mode?",
    "chart": null,
    "options": [
      "The user does not clamp the line before disconnecting it.",
      "The blood pump motor bearing wears out early.",
      "The supplier ships tubing with wall thickness out of tolerance.",
      "A software timer overflows after 49 days of continuous operation."
    ],
    "answer": 0,
    "why": "<p>A UFMEA looks at the system from the user’s side: each step of the operating instructions is a requirement, and each failure mode is a failure to meet it, such as skipping or misperforming a step. It is essentially a process FMEA for the user’s process, and it surfaces foreseeable misuse. The other entries belong in design, supplier process and software FMEAs.</p><p><b>A. The user does not clamp the line before disconnecting it.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Failure Mode and Effects Analysis — types of FMEAs (use FMEA).</span></p>",
    "optionRationales": [
      "Correct. It is a failure to perform an operating step, from the user’s point of view.",
      "Bearing wear is a design FMEA failure mode.",
      "Out-of-tolerance supplied tubing is a process or supplier FMEA item.",
      "A timer overflow is a software FMEA item."
    ],
    "keyPoint": "UFMEA failure modes are failures to meet the user’s operating steps; they reveal foreseeable misuse.",
    "trap": "Listing design, process or software failure modes in a use FMEA.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "use FMEA",
      "UFMEA",
      "foreseeable misuse",
      "FMEA types"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Failure mode and effects analysis — use FMEA",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q88",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.6",
      "topic": "Choosing a mistake-proofing control"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Scenario judgment",
    "quantitative": false,
    "stem": "Field returns show that technicians sometimes swap the supply and return hoses on a coolant module, which overheats the unit. The hoses already carry color-coded tags, and the step is in the work instructions. Which control most effectively prevents the error?",
    "chart": null,
    "options": [
      "Retrain the technicians and add a sign-off line for the hose step to the work instructions.",
      "Replace the color tags with larger, high-contrast labels and add a photo of the correct hookup.",
      "Add an end-of-line flow test that detects swapped hoses before the unit ships.",
      "Fit the supply and return lines with different connector sizes so that each hose fits only its own port."
    ],
    "answer": 3,
    "why": "<p>The best mistake-proofing designs the error out: a physical barrier makes the wrong connection impossible. Training and sign-offs rely on attention, and enhanced visual reminders have already proved insufficient, since color tags exist and errors persist. A flow test detects the error after it is made and does not protect field connections made during service.</p><p><b>D. Keyed connectors that fit only their own ports.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, System Safety — human error and mistake-proofing (physical barriers, visual reminders, automation, standardizing).</span></p>",
    "optionRationales": [
      "Training and sign-offs depend on attention, the same weakness that lets the error happen now.",
      "A stronger visual reminder still relies on the technician noticing; visual cues are already in place and have not stopped the error.",
      "Detection after the fact catches factory errors but not hose swaps made during field service.",
      "Correct. A physical barrier makes the wrong connection impossible."
    ],
    "keyPoint": "Mistake-proofing hierarchy: prevent the error by design (physical barriers) before relying on reminders, procedures or detection.",
    "trap": "Choosing training or inspection when the error can be designed out.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "mistake-proofing",
      "poka-yoke",
      "human error",
      "system safety"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "System safety — human error and mistake-proofing",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q89",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.6",
      "topic": "Weighted tradeoff analysis of design concepts"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "Three concepts for a pump housing are compared with the current design in a weighted Pugh matrix (better = +1, same = 0, worse = −1). Which concept should the tradeoff analysis select?",
    "chart": {
      "type": "data-table",
      "title": "Weighted Pugh matrix against the current design",
      "columns": [
        "Criterion",
        "Weight",
        "Concept A",
        "Concept B",
        "Concept C"
      ],
      "rows": [
        [
          "Reliability",
          "9",
          "+1",
          "−1",
          "+1"
        ],
        [
          "Safety",
          "9",
          "+1",
          "0",
          "−1"
        ],
        [
          "Cost",
          "3",
          "−1",
          "+1",
          "+1"
        ],
        [
          "Mass",
          "2",
          "−1",
          "+1",
          "0"
        ],
        [
          "Maintainability",
          "3",
          "−1",
          "+1",
          "+1"
        ],
        [
          "Producibility",
          "2",
          "0",
          "+1",
          "−1"
        ]
      ]
    },
    "options": [
      "Concept A: its weighted total is the highest, because it improves the two most heavily weighted criteria.",
      "Concept B: it has the most improvements and the fewest losses against the current design.",
      "Concept C: its weighted total is positive, and it improves reliability, cost and maintainability.",
      "Keep the current design, because no concept is better on every criterion."
    ],
    "answer": 0,
    "why": "<p>Multiply each rating by its criterion weight and add:</p><p>\\[\\begin{aligned}S_A &= 9 + 9 - 3 - 2 - 3 + 0 \\\\ &= 10 \\\\ S_B &= -9 + 0 + 3 + 2 + 3 + 2 \\\\ &= 1 \\\\ S_C &= 9 - 9 + 3 + 0 + 3 - 2 \\\\ &= 4\\end{aligned}\\]</p><p>where \\(S\\) is a concept’s weighted total against the current design. Concept B has the most pluses (4) but loses on reliability, the heaviest criterion; Concept C gains reliability but loses safety. Concept A wins once the agreed weights are applied. Its weaker points (cost, mass, maintainability) are candidates for borrowing features from B, as the Pugh method encourages.</p><p><b>A. Concept A (+10).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, System Safety — tradeoff analysis; Concept Down-Select (Pugh method).</span></p>",
    "optionRationales": [
      "Correct. Weighted totals are A +10, C +4, B +1.",
      "Counting pluses ignores the weights; B is worse on reliability, which carries weight 9.",
      "C’s total (+4) is positive but below A’s, and it gives up safety, a weight-9 criterion.",
      "A Pugh analysis rarely finds a concept better on every criterion; the weighted totals decide."
    ],
    "keyPoint": "Tradeoff analysis: agree the weights first, then compare weighted totals, not counts of pluses and minuses.",
    "trap": "Counting pluses and minuses without weights, or demanding a concept that wins every criterion.",
    "formula": "\\(S = \\sum w_i r_i\\)",
    "assumptions": [
      "The weights were agreed by the team before scoring."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "tradeoff analysis",
      "Pugh matrix",
      "weighted criteria",
      "concept selection"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "System safety — tradeoff analysis; concept down-select (Pugh)",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b09-q90",
    "set": 1,
    "batch": 9,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "B. Analysis",
      "code": "II.B.1",
      "topic": "Prioritizing fault tree improvements by cut-set contribution"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The fault tree shown has three minimal cut sets. Each of four proposed improvements costs about the same. Which improvement reduces the top-event probability the most?",
    "chart": {
      "type": "cre-fault-tree",
      "title": "Top event: process upset",
      "altText": "Fault tree. Top event \"Process upset\" is an OR gate of three inputs: an AND gate of A (0.3) and B (0.2); the single basic event C (0.05); and an AND gate of D (0.4) and E (0.3).",
      "root": {
        "label": "Process upset",
        "gate": "OR",
        "children": [
          {
            "label": "A and B",
            "gate": "AND",
            "children": [
              {
                "label": "A",
                "p": "0.3"
              },
              {
                "label": "B",
                "p": "0.2"
              }
            ]
          },
          {
            "label": "C",
            "p": "0.05"
          },
          {
            "label": "D and E",
            "gate": "AND",
            "children": [
              {
                "label": "D",
                "p": "0.4"
              },
              {
                "label": "E",
                "p": "0.3"
              }
            ]
          }
        ]
      }
    },
    "options": [
      "Eliminate event C, the only single-point failure.",
      "Reduce the probability of B from 0.2 to 0.05.",
      "Halve the probability of D, from 0.4 to 0.2.",
      "Halve the probability of A, from 0.3 to 0.15."
    ],
    "answer": 2,
    "why": "<p>The top event is the union of the cut sets {A, B}, {C} and {D, E}, with probabilities 0.06, 0.05 and 0.12:</p><p>\\[\\begin{aligned}P_0 &= 1 - 0.94(0.95)(0.88) \\\\ &= 0.2142 \\\\ P_{\\bar{C}} &= 1 - 0.94(0.88) \\\\ &= 0.1728 \\\\ P_{B} &= 1 - 0.985(0.95)(0.88) \\\\ &= 0.1765 \\\\ P_{D} &= 1 - 0.94(0.95)(0.94) \\\\ &= 0.1606 \\\\ P_{A} &= 1 - 0.97(0.95)(0.88) \\\\ &= 0.1891\\end{aligned}\\]</p><p>where \\(P_0\\) is the present top-event probability and the others are the results of each change. Halving D removes 0.054, the most, because {D, E} is the largest cut set (0.12). Eliminating the single-point event C removes only 0.041: being a single-point failure does not make it the biggest contributor here.</p><p><b>C. Halve the probability of D.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 4, Fault Tree Analysis — action priority (prioritizing actions by probability of failure).</span></p>",
    "optionRationales": [
      "Eliminating C gives 0.1728, a reduction of 0.041. Its cut set (0.05) is smaller than {D, E} (0.12).",
      "Reducing B to 0.05 gives 0.1765, a reduction of 0.038.",
      "Correct. Halving D gives 0.1606, a reduction of 0.054, the largest.",
      "Halving A gives 0.1891, a reduction of 0.025."
    ],
    "keyPoint": "Prioritize fault tree actions by how much each cut set contributes to the top event, not by whether an event is a single-point failure.",
    "trap": "Assuming a single-point failure is always the top priority.",
    "formula": "\\(P_{\\text{top}} = 1 - \\prod_{j}(1 - P_{\\text{cut } j})\\) for independent cut sets with no shared events",
    "assumptions": [
      "Independent basic events; no event appears in more than one cut set."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "fault tree analysis",
      "minimal cut sets",
      "action priority",
      "importance"
    ],
    "sourceSection": "Chapter 4 - Risk Analysis",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 4 - Risk Analysis",
        "section": "Fault tree analysis — action priority",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q91",
    "set": 1,
    "batch": 10,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "C. Mitigation",
      "code": "II.C",
      "topic": "Risk mitigation strategies (the 4 Ts)"
    },
    "difficulty": "Medium",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "A pump maker has found that its shaft seals can harden and leak in cold climates. The table lists four responses the team is considering. Which classification of the responses is correct?",
    "chart": {
      "type": "data-table",
      "title": "Responses to the seal-hardening risk",
      "columns": [
        "Response",
        "Description"
      ],
      "rows": [
        [
          "1",
          "Buy the seal as a complete module from a specialist supplier, who carries the warranty liability for it"
        ],
        [
          "2",
          "Change to a magnetic drive, which needs no shaft seal at all"
        ],
        [
          "3",
          "Change the elastomer compound and add a cold-soak test to qualification"
        ],
        [
          "4",
          "For the indoor-only model, record the risk and take no action, because those units never see cold temperatures"
        ]
      ]
    },
    "options": [
      "1 transfer; 2 terminate; 3 treat; 4 tolerate",
      "1 treat; 2 terminate; 3 transfer; 4 tolerate",
      "1 transfer; 2 treat; 3 terminate; 4 tolerate",
      "1 tolerate; 2 terminate; 3 treat; 4 transfer"
    ],
    "answer": 0,
    "why": "<p>The four mitigation strategies are tolerate, terminate, treat and transfer. Shifting the liability to the specialist supplier transfers the risk (1). Removing the seal removes the failure mode completely, which terminates the risk (2). A better compound and a qualification test reduce the risk without removing it, which treats it (3). Accepting a low-priority risk for a model that never sees the cold condition tolerates it, freeing resources for higher-priority risks (4).</p><p><b>A. 1 transfer; 2 terminate; 3 treat; 4 tolerate.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 5, Strategies to Minimize Risk (the 4 Ts).</span></p>",
    "optionRationales": [
      "Correct. Supplier liability is transfer, removing the seal is terminate, the new compound is treat, and accepting the indoor risk is tolerate.",
      "Response 1 does not reduce the risk; it moves the liability to another party, which is transfer. Response 3 reduces the risk, which is treat.",
      "Response 2 removes the failure mode entirely, so it terminates the risk; response 3 only reduces it, so it treats the risk.",
      "Response 1 shifts liability to the supplier (transfer), and response 4 accepts the risk (tolerate); these two are swapped."
    ],
    "keyPoint": "Terminate removes the risk, treat reduces it, transfer shifts it to another party, and tolerate accepts it.",
    "trap": "Calling any design change \"treat\": a change that removes the failure mode completely terminates the risk.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "risk mitigation",
      "4 Ts",
      "tolerate",
      "terminate",
      "treat",
      "transfer"
    ],
    "sourceSection": "Chapter 5 - Risk Mitigation",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 5 - Risk Mitigation",
        "section": "Strategies to minimize risk",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q92",
    "set": 1,
    "batch": 10,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "C. Mitigation",
      "code": "II.C",
      "topic": "ALARP, ALARA and ALAP"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "An industrial radiography crew inspects pipeline welds with a gamma source. Their exposures are already below the regulatory limit, but the site plan still requires them to cut exposure further by limiting time near the source, using shielding and increasing distance, as U.S. radiation-protection rules require. Which risk-reduction principle does the plan apply?",
    "chart": null,
    "options": [
      "As low as reasonably practicable (ALARP)",
      "As low as reasonably achievable (ALARA)",
      "As low as possible (ALAP)",
      "Risk tolerance at the regulatory limit"
    ],
    "answer": 1,
    "why": "<p>ALARA is the principle used in radiation safety. It minimizes exposure that brings the person no direct benefit, using three factors: time, shielding and distance. ALARP is the general cost-balanced principle, and ALAP requires reduction as far as possible regardless of cost, as in medical device and aerospace risk management.</p><p><b>B. As low as reasonably achievable (ALARA).</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 5, Requirements to Reduce Risk: ALARP, ALAP, and ALARA.</span></p>",
    "optionRationales": [
      "ALARP balances risk reduction against cost and practicality in general use; radiation protection uses its own principle.",
      "Correct. ALARA governs radiation exposure, using time, shielding and distance.",
      "ALAP requires reduction as far as possible regardless of cost; it is the standard for catastrophic risks such as in medical devices and aerospace.",
      "The plan does not stop at the regulatory limit; it keeps reducing exposure below it."
    ],
    "keyPoint": "ALARA: radiation safety (time, shielding, distance). ALARP: cost-balanced reduction. ALAP: as far as possible, regardless of cost.",
    "trap": "Choosing ALARP because the plan sounds reasonable; radiation exposure has its own named principle.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "ALARA",
      "ALARP",
      "ALAP",
      "radiation safety"
    ],
    "sourceSection": "Chapter 5 - Risk Mitigation",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 5 - Risk Mitigation",
        "section": "Requirements to reduce risk: ALARP, ALAP, and ALARA",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q93",
    "set": 1,
    "batch": 10,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "C. Mitigation",
      "code": "II.C",
      "topic": "Applying ALARP with a disproportion test"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "A plant applies ALARP with this rule: a risk-reduction measure must be implemented unless its cost is more than three times its benefit. The benefit is the reduction in expected loss over the 5-year life of the line. Using the table, which measures must be implemented?",
    "chart": {
      "type": "data-table",
      "title": "Candidate risk-reduction measures",
      "columns": [
        "Measure",
        "Cost (dollars)",
        "Reduction in expected loss (dollars per year)"
      ],
      "rows": [
        [
          "M1: interlock on the access door",
          "40,000",
          "20,000"
        ],
        [
          "M2: full enclosure of the line",
          "600,000",
          "30,000"
        ],
        [
          "M3: second independent pressure relief",
          "250,000",
          "20,000"
        ],
        [
          "M4: automatic fire suppression",
          "400,000",
          "24,000"
        ]
      ]
    },
    "options": [
      "M1 only",
      "M1 and M3",
      "M1, M3 and M4",
      "All four measures"
    ],
    "answer": 1,
    "why": "<p>Compare each measure’s cost with its benefit over the 5-year life:</p><p>\\[\\begin{aligned}r_1 &= \\frac{40000}{5(20000)} = 0.40 \\\\ r_2 &= \\frac{600000}{5(30000)} = 4.00 \\\\ r_3 &= \\frac{250000}{5(20000)} = 2.50 \\\\ r_4 &= \\frac{400000}{5(24000)} = 3.33\\end{aligned}\\]</p><p>where \\(r\\) is a measure’s cost divided by its benefit. Under the rule, a measure is required unless \\(r \\gt 3\\), so M1 and M3 are required. M3 costs more than it saves, but ALARP does not stop at break-even; it stops only when the cost is grossly disproportionate to the benefit. M2 and M4 exceed the factor of 3.</p><p><b>B. M1 and M3.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 5, Requirements to Reduce Risk: ALARP (cost of further reduction disproportionate to the benefit).</span></p>",
    "optionRationales": [
      "A simple cost-benefit test keeps only M1. The plant’s ALARP rule also requires M3, whose cost is 2.5 times its benefit.",
      "Correct. \\(r_1 = 0.40\\) and \\(r_3 = 2.50\\) are within the factor of 3; M2 (4.00) and M4 (3.33) are not.",
      "M4’s cost is 3.33 times its benefit, beyond the plant’s factor of 3.",
      "Implementing everything regardless of cost is ALAP, not ALARP."
    ],
    "keyPoint": "ALARP requires risk reduction until the cost becomes disproportionate to the benefit, not merely until cost exceeds benefit.",
    "trap": "Treating ALARP as a break-even test and rejecting every measure that costs more than it saves.",
    "formula": "\\(r = \\dfrac{C}{T\\,\\Delta L}\\); implement unless \\(r \\gt 3\\)",
    "assumptions": [
      "Benefits are not discounted; the 5-year life applies to every measure."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "ALARP",
      "disproportion",
      "cost-benefit",
      "risk reduction"
    ],
    "sourceSection": "Chapter 5 - Risk Mitigation",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 5 - Risk Mitigation",
        "section": "Requirements to reduce risk: ALARP, ALAP, and ALARA",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q94",
    "set": 1,
    "batch": 10,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "C. Mitigation",
      "code": "II.C",
      "topic": "Overall residual risk across a fleet"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "A home appliance has five residual hazards after mitigation. Company criteria limit each hazard to 200 harm events per million unit-years and the overall residual risk to 500. The appliance is planned for 20,000 units with a 10-year life. How many harm events should be expected across the fleet’s life, and what should the team decide?",
    "chart": {
      "type": "data-table",
      "title": "Residual risk after mitigation",
      "columns": [
        "Hazard",
        "Harm events per million unit-years"
      ],
      "rows": [
        [
          "H1: burn from hot surface",
          "150"
        ],
        [
          "H2: shock during cleaning",
          "80"
        ],
        [
          "H3: pinch at the lid hinge",
          "120"
        ],
        [
          "H4: tip-over",
          "60"
        ],
        [
          "H5: battery thermal event",
          "190"
        ]
      ]
    },
    "options": [
      "About 24 events; release, because the average hazard rate is within the individual criterion.",
      "About 38 events; release, because the largest hazard rate is within the individual criterion.",
      "About 120 events; release, because each of the five hazards is within its limit of 200.",
      "About 120 events; do not release, because the five hazards together exceed the limit of 500."
    ],
    "answer": 3,
    "why": "<p>Each hazard is acceptable on its own, but overall residual risk is the sum of all of them:</p><p>\\[\\begin{aligned}\\lambda &= 150 + 80 + 120 \\\\ &\\quad + 60 + 190 \\\\ &= 600 \\\\ E &= \\lambda N t \\\\ &= 600(0.02)(10) = 120\\end{aligned}\\]</p><p>where \\(\\lambda\\) is the overall residual rate in harm events per million unit-years, \\(N\\) the fleet size in millions of units (0.02), \\(t\\) the life in years and \\(E\\) the expected number of harm events over the fleet’s life. An overall rate of 600 exceeds the criterion of 500, so the overall residual risk is unacceptable even though every hazard passes alone. The team should reduce or decouple individual risks (H5 and H1 are the largest) before release.</p><p><b>D. About 120 events; do not release yet.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 5, Residual Risk — Overall Residual Risk Assessment.</span></p>",
    "optionRationales": [
      "The average rate (120) times 0.2 million unit-years gives 24, but the hazards add; they do not average.",
      "Using only the largest hazard (190) gives 38 and ignores the other four.",
      "The total of 120 events is right, but passing each individual criterion does not make the overall risk acceptable: 600 exceeds 500.",
      "Correct. The overall rate of 600 per million unit-years exceeds 500, and about 120 harm events are expected."
    ],
    "keyPoint": "Individually acceptable residual risks can add up to an unacceptable overall residual risk; assess the total before release.",
    "trap": "Releasing because every hazard passes its individual criterion.",
    "formula": "\\(E = \\lambda N t\\), with \\(\\lambda = \\sum_i \\lambda_i\\)",
    "assumptions": [
      "Rates are constant over the product life; the hazards occur independently."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "residual risk",
      "overall residual risk",
      "risk acceptance",
      "fleet exposure"
    ],
    "sourceSection": "Chapter 5 - Risk Mitigation",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 5 - Risk Mitigation",
        "section": "Residual risk — overall residual risk assessment",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q95",
    "set": 1,
    "batch": 10,
    "sub": "cre-risk",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "II. Risk Management",
      "subdomain": "C. Mitigation",
      "code": "II.C",
      "topic": "Secondary risk introduced by a risk control"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Grid power fails at a site about 4 times a year, and each outage stops a critical controller. The team adds a standby generator with an automatic transfer switch; the event tree shows what happens in an outage. The new switch also introduces a secondary risk: about 0.5 times a year it transfers spuriously while the grid is healthy, which drops the controller. How many losses of the critical function per year should be expected with the mitigation in place?",
    "chart": {
      "type": "cre-prob-tree",
      "title": "Event tree per grid outage (4 per year)",
      "altText": "Event tree for one grid outage. The transfer switch works with probability 0.98 or fails with probability 0.02 (loss of function). If it works, the generator starts with probability 0.95 (no loss) or fails to start with probability 0.05 (loss of function).",
      "root": "Grid outage",
      "children": [
        {
          "label": "Transfer works",
          "p": "0.98",
          "children": [
            {
              "label": "Generator starts",
              "p": "0.95",
              "outcome": "No loss"
            },
            {
              "label": "Generator fails",
              "p": "0.05",
              "outcome": "Loss of function"
            }
          ]
        },
        {
          "label": "Transfer fails",
          "p": "0.02",
          "outcome": "Loss of function"
        }
      ]
    },
    "options": [
      "0.276",
      "0.500",
      "0.776",
      "4.500"
    ],
    "answer": 2,
    "why": "<p>Count losses from outages that the mitigation fails to cover, then add the losses the mitigation itself creates:</p><p>\\[\\begin{aligned}f_o &= 4[0.02 + 0.98(0.05)] \\\\ &= 4(0.069) = 0.276 \\\\ f &= f_o + f_s \\\\ &= 0.276 + 0.500 = 0.776\\end{aligned}\\]</p><p>where \\(f_o\\) is the yearly rate of outages that still drop the controller, \\(f_s\\) the yearly rate of spurious transfers and \\(f\\) the total. The mitigation cuts losses from 4 to about 0.78 a year, but the secondary risk now makes up almost two-thirds of what remains, so it must be assessed and controlled too.</p><p><b>C. 0.776</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 5, Secondary Risk (risks introduced by a risk control; the backup generator and transfer switch).</span></p>",
    "optionRationales": [
      "Counts only the outages the mitigation fails to cover and ignores the secondary risk the switch introduces.",
      "Counts only the spurious transfers and ignores outages the switch or generator fails to cover.",
      "Correct. \\(0.276 + 0.500 = 0.776\\) losses a year.",
      "Adds the spurious transfers to the original 4 outages, as if the mitigation did nothing."
    ],
    "keyPoint": "Every risk control can introduce secondary risks; include them when judging whether the mitigated risk is acceptable.",
    "trap": "Crediting the mitigation without counting the new failure modes it introduces.",
    "formula": "\\(f = f_{\\text{outage}}[q_s + (1 - q_s)q_g] + f_s\\)",
    "assumptions": [
      "Switch and generator failures are independent; spurious transfers are independent of outages."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "secondary risk",
      "risk control",
      "event tree",
      "transfer switch"
    ],
    "sourceSection": "Chapter 5 - Risk Mitigation",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 5 - Risk Mitigation",
        "section": "Secondary risk",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q96",
    "set": 1,
    "batch": 10,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.2",
      "topic": "Distinguishing quality from reliability"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "Every connector in a lot passed 100% final inspection for dimensions and contact resistance. After 18 months at humid coastal sites, 6% of them show contact resistance above the limit. Which statement best describes this problem?",
    "chart": null,
    "options": [
      "It is a reliability problem: the connectors met their requirements when shipped but did not keep that performance over time in the use environment.",
      "It is a quality problem: final inspection must have let nonconforming connectors through at shipment, so the inspection method needs correcting.",
      "It is outside the scope of quality and reliability engineering, because the degradation occurred after the connectors left the plant.",
      "It shows that the inspection sample was too small, and inspecting more connectors before shipment would prevent these failures."
    ],
    "answer": 0,
    "why": "<p>Quality describes how well an item performs its function at a point in time, such as at shipment. Reliability describes how well it keeps that performance over time and through its use conditions. These connectors conformed when shipped (inspection was 100%, not a sample) and degraded in humid service, so this is a reliability problem: the fix is in design or materials, verified by environmental life testing, not in more inspection.</p><p><b>A. A reliability problem.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Interrelationship of Safety, Quality, and Reliability.</span></p>",
    "optionRationales": [
      "Correct. The connectors conformed at shipment; they lost performance over time in service, which is reliability.",
      "Inspection was 100% and found every connector conforming; nothing suggests nonconforming parts shipped.",
      "Performance in the use environment over the product’s life is exactly what reliability engineering addresses.",
      "Inspection was already 100%, and no inspection at shipment can detect degradation that has not yet happened."
    ],
    "keyPoint": "Quality is performance at a point in time; reliability is keeping that performance over time and through use conditions.",
    "trap": "Blaming outgoing inspection for failures that develop in service.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "quality versus reliability",
      "field degradation",
      "use environment"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Interrelationship of safety, quality, and reliability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q97",
    "set": 1,
    "batch": 10,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.5",
      "topic": "Critical path after a slip and a crash"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The table shows a reliability test program, planned to finish in 135 days. Fixture build (D) now slips by 15 days. To recover, the team crashes the accelerated life test (E) by 8 days by testing at a higher approved stress. What is the new project duration, and which path is critical?",
    "chart": {
      "type": "data-table",
      "title": "Reliability test program activities",
      "columns": [
        "Activity",
        "Description",
        "Predecessors",
        "Duration (days)"
      ],
      "rows": [
        [
          "A",
          "Design and order test fixtures",
          "—",
          "30"
        ],
        [
          "B",
          "Write test protocols",
          "—",
          "20"
        ],
        [
          "C",
          "HALT on prototypes",
          "B",
          "45"
        ],
        [
          "D",
          "Build and approve fixtures",
          "A",
          "25"
        ],
        [
          "E",
          "Accelerated life test",
          "C, D",
          "60"
        ],
        [
          "F",
          "Field-use survey",
          "B",
          "15"
        ],
        [
          "G",
          "Reliability growth test",
          "D, F",
          "35"
        ],
        [
          "H",
          "Final report",
          "E, G",
          "10"
        ]
      ]
    },
    "options": [
      "132 days; B–C–E–H is still the critical path.",
      "135 days; the slip is absorbed by slack in D, so the crash saves no time.",
      "132 days; A–D–E–H becomes the critical path.",
      "142 days; the 15-day slip and the 8-day crash both pass straight to the end date."
    ],
    "answer": 2,
    "why": "<p>Recompute every start-to-finish path with D at 40 days and E at 52 days:</p><p>\\[\\begin{aligned}L_{ADEH} &= 30 + 40 + 52 + 10 \\\\ &= 132 \\\\ L_{BCEH} &= 20 + 45 + 52 + 10 \\\\ &= 127 \\\\ L_{ADGH} &= 30 + 40 + 35 + 10 \\\\ &= 115 \\\\ L_{BFGH} &= 20 + 15 + 35 + 10 \\\\ &= 80\\end{aligned}\\]</p><p>where \\(L\\) is a path’s length in days. Before the changes, B–C–E–H (135 days) was critical and D had 10 days of total slack (A–D–E–H was 125 days). The 15-day slip uses that slack and moves A–D–E–H to 140 days, and crashing E, which lies on both of the longest paths, shortens both by 8 days. A–D–E–H, at 132 days, becomes the critical path, and the project now finishes 3 days earlier than planned.</p><p><b>C. 132 days; A–D–E–H becomes critical.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Project Management in Reliability Engineering — The Critical Path Method (total slack; crashing).</span></p>",
    "optionRationales": [
      "The duration is right, but B–C–E–H is now 127 days; A–D–E–H (132) is the longest path.",
      "D had only 10 days of slack, so a 15-day slip cannot be fully absorbed, and the crash does shorten the project.",
      "Correct. A–D–E–H is the longest path at 132 days.",
      "Adds the slip in full, ignoring D’s 10 days of slack: 135 + 15 − 8 = 142."
    ],
    "keyPoint": "A slip longer than an activity’s total slack can move the critical path; recompute all paths after any change.",
    "trap": "Adding a delay straight to the end date, or assuming the critical path never changes.",
    "formula": "\\(L = \\sum_{j \\in \\text{path}} d_j\\); the critical path is the longest \\(L\\)",
    "assumptions": [
      "Durations are fixed; no other activity changes."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "critical path method",
      "total slack",
      "crashing",
      "reliability test planning"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Project management in reliability engineering — the critical path method",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q98",
    "set": 1,
    "batch": 10,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.7",
      "topic": "Protecting a former employer’s confidential data"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A reliability engineer has just joined a new employer. She still has life-test data for a bearing that her former employer developed, and no confidentiality agreement was ever signed. Her new manager asks her to use those data to set the warranty for a similar bearing. What should she do?",
    "chart": null,
    "options": [
      "Use the data, because without a signed confidentiality agreement the former employer has no claim on them.",
      "Use the data after removing the former employer’s name, and record the source internally for traceability.",
      "Use only the fitted Weibull parameters, because summary statistics are not the former employer’s proprietary data.",
      "Decline unless the former employer releases the data in writing; use public or newly generated data instead."
    ],
    "answer": 3,
    "why": "<p>The ASQ Code of Ethics (C.1) requires protecting the integrity of confidential information. Even without a confidentiality agreement, the engineer must act as if one were in place, and a signed release from the former employer is the practical safeguard. Removing the name or using only fitted parameters still uses the confidential results.</p><p><b>D. Decline unless released in writing; use public or new data.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Ethics in Reliability Engineering (ASQ Code of Ethics C.1).</span></p>",
    "optionRationales": [
      "The code applies even without a signed agreement: she must act as if one were in place.",
      "Hiding the source does not change the fact that confidential information is being used.",
      "Distribution parameters fitted to the confidential tests are themselves confidential results.",
      "Correct. Without a written release she must not use the data; public or newly generated data are proper sources."
    ],
    "keyPoint": "Treat a former employer’s or client’s information as confidential even when no agreement was signed.",
    "trap": "Assuming there is no obligation because no confidentiality agreement exists.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "ethics",
      "ASQ Code of Ethics",
      "confidential information"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Ethics in reliability engineering",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q99",
    "set": 1,
    "batch": 10,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.8",
      "topic": "Choosing a supplier reliability arrangement"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A sensor supplier has design control of the sensor module it supplies and a long, trusted record with the customer. The supply chain is short. Which reliability arrangement and assessment approach best fit this supplier?",
    "chart": null,
    "options": [
      "The customer does the reliability engineering for the module and requires the supplier to meet its specifications.",
      "The supplier does the reliability engineering for its module and reports for agreement; the customer verifies it during quality audits.",
      "An independent third party does the reliability analysis for the module, and both parties accept its findings.",
      "The customer repeats the supplier’s reliability tests on each new module design before approving it."
    ],
    "answer": 1,
    "why": "<p>When the supplier has design control, it normally takes responsibility for reliability engineering and reports its analysis and decisions to the customer for agreement, with responsibilities such as warranty sharing set out in the contract. For a supplier with a long, trusted record, the customer verifies those reliability functions at quality audits, with at least one auditor who knows reliability engineering. Full customer testing suits suppliers without a favorable history, and third parties are more common when the supply chain is long or complex.</p><p><b>B. Supplier-led reliability engineering, verified by the customer at quality audits.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Supplier Reliability Assessments (the three arrangements; assessments for trusted and new suppliers).</span></p>",
    "optionRationales": [
      "Customer-led reliability with conformance only fits a customer with full design responsibility for minor parts, not a supplier with design control.",
      "Correct. Design control places reliability engineering with the supplier, and a trusted record supports verification at audits.",
      "Third-party involvement is more common with long or complex supply chains; this chain is short.",
      "Customer testing of the supplier’s products suits a supplier without a strong favorable history; this supplier has a long, trusted record."
    ],
    "keyPoint": "Match the supplier arrangement to who holds design control, and the assessment depth to the supplier’s history.",
    "trap": "Applying one assessment approach to every supplier regardless of design control and track record.",
    "formula": null,
    "assumptions": [
      "The contract states the agreed responsibilities."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "supplier reliability",
      "design control",
      "supplier assessment",
      "quality audit"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Supplier reliability assessments",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b10-q100",
    "set": 1,
    "batch": 10,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.9",
      "topic": "Overall equipment effectiveness (OEE)"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Use the shift record to find the machine’s overall equipment effectiveness (OEE) for the shift.",
    "chart": {
      "type": "data-table",
      "title": "Shift record",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Shift length",
          "480 min"
        ],
        [
          "Scheduled breaks",
          "30 min"
        ],
        [
          "Changeover",
          "25 min"
        ],
        [
          "Breakdown",
          "35 min"
        ],
        [
          "Ideal production rate",
          "4 pieces per minute"
        ],
        [
          "Total pieces produced",
          "1,404"
        ],
        [
          "Good pieces",
          "1,320"
        ]
      ]
    },
    "options": [
      "63.6%",
      "68.8%",
      "73.3%",
      "78.0%"
    ],
    "answer": 2,
    "why": "<p>Planned production time excludes the breaks; operating time also excludes the changeover and the breakdown:</p><p>\\[\\begin{aligned}A &= \\frac{450 - 60}{450} = 0.8667 \\\\ P_f &= \\frac{1404/390}{4} = 0.9000 \\\\ Q &= \\frac{1320}{1404} = 0.9402 \\\\ \\text{OEE} &= A \\, P_f \\, Q \\\\ &= 0.733\\end{aligned}\\]</p><p>where \\(A\\) is availability, \\(P_f\\) performance (actual rate over ideal rate) and \\(Q\\) quality (good pieces over total pieces). Performance uses all pieces produced and the actual operating time; the scrap is counted once, in quality.</p><p><b>C. 73.3%</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Performance Monitoring — Overall Equipment Effectiveness Monitoring.</span></p>",
    "optionRationales": [
      "Uses the 450-minute planned time instead of the 390-minute operating time for performance, counting the downtime twice.",
      "Leaves the 30 minutes of breaks in planned production time, so availability and performance are based on 480 and 420 minutes.",
      "Correct. \\(0.8667 \\times 0.9000 \\times 0.9402 = 0.733\\).",
      "Stops at availability times performance and leaves out quality."
    ],
    "keyPoint": "OEE is availability times performance times quality, with each loss counted once.",
    "trap": "Counting downtime or scrap in two factors.",
    "formula": "\\(\\text{OEE} = A \\times P_f \\times Q\\)",
    "assumptions": [
      "Changeover and breakdown are the only downtime; breaks are not planned production time."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "OEE",
      "availability",
      "performance",
      "quality",
      "performance monitoring"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Performance monitoring — overall equipment effectiveness monitoring",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q101",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.1",
      "topic": "Value of early reliability engineering"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "Why should reliability engineering be involved at the start of new product development, rather than after the first prototypes have been tested?",
    "chart": null,
    "options": [
      "Reliability targets are best written after failure data from prototype testing are available.",
      "Involving reliability early removes the need for reliability testing later in the program.",
      "Reliability engineering is mainly a field-support function, so early involvement is optional.",
      "Design decisions that achieve the reliability goals can be made earlier, when changes cost less."
    ],
    "answer": 3,
    "why": "<p>Understanding reliability needs at the start of development lets the team make the design decisions that achieve the reliability goals early, when they are cheapest to change. Design for reliability practices applied early cost far less than redesign after prototypes or field failures reveal problems.</p><p><b>D. Decisions are made earlier, when changes cost less.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Benefits of Reliability Engineering.</span></p>",
    "optionRationales": [
      "Reliability targets come from customer needs, standards and safety; they are set before prototypes exist.",
      "Early involvement focuses testing; it does not remove the need to verify reliability.",
      "Reliability engineering shapes design from the start; it is not mainly a field-support role.",
      "Correct. Early reliability input makes design choices when they are cheapest to change."
    ],
    "keyPoint": "Reliability is cheapest to design in early; late changes cost more and delay launch.",
    "trap": "Treating reliability as a test or field activity that can wait for prototypes.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "benefits of reliability engineering",
      "design for reliability"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Benefits of reliability engineering",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q102",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.3",
      "topic": "Acting as the reliability champion"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "To meet a launch date, a program manager proposes cutting the reliability growth test from 12 weeks to 6. The reliability engineer’s growth projection shows the MTBF target is unlikely to be met at 6 weeks. As the reliability champion, what should the engineer do?",
    "chart": null,
    "options": [
      "Accept the cut without comment, because schedule decisions belong to program management alone.",
      "Refuse to sign the program plan until the full 12-week test is restored.",
      "Report the proposal directly to the customer, so that the customer can overrule the program manager.",
      "Explain the reliability, safety and business risks of each option clearly, so management can make an informed decision."
    ],
    "answer": 3,
    "why": "<p>A reliability champion influences decisions through clear, cross-functional communication: explaining in plain terms the reliability and safety risks and the business consequences of a management decision, so that managers can make an informed choice. Staying silent fails that duty, refusing to sign or going around the manager replaces influence with obstruction.</p><p><b>D. Explain the risks of each option so management can decide.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Reliability Engineer Leadership Responsibilities (the reliability champion).</span></p>",
    "optionRationales": [
      "Silence leaves management deciding without the reliability evidence the engineer holds.",
      "A unilateral refusal obstructs rather than informs; the engineer’s role is to make the risk clear.",
      "Going around the program manager to the customer breaks the program’s decision process.",
      "Correct. The champion makes the risks and consequences clear so the decision is an informed one."
    ],
    "keyPoint": "A reliability champion informs and influences decisions; management decides with the risks made clear.",
    "trap": "Confusing championing reliability with refusing or escalating.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "reliability champion",
      "leadership",
      "communication",
      "growth testing"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Reliability engineer leadership responsibilities",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q103",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.4",
      "topic": "Raising safety concerns in a design review"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Scenario, classification",
    "quantitative": false,
    "stem": "In a design review of a bench-top air purifier, the reliability engineer lists four concerns. Which one is a safety hazard that exists even when the product has not failed?",
    "chart": null,
    "options": [
      "Removing the filter-access panel for routine cleaning exposes live mains terminals.",
      "The sealed enclosure lets the internal capacitors run hotter than their rating assumes.",
      "If the building’s supply voltage surges, the unit may receive more than its rated voltage.",
      "Users may stack shipping cartons higher than the stacking height that was tested."
    ],
    "answer": 0,
    "why": "<p>In design reviews, the reliability engineer asks several distinct questions, including which aspects of the product could cause safety hazards even though it has not failed. Routine maintenance that exposes energized conductors is such a hazard: nothing has failed, yet the user is exposed. The other concerns are different categories: a design that compromises component reliability (hot capacitors), a malfunction elsewhere in the system (supply surge) and foreseeable misuse (over-stacking).</p><p><b>A. Live terminals exposed during routine cleaning.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Reliability Engineer Role and Responsibilities in the Product Lifecycle.</span></p>",
    "optionRationales": [
      "Correct. The hazard exists during normal maintenance, with no failure at all.",
      "This is a design that compromises component reliability; the hazard arises only when the capacitors fail early.",
      "This is a malfunction elsewhere in the system acting on the product, not a hazard of the working product.",
      "This is foreseeable misuse of shipping and storage, which leads to damage, not a hazard of the working product."
    ],
    "keyPoint": "Design reviews look for hazards without failure, misuse, disposal issues, external malfunctions and designs that compromise component reliability.",
    "trap": "Assuming every safety concern starts with a failure.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "design review",
      "safety",
      "product lifecycle",
      "misuse"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Reliability engineer role and responsibilities in the product lifecycle",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q104",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.6",
      "topic": "Scheduling replacement of a short-life component"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation, decision",
    "quantitative": true,
    "stem": "A controller has a 10-year design life, but its cooling fan wears out sooner: fan life follows a Weibull distribution with \\(\\beta = 3\\) and \\(\\eta = 6\\) years. Fans will be replaced at a fixed interval so that each fan’s reliability over the interval is at least 0.95. What is the longest whole-year replacement interval that meets this?",
    "chart": null,
    "options": [
      "Every year",
      "Every 2 years",
      "Every 3 years",
      "Every 6 years"
    ],
    "answer": 1,
    "why": "<p>Solve the Weibull reliability function for the time at which reliability falls to 0.95:</p><p>\\[\\begin{aligned}t &= \\eta(-\\ln R)^{1/\\beta} \\\\ &= 6(-\\ln 0.95)^{1/3} \\\\ &= 6(0.0513)^{1/3} \\\\ &= 2.23 \\text{ years}\\end{aligned}\\]</p><p>where \\(t\\) is the replacement interval, \\(R\\) the required reliability, \\(\\eta\\) the scale and \\(\\beta\\) the shape. The longest whole-year interval is 2 years, where \\(R(2) = e^{-(2/6)^{3}} = 0.964\\). At 3 years, \\(R(3) = e^{-(3/6)^{3}} = 0.882\\), which is too low.</p><p><b>B. Every 2 years.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Function of Reliability in Engineering (replacing components with lives shorter than the product’s on a reliability-based schedule).</span></p>",
    "optionRationales": [
      "Yearly replacement meets the target (\\(R = 0.995\\)) but replaces fans twice as often as needed.",
      "Correct. \\(R(2) = 0.964\\) meets 0.95; 3 years would not.",
      "\\(R(3) = 0.882\\), below the 0.95 requirement.",
      "At \\(t = \\eta\\), only \\(e^{-1} = 0.368\\) of fans survive; \\(\\eta\\) is the 63rd percentile, not a safe interval."
    ],
    "keyPoint": "Components that wear out before the product does are replaced on a schedule set from their life distribution.",
    "trap": "Using the characteristic life as the replacement interval.",
    "formula": "\\(R(t) = e^{-(t/\\eta)^{\\beta}}\\)",
    "assumptions": [
      "Replaced fans are as good as new; the Weibull parameters are known."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Weibull",
      "replacement interval",
      "wear-out",
      "function of reliability"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Function of reliability in engineering",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q105",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.9",
      "topic": "Reading a FRACAS trend chart"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation",
    "quantitative": false,
    "stem": "The chart tracks failure reports in a development program’s FRACAS (failure reporting, analysis and corrective action system). The design-freeze gate is at week 14. What does the chart show?",
    "chart": {
      "type": "cre-xy-plot",
      "title": "Cumulative FRACAS reports by test week",
      "eyebrow": "FRACAS trend",
      "legend": true,
      "altText": "Two cumulative lines against test weeks 1 to 12. Reports opened: 4, 9, 15, 20, 24, 27, 29, 31, 32, 33, 33, 34, rising quickly at first and leveling off. Reports closed: 0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, rising by about 2 a week. At week 12, 34 reports have been opened and 21 closed.",
      "xTicks": [
        0,
        2,
        4,
        6,
        8,
        10,
        12
      ],
      "yTicks": [
        0,
        10,
        20,
        30,
        40
      ],
      "series": [
        {
          "label": "Reports opened",
          "points": [
            [
              1,
              4
            ],
            [
              2,
              9
            ],
            [
              3,
              15
            ],
            [
              4,
              20
            ],
            [
              5,
              24
            ],
            [
              6,
              27
            ],
            [
              7,
              29
            ],
            [
              8,
              31
            ],
            [
              9,
              32
            ],
            [
              10,
              33
            ],
            [
              11,
              33
            ],
            [
              12,
              34
            ]
          ]
        },
        {
          "label": "Reports closed",
          "dashed": true,
          "points": [
            [
              1,
              0
            ],
            [
              2,
              1
            ],
            [
              3,
              3
            ],
            [
              4,
              5
            ],
            [
              5,
              7
            ],
            [
              6,
              9
            ],
            [
              7,
              11
            ],
            [
              8,
              13
            ],
            [
              9,
              15
            ],
            [
              10,
              17
            ],
            [
              11,
              19
            ],
            [
              12,
              21
            ]
          ]
        }
      ],
      "xLabel": "Test week",
      "yLabel": "Cumulative reports"
    },
    "options": [
      "New reports are leveling off, but 13 remain open and the backlog shrinks by less than 1 a week, so the week-14 gate is at risk.",
      "Reliability is getting worse, because the opened line is still above the closed line at week 12.",
      "The program is ready for the week-14 gate, because closures have held steady at about 2 a week and the gap is closing fast.",
      "The steady slope of the closed line proves the corrective actions work, so monitoring can stop at the gate."
    ],
    "answer": 0,
    "why": "<p>The opened line flattens (only 3 new reports in the last 4 weeks), a sign that fixes are taking hold. But 34 opened minus 21 closed leaves 13 open reports. Closures run at about 2 a week while new reports still arrive, so the backlog shrinks by less than 1 a week (18 at week 6, 13 at week 12). Even at 2 closures a week with no new reports, clearing 13 would take 6 to 7 weeks, so the week-14 gate is at risk unless closure work is resourced. Closing a report also requires verifying the fix, so monitoring continues through and after the gate.</p><p><b>A. Reports leveling off; 13 still open and shrinking slowly; gate at risk.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Performance Monitoring — performance monitoring phases (FRACAS open and closed trends; KPIs).</span></p>",
    "optionRationales": [
      "Correct. Arrivals are slowing, but the 13-report backlog is shrinking by less than 1 a week.",
      "Cumulative opened is always at or above cumulative closed; the flattening opened line shows improvement, not decline.",
      "The gap narrows by under a report a week; 13 open reports will not clear in 2 weeks.",
      "Closing reports does not by itself prove effectiveness, and field and production monitoring continue after design freeze."
    ],
    "keyPoint": "Track both new failure reports and the open backlog: arrivals show growth, the backlog shows whether corrective action keeps pace.",
    "trap": "Reading the cumulative opened line as a failure rate, or ignoring the open backlog.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 3,
    "keywords": [
      "FRACAS",
      "performance monitoring",
      "KPI",
      "corrective action backlog"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Performance monitoring — performance monitoring phases and expectations",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q106",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.1",
      "topic": "Inherent, achieved and operational availability"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The table summarizes a year of records for a compressor. What is its achieved availability?",
    "chart": {
      "type": "data-table",
      "title": "Compressor records for one year",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Operating time",
          "8,000 h"
        ],
        [
          "Corrective repairs (failures)",
          "8"
        ],
        [
          "Active corrective repair time, total",
          "48 h"
        ],
        [
          "Preventive maintenance actions",
          "12"
        ],
        [
          "Active preventive maintenance time, total",
          "36 h"
        ],
        [
          "Logistics and administrative delay, total",
          "140 h"
        ]
      ]
    },
    "options": [
      "0.9728",
      "0.9896",
      "0.9940",
      "0.9958"
    ],
    "answer": 1,
    "why": "<p>Achieved availability counts all maintenance actions, corrective and preventive, but only their active time; it excludes logistics and administrative delay:</p><p>\\[\\begin{aligned}\\text{MTBM} &= \\frac{8000}{8 + 12} = 400 \\text{ h} \\\\ \\bar{M} &= \\frac{48 + 36}{20} = 4.2 \\text{ h} \\\\ A_a &= \\frac{400}{400 + 4.2} \\\\ &= 0.9896\\end{aligned}\\]</p><p>where MTBM is the mean time between maintenance actions and \\(\\bar{M}\\) the mean active maintenance time. For comparison, inherent availability uses failures only, \\(A_i = 1000/(1000 + 6) = 0.9940\\). Operational availability adds the delays, \\(A_o = 400/(400 + 11.2) = 0.9728\\).</p><p><b>B. 0.9896</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Basic Reliability Terminology (availability); Ch. 13, Maintainability (inherent, achieved and operational availability).</span></p>",
    "optionRationales": [
      "This is operational availability: it includes the 140 h of logistics and administrative delay.",
      "Correct. \\(A_a = 400/404.2 = 0.9896\\).",
      "This is inherent availability: corrective maintenance only, with MTBF of 1,000 h and MTTR of 6 h.",
      "Uses MTBF (1,000 h) where achieved availability needs MTBM (400 h), so preventive actions are left out of uptime between actions."
    ],
    "keyPoint": "Inherent: corrective only. Achieved: corrective plus preventive active time. Operational: all downtime, including delays.",
    "trap": "Mixing MTBF with total maintenance time, or including logistics delay in achieved availability.",
    "formula": "\\(A_a = \\dfrac{\\text{MTBM}}{\\text{MTBM} + \\bar{M}}\\)",
    "assumptions": [
      "Times are totals for the year; delays occur only during maintenance actions."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "achieved availability",
      "inherent availability",
      "operational availability",
      "MTBM"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Basic reliability terminology — availability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q107",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.1",
      "topic": "Mean time between critical failures"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "Twelve infusion pumps each run 2,000 hours on test. There are 9 failures, of which 3 are critical (they interrupt therapy). What is the mean time between critical failures (MTBCF)?",
    "chart": null,
    "options": [
      "667 h",
      "2,667 h",
      "8,000 h",
      "24,000 h"
    ],
    "answer": 2,
    "why": "<p>Divide the total test time by the number of critical failures:</p><p>\\[\\begin{aligned}\\text{MTBCF} &= \\frac{nT}{C} \\\\ &= \\frac{12(2000)}{3} \\\\ &= 8000 \\text{ h}\\end{aligned}\\]</p><p>where \\(n\\) is the number of units, \\(T\\) the test hours per unit and \\(C\\) the number of critical failures. The MTBF from all 9 failures is \\(24000/9 = 2667\\) h.</p><p><b>C. 8,000 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Basic Reliability Terminology (MTBF and MTBCF).</span></p>",
    "optionRationales": [
      "Leaves out the number of units: 2,000 h divided by 3 critical failures.",
      "This is the MTBF from all 9 failures, not just the critical ones.",
      "Correct. \\(24000/3 = 8000\\) h.",
      "This is the total test time, as if only one critical failure had occurred."
    ],
    "keyPoint": "MTBCF counts only critical failures over the total operating time.",
    "trap": "Using all failures (MTBF) or one unit’s hours.",
    "formula": "\\(\\text{MTBCF} = nT/C\\)",
    "assumptions": [
      "Constant failure rate; failed units are repaired and returned to test."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "MTBCF",
      "MTBF",
      "critical failure"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Basic reliability terminology",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q108",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.2",
      "topic": "Aligning reliability requirements with ESG policy"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A company’s environmental, social and governance (ESG) policy commits to cutting the electronic waste its products create. Which change to the reliability requirements for its next handheld meter best aligns with this policy?",
    "chart": null,
    "options": [
      "Raise the design-life target and require a user-replaceable battery with a stated service interval.",
      "Shorten the warranty from three years to one, so that the requirement matches only the expected early-failure period.",
      "Add a burn-in step to production, so that early failures are caught before the meters are shipped.",
      "Reduce the size of the reliability demonstration sample, so that fewer test units are scrapped."
    ],
    "answer": 0,
    "why": "<p>Customer expectations, standards, safety, liability and regulations set reliability targets, and the company’s ESG policies should shape how those targets are set. Less electronic waste means products last longer in service: a longer design life and a replaceable wear item (the battery) keep meters in use instead of discarded.</p><p><b>A. Longer design life and a user-replaceable battery.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Drivers of Reliability Requirements and Targets (ESG policies).</span></p>",
    "optionRationales": [
      "Correct. Longer life and a replaceable wear item keep products in use and out of the waste stream.",
      "A shorter warranty does nothing to keep products in service longer.",
      "Burn-in moves early failures in-house but does not extend product life; it can even add scrap.",
      "A smaller test sample saves a few units but weakens the evidence and does not affect field life."
    ],
    "keyPoint": "ESG policies shape reliability targets: longer, maintainable product life supports environmental commitments.",
    "trap": "Choosing an action that reduces internal scrap but not product waste.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "reliability requirements",
      "ESG",
      "design life",
      "maintainability"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Drivers of reliability requirements and targets",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q109",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.3",
      "topic": "Judging CAPA effectiveness without aggregating defect types"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, hypothesis test, decision",
    "quantitative": true,
    "stem": "A corrective and preventive action (CAPA) changed a molding parameter to stop cracks. The table compares 2,000 units before and 2,000 after. At a 5% significance level, what should the team conclude?",
    "chart": {
      "type": "data-table",
      "title": "Defects before and after the CAPA",
      "columns": [
        "Defect type",
        "Before (2,000 units)",
        "After (2,000 units)"
      ],
      "rows": [
        [
          "Cracks",
          "30",
          "8"
        ],
        [
          "Voids",
          "10",
          "28"
        ],
        [
          "Total",
          "40",
          "36"
        ]
      ]
    },
    "options": [
      "The CAPA is not effective: total defects fell only from 2.0% to 1.8%, with \\(z = 0.46\\).",
      "The CAPA is effective and can be closed: the crack rate fell significantly, with \\(z = 3.59\\).",
      "Cracks fell significantly (\\(z = 3.59\\)), but voids rose significantly (\\(z = 2.93\\)), so investigate whether the change caused them.",
      "The result is inconclusive, because proportions from before and after a change cannot be compared without a control chart."
    ],
    "answer": 2,
    "why": "<p>Test each defect type separately with a two-proportion test; aggregating the types hides opposite changes:</p><p>\\[\\begin{aligned}\\bar{p}_c &= \\frac{30 + 8}{4000} = 0.0095 \\\\ \\text{SE}^{2} &= 0.0095(0.9905)(0.001) \\\\ \\text{SE} &= 0.00307 \\\\ z_c &= \\frac{0.015 - 0.004}{0.00307} \\\\ &= 3.59 \\\\ z_v &= \\frac{0.014 - 0.005}{0.00307} \\\\ &= 2.93\\end{aligned}\\]</p><p>where \\(\\bar{p}\\) is the pooled proportion, SE the standard error and \\(z\\) the test statistic; both values of \\(z\\) exceed 1.96. The pooled void proportion is also 0.0095, so voids have the same standard error. Cracks fell, so the action worked on its target. Voids rose significantly at the same time, a possible secondary effect of the parameter change, which must be investigated before the CAPA is closed. The total, \\(z = 0.46\\), shows neither change.</p><p><b>C. Cracks fell, voids rose; investigate before closing.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Corrective and Preventative Action (testing effectiveness; avoid aggregating defect types).</span></p>",
    "optionRationales": [
      "Aggregating the defect types hides a significant fall in cracks and a significant rise in voids.",
      "Cracks did fall, but the significant rise in voids must be explained before the CAPA is closed.",
      "Correct. \\(z_c = 3.59\\) and \\(z_v = 2.93\\) both exceed 1.96, in opposite directions.",
      "A two-proportion hypothesis test is a standard way to compare before and after data; a control chart is not required."
    ],
    "keyPoint": "Judge CAPA effectiveness by defect type: aggregated rates can hide both the improvement and any new problem the action created.",
    "trap": "Testing only the total defect rate.",
    "formula": "\\(z = \\dfrac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\bar{p}(1 - \\bar{p})(1/n_1 + 1/n_2)}}\\)",
    "assumptions": [
      "Units are independent random samples from the process before and after the change."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "CAPA",
      "effectiveness",
      "two-proportion test",
      "aggregation"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Corrective and preventative action (CAPA)",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b11-q110",
    "set": 1,
    "batch": 11,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.4",
      "topic": "Recognizing the people-blaming pitfall in a 5 Why analysis"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation",
    "quantitative": false,
    "stem": "A maintenance team recorded the 5 Why analysis shown for a hose failure. What is wrong with it, and how should the analysis continue?",
    "chart": {
      "type": "data-table",
      "title": "5 Why analysis: hose burst on press 4",
      "columns": [
        "Step",
        "Statement"
      ],
      "rows": [
        [
          "What happened?",
          "A hydraulic hose on press 4 burst during a cycle"
        ],
        [
          "Why?",
          "The hose fitting had backed off"
        ],
        [
          "Why?",
          "The fitting was not torqued to specification when the hose was last replaced"
        ],
        [
          "Why?",
          "The technician skipped the torque step"
        ],
        [
          "Conclusion recorded",
          "Technician error; retrain the technician"
        ]
      ]
    },
    "options": [
      "Lack-of-solution pitfall: the team chose retraining before it began, so the analysis should restart from the burst.",
      "Nothing is wrong: an analysis may stop before five whys, and retraining is a permanent preventive action.",
      "It stops after three whys, and a valid 5 Why analysis must ask the question exactly five times.",
      "People blaming: ask why the process let the torque step be skipped, which leads to engineered controls."
    ],
    "answer": 3,
    "why": "<p>Stopping at \"the technician skipped a step\" blames a person. People-blaming limits the fixes to retraining or replacing someone and leaves the process unchanged, so another technician can repeat the error. The next why asks how the process allowed the step to be skipped: for example, no torque tool, no verification sign-off or no step in the work instruction. That leads to engineered or system controls. The number of whys is not fixed; the chain must reach a cause the organization can remove.</p><p><b>D. People blaming; ask why the process allowed the skip.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Root Cause Analysis (pitfalls: lack of solution, proving oneself right, people blaming; 5 Whys).</span></p>",
    "optionRationales": [
      "The chain does not start from a preset solution; it stops at a person, which is a different pitfall.",
      "Retraining one person does not stop another from making the same error; the process still allows it.",
      "The 5 Whys is not limited to exactly five questions; it continues until it reaches a removable cause.",
      "Correct. The analysis stops at a person, so the process cause is never found."
    ],
    "keyPoint": "Root cause analysis that ends at human error should ask why the system allowed the error.",
    "trap": "Accepting \"operator error\" and retraining as the root cause and permanent fix.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "root cause analysis",
      "5 Whys",
      "people blaming",
      "human error"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Root cause analysis — five whys",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q111",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.5",
      "topic": "Lifecycle cost of pump options"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation, decision",
    "quantitative": true,
    "stem": "A plant will run a pump 6,000 hours a year for 10 years. Each failure costs 800 dollars in parts and labor plus 200 dollars per hour of downtime while the pump is repaired. Using the table, which pump has the lowest lifecycle cost?",
    "chart": {
      "type": "data-table",
      "title": "Pump options",
      "columns": [
        "Pump",
        "Price ($)",
        "MTBF (h)",
        "MTTR (h)"
      ],
      "rows": [
        [
          "A",
          "4,000",
          "8,000",
          "10"
        ],
        [
          "B",
          "6,500",
          "20,000",
          "6"
        ],
        [
          "C",
          "9,000",
          "40,000",
          "4"
        ]
      ]
    },
    "options": [
      "Pump A, with the lowest purchase price at $4,000",
      "Pump B, with the lowest lifecycle cost at about $8,900",
      "Pump C, with the lowest lifecycle cost at about $11,400",
      "Pump B, with the lowest lifecycle cost at about $12,500"
    ],
    "answer": 2,
    "why": "<p>Over 60,000 operating hours, add each pump’s purchase price to its expected failures times the cost of each failure:</p><p>\\[\\begin{aligned}C_A &= 4000 + 7.5(2800) \\\\ &= 25000 \\\\ C_B &= 6500 + 3(2000) \\\\ &= 12500 \\\\ C_C &= 9000 + 1.5(1600) \\\\ &= 11400\\end{aligned}\\]</p><p>where \\(C\\) is the lifecycle cost in dollars; the expected failures are \\(60000/\\text{MTBF}\\), and each failure costs 800 dollars plus 200 dollars times the MTTR (2,800, 2,000 and 1,600 dollars for A, B and C). The most expensive pump to buy is the cheapest to own, because it fails least often and is repaired fastest.</p><p><b>C. Pump C, about $11,400.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Product Lifecycle Engineering Stages (lifecycle cost; “pay me now or pay me later”).</span></p>",
    "optionRationales": [
      "Purchase price is only part of lifecycle cost; Pump A’s failures add about 21,000 dollars over 10 years.",
      "Leaves out downtime cost: 6,500 plus 3 failures at 800 dollars gives 8,900, which favors B.",
      "Correct. 9,000 plus 1.5 failures at 1,600 dollars each gives 11,400, the lowest.",
      "This is Pump B’s correct lifecycle cost, but Pump C’s is lower."
    ],
    "keyPoint": "Choose on lifecycle cost (purchase plus failure and downtime costs over the life), not on purchase price.",
    "trap": "Leaving out downtime cost, which depends on maintainability (MTTR).",
    "formula": "\\(C = P_0 + \\dfrac{L}{\\text{MTBF}}(c_r + c_d \\, \\text{MTTR})\\)",
    "assumptions": [
      "Constant failure rates; no discounting; operating costs other than failures are the same for all three pumps."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "lifecycle cost",
      "MTBF",
      "MTTR",
      "downtime cost"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Product lifecycle engineering stages",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q112",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.5",
      "topic": "Software reliability: fault containment"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "Flight-control software computes each command with two independently written algorithms on separate processors, compares the results and rejects any output on which they disagree. Which phase of the software reliability effort does this technique belong to?",
    "chart": null,
    "options": [
      "Fault containment through redundancy",
      "Error prevention through requirements",
      "Fault detection and removal during testing before release",
      "Reliability growth testing after release"
    ],
    "answer": 0,
    "why": "<p>The software reliability effort has three general phases: error prevention, fault detection and removal, and fault containment through redundancy. Computing a value with alternate, independently written algorithms and comparing the results detects and contains faults automatically while the software runs, which is the containment phase. The diversity matters: identical code on two processors would repeat the same software fault and catch only hardware faults. Error prevention works through solid requirements before coding, and fault detection and removal happens in testing.</p><p><b>A. Fault containment through redundancy.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Product Lifecycle Engineering Stages — Reliability Engineering for Software Products.</span></p>",
    "optionRationales": [
      "Correct. Comparing results from diverse, redundant computations contains faults at run time.",
      "Error prevention happens before coding, mainly through clear, complete requirements.",
      "Detection and removal finds and fixes faults in testing; this technique acts during operation.",
      "Growth testing tracks fault removal over time; it is not a run-time protection."
    ],
    "keyPoint": "Software reliability: prevent errors (requirements), detect and remove faults (testing), contain faults (redundancy at run time).",
    "trap": "Calling any fault-detecting technique part of testing.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "software reliability",
      "fault containment",
      "redundancy"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Reliability engineering for software products",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q113",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.6",
      "topic": "Maintenance strategy and achieved availability"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "Two maintenance strategies are proposed for a packaging line. Strategy 1 adds frequent preventive maintenance (PM); Strategy 2 runs mostly to failure. Using the table, which strategy gives the higher achieved availability, and what is it?",
    "chart": {
      "type": "data-table",
      "title": "Maintenance strategies 1 and 2",
      "columns": [
        "Item",
        "1",
        "2"
      ],
      "rows": [
        [
          "Failures per 1,000 h",
          "1",
          "3"
        ],
        [
          "PM actions per 1,000 h",
          "4",
          "0.5"
        ],
        [
          "Mean active maintenance time (h)",
          "2.5",
          "6.0"
        ]
      ]
    },
    "options": [
      "Strategy 1, 0.9877",
      "Strategy 2, 0.9794",
      "Strategy 2, because its mean time between maintenance actions (286 h) is longer",
      "Strategy 1, 0.9975"
    ],
    "answer": 0,
    "why": "<p>Achieved availability counts all maintenance actions, corrective and preventive, with their active time:</p><p>\\[\\begin{aligned}M_1 &= \\frac{1000}{1 + 4} = 200 \\\\ A_1 &= \\frac{200}{200 + 2.5} \\\\ &= 0.9877 \\\\ M_2 &= \\frac{1000}{3 + 0.5} = 286 \\\\ A_2 &= \\frac{286}{286 + 6} \\\\ &= 0.9794\\end{aligned}\\]</p><p>where \\(M\\) is the mean time between maintenance actions (MTBMA, failures plus PM) in hours and \\(A\\) the achieved availability. Strategy 2 has fewer maintenance actions, but each is longer, and unplanned repairs take more than twice as long as PM, so Strategy 1 is available more of the time.</p><p><b>A. Strategy 1, 0.9877.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Economics of Product Maintainability and Availability (MTBMA and achieved availability).</span></p>",
    "optionRationales": [
      "Correct. More frequent but shorter maintenance actions give the higher achieved availability.",
      "This is Strategy 2’s achieved availability, which is lower than Strategy 1’s.",
      "A longer MTBMA does not guarantee higher availability; Strategy 2’s longer active maintenance time outweighs it.",
      "Uses MTBF alone (1,000 h) and leaves out the PM actions, overstating availability: \\(1000/1002.5\\)."
    ],
    "keyPoint": "Achieved availability trades how often maintenance occurs against how long each action takes.",
    "trap": "Choosing the strategy with fewer maintenance actions without weighing their duration.",
    "formula": "\\(A = \\dfrac{\\text{MTBMA}}{\\text{MTBMA} + \\text{MAMT}}\\), with \\(\\text{MTBMA} = \\dfrac{1}{\\lambda + \\mu}\\)",
    "assumptions": [
      "Constant failure and PM rates; logistic and administrative delays excluded."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "achieved availability",
      "MTBMA",
      "preventive maintenance",
      "maintainability economics"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Economics of product maintainability and availability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q114",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.7",
      "topic": "Quantifiable nonfinancial costs of poor reliability"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A plant sells everything it can make. Each month, 300 of its 10,000 units of capacity go to warranty replacements. The warranty report counts parts, labor and freight for each claim. Which cost of poor reliability does the report miss, even though it could be quantified?",
    "chart": null,
    "options": [
      "The harm to the brand’s reputation among buyers who never file a claim.",
      "The materials and labor used to build each replacement unit.",
      "The freight cost of shipping the replacement units to customers.",
      "The margin lost on 300 sales a month that the replacement units displace."
    ],
    "answer": 3,
    "why": "<p>Replacement units consume production capacity without adding customer value, just like rework. When demand exceeds supply, every replacement displaces a unit that could have been sold, so the lost margin is a real cost. It does not appear in the warranty report but can be quantified. Reputation damage is a cost too, but it is very hard to quantify.</p><p><b>D. Lost margin on displaced sales.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Cost of Poor Reliability — Quantifiable Nonfinancial Costs.</span></p>",
    "optionRationales": [
      "Reputation is a real cost of poor reliability but is described as nonquantifiable in practice.",
      "Parts and labor for each replacement are already counted in the warranty report.",
      "Freight is already counted in the warranty report.",
      "Correct. Capacity used for replacements is lost sales when the plant is sold out, a cost that can be quantified."
    ],
    "keyPoint": "Poor reliability costs more than warranty claims: replacements consume capacity, and reputation suffers.",
    "trap": "Treating the warranty report as the full cost of poor reliability.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "cost of poor reliability",
      "warranty",
      "capacity",
      "lost sales"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Cost of poor reliability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q115",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.8",
      "topic": "The quality triangle"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "Management cuts a development program’s schedule by a third while holding its budget fixed. According to the quality triangle, what should the reliability engineer warn is most likely to suffer?",
    "chart": null,
    "options": [
      "Quality, including reliability, because time has been cut and cost is held.",
      "Nothing, if the program is managed well enough to absorb the change.",
      "The budget, because cost usually gives way first when a schedule is cut.",
      "The schedule, because the program will drift back to its original length."
    ],
    "answer": 0,
    "why": "<p>The quality triangle links cost, time and quality: investing in one element costs another (“faster, better, cheaper: pick any two”). With time cut and cost held, quality, including reliability testing and design margin, is what gives. Good project management can reduce the tradeoff but does not remove it.</p><p><b>A. Quality, including reliability.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Quality Triangle.</span></p>",
    "optionRationales": [
      "Correct. With time cut and cost fixed, quality and reliability are the element at risk.",
      "Effective project management narrows the tradeoff; it does not eliminate it.",
      "The budget is held fixed in this scenario, so cost is not what gives.",
      "The schedule has been cut by decision; the triangle predicts the effect on the remaining element."
    ],
    "keyPoint": "Cost, time and quality trade off: fix two, and the third absorbs the change.",
    "trap": "Assuming better management can deliver all three at once.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "quality triangle",
      "cost",
      "time",
      "quality"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Quality triangle",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q116",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.9",
      "topic": "Reliability work within DMAIC"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, classification",
    "quantitative": false,
    "stem": "A Six Sigma project aims to extend the life of a pump seal. The table lists four of its reliability activities. Which DMAIC phases do they belong to?",
    "chart": {
      "type": "data-table",
      "title": "Reliability activities in the seal project",
      "columns": [
        "Activity",
        "Description"
      ],
      "rows": [
        [
          "1",
          "Fit a Weibull model to field returns to find which failure mode dominates"
        ],
        [
          "2",
          "Confirm the life-test rig’s measurement system and establish the baseline B10 life"
        ],
        [
          "3",
          "Run an accelerated life test on the redesigned seal to confirm the life gain"
        ],
        [
          "4",
          "Add B10 life to the control plan, with periodic ongoing reliability tests"
        ]
      ]
    },
    "options": [
      "1 Measure; 2 Analyze; 3 Improve; 4 Control",
      "1 Analyze; 2 Measure; 3 Improve; 4 Control",
      "1 Analyze; 2 Define; 3 Improve; 4 Control",
      "1 Improve; 2 Measure; 3 Analyze; 4 Control"
    ],
    "answer": 1,
    "why": "<p>Measure establishes a trustworthy baseline, which includes validating the measurement system (activity 2). Analyze finds the causes, here the dominant failure mode in field data (activity 1). Improve develops and confirms the solution (activity 3), and Control sustains it through the control plan and ongoing testing (activity 4).</p><p><b>B. 1 Analyze; 2 Measure; 3 Improve; 4 Control.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Six Sigma Methodologies (DMAIC).</span></p>",
    "optionRationales": [
      "Finding the dominant failure mode is analysis of causes; establishing the baseline is measurement.",
      "Correct. Baseline and measurement system are Measure; failure-mode analysis is Analyze; confirmation is Improve; the control plan is Control.",
      "Validating the measurement system and setting the baseline belong to Measure, not Define.",
      "Confirming the redesign’s life gain is Improve; finding the failure mode is Analyze."
    ],
    "keyPoint": "Reliability tools fit DMAIC: baseline life in Measure, failure analysis in Analyze, life confirmation in Improve, ongoing testing in Control.",
    "trap": "Placing any data analysis in Measure.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "Six Sigma",
      "DMAIC",
      "B10 life",
      "control plan"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Six Sigma methodologies",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q117",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.10",
      "topic": "Integration failures between qualified components"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A medical cart’s battery pack, charger and motor controller each passed their own qualification tests. In the first system-level runs, heat from the charger raised the battery pack above its rated temperature, halving its cycle life. What does this show, and what should the reliability engineer do?",
    "chart": null,
    "options": [
      "The battery’s qualification was inadequate; requalify the battery on its own at a higher temperature.",
      "The charger is defective; replace it with a charger that passed a stricter stand-alone test.",
      "The battery’s thermal margin is too narrow; specify a higher-temperature cell and keep the current layout.",
      "Qualified parts can still interact; add combined-environment testing and fix the layout or cooling."
    ],
    "answer": 3,
    "why": "<p>Systems engineering integrates the elements so the whole operates as one, then runs and evaluates the system against its requirements. Each component met its own requirements; the failure comes from their interaction (the charger heating the battery). That is found only by integrated, system-level testing, and it is fixed at the system level, through layout, airflow or thermal isolation.</p><p><b>D. Qualified parts can interact; test them together and fix layout or cooling.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Systems Engineering and Integration.</span></p>",
    "optionRationales": [
      "The battery met its own rating; the problem is the environment the system creates around it.",
      "The charger works as specified; a stricter stand-alone test would not reveal an interaction.",
      "A tougher cell treats one symptom but leaves the interaction in place; the layout still overheats the pack.",
      "Correct. The failure is an interaction, so it is found and fixed at the system level."
    ],
    "keyPoint": "Component qualification does not prove system reliability; interfaces and interactions need integrated testing.",
    "trap": "Blaming a component that met its own requirements.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "systems engineering",
      "integration",
      "interaction",
      "system-level testing"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Systems engineering and integration",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q118",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.1",
      "topic": "B10 life with a constant failure rate"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A pressure sensor has a constant failure rate and an MTBF of 50,000 hours. What is its B10 life?",
    "chart": null,
    "options": [
      "5,000 h",
      "5,268 h",
      "45,000 h",
      "50,000 h"
    ],
    "answer": 1,
    "why": "<p>B10 life is the time by which 10% of units have failed, so \\(R(t) = 0.90\\):</p><p>\\[\\begin{aligned}e^{-t/\\theta} &= 0.90 \\\\ t &= -\\theta \\ln 0.90 \\\\ &= 50000(0.10536) \\\\ &= 5268 \\text{ h}\\end{aligned}\\]</p><p>where \\(\\theta\\) is the MTBF. With a constant failure rate, about 63% of units fail before the MTBF, so the MTBF is far longer than the B10 life.</p><p><b>B. 5,268 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Basic Reliability Terminology (BX life; reliability with a constant failure rate).</span></p>",
    "optionRationales": [
      "Takes 10% of the MTBF, which only approximates the exact value.",
      "Correct. \\(t = -50000 \\ln 0.90 = 5268\\) h.",
      "Takes 90% of the MTBF, as if reliability fell linearly to zero at the MTBF.",
      "The MTBF is not a life most units reach: only about 37% survive to it."
    ],
    "keyPoint": "BX life solves \\(R(t) = 1 - X/100\\); with a constant failure rate, \\(t = -\\theta \\ln R\\).",
    "trap": "Treating the MTBF as a typical life, or scaling it linearly.",
    "formula": "\\(R(t) = e^{-t/\\theta}\\)",
    "assumptions": [
      "Constant failure rate (exponential life)."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "B10 life",
      "MTBF",
      "exponential",
      "constant failure rate"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Basic reliability terminology",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q119",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.4",
      "topic": "Escape point in an 8D"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation",
    "quantitative": false,
    "stem": "The table shows part of an 8D record for soft drive shafts returned from the field. Which 8D requirement has the team not yet met?",
    "chart": {
      "type": "data-table",
      "title": "8D record: soft drive shafts",
      "columns": [
        "Step",
        "Record"
      ],
      "rows": [
        [
          "D2",
          "Hardness below specification on shafts returned from the field; 1.2% of March production affected"
        ],
        [
          "D3",
          "All shafts in stock and in transit sorted with a hardness check"
        ],
        [
          "D4",
          "Root cause verified: quench furnace temperature drift, reproduced in a trial run"
        ],
        [
          "D5",
          "Furnace controller replaced; trial lots meet hardness on every shaft"
        ]
      ]
    },
    "options": [
      "D3 containment: sorting stock and in-transit shafts does not isolate the problem from customers.",
      "D4 root cause: reproducing the defect in a trial does not count as verifying the cause.",
      "D5 permanent correction: replacing the controller is a containment action, not a correction.",
      "D4 escape point: the team has not found why final inspection let soft shafts ship."
    ],
    "answer": 3,
    "why": "<p>D4 requires two things: the verified root cause and the escape point, the reason the problem was not caught when it occurred. The team verified the cause (furnace drift, reproduced in a trial) but has not asked why final inspection let soft shafts reach customers. Without that, a future process problem could escape the same way.</p><p><b>D. D4 escape point.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Root Cause Analysis — 8D (D4: determine, identify and verify root causes and escape points).</span></p>",
    "optionRationales": [
      "Sorting all stock and in-transit parts is the interim containment that D3 calls for.",
      "Turning the cause on and off in a trial is strong verification of a root cause.",
      "Replacing the drifting controller removes the cause, and trial lots confirm it, which is what D5 asks.",
      "Correct. D4 also requires the escape point: why the defect was not detected."
    ],
    "keyPoint": "8D D4 needs both the verified root cause and the escape point.",
    "trap": "Stopping at the root cause without asking how the defect escaped detection.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "8D",
      "escape point",
      "root cause analysis",
      "containment"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Root cause analysis — 8D",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b12-q120",
    "set": 1,
    "batch": 12,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.3",
      "topic": "Testing CAPA effectiveness with a Poisson model"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Calculation, hypothesis test",
    "quantitative": true,
    "stem": "Before a corrective and preventive action (CAPA), a fan model logged 18 failures in 36,000 unit-hours of testing. After the CAPA, 24,000 unit-hours produced 4 failures. If the CAPA had no effect and the failure rate were still constant at its old value, what is the probability of 4 or fewer failures in the new test?",
    "chart": null,
    "options": [
      "0.0023",
      "0.0053",
      "0.0076",
      "0.9977"
    ],
    "answer": 2,
    "why": "<p>Under the old failure rate, the expected number of failures in the new test is:</p><p>\\[\\begin{aligned}\\mu &= 24000 \\times \\frac{18}{36000} \\\\ &= 12 \\\\ P(X \\le 4) &= \\sum_{k=0}^{4}\\frac{e^{-12}12^{k}}{k!} \\\\ &= 1237e^{-12} \\\\ &= 0.0076\\end{aligned}\\]</p><p>where \\(\\mu\\) is the expected Poisson count and \\(X\\) the number of failures. Four or fewer failures would happen less than 1% of the time if nothing had changed, so the evidence supports an effective CAPA. Turning the action off and on and seeing the effect follow is the strongest confirmation.</p><p><b>C. 0.0076</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Corrective and Preventative Action (testing effectiveness with before-and-after data).</span></p>",
    "optionRationales": [
      "This is \\(P(X \\le 3)\\); “4 or fewer” must include \\(X = 4\\).",
      "This is \\(P(X = 4)\\) alone; “4 or fewer” sums \\(X = 0\\) to 4.",
      "Correct. \\(1237e^{-12} = 0.0076\\).",
      "This is \\(P(X \\ge 4)\\), the wrong tail."
    ],
    "keyPoint": "Judge a CAPA by asking how likely the after-data would be if nothing had changed.",
    "trap": "Using a single Poisson term or the wrong tail.",
    "formula": "\\(P(X \\le c) = \\sum_{k=0}^{c} \\dfrac{e^{-\\mu}\\mu^{k}}{k!}\\)",
    "assumptions": [
      "Failures follow a Poisson process with a constant rate in each period."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "CAPA",
      "effectiveness",
      "Poisson",
      "hypothesis test"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Corrective and preventative action (CAPA)",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q121",
    "set": 1,
    "batch": 13,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.5",
      "topic": "Scheduling a reprocessing test in the Gantt chart"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A reusable surgical instrument must survive 100 reprocessing cycles, and the test plan is summarized in the table. How many sterilizer days should the program Gantt chart allow for this test?",
    "chart": {
      "type": "data-table",
      "title": "Reprocessing test plan",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Units on test",
          "12"
        ],
        [
          "Sterilizer capacity",
          "6 units per cycle"
        ],
        [
          "Cycle time, including functional check",
          "4.5 h"
        ],
        [
          "Cycles required per unit",
          "100"
        ],
        [
          "Sterilizer availability",
          "18 h per day"
        ]
      ]
    },
    "options": [
      "25 days",
      "38 days",
      "45 days",
      "50 days"
    ],
    "answer": 3,
    "why": "<p>Twelve units need two sterilizer loads, and each load must complete 100 cycles:</p><p>\\[\\begin{aligned}T &= 2 \\times 100 \\times 4.5 \\\\ &= 900 \\text{ h} \\\\ d &= \\frac{900}{18} = 50 \\text{ days}\\end{aligned}\\]</p><p>where \\(T\\) is the sterilizer time in hours and \\(d\\) the number of 18-hour sterilizer days. Exactly 4 whole cycles fit in each day, so 200 cycles also take 50 days when counted cycle by cycle. Reprocessing time like this often puts a reliability test on the critical path, which is why it must be in the plan from the start.</p><p><b>D. 50 days</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Project Management in Reliability Engineering — Reliability Engineering Gantt Chart Considerations (test duration, fixtures and environments).</span></p>",
    "optionRationales": [
      "Schedules only one load of 6 units, not all 12.",
      "Assumes the sterilizer runs 24 h a day instead of the 18 h available.",
      "Leaves out the 0.5 h functional check in each cycle: 800 h over 18-hour days.",
      "Correct. \\(2 \\times 100 \\times 4.5 = 900\\) h, or 50 eighteen-hour days."
    ],
    "keyPoint": "Reliability test duration depends on fixture or chamber capacity, cycle time and checks; plan it early because it is often on the critical path.",
    "trap": "Leaving out capacity limits or per-cycle checks when estimating test duration.",
    "formula": "\\(d = \\left\\lceil \\dfrac{L \\, c \\, t}{h} \\right\\rceil\\)",
    "assumptions": [
      "Loads run one after another; no downtime of the sterilizer."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Gantt chart",
      "test duration",
      "reliability test planning"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Project management in reliability engineering — Gantt chart considerations",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q122",
    "set": 1,
    "batch": 13,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.1",
      "topic": "Maintainability as a function of time"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "Repair times for a controller are exponentially distributed with a mean time to repair (MTTR) of 2 hours. Within how many hours are 95% of repairs completed?",
    "chart": null,
    "options": [
      "1.9 h",
      "2.0 h",
      "6.0 h",
      "40 h"
    ],
    "answer": 2,
    "why": "<p>Maintainability \\(M(t)\\) is the probability that a repair is completed within time \\(t\\). Set it to 0.95 and solve:</p><p>\\[\\begin{aligned}M(t) &= 1 - e^{-t/\\text{MTTR}} = 0.95 \\\\ t &= -2 \\ln 0.05 \\\\ &= 5.99 \\text{ h}\\end{aligned}\\]</p><p>where \\(t\\) is the repair time and MTTR the mean time to repair. With exponential repair times, the 95th percentile is about three times the mean.</p><p><b>C. 6.0 h</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Basic Reliability Terminology — Maintainability (maintainability as a function of time).</span></p>",
    "optionRationales": [
      "Takes 95% of the MTTR, which treats a percentile as a fraction of the mean.",
      "The MTTR is the mean; only about 63% of exponential repairs finish within it.",
      "Correct. \\(t = -2\\ln 0.05 = 5.99\\) h.",
      "Divides the MTTR by 0.05 instead of using the exponential function."
    ],
    "keyPoint": "Maintainability \\(M(t)\\) is a probability of completing repair within \\(t\\); high percentiles lie well above the MTTR.",
    "trap": "Treating the MTTR as the time within which most repairs finish.",
    "formula": "\\(M(t) = 1 - e^{-t/\\text{MTTR}}\\)",
    "assumptions": [
      "Repair times are exponentially distributed."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "maintainability",
      "MTTR",
      "exponential repair time"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Basic reliability terminology — maintainability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q123",
    "set": 1,
    "batch": 13,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "B. Reliability Foundations",
      "code": "I.B.2",
      "topic": "Categories of reliability acceptance criteria"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "A requirement says: “After 72 hours of storage at −40 °C, the pump shall start and deliver its rated flow.” What kind of reliability requirement does the −40 °C storage temperature set?",
    "chart": null,
    "options": [
      "A functional requirement",
      "An environmental requirement",
      "A time requirement",
      "A probability of success requirement"
    ],
    "answer": 1,
    "why": "<p>Reliability acceptance criteria fall into three categories: functional requirements (such as a minimum flow rate), environmental requirements (such as temperature, radiation or pH) and time requirements (such as the failure rate during useful life). The storage temperature is an environmental condition; the rated flow is the functional part of the same requirement.</p><p><b>B. An environmental requirement.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 2, Drivers of Reliability Requirements and Targets (functional, environmental and time requirements).</span></p>",
    "optionRationales": [
      "The rated flow is functional, but the storage condition is environmental.",
      "Correct. Temperature during storage is an environmental requirement.",
      "The 72 hours set the exposure, but the condition being specified is the temperature.",
      "No probability is stated; the requirement sets conditions, not a reliability level."
    ],
    "keyPoint": "Acceptance criteria are functional, environmental or time requirements; one requirement can combine them.",
    "trap": "Classifying a whole requirement by its functional output.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "reliability requirements",
      "environmental requirement",
      "acceptance criteria"
    ],
    "sourceSection": "Chapter 2 - Reliability Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 2 - Reliability Foundations",
        "section": "Drivers of reliability requirements and targets",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q124",
    "set": 1,
    "batch": 13,
    "sub": "cre-fundamentals",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "I. Reliability Fundamentals",
      "subdomain": "A. Leadership Foundations",
      "code": "I.A.7",
      "topic": "Reporting an inconclusive result honestly"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A comparison of a new and an old seal shows the new seal’s mean life is 8% longer, but the two-sample test gives \\(p = 0.20\\). The product manager asks for the report to say the new seal “is proven to last longer.” What should the reliability engineer report?",
    "chart": null,
    "options": [
      "The 8% observed gain with its p-value, stating that the test did not show a significant difference at the 5% level.",
      "That the new seal is proven to last longer, because its sample mean life is higher than the old seal’s.",
      "That the new seal and the old seal have equal mean life, because the test found no significant difference.",
      "That the new seal lasts longer, because an 8% gain matters in practice even though \\(p = 0.20\\)."
    ],
    "answer": 0,
    "why": "<p>The ASQ Code of Ethics requires being truthful and transparent. A reliability engineer presents both the good and the bad news and discloses the significance level when hypothesis tests support conclusions. An 8% difference with a p-value of 0.20 is not statistically demonstrated, so the report states what was observed and that it was not significant; it can also recommend a larger test.</p><p><b>A. The gain with its p-value; not significant at 5%.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 1, Ethics in Reliability Engineering (ASQ Code of Ethics A.2: truthful and transparent; disclose significance levels).</span></p>",
    "optionRationales": [
      "Correct. Report the observation and its significance honestly.",
      "A higher sample mean with a p-value of 0.20 does not prove a difference.",
      "Failing to find a difference does not prove the lives are equal; the observed gain must be reported too.",
      "Practical importance does not make an unproven difference proven; the uncertainty must be disclosed."
    ],
    "keyPoint": "Report results with their significance level, including the bad news.",
    "trap": "Claiming proof from a sample difference that is not statistically significant.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "ethics",
      "significance level",
      "transparent reporting"
    ],
    "sourceSection": "Chapter 1 - Leadership Foundations",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 1 - Leadership Foundations",
        "section": "Ethics in reliability engineering",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q125",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.1",
      "topic": "Sample size for zero-failure design verification"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "A design verification test for a medium-risk requirement uses 90% confidence and 95% reliability, with zero failures allowed. What is the minimum sample size?",
    "chart": null,
    "options": [
      "20",
      "29",
      "45",
      "299"
    ],
    "answer": 2,
    "why": "<p>For a zero-failure attribute test, the sample size comes from the binomial distribution:</p><p>\\[\\begin{aligned}n &= \\frac{\\ln(1 - C)}{\\ln R} \\\\ &= \\frac{\\ln 0.10}{\\ln 0.95} \\\\ &= 44.9 \\rightarrow 45\\end{aligned}\\]</p><p>where \\(C\\) is the confidence level and \\(R\\) the reliability to be shown; round up. If all 45 units pass, the team can claim 95% reliability with 90% confidence.</p><p><b>C. 45</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design Evaluation Techniques — Design Verification (sample size for zero-failure acceptance testing).</span></p>",
    "optionRationales": [
      "Uses \\(1/(1 - R) = 20\\), which ignores the confidence level.",
      "Swaps confidence and reliability: \\(\\ln 0.05/\\ln 0.90 = 28.4\\).",
      "Correct. \\(\\ln 0.10/\\ln 0.95 = 44.9\\), rounded up to 45.",
      "This is the sample size for a high-risk requirement at 95% confidence and 99% reliability."
    ],
    "keyPoint": "Higher risk calls for higher confidence and reliability, which drive the zero-failure sample size up quickly.",
    "trap": "Swapping confidence and reliability in the formula.",
    "formula": "\\(n = \\dfrac{\\ln(1 - C)}{\\ln R}\\)",
    "assumptions": [
      "Units are independent; zero failures are allowed."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "design verification",
      "success testing",
      "sample size",
      "confidence",
      "reliability"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design evaluation techniques — design verification",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q126",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.2",
      "topic": "Choosing the best stress–strength improvement"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation, decision",
    "quantitative": true,
    "stem": "Stress on a bracket and its strength are independent and normally distributed, as in the table. Which single change gives the lowest probability of failure?",
    "chart": {
      "type": "data-table",
      "title": "Bracket stress and strength (MPa)",
      "columns": [
        "Quantity",
        "Mean",
        "Standard deviation"
      ],
      "rows": [
        [
          "Stress",
          "300",
          "40"
        ],
        [
          "Strength",
          "420",
          "30"
        ]
      ]
    },
    "options": [
      "Raise the mean strength to 440 MPa",
      "Cut the strength standard deviation to 15 MPa",
      "Cut the stress standard deviation to 30 MPa",
      "Cut the mean stress to 290 MPa"
    ],
    "answer": 2,
    "why": "<p>Failure occurs when strength minus stress is negative. Compute \\(z = \\mu_D/\\sigma_D\\) for each change (now \\(120/50 = 2.40\\)):</p><p>\\[\\begin{aligned}z_A &= \\frac{140}{50} = 2.80 \\\\ z_B &= \\frac{120}{\\sqrt{40^{2} + 15^{2}}} = 2.81 \\\\ z_C &= \\frac{120}{\\sqrt{30^{2} + 30^{2}}} = 2.83 \\\\ z_D &= \\frac{130}{50} = 2.60\\end{aligned}\\]</p><p>where \\(\\mu_D\\) is the mean and \\(\\sigma_D\\) the standard deviation of strength minus stress. The probability of failure is \\(\\Phi(-z)\\): about 0.0026, 0.0025, 0.0023 and 0.0047. The largest variance is the stress’s, so cutting it shrinks \\(\\sigma_D\\) most; the largest \\(z\\) gives the lowest probability.</p><p><b>C. Cut the stress standard deviation to 30 MPa.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Stress–Strength Analysis for Normal Distributions (four ways to improve reliability).</span></p>",
    "optionRationales": [
      "Raising the mean strength by 20 gives \\(z = 2.80\\), slightly less than cutting the stress variation.",
      "Halving the strength variation gives \\(z = 2.81\\); the stress variation is the larger term in \\(\\sigma_D\\).",
      "Correct. \\(\\sigma_D\\) falls to 42.4 and \\(z\\) rises to 2.83, the largest.",
      "Lowering the mean stress by 10 gives only \\(z = 2.60\\)."
    ],
    "keyPoint": "Reduce the largest source of variance first: shrinking the dominant spread can beat shifting a mean.",
    "trap": "Assuming that raising strength is always the most effective change.",
    "formula": "\\(P_f = \\Phi\\left(-\\dfrac{\\mu_Y - \\mu_X}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\right)\\)",
    "assumptions": [
      "Stress and strength are independent and normally distributed."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "stress-strength interference",
      "normal distribution",
      "variance reduction"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Stress–strength analysis for normal distributions",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q127",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.2",
      "topic": "Equal safety factors, different risks"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "Two shaft designs have the same factor of safety, 1.5, based on mean strength and mean stress. Stress and strength are independent and normally distributed, as in the table. What is the probability of failure for Design Y, and what does it show?",
    "chart": {
      "type": "data-table",
      "title": "Shaft designs (MPa)",
      "columns": [
        "Design",
        "Stress mean",
        "Stress SD",
        "Strength mean",
        "Strength SD"
      ],
      "rows": [
        [
          "X",
          "300",
          "30",
          "450",
          "20"
        ],
        [
          "Y",
          "300",
          "60",
          "450",
          "60"
        ]
      ]
    },
    "options": [
      "About 0.039 for Design X as well, because designs with equal safety factors have equal interference.",
      "About 0.039; Design Y’s larger variation gives far more interference than Design X.",
      "About 0.00002, the same as Design X, because their safety factors are equal.",
      "About 0.0062, using only the variation in strength."
    ],
    "answer": 1,
    "why": "<p>Use the distribution of strength minus stress for Design Y:</p><p>\\[\\begin{aligned}\\sigma_D &= \\sqrt{60^{2} + 60^{2}} = 84.9 \\\\ z &= \\frac{450 - 300}{84.9} = 1.768 \\\\ P_f &= \\Phi(-1.768) = 0.039\\end{aligned}\\]</p><p>where \\(\\sigma_D\\) is the standard deviation of strength minus stress and \\(z\\) the number of standard deviations between zero and its mean. For Design X, \\(z = 150/36.1 = 4.16\\) and \\(P_f \\approx 0.00002\\). The safety factor uses means only and has no direct link to probability; stress–strength interference shows the risk.</p><p><b>B. About 0.039.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Stress–Strength Analysis (factor of safety versus interference).</span></p>",
    "optionRationales": [
      "Equal safety factors do not mean equal interference: Design X’s probability is about 0.00002.",
      "Correct. \\(z = 1.768\\), so \\(P_f = 0.039\\), more than 2,000 times Design X’s risk.",
      "That is Design X’s probability; Design Y’s larger variation gives far more interference.",
      "Leaves out the stress variation: \\(150/60 = 2.5\\) gives 0.0062."
    ],
    "keyPoint": "A safety factor compares means; interference analysis adds the variation and gives a probability.",
    "trap": "Treating equal safety factors as equal reliability.",
    "formula": "\\(z = \\dfrac{\\mu_Y - \\mu_X}{\\sqrt{\\sigma_X^{2} + \\sigma_Y^{2}}}\\)",
    "assumptions": [
      "Stress and strength are independent and normally distributed."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "factor of safety",
      "stress-strength interference",
      "variation"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Stress–strength analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q128",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.3",
      "topic": "Interaction effect in a replicated two-level factorial design"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A replicated \\(2^{2}\\) experiment studies cure temperature (A) and cure time (B) on the peel strength of a bonded joint. Using the table, what is the AB interaction effect?",
    "chart": {
      "type": "data-table",
      "title": "Peel strength (N), two replicates",
      "columns": [
        "Run",
        "Temperature (A)",
        "Time (B)",
        "Replicate 1",
        "Replicate 2"
      ],
      "rows": [
        [
          "1",
          "Low",
          "Low",
          "42",
          "44"
        ],
        [
          "2",
          "High",
          "Low",
          "50",
          "48"
        ],
        [
          "3",
          "Low",
          "High",
          "46",
          "48"
        ],
        [
          "4",
          "High",
          "High",
          "64",
          "62"
        ]
      ]
    },
    "options": [
      "2.5",
      "5.0",
      "9.0",
      "10.0"
    ],
    "answer": 1,
    "why": "<p>Average each run, then compare the runs where A and B are at the same level with those where they differ:</p><p>\\[\\begin{aligned}\\bar{y} &= 43,\\ 49,\\ 47,\\ 63 \\\\ AB &= \\frac{43 + 63}{2} - \\frac{49 + 47}{2} \\\\ &= 53 - 48 = 5.0\\end{aligned}\\]</p><p>where \\(\\bar{y}\\) is the run average and \\(AB\\) the interaction effect. The coefficient in the coded regression model is half the effect, 2.5. For comparison, the main effects are \\(A = 11\\) and \\(B = 9\\): longer cure time helps much more at high temperature (+14) than at low temperature (+4).</p><p><b>B. 5.0</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design of Experiments — 2^k Full-Factorial Designs and Interaction Effect.</span></p>",
    "optionRationales": [
      "This is the regression coefficient, which is half the effect.",
      "Correct. \\((43 + 63)/2 - (49 + 47)/2 = 5.0\\).",
      "This is the main effect of B (time), not the interaction.",
      "Adds the diagonal totals without averaging: 106 minus 96."
    ],
    "keyPoint": "An effect is the difference of two averages; its coded coefficient is half the effect.",
    "trap": "Confusing an effect with its regression coefficient.",
    "formula": "\\(AB = \\bar{y}_{AB = +} - \\bar{y}_{AB = -}\\)",
    "assumptions": [
      "Runs were randomized; the two replicates are true replicates."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "design of experiments",
      "2^k factorial",
      "interaction effect",
      "coefficient"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design of experiments — 2^k full-factorial designs",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q129",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.4",
      "topic": "Meeting a reliability goal at the lowest cost"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, multi-step calculation, decision",
    "quantitative": true,
    "stem": "The block diagram shows a three-stage process with a reliability goal of 0.86. Which single improvement meets the goal at the lowest cost?",
    "chart": {
      "type": "cre-rbd",
      "title": "Three-stage process",
      "altText": "Reliability block diagram with three stages in series: Stage 1 reliability 0.95, Stage 2 reliability 0.90, Stage 3 reliability 0.92.",
      "stages": [
        {
          "label": "Stage 1",
          "blocks": [
            {
              "label": "Stage 1 unit",
              "r": "0.95"
            }
          ]
        },
        {
          "label": "Stage 2",
          "blocks": [
            {
              "label": "Stage 2 unit",
              "r": "0.90"
            }
          ]
        },
        {
          "label": "Stage 3",
          "blocks": [
            {
              "label": "Stage 3 unit",
              "r": "0.92"
            }
          ]
        }
      ]
    },
    "options": [
      "Add a redundant stage 2 unit in parallel, for 3,000 dollars",
      "Upgrade the stage 3 unit to 0.98, for 2,000 dollars",
      "Add a redundant stage 3 unit in parallel, for 2,500 dollars",
      "Upgrade stage 1 to 0.99 and stage 3 to 0.98, for 3,500 dollars"
    ],
    "answer": 0,
    "why": "<p>The present system reliability is \\(0.95(0.90)(0.92) = 0.787\\). Evaluate each option:</p><p>\\[\\begin{aligned}R_A &= 0.95(1 - 0.10^{2})(0.92) \\\\ &= 0.865 \\\\ R_B &= 0.95(0.90)(0.98) \\\\ &= 0.838 \\\\ R_C &= 0.95(0.90)(1 - 0.08^{2}) \\\\ &= 0.8495 \\\\ R_D &= 0.99(0.90)(0.98) \\\\ &= 0.873\\end{aligned}\\]</p><p>where \\(R\\) is the system reliability. Options A and D meet 0.86; B and C (0.8495) fall short. Of the two that meet the goal, A costs less. Improving the weakest stage first usually gives the largest gain.</p><p><b>A. Redundant stage 2 unit, 3,000 dollars.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Reliability Optimization (model, estimate reliability and cost, optimize).</span></p>",
    "optionRationales": [
      "Correct. 0.865 meets the goal, and it is cheaper than D.",
      "Only 0.838: stage 2, the weakest, still limits the system.",
      "0.8495 falls short of 0.86, although it is cheaper.",
      "Meets the goal at 0.873 but costs 500 dollars more than A."
    ],
    "keyPoint": "Optimize by modeling the system, estimating each option’s reliability and cost, then choosing the cheapest option that meets the goal.",
    "trap": "Choosing the cheapest option without checking that it meets the goal.",
    "formula": "\\(R_{\\text{sys}} = \\prod_i R_i\\), with \\(R_{\\text{parallel}} = 1 - (1 - R)^{2}\\)",
    "assumptions": [
      "Stages are independent; a redundant unit is identical and either unit suffices."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "reliability optimization",
      "redundancy",
      "series system",
      "cost"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Reliability optimization",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b13-q130",
    "set": 1,
    "batch": 13,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.5",
      "topic": "Human performance and job underload"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "An inspector watches a highly automated line on which a defect appears about once a week. Audits show she misses more defects than inspectors on other lines. Which explanation and response best fit human-factors principles?",
    "chart": null,
    "options": [
      "Overload: the automated line runs faster than the others, so slow it to cut the units she must scan each minute.",
      "Lack of skill: retrain her until her detection rate matches that of the other inspectors.",
      "Stress: she is under time pressure, so add an extra break to each shift.",
      "Underload: the task gives too little stimulation, so add task variety or rotation to sustain attention."
    ],
    "answer": 3,
    "why": "<p>Human performance peaks at a moderate level of stress. Job underload, work that gives too little meaningful stimulation, lowers performance just as overload does. Rare defects on a monotonous task produce vigilance losses, so the fix is in the work design: task variety, rotation or automated support, not blaming or retraining the person.</p><p><b>D. Underload; add variety or rotation.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Human Factors (stress and performance; work overload and underload).</span></p>",
    "optionRationales": [
      "Rare defects on an automated line point to too little stimulation, not too much demand.",
      "Missed rare events are a work-design problem; retraining does not restore vigilance.",
      "More breaks reduce challenge further; a monotonous task with rare signals needs more stimulation, not less.",
      "Correct. Underload reduces vigilance; varied work restores it."
    ],
    "keyPoint": "Human performance is best at moderate stress; both overload and underload degrade it.",
    "trap": "Assuming that lower stress always means better performance.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "human factors",
      "underload",
      "vigilance",
      "human reliability"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Human factors",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q131",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.3",
      "topic": "Aliasing and resolution in a half fraction"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation",
    "quantitative": false,
    "stem": "The table shows a \\(2^{4-1}\\) fractional factorial design built with the generator \\(D = ABC\\). With which effect is the AB interaction aliased, and what is the resolution of the design?",
    "chart": {
      "type": "data-table",
      "title": "Half-fraction design matrix",
      "columns": [
        "Run",
        "A",
        "B",
        "C",
        "D"
      ],
      "rows": [
        [
          "1",
          "−1",
          "−1",
          "−1",
          "−1"
        ],
        [
          "2",
          "+1",
          "−1",
          "−1",
          "+1"
        ],
        [
          "3",
          "−1",
          "+1",
          "−1",
          "+1"
        ],
        [
          "4",
          "+1",
          "+1",
          "−1",
          "−1"
        ],
        [
          "5",
          "−1",
          "−1",
          "+1",
          "+1"
        ],
        [
          "6",
          "+1",
          "−1",
          "+1",
          "−1"
        ],
        [
          "7",
          "−1",
          "+1",
          "+1",
          "−1"
        ],
        [
          "8",
          "+1",
          "+1",
          "+1",
          "+1"
        ]
      ]
    },
    "options": [
      "CD; resolution IV",
      "D; resolution III",
      "ABCD; resolution IV",
      "BC; resolution III"
    ],
    "answer": 0,
    "why": "<p>The generator \\(D = ABC\\) gives the defining relation \\(I = ABCD\\). Multiplying AB by the defining word gives its alias: \\(AB \\times ABCD = A^{2}B^{2}CD = CD\\). The shortest word in the defining relation has four letters, so the design is resolution IV: main effects are aliased only with three-factor interactions, and two-factor interactions are aliased in pairs (AB with CD, AC with BD, AD with BC). In the table, the product of columns A and B matches the product of columns C and D in every run.</p><p><b>A. CD; resolution IV.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design of Experiments — Two-Level Fractional Factorial Experiments; Confounding; Resolution.</span></p>",
    "optionRationales": [
      "Correct. \\(I = ABCD\\), so AB = CD, and the four-letter word makes the design resolution IV.",
      "D is aliased with ABC, a three-factor interaction, not with AB.",
      "ABCD is the defining word (the identity column), not an alias of AB.",
      "BC is aliased with AD here; the shortest defining word has four letters, so the design is resolution IV, not III."
    ],
    "keyPoint": "Find aliases by multiplying an effect by the defining relation; resolution is the length of the shortest defining word.",
    "trap": "Assuming two-factor interactions are clear in a resolution IV design.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 3,
    "keywords": [
      "fractional factorial",
      "aliasing",
      "confounding",
      "resolution"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design of experiments — fractional factorial designs; confounding; resolution",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q132",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.3",
      "topic": "Blocking on a nuisance factor"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A \\(2^{4}\\) experiment on a forming process needs 16 runs. Each steel coil supplies material for only 8 runs, and coils differ in hardness. How should the team run the experiment?",
    "chart": null,
    "options": [
      "Run each coil as a block of 8, confounding ABCD with blocks, and randomize within each block.",
      "Randomize all 16 runs across the two coils and ignore which coil each run used.",
      "Run every high-A run on coil 1 and every low-A run on coil 2, randomizing the run order within each coil.",
      "Treat the coil as a fifth factor and double the experiment to 32 runs so that every combination is covered."
    ],
    "answer": 0,
    "why": "<p>A block is a planned grouping of runs that removes a known nuisance source, here the coil, from the comparison of factor effects. Splitting the 16 runs into two blocks of 8 and confounding the highest-order interaction (ABCD, usually negligible) with the block difference keeps all main effects and two-factor interactions clear of the coil effect. Randomization then happens within each block.</p><p><b>A. Two blocks of 8, ABCD confounded with blocks, randomized within blocks.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design of Experiments — Blocking; Randomization.</span></p>",
    "optionRationales": [
      "Correct. Blocking on the coil removes its effect, at the cost of only the ABCD interaction.",
      "Ignoring the coil leaves its hardness difference in the error term, which inflates noise and can bias effects.",
      "This confounds factor A completely with the coil, so the A effect cannot be separated from the hardness difference.",
      "Doubling the runs is unnecessary; a nuisance variable is handled by blocking, not by studying it as a factor."
    ],
    "keyPoint": "Block on known nuisance sources, confound the least important effect with blocks, and randomize within blocks.",
    "trap": "Aligning a factor with the nuisance source, which confounds that factor.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "blocking",
      "randomization",
      "2^k factorial",
      "nuisance factor"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design of experiments — blocking",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q133",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.6",
      "topic": "Fault detection and fault isolation capability"
    },
    "difficulty": "Medium",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A design-for-testability review injects faults into a controller to check its built-in test (BIT). Using the table, what are the fault detection capability (the share of injected faults detected) and the fault isolation capability (the share of detected faults isolated to one module)?",
    "chart": {
      "type": "data-table",
      "title": "BIT fault-injection results",
      "columns": [
        "Item",
        "Count"
      ],
      "rows": [
        [
          "Faults injected",
          "200"
        ],
        [
          "Faults detected by BIT",
          "184"
        ],
        [
          "Detected faults isolated to one replaceable module",
          "161"
        ]
      ]
    },
    "options": [
      "Detection 0.920; isolation 0.805",
      "Detection 0.875; isolation 0.920",
      "Detection 0.805; isolation 0.875",
      "Detection 0.920; isolation 0.875"
    ],
    "answer": 3,
    "why": "<p>Detection compares detected faults with all faults; isolation compares isolated faults with the faults that were detected:</p><p>\\[\\begin{aligned}\\text{FD} &= \\frac{184}{200} = 0.920 \\\\ \\text{FI} &= \\frac{161}{184} = 0.875\\end{aligned}\\]</p><p>where FD is the fault detection capability and FI the fault isolation capability. A fault must be detected before it can be isolated, so isolation is measured against the detected faults.</p><p><b>D. Detection 0.920; isolation 0.875.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design for X — design for testability (fault detection and fault isolation capability).</span></p>",
    "optionRationales": [
      "Divides the isolated faults by all injected faults (0.805), not by the detected faults.",
      "The two measures are swapped.",
      "Uses the isolated share of all faults as detection.",
      "Correct. \\(184/200 = 0.920\\) and \\(161/184 = 0.875\\)."
    ],
    "keyPoint": "Fault detection is detected over total faults; fault isolation is isolated over detected faults.",
    "trap": "Measuring isolation against all faults instead of the detected ones.",
    "formula": "\\(\\text{FD} = N_d/N\\); \\(\\text{FI} = N_i/N_d\\)",
    "assumptions": [
      "Injected faults are representative of field faults."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "design for testability",
      "built-in test",
      "fault detection",
      "fault isolation"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design for X — testability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q134",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.7",
      "topic": "Using FEA results in design for reliability"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Scenario, calculation",
    "quantitative": true,
    "stem": "A finite element analysis (FEA) of a cast bracket under the maximum service load shows a peak stress of 210 MPa at a sharp internal corner. The alloy’s fatigue strength at \\(10^{7}\\) cycles is 240 MPa, and the design rule requires a factor of safety of at least 1.5 against it. What should the design-for-reliability team do?",
    "chart": null,
    "options": [
      "Release the design, because the peak stress is below the fatigue strength, so the bracket will not fatigue.",
      "Redesign the corner, for example with a larger fillet, to bring peak stress to 160 MPa or less, then verify by test.",
      "Accept the design, because the factor of safety is 1.14 and FEA peak stresses at sharp corners depend on the mesh.",
      "Change to an alloy with a fatigue strength of 300 MPa and keep the corner as it is."
    ],
    "answer": 1,
    "why": "<p>Compare the FEA result with the design rule:</p><p>\\[\\begin{aligned}\\text{FoS} &= \\frac{240}{210} = 1.14 \\\\ \\sigma_{\\max} &= \\frac{240}{1.5} = 160 \\text{ MPa}\\end{aligned}\\]</p><p>where FoS is the factor of safety against the fatigue strength and \\(\\sigma_{\\max}\\) the highest peak stress the rule allows. A factor of 1.14 falls short of 1.5, so the corner must be redesigned before prototypes are built, which is when FEA gives the most value. Model results are then confirmed with measurements, such as strain gauges.</p><p><b>B. Redesign to at most 160 MPa, then confirm by test.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design for Reliability (FEA to assess and optimize robustness early).</span></p>",
    "optionRationales": [
      "A factor of 1.14 does not meet the required 1.5, and scatter in fatigue strength makes the small margin risky.",
      "Correct. \\(240/1.5 = 160\\) MPa is the allowable peak stress.",
      "Mesh sensitivity is a reason to refine the model and verify it by test, not to accept a factor of 1.14 against a required 1.5.",
      "The stronger alloy allows \\(300/1.5 = 200\\) MPa, still below the 210 MPa peak, so the corner must change anyway."
    ],
    "keyPoint": "Use FEA early to find and fix stress concentrations against the design margin, then verify the model by test.",
    "trap": "Treating any stress below the fatigue strength as safe without the required margin.",
    "formula": "\\(\\text{FoS} = S_f/\\sigma_{\\text{peak}}\\)",
    "assumptions": [
      "The FEA load case is the maximum service load; the fatigue strength is for the cast alloy at the service stress ratio."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "design for reliability",
      "finite element analysis",
      "factor of safety",
      "fatigue"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design for reliability",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q135",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "B. Parts and Systems Development",
      "code": "V.B.1",
      "topic": "Selecting a component rating by derating level"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A capacitor in an avionics flight-control unit sees 35 V in service. The company’s derating rules are in the table, and Level B applies to avionics and safety-related uses. What is the lowest standard voltage rating that complies?",
    "chart": {
      "type": "data-table",
      "title": "Capacitor voltage derating rules",
      "columns": [
        "Derating level",
        "Maximum applied voltage"
      ],
      "rows": [
        [
          "Level A (general use)",
          "70% of rated voltage"
        ],
        [
          "Level B (avionics, safety-related, long life)",
          "50% of rated voltage"
        ]
      ]
    },
    "options": [
      "50 V",
      "63 V",
      "80 V",
      "100 V"
    ],
    "answer": 2,
    "why": "<p>Level B limits applied voltage to half the rating, so the rating must be at least:</p><p>\\[V_r \\ge \\frac{35}{0.50} = 70 \\text{ V}\\]</p><p>where \\(V_r\\) is the rated voltage. The lowest standard rating at or above 70 V is 80 V. Derating widens the margin between applied stress and the part’s limit, which slows degradation and extends life.</p><p><b>C. 80 V</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 12, Materials, Components, Equipment, and Software Selection Techniques — Derating (Level A and Level B).</span></p>",
    "optionRationales": [
      "Meets Level A (\\(35/0.70 = 50\\) V) but not Level B, which avionics requires.",
      "A 63 V part would run at 56% of its rating, above the 50% limit.",
      "Correct. \\(35/0.50 = 70\\) V, so 80 V is the lowest compliant rating.",
      "Complies, but it is not the lowest rating that meets the rule."
    ],
    "keyPoint": "Derating level depends on the application; safety-related and avionics uses call for the stricter level.",
    "trap": "Applying the general-use derating level to a safety-related application.",
    "formula": "\\(V_r \\ge V_{\\text{applied}}/k\\)",
    "assumptions": [
      "Available ratings are 50, 63, 80 and 100 V; voltage is the governing derating parameter."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "derating",
      "component selection",
      "avionics",
      "voltage rating"
    ],
    "sourceSection": "Chapter 12 - Parts and Systems Development",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 12 - Parts and Systems Development",
        "section": "Materials, components, equipment, and software selection techniques — derating",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q136",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "B. Parts and Systems Development",
      "code": "V.B.1",
      "topic": "Selecting COTS software for test equipment"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A reliability lab plans to buy commercial off-the-shelf (COTS) control software for its thermal chambers instead of developing its own. What should the lab still require?",
    "chart": null,
    "options": [
      "Acceptance based on the supplier’s published feature list and user ratings.",
      "Access to the full source code, so that the lab can verify every routine itself.",
      "A fixed-price contract for the supplier to customize the software for each test procedure.",
      "Evidence of supplier capability, and verification that the software meets the lab’s requirements."
    ],
    "answer": 3,
    "why": "<p>COTS software brings lower cost, faster availability and validation by a specialized supplier. But test-equipment software affects the reliability results it produces, so the lab must still check that the supplier is certified or can show evidence of its capability and maturity, and that the package meets the lab’s own requirements (for example, through trial copies and pilot testing).</p><p><b>D. Supplier capability evidence and fit to the lab’s requirements.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 12, Materials, Components, Equipment, and Software Selection Techniques — COTS Products; Software Selection.</span></p>",
    "optionRationales": [
      "A feature list and ratings do not show the supplier’s maturity or that the software meets the lab’s own requirements.",
      "Verifying every routine in-house throws away the benefit of using a validated COTS product.",
      "COTS means using the product as is; per-test customization defeats the purpose.",
      "Correct. Check the supplier’s capability and the software’s fit to requirements before relying on it."
    ],
    "keyPoint": "COTS saves time and cost, but supplier capability and fit to requirements must still be shown.",
    "trap": "Assuming COTS needs no evaluation.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 2,
    "keywords": [
      "COTS",
      "software selection",
      "test equipment"
    ],
    "sourceSection": "Chapter 12 - Parts and Systems Development",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 12 - Parts and Systems Development",
        "section": "Materials, components, equipment, and software selection techniques — COTS",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q137",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "B. Parts and Systems Development",
      "code": "V.B.2",
      "topic": "The RCM sequence of questions"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "Following SAE JA1011, a reliability-centered maintenance (RCM) team has listed an asset’s functions and its functional failures. Which question does the team answer next?",
    "chart": null,
    "options": [
      "What are the failure modes?",
      "What are the failure consequences?",
      "What happens when each failure occurs?",
      "What must be done if no task applies?"
    ],
    "answer": 0,
    "why": "<p>SAE JA1011 sets seven questions in order: functions, functional failures, failure modes, failure effects, failure consequences, proactive (preventive) tasks, and what to do if no suitable task can be found. After functional failures come the failure modes that cause them.</p><p><b>A. What are the failure modes?</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 12, Parts Standardization and System Simplification — Reliability Centered Maintenance (SAE JA1011).</span></p>",
    "optionRationales": [
      "Correct. Failure modes follow functional failures.",
      "Consequences come after modes and effects.",
      "This is the failure effects question, which comes after the failure modes.",
      "This is the last question, used when no proactive task fits."
    ],
    "keyPoint": "RCM: functions, functional failures, modes, effects, consequences, tasks, default actions.",
    "trap": "Jumping to maintenance tasks before analyzing failure modes and consequences.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "reliability-centered maintenance",
      "RCM",
      "SAE JA1011"
    ],
    "sourceSection": "Chapter 12 - Parts and Systems Development",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 12 - Parts and Systems Development",
        "section": "Reliability centered maintenance",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q138",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.1",
      "topic": "Spare parts for scheduled and corrective replacement"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "The table describes a fleet of pumps. Each pump is replaced every 6,000 operating hours as the manufacturer requires, and between replacements its failure rate is constant. Corrective replacements do not change the scheduled replacement times. How many spares should be stocked for the 3-year period to cover the scheduled replacements and, with at least 95% probability, the corrective replacements?",
    "chart": {
      "type": "data-table",
      "title": "Pump fleet",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Pumps in service",
          "10"
        ],
        [
          "Operating hours per pump per year",
          "4,000"
        ],
        [
          "Planning period",
          "3 years"
        ],
        [
          "Failure rate",
          "50 per million hours"
        ],
        [
          "Scheduled replacement interval",
          "6,000 operating hours"
        ],
        [
          "Scheduled replacements per pump in the period",
          "2"
        ]
      ]
    },
    "options": [
      "10",
      "26",
      "29",
      "30"
    ],
    "answer": 3,
    "why": "<p>Fleet operating time is \\(10 \\times 4000 \\times 3 = 120000\\) h. Count scheduled replacements, then find the corrective spares from the cumulative Poisson distribution:</p><p>\\[\\begin{aligned}n_s &= \\frac{120000}{6000} = 20 \\\\ \\mu &= \\frac{50(120000)}{10^{6}} = 6 \\\\ P_{9} &= 0.916 \\\\ P_{10} &= 0.957\\end{aligned}\\]</p><p>where \\(n_s\\) is the number of scheduled replacements, \\(\\mu = \\lambda t\\) the expected number of failures and \\(P_r = P(X \\le r)\\) the cumulative Poisson probability of \\(r\\) or fewer failures. Ten corrective spares give at least 95% protection, so stock \\(20 + 10 = 30\\).</p><p><b>D. 30</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Maintenance Strategies — Spare Parts Analysis (cumulative Poisson).</span></p>",
    "optionRationales": [
      "Counts only the corrective spares and leaves out the 20 scheduled replacements.",
      "Stocks only the expected 6 failures; that covers corrective demand only about 61% of the time.",
      "Nine corrective spares give only \\(P(X \\le 9) = 0.916\\), below 95%.",
      "Correct. 20 scheduled plus 10 corrective, since \\(P(X \\le 10) = 0.957\\)."
    ],
    "keyPoint": "Spares = scheduled replacements plus the Poisson quantile of corrective demand at the required protection level.",
    "trap": "Stocking the mean number of failures instead of a protection-level quantile.",
    "formula": "\\(P(X \\le r) = \\sum_{k=0}^{r} \\dfrac{(\\lambda t)^{k} e^{-\\lambda t}}{k!}\\)",
    "assumptions": [
      "Constant failure rate between replacements; failed pumps are replaced, not repaired."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "spare parts",
      "Poisson",
      "protection level",
      "maintenance planning"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Maintenance strategies — spare parts analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q139",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.1",
      "topic": "Repair or replace"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation, decision",
    "quantitative": true,
    "stem": "A failed motor can be repaired or replaced. The plant needs it for 4 more years, each failure costs 1,800 dollars, and there is no salvage value; ignore the time value of money. Using the table, which choice costs less over the 4 years?",
    "chart": {
      "type": "data-table",
      "title": "Repair or replace a motor",
      "columns": [
        "Item",
        "Repair",
        "Replace"
      ],
      "rows": [
        [
          "Up-front cost (dollars)",
          "2,400",
          "7,000"
        ],
        [
          "Failures per year",
          "0.5",
          "0.1"
        ],
        [
          "Energy cost (dollars per year)",
          "3,000",
          "2,400"
        ]
      ]
    },
    "options": [
      "Repair, because its up-front cost is 4,600 dollars lower",
      "Replace, at about 17,300 dollars against about 18,000 for repair",
      "Repair, at about 6,000 dollars against about 7,700 for replacement",
      "Replace, at about 9,600 dollars against about 12,000 for repair"
    ],
    "answer": 1,
    "why": "<p>Add the up-front cost, the expected failure cost and the energy cost over 4 years:</p><p>\\[\\begin{aligned}C_R &= 2400 + 4(0.5)(1800) \\\\ &\\quad + 4(3000) = 18000 \\\\ C_N &= 7000 + 4(0.1)(1800) \\\\ &\\quad + 4(2400) = 17320\\end{aligned}\\]</p><p>where \\(C_R\\) is the 4-year cost of repairing and \\(C_N\\) of replacing, in dollars. The cheaper repair loses once its higher failure rate and energy use are counted.</p><p><b>B. Replace, about 17,300 against 18,000.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Maintenance Strategies (repair-or-replace decisions using failure and cost data).</span></p>",
    "optionRationales": [
      "Compares up-front cost only and ignores 4 years of failures and energy.",
      "Correct. Replacement costs 17,320 dollars against 18,000 for repair.",
      "Leaves out energy cost, which reverses the decision.",
      "Compares energy cost only; the decision is right, but the costs are not the full 4-year totals."
    ],
    "keyPoint": "Repair-or-replace decisions compare total cost over the remaining need, including failures and operating costs.",
    "trap": "Deciding on up-front cost alone.",
    "formula": "\\(C = C_0 + T\\lambda c_f + T c_e\\)",
    "assumptions": [
      "Constant failure rates; no discounting; failure cost covers repair and downtime."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "repair or replace",
      "lifecycle cost",
      "maintenance strategy"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Maintenance strategies",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b14-q140",
    "set": 1,
    "batch": 14,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.2",
      "topic": "Optimum proof-test interval for a hidden failure"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Calculation, optimization",
    "quantitative": true,
    "stem": "A standby relief valve has a hidden (undetected) failure rate of \\(10^{-5}\\) per hour. Between proof tests, a hidden failure leaves the valve unavailable for, on average, half the test interval. Each proof test also takes the valve out of service for 4 hours. Which test interval minimizes the average unavailability, and what is the minimum?",
    "chart": null,
    "options": [
      "About 450 h, giving about 0.0112",
      "About 630 h, giving about 0.0095",
      "About 890 h, giving about 0.0089",
      "About 1,790 h, giving about 0.0112"
    ],
    "answer": 2,
    "why": "<p>Add the hidden-failure term and the test-downtime term, then set the derivative to zero:</p><p>\\[\\begin{aligned}U(\\tau) &= \\frac{\\lambda\\tau}{2} + \\frac{4}{\\tau} \\\\ \\tau^{*} &= \\sqrt{\\frac{8}{\\lambda}} = \\sqrt{800000} \\\\ &= 894 \\text{ h} \\\\ U(\\tau^{*}) &= 0.00447 + 0.00447 \\\\ &= 0.0089\\end{aligned}\\]</p><p>where \\(U\\) is the average unavailability, \\(\\tau\\) the test interval in hours and \\(\\lambda\\) the hidden failure rate. Testing more often cuts hidden downtime but adds test downtime; at the optimum the two terms are equal.</p><p><b>C. About 890 h, 0.0089.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Preventive Maintenance (PM) Analysis (optimum PM intervals; tradeoff between maintenance and failure).</span></p>",
    "optionRationales": [
      "Uses \\(\\sqrt{2/\\lambda}\\); testing this often makes test downtime dominate.",
      "Uses \\(\\sqrt{4/\\lambda}\\), which leaves out the factor of 2 from the half-interval term.",
      "Correct. \\(\\sqrt{8/\\lambda} = 894\\) h, where the two terms are equal.",
      "Twice the optimum interval; hidden-failure downtime now dominates."
    ],
    "keyPoint": "The optimum test interval balances downtime from undetected failures against downtime from the tests themselves.",
    "trap": "Choosing the interval from the hidden-failure term alone and ignoring test downtime.",
    "formula": "\\(\\tau^{*} = \\sqrt{2T_t/\\lambda}\\) for \\(U = \\lambda\\tau/2 + T_t/\\tau\\)",
    "assumptions": [
      "\\(\\lambda\\tau\\) is small; tests are perfect and restore the valve to as-good-as-new."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "proof test interval",
      "hidden failure",
      "unavailability",
      "PM optimization"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Preventive maintenance (PM) analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q141",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.3",
      "topic": "Allocating an MTTR requirement to subsystems"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, multi-step calculation",
    "quantitative": true,
    "stem": "A series system must have a mean time to repair (MTTR) of no more than 60 minutes. Its three subsystems are in the table. If the requirement is allocated in proportion to each subsystem’s current MTTR, what MTTR should subsystem 2 be designed to?",
    "chart": {
      "type": "data-table",
      "title": "Subsystem failure rates and repair times",
      "columns": [
        "Subsystem",
        "Failures per million h",
        "MTTR (min)"
      ],
      "rows": [
        [
          "1",
          "20",
          "120"
        ],
        [
          "2",
          "50",
          "60"
        ],
        [
          "3",
          "30",
          "90"
        ]
      ]
    },
    "options": [
      "40 min",
      "44 min",
      "60 min",
      "81 min"
    ],
    "answer": 1,
    "why": "<p>System MTTR is the failure-rate-weighted average of the subsystem MTTRs; then each subsystem is scaled by the same ratio:</p><p>\\[\\begin{aligned}t &= \\frac{2400 + 3000 + 2700}{100} \\\\ &= 81 \\text{ min} \\\\ t_2^{*} &= \\frac{t_2}{t} \\times t^{*} \\\\ &= \\frac{60}{81}(60) = 44.4 \\text{ min}\\end{aligned}\\]</p><p>where the numerator sums each subsystem’s failure rate times its MTTR, \\(t\\) is the current system MTTR, \\(t^{*}\\) the requirement and \\(t_2\\) subsystem 2’s current MTTR. Weighting by failure rate matters because subsystem 2 fails most often, so its repairs dominate the system MTTR.</p><p><b>B. 44 min</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Maintenance Strategies — MTTR Allocation.</span></p>",
    "optionRationales": [
      "Uses the simple average of the three MTTRs (90 min) instead of the failure-rate-weighted 81 min.",
      "Correct. \\(60 \\times 60/81 = 44.4\\) min.",
      "This is the system requirement, which subsystem 2 already meets, but the system as a whole does not.",
      "This is the current system MTTR, which is what must be reduced."
    ],
    "keyPoint": "System MTTR is weighted by failure rate; allocation scales every subsystem MTTR by the requirement over the current system value.",
    "trap": "Averaging subsystem MTTRs without weighting them by failure rate.",
    "formula": "\\(t = \\dfrac{\\sum \\lambda_i t_i}{\\sum \\lambda_i}\\); \\(t_i^{*} = \\dfrac{t_i}{t} t^{*}\\)",
    "assumptions": [
      "Series system; constant failure rates."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "MTTR allocation",
      "maintainability",
      "corrective maintenance"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Maintenance strategies — MTTR allocation",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q142",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.3",
      "topic": "Crew skill and the cost of a corrective repair"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "A critical compressor has failed, and every hour it is down costs 300 dollars in lost production. Two crews could do the repair, as in the table. How much less does the repair cost in total (labor plus downtime) with the crew that includes the skilled technician?",
    "chart": {
      "type": "data-table",
      "title": "Repair crew options",
      "columns": [
        "Item",
        "Skilled + helper",
        "Two general"
      ],
      "rows": [
        [
          "Crew labor cost (dollars per h)",
          "120",
          "90"
        ],
        [
          "Fault isolation time (h)",
          "1.5",
          "3"
        ],
        [
          "Repair time (h)",
          "2.5",
          "4"
        ]
      ]
    },
    "options": [
      "150 dollars",
      "900 dollars",
      "1,050 dollars",
      "2,730 dollars"
    ],
    "answer": 2,
    "why": "<p>Each crew works for its isolation time plus its repair time, and the compressor is down for that whole time:</p><p>\\[\\begin{aligned}C_S &= 4(120 + 300) \\\\ &= 1680 \\\\ C_G &= 7(90 + 300) \\\\ &= 2730 \\\\ C_G - C_S &= 1050\\end{aligned}\\]</p><p>where \\(C_S\\) and \\(C_G\\) are the total repair costs in dollars for the skilled and general crews. The skilled crew costs more per hour but isolates the fault twice as fast, and downtime dominates the total.</p><p><b>C. 1,050 dollars</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Corrective Maintenance Analysis — Crew Hours and Skill Level.</span></p>",
    "optionRationales": [
      "Compares labor only (480 against 630) and leaves out the downtime cost.",
      "Compares downtime only (3 fewer hours at 300 dollars).",
      "Correct. \\(2730 - 1680 = 1050\\) dollars.",
      "This is the general crew’s total cost, not the difference."
    ],
    "keyPoint": "Choose repair crews on total cost, including downtime; skill shortens fault isolation, often the longest step.",
    "trap": "Comparing labor rates alone.",
    "formula": "\\(C = (t_i + t_r)(c_l + c_d)\\)",
    "assumptions": [
      "Downtime equals isolation plus repair time; no other delays."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "corrective maintenance",
      "crew skill level",
      "downtime cost"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Corrective maintenance analysis — crew hours and skill level",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q143",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.3",
      "topic": "What built-in test shortens"
    },
    "difficulty": "Easy",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "A redesign adds built-in test (BIT) that displays which module has failed. Which part of corrective maintenance time does it mainly reduce?",
    "chart": null,
    "options": [
      "Fault localization and isolation",
      "Interchange of the failed module",
      "Alignment and final checkout",
      "Logistics and administrative delay"
    ],
    "answer": 0,
    "why": "<p>Active corrective maintenance runs through localization, isolation, disassembly, interchange, reassembly, alignment and checkout. BIT tells the technician where the fault is, so it shortens the first two steps, which are often the longest and most variable. It does not speed up the physical work or waiting for parts.</p><p><b>A. Fault localization and isolation.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Corrective Maintenance Analysis — Fault Isolation Time (built-in testing).</span></p>",
    "optionRationales": [
      "Correct. BIT points to the failed module, cutting the time to find and confirm the fault.",
      "Swapping the module takes the same time once it is found.",
      "Alignment and checkout follow the repair and are unchanged by BIT.",
      "Waiting for parts or approvals is inactive time that BIT does not affect."
    ],
    "keyPoint": "BIT shortens fault isolation; designs for maintainability target each step of the repair sequence.",
    "trap": "Expecting a diagnostic feature to shorten the physical repair.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "built-in test",
      "fault isolation",
      "corrective maintenance"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Corrective maintenance analysis — fault isolation time",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q144",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.1",
      "topic": "Keeping an equipment warranty valid"
    },
    "difficulty": "Medium",
    "cognitive": "Evaluate",
    "questionType": "Scenario",
    "quantitative": false,
    "stem": "A plant’s new extruder is covered by the standard manufacturer warranty. Which action is most likely to void the warranty?",
    "chart": null,
    "options": [
      "Following the prescribed preventive maintenance schedule and logging each task",
      "Reporting a drive fault to the supplier on the day it occurs",
      "Notifying the supplier and scheduling the warranty repair with them for the next planned shutdown",
      "Having in-house technicians replace a failed drive board without the supplier"
    ],
    "answer": 3,
    "why": "<p>A standard warranty usually excludes unauthorized repairs, along with wear and tear, misuse and neglect. Following the maintenance schedule, documenting work, reporting faults promptly and scheduling warranty work during planned downtime are all recommended practices. An in-house repair the warranty does not allow can void it.</p><p><b>D. In-house repair without the supplier.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Equipment Warranties — Warranty Types; Best Practices for Warranty Use.</span></p>",
    "optionRationales": [
      "Following the prescribed schedule and keeping records protects the warranty.",
      "Prompt reporting is a warranty best practice and keeps the claim eligible.",
      "Scheduling warranty work in planned downtime is recommended to limit disruption.",
      "Correct. Unauthorized repairs are a common warranty exclusion."
    ],
    "keyPoint": "Know a warranty’s terms and exclusions; unauthorized repairs and missed maintenance can void it.",
    "trap": "Assuming any quick fix is acceptable while equipment is under warranty.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "equipment warranty",
      "maintenance strategy",
      "unauthorized repair"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Equipment warranties",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q145",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "C. Maintainability",
      "code": "V.C.2",
      "topic": "When age-based replacement is effective"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, decision",
    "quantitative": false,
    "stem": "Two components of a packaging machine have the life distributions in the table. Which preventive maintenance policy fits?",
    "chart": {
      "type": "data-table",
      "title": "Component life distributions",
      "columns": [
        "Component",
        "Life distribution"
      ],
      "rows": [
        [
          "Controller board",
          "Weibull, \\(\\beta = 1.0\\), \\(\\eta = 60000\\) h"
        ],
        [
          "Gearbox bearing",
          "Weibull, \\(\\beta = 3.2\\), \\(\\eta = 20000\\) h"
        ]
      ]
    },
    "options": [
      "Replace the bearing at a fixed age well before 20,000 h, and run the controller board to failure, because only the bearing’s failure rate increases.",
      "Replace both at fixed ages, because scheduled replacement lowers failures whatever a component’s failure pattern.",
      "Replace the controller board at a fixed age and run the bearing to failure, because electronics fail randomly.",
      "Run both to failure, because scheduled replacement can introduce maintenance-induced failures."
    ],
    "answer": 0,
    "why": "<p>Age-based replacement helps only when the hazard rises with age. The bearing, with \\(\\beta = 3.2\\), wears out, so replacing it before wear-out sharply cuts failures. The controller board, with \\(\\beta = 1.0\\), has a constant failure rate: a new board is no less likely to fail than an old one, so age replacement adds cost and the risk of maintenance-induced failures without reducing failures. Condition monitoring or running it to failure fits better.</p><p><b>A. Replace the bearing by age; run the board to failure.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 13, Preventive Maintenance (PM) Analysis (PM pays off for increasing failure rates; PM does not reduce a constant failure rate).</span></p>",
    "optionRationales": [
      "Correct. Replace the wearing-out bearing; age replacement cannot help a constant-rate part.",
      "Replacing a constant-rate part early does not reduce its failures and may add maintenance-induced ones.",
      "This reverses the logic: the bearing wears out, while the board fails at a constant rate.",
      "Maintenance-induced failures are a real risk, but the bearing’s wear-out makes its replacement worthwhile."
    ],
    "keyPoint": "Schedule replacement for parts with increasing hazard (\\(\\beta \\gt 1\\)); it does not help when the failure rate is constant.",
    "trap": "Applying age replacement to a part with a constant failure rate.",
    "formula": null,
    "assumptions": [
      "Replacement restores a part to as-good-as-new."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "preventive maintenance",
      "age replacement",
      "Weibull shape",
      "constant failure rate"
    ],
    "sourceSection": "Chapter 13 - Maintainability",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 13 - Maintainability",
        "section": "Preventive maintenance (PM) analysis",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q146",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.3",
      "topic": "One-way ANOVA across suppliers"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, hypothesis test",
    "quantitative": true,
    "stem": "Bond strength (N) of an adhesive from three suppliers is tested with five specimens each, summarized in the table. What is the one-way ANOVA F statistic, and is there a significant difference at the 5% level? (\\(F_{0.05,2,12} = 3.89\\).)",
    "chart": {
      "type": "data-table",
      "title": "Bond strength by supplier",
      "columns": [
        "Supplier",
        "Specimens",
        "Mean (N)",
        "Sample variance"
      ],
      "rows": [
        [
          "A",
          "5",
          "42",
          "7"
        ],
        [
          "B",
          "5",
          "46",
          "8"
        ],
        [
          "C",
          "5",
          "50",
          "9"
        ]
      ]
    },
    "options": [
      "\\(F = 1.67\\); not significant",
      "\\(F = 3.33\\); not significant",
      "\\(F = 10.0\\); significant",
      "\\(F = 20.0\\); significant"
    ],
    "answer": 2,
    "why": "<p>Compare the variation between supplier means with the variation within suppliers:</p><p>\\[\\begin{aligned}\\text{SS}_{tr} &= 5[(-4)^{2} + 0^{2} + 4^{2}] \\\\ &= 160 \\\\ \\text{MS}_{tr} &= 160/2 = 80 \\\\ \\text{MS}_{E} &= \\frac{7 + 8 + 9}{3} = 8 \\\\ F &= 80/8 = 10.0\\end{aligned}\\]</p><p>where the grand mean is 46, \\(\\text{SS}_{tr}\\) and \\(\\text{MS}_{tr}\\) are the treatment sum of squares and mean square (2 degrees of freedom), and \\(\\text{MS}_{E}\\) is the error mean square: the pooled within-supplier variance, with 12 degrees of freedom. Since \\(10.0 \\gt 3.89\\), at least one supplier’s mean differs.</p><p><b>C. \\(F = 10.0\\); significant.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design of Experiments — One-Way Analysis of Variance.</span></p>",
    "optionRationales": [
      "Divides the treatment sum of squares by the error sum of squares (160/96), with no degrees of freedom.",
      "Uses the sum of the three variances (24) as the error mean square instead of their average.",
      "Correct. \\(80/8 = 10.0\\), which exceeds 3.89.",
      "Divides the treatment sum of squares (160) by the error mean square without dividing by its 2 degrees of freedom."
    ],
    "keyPoint": "F is the treatment mean square over the error mean square; with equal sample sizes, the error mean square is the average within-group variance.",
    "trap": "Using sums of squares instead of mean squares.",
    "formula": "\\(F = \\dfrac{\\text{SS}_{tr}/(k - 1)}{\\text{SS}_E/(N - k)}\\)",
    "assumptions": [
      "Independent, normally distributed responses with equal variances."
    ],
    "estimatedMinutes": 6,
    "keywords": [
      "ANOVA",
      "F test",
      "design of experiments",
      "supplier comparison"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design of experiments — one-way analysis of variance",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q147",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.2",
      "topic": "Lognormal stress–strength interference"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, calculation",
    "quantitative": true,
    "stem": "The stress on a weld and its strength are independent and lognormally distributed, as in the table. What is the probability of failure?",
    "chart": {
      "type": "data-table",
      "title": "Weld stress and strength (lognormal)",
      "columns": [
        "Quantity",
        "Median (MPa)",
        "Standard deviation of ln"
      ],
      "rows": [
        [
          "Stress",
          "300",
          "0.15"
        ],
        [
          "Strength",
          "400",
          "0.10"
        ]
      ]
    },
    "options": [
      "0.028",
      "0.055",
      "0.125",
      "0.945"
    ],
    "answer": 1,
    "why": "<p>For lognormal stress and strength, the log of their ratio is normal:</p><p>\\[\\begin{aligned}z &= \\frac{\\ln(400/300)}{\\sqrt{0.15^{2} + 0.10^{2}}} \\\\ &= \\frac{0.2877}{0.1803} = 1.60 \\\\ P_f &= \\Phi(-1.60) = 0.055\\end{aligned}\\]</p><p>where \\(z\\) is the number of log-scale standard deviations between the medians and \\(P_f\\) the probability that stress exceeds strength.</p><p><b>B. 0.055</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Stress–Strength Analysis for Lognormal Distributions.</span></p>",
    "optionRationales": [
      "Uses only the stress spread (\\(0.2877/0.15 = 1.92\\)).",
      "Correct. \\(z = 1.60\\), so \\(P_f = 0.055\\).",
      "Adds the standard deviations (0.25) instead of combining their squares.",
      "This is the reliability, not the probability of failure."
    ],
    "keyPoint": "Lognormal interference: z is the log of the median ratio over the root-sum-square of the log standard deviations.",
    "trap": "Adding standard deviations instead of variances.",
    "formula": "\\(P_f = 1 - \\Phi\\left(\\dfrac{\\ln(m_Y/m_X)}{\\sqrt{s_X^{2} + s_Y^{2}}}\\right)\\)",
    "assumptions": [
      "Stress and strength are independent and lognormal."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "stress-strength interference",
      "lognormal",
      "probability of failure"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Stress–strength analysis for lognormal distributions",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q148",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.1",
      "topic": "Types of reliability evaluation during production"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "After production approval, a sample of units is pulled each month and tested to confirm that output still meets the reliability requirement. Which type of evaluation is this?",
    "chart": null,
    "options": [
      "Environmental stress screening",
      "Reliability development (growth) testing",
      "Production reliability acceptance testing",
      "Reliability qualification (demonstration) testing"
    ],
    "answer": 2,
    "why": "<p>Four types of evaluation are used across the lifecycle: environmental stress screening exposes units to severe stresses to find weak components; reliability growth tests show the effect of corrective actions during development; reliability qualification (demonstration) tests on a production sample serve as the basis for production approval; and production reliability acceptance tests run periodically during production to confirm that output still meets the requirement.</p><p><b>C. Production reliability acceptance testing.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design Evaluation Techniques — Post-Production (types of evaluation).</span></p>",
    "optionRationales": [
      "Screening stresses units to precipitate weak components; it does not verify a reliability requirement.",
      "Growth testing tracks the effect of design fixes during development.",
      "Correct. Periodic testing of production output against the requirement is acceptance testing.",
      "Qualification testing is the basis for production approval, which has already happened here."
    ],
    "keyPoint": "Qualification tests approve production; acceptance tests keep confirming it periodically.",
    "trap": "Confusing one-time qualification with periodic acceptance testing.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "reliability acceptance test",
      "qualification test",
      "design evaluation"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design evaluation techniques — post-production",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q149",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "B. Parts and Systems Development",
      "code": "V.B.2",
      "topic": "Benefits of parts standardization"
    },
    "difficulty": "Medium",
    "cognitive": "Understand",
    "questionType": "Concept",
    "quantitative": false,
    "stem": "A design team standardizes on one fastener size and one connector family across a product line. What is the main reliability and maintainability benefit?",
    "chart": null,
    "options": [
      "Each fastener becomes more reliable, because it is bought in larger quantities.",
      "New parts need less qualification, because standard parts already have field history.",
      "The design gains redundancy, because identical parts can back each other up in service.",
      "Fewer part types reduce assembly and service errors, because technicians handle familiar parts and spares are easier to stock."
    ],
    "answer": 3,
    "why": "<p>Standardization and simplification reduce the variety of parts and materials. That makes products easier and cheaper to assemble, reduces the chance of using the wrong part, and improves maintainability through easier access to standard spare and repair parts and fewer special tools.</p><p><b>D. Simpler assembly and service, easier spares.</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 12, Parts Standardization and System Simplification.</span></p>",
    "optionRationales": [
      "Buying in volume can lower cost, but it does not make each part more reliable.",
      "Field history in one use does not qualify a part for a new application and its stresses.",
      "Using the same part in many places does not create redundancy.",
      "Correct. Fewer part types mean simpler assembly and service and easier spares."
    ],
    "keyPoint": "Standardization and simplification cut variety, which simplifies assembly, maintenance and spares.",
    "trap": "Assuming a standard part is qualified for every application.",
    "formula": null,
    "assumptions": [],
    "estimatedMinutes": 1,
    "keywords": [
      "standardization",
      "simplification",
      "maintainability",
      "spares"
    ],
    "sourceSection": "Chapter 12 - Parts and Systems Development",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 12 - Parts and Systems Development",
        "section": "Parts standardization and system simplification",
        "example": null
      }
    ]
  },
  {
    "qid": "cre:set-1:b15-q150",
    "set": 1,
    "batch": 15,
    "sub": "cre-lifecycle",
    "sourceDocument": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
    "bok": {
      "domain": "V. Lifecycle Reliability",
      "subdomain": "A. Reliability Design Techniques",
      "code": "V.A.7",
      "topic": "Cascading a system reliability target"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Calculation",
    "quantitative": true,
    "stem": "In a design-for-reliability program, a system target of 0.90 for a 100-hour mission is cascaded to three series subsystems in proportion to their predicted failure rates: 200, 300 and 500 per million hours. What reliability target should subsystem 3 receive?",
    "chart": null,
    "options": [
      "0.9000",
      "0.9487",
      "0.9512",
      "0.9655"
    ],
    "answer": 1,
    "why": "<p>Convert the system target to an allowed failure rate, give subsystem 3 its share (500 of 1,000), and convert back:</p><p>\\[\\begin{aligned}\\lambda^{*} &= \\frac{-\\ln 0.90}{100} = 0.0010536 \\\\ \\lambda_3^{*} &= 0.5(0.0010536) \\\\ &= 0.0005268 \\\\ R_3^{*} &= e^{-0.0005268(100)} \\\\ &= 0.9487\\end{aligned}\\]</p><p>where \\(\\lambda^{*}\\) is the allowed system failure rate per hour and \\(\\lambda_3^{*}\\) and \\(R_3^{*}\\) are subsystem 3’s allocated failure rate and reliability target. Subsystems with higher predicted failure rates get the looser targets; equal apportionment would give each \\(0.90^{1/3} = 0.9655\\).</p><p><b>B. 0.9487</b> <span class=\"tb-source-ref\">Source: CRE Handbook (4th ed.), Ch. 11, Design for Reliability — Step 2: Cascade Reliability Targets.</span></p>",
    "optionRationales": [
      "This is the system target; each series subsystem must be more reliable than the system.",
      "Correct. \\(e^{-0.05268} = 0.9487\\).",
      "This is subsystem 3’s predicted reliability, \\(e^{-0.05}\\), not its allocated target.",
      "Equal apportionment ignores the predicted failure rates."
    ],
    "keyPoint": "Cascade targets by weighting with predicted failure rates; the subsystem targets multiply back to the system target.",
    "trap": "Splitting a series target equally, or confusing the prediction with the allocation.",
    "formula": "\\(R_i^{*} = (R_s^{*})^{w_i}\\), with \\(w_i = \\lambda_i / \\sum \\lambda_j\\)",
    "assumptions": [
      "Series subsystems with constant failure rates."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "design for reliability",
      "reliability allocation",
      "cascading targets"
    ],
    "sourceSection": "Chapter 11 - Reliability Design Techniques",
    "sources": [
      {
        "id": "S1",
        "document": "The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)",
        "chapter": "Chapter 11 - Reliability Design Techniques",
        "section": "Design for reliability — cascade reliability targets",
        "example": null
      }
    ]
  }
];
})(window);
