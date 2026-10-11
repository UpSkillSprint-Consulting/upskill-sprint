(function () {
  'use strict';

  var SOURCE = {
  "sections": [
    {
      "key": "I. Reliability Fundamentals",
      "id": "cre-fundamentals",
      "name": "I. Reliability Fundamentals"
    },
    {
      "key": "II. Risk Management",
      "id": "cre-risk",
      "name": "II. Risk Management"
    },
    {
      "key": "III. Probability and Statistics for Reliability",
      "id": "cre-statistics",
      "name": "III. Probability and Statistics for Reliability"
    },
    {
      "key": "IV. Reliability Planning, Testing, and Modeling",
      "id": "cre-testing",
      "name": "IV. Reliability Planning, Testing, and Modeling"
    },
    {
      "key": "V. Lifecycle Reliability",
      "id": "cre-lifecycle",
      "name": "V. Lifecycle Reliability"
    }
  ],
  "formulas": [
    {
      "id": "CRE-2.1",
      "section": "I. Reliability Fundamentals",
      "name": "Reliability at time t",
      "formula": "R(t)=Pr(X>t)=1-Pr(X≤ t)",
      "when": "Reliability at time t is the probability that life exceeds t.",
      "caution": "Do not report the probability of failure, Pr(X at or below t), as the reliability.",
      "aliases": [
        "Reliability at time t",
        "CRE-2.1"
      ]
    },
    {
      "id": "CRE-2.2",
      "section": "I. Reliability Fundamentals",
      "name": "Empirical reliability at time t",
      "formula": "R(t)=(units functioning at the end of the period)/(units functioning at the start of the test)",
      "when": "Use the count still functioning divided by the count that started the test.",
      "caution": "Do not put the failed units in the numerator.",
      "aliases": [
        "Empirical reliability at time t",
        "CRE-2.2"
      ]
    },
    {
      "id": "CRE-2.3",
      "section": "I. Reliability Fundamentals",
      "name": "Mean time to failure",
      "formula": "MTTF=θ=(Σ tᵢ)/(n)",
      "when": "For complete failure times, the mean is the total of the times divided by the number of items.",
      "caution": "Do not divide by the number of survivors.",
      "aliases": [
        "Mean time to failure",
        "CRE-2.3",
        "mttf"
      ]
    },
    {
      "id": "CRE-2.4",
      "section": "I. Reliability Fundamentals",
      "name": "Mean time between failures",
      "formula": "MTBF=(nm)/(r)",
      "when": "n items each exposed for m hours, with r failures, give total time nm divided by r.",
      "caution": "Do not divide by the number of items when the question asks for time per failure.",
      "aliases": [
        "Mean time between failures",
        "CRE-2.4",
        "mtbf"
      ]
    },
    {
      "id": "CRE-2.5",
      "section": "I. Reliability Fundamentals",
      "name": "Mean cycles between failures",
      "formula": "MCBF=(nc)/(r)",
      "when": "The same total-exposure idea, counted in cycles instead of hours.",
      "caution": "Do not leave the answer in hours when the exposure is in cycles.",
      "aliases": [
        "Mean cycles between failures",
        "CRE-2.5",
        "mcbf"
      ]
    },
    {
      "id": "CRE-2.6",
      "section": "I. Reliability Fundamentals",
      "name": "Mean time between critical failures",
      "formula": "MTBCF=(nc)/(C)",
      "when": "The denominator is the count of critical failures, not every failure.",
      "caution": "Using all failures in the denominator gives MTBF, not the critical-failure measure.",
      "aliases": [
        "Mean time between critical failures",
        "CRE-2.6",
        "mtbcf",
        "critical failures"
      ]
    },
    {
      "id": "CRE-2.7",
      "section": "I. Reliability Fundamentals",
      "name": "Constant failure rate",
      "formula": "λ=(1)/(MTBF)=(1)/(MTTF)",
      "when": "Under a constant rate, the rate is the reciprocal of the mean life.",
      "caution": "Do not multiply the mean by the rate and call that λ.",
      "aliases": [
        "Constant failure rate",
        "CRE-2.7"
      ]
    },
    {
      "id": "CRE-2.8",
      "section": "I. Reliability Fundamentals",
      "name": "Mean time to repair",
      "formula": "MTTR=(total repair time)/(number of repair operations)",
      "when": "Average the observed repair times. This is a repair measure, not a life measure.",
      "caution": "Do not put operating hours in the numerator.",
      "aliases": [
        "Mean time to repair",
        "CRE-2.8",
        "mttr"
      ]
    },
    {
      "id": "CRE-2.9",
      "section": "I. Reliability Fundamentals",
      "name": "MTBF at a constant failure rate",
      "formula": "MTBF=(1)/(λ)",
      "when": "Invert a constant failure rate to get the mean time between failures.",
      "caution": "The rate itself is not a time.",
      "aliases": [
        "MTBF at a constant failure rate",
        "CRE-2.9",
        "mtbf"
      ]
    },
    {
      "id": "CRE-2.10",
      "section": "I. Reliability Fundamentals",
      "name": "MTTF at a constant failure rate",
      "formula": "MTTF=(1)/(λ)",
      "when": "The same reciprocal applies to a nonrepairable item's mean time to failure.",
      "caution": "Do not use this reciprocal when the hazard changes with age.",
      "aliases": [
        "MTTF at a constant failure rate",
        "CRE-2.10",
        "mttf"
      ]
    },
    {
      "id": "CRE-2.11",
      "section": "I. Reliability Fundamentals",
      "name": "Mean downtime",
      "formula": "MDT=(total downtime)/(number of downtime occurrences)",
      "when": "Downtime includes more than active repair when the record says so.",
      "caution": "MTTR is the repair portion. Do not substitute it when the question asks for downtime.",
      "aliases": [
        "Mean downtime",
        "CRE-2.11",
        "mdt"
      ]
    },
    {
      "id": "CRE-2.12",
      "section": "I. Reliability Fundamentals",
      "name": "Availability over an interval",
      "formula": "A=(time the unit is capable of use)/(length of the interval)",
      "when": "Compare capable time with the full interval named in the question.",
      "caution": "Do not omit scheduled or logistics time if the interval includes it.",
      "aliases": [
        "Availability over an interval",
        "CRE-2.12"
      ]
    },
    {
      "id": "CRE-2.13",
      "section": "I. Reliability Fundamentals",
      "name": "Availability, general formula",
      "formula": "A=(average uptime)/(average uptime+average downtime)",
      "when": "Availability is uptime divided by uptime plus downtime.",
      "caution": "Leaving downtime out of the denominator produces 1.",
      "aliases": [
        "Availability, general formula",
        "CRE-2.13",
        "Availability, general"
      ]
    },
    {
      "id": "CRE-2.14",
      "section": "I. Reliability Fundamentals",
      "name": "Reliability at time t, constant failure rate",
      "formula": "R(t)=e^(-λ t)",
      "when": "A constant failure rate gives an exponential reliability.",
      "caution": "The exponent is negative. A positive exponent is greater than 1 and cannot be a reliability.",
      "aliases": [
        "Reliability at time t, constant failure rate",
        "CRE-2.14",
        "exponential reliability",
        "constant failure rate"
      ]
    },
    {
      "id": "CRE-2.15",
      "section": "I. Reliability Fundamentals",
      "name": "Availability from MTBF and MTTR",
      "formula": "A=(MTBF)/(MTBF+MTTR)",
      "when": "Use this when the only times given are the mean life and the mean repair.",
      "caution": "Do not put MTTR in the numerator.",
      "aliases": [
        "Availability from MTBF and MTTR",
        "CRE-2.15",
        "availability"
      ]
    },
    {
      "id": "CRE-2.16",
      "section": "I. Reliability Fundamentals",
      "name": "Mean time between maintenance actions",
      "formula": "MTBMA=(1)/(λ+μ)",
      "when": "λ is the failure rate and μ is the preventive maintenance rate. Both remove the item from service.",
      "caution": "Using only λ ignores the maintenance actions.",
      "aliases": [
        "Mean time between maintenance actions",
        "CRE-2.16",
        "mtbma",
        "maintenance actions"
      ]
    },
    {
      "id": "CRE-2.17",
      "section": "I. Reliability Fundamentals",
      "name": "Availability from maintenance actions",
      "formula": "A=(MTBMA)/(MTBMA+MAMT)",
      "when": "MAMT is the mean active maintenance time that goes with MTBMA.",
      "caution": "Do not replace MAMT with MTTR unless the problem says they are the same.",
      "aliases": [
        "Availability from maintenance actions",
        "CRE-2.17"
      ]
    },
    {
      "id": "CRE-6.1",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Sample mean",
      "formula": "X̄=(1)/(n)Σ_(i=1)^n Xᵢ",
      "when": "Add the observations and divide by how many there are.",
      "caution": "The divisor is n, not n minus 1. That correction belongs to the sample variance.",
      "aliases": [
        "Sample mean",
        "CRE-6.1"
      ]
    },
    {
      "id": "CRE-6.2",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Pearson sample correlation",
      "formula": "r=(Cov(X,Y))/(sₓ s_y)=(SS_xy)/(√(SS_xx SS_yy))",
      "when": "Scale the sample covariance by the two sample standard deviations. The same ratio is the corrected sum of products over the square root of the two corrected sums of squares.",
      "caution": "A correlation is not a slope. The slope still has the units of Y per unit of X.",
      "aliases": [
        "Pearson sample correlation",
        "CRE-6.2",
        "correlation",
        "pearson"
      ]
    },
    {
      "id": "CRE-6.3",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Simple linear regression model",
      "formula": "y=β₀+β₁ x+ε",
      "when": "The model is a straight line plus a random error. The β values are unknown constants.",
      "caution": "Do not replace the error with the residual. The residual is what remains after fitting.",
      "aliases": [
        "Simple linear regression model",
        "CRE-6.3",
        "Simple linear regression",
        "regression"
      ]
    },
    {
      "id": "CRE-6.4",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Fitted regression equation",
      "formula": "ŷ=b₀+b₁ x",
      "when": "The fitted equation uses the estimated intercept and slope.",
      "caution": "A hat on y means a prediction, not an observed point.",
      "aliases": [
        "Fitted regression equation",
        "CRE-6.4"
      ]
    },
    {
      "id": "CRE-6.5",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Estimated intercept and slope",
      "formula": "b₀ =ȳ-b₁x̄\nb₁ =(SS_xy)/(SS_xx)",
      "when": "Estimate the slope from the corrected sums of squares, then the intercept from the means.",
      "caution": "Swapping the sums of squares inverts the slope.",
      "aliases": [
        "Estimated intercept and slope",
        "CRE-6.5",
        "slope",
        "intercept"
      ]
    },
    {
      "id": "CRE-6.6",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Estimated residuals",
      "formula": "eᵢ=yᵢ-ŷᵢ",
      "when": "A residual is the observed response minus the fitted response.",
      "caution": "The reverse subtraction changes the sign of every residual.",
      "aliases": [
        "Estimated residuals",
        "CRE-6.6"
      ]
    },
    {
      "id": "CRE-6.7",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Two-sided test statistic for the slope",
      "formula": "t^(*) =(b₁-β₁)/(s_(b₁))\ns_(b₁) =(sₑ)/(√(SS_xx))\nsₑ =√((Σ_(i=1)^n(yᵢ-ŷᵢ)²)/(n-2))=√((SSE)/(n-2))",
      "when": "Compare the estimated slope with the hypothesized slope. The standard error uses the residual standard deviation and SS sub xx. Reject the null when the absolute value of t-star exceeds the two-sided critical value with n minus 2 degrees of freedom.",
      "caution": "The usual null value of beta sub 1 is 0, but only when the question says the slope is zero. The critical value uses alpha over 2 because the handbook states a two-sided rule.",
      "aliases": [
        "Two-sided test statistic for the slope",
        "CRE-6.7"
      ]
    },
    {
      "id": "CRE-6.8",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Relative frequency",
      "formula": "Pr(A)=(a)/(n)",
      "when": "a is the number of times A occurred and n is the number of trials.",
      "caution": "This is an estimate of the probability, not a proof that the probability equals a over n.",
      "aliases": [
        "Relative frequency",
        "CRE-6.8"
      ]
    },
    {
      "id": "CRE-6.9",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Complement rule",
      "formula": "Pr(Ā)=1-Pr(A)",
      "when": "An event and its complement use up the whole probability.",
      "caution": "Do not subtract from the number of trials. Subtract from 1.",
      "aliases": [
        "Complement rule",
        "CRE-6.9"
      ]
    },
    {
      "id": "CRE-6.10",
      "section": "III. Probability and Statistics for Reliability",
      "name": "General addition rule",
      "formula": "Pr(A∪ B)=Pr(A)+Pr(B)-Pr(A∩ B)",
      "when": "Add the two events, then subtract the overlap that was counted twice. The handbook's note after Equation 6.10 describes that overlap.",
      "caution": "The printed Equation 6.10 shows the union symbol on both sides. The sentence after it says the overlap was counted twice, so subtract the intersection, not the union.",
      "aliases": [
        "General addition rule",
        "CRE-6.10",
        "addition rule",
        "union"
      ]
    },
    {
      "id": "CRE-6.11",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Conditional probability",
      "formula": "Pr(A| B)=(Pr(A∩ B))/(Pr(B))",
      "when": "Restrict the denominator to the event that is known to have happened.",
      "caution": "Dividing by Pr(A) instead of Pr(B) answers a different conditional probability.",
      "aliases": [
        "Conditional probability",
        "CRE-6.11"
      ]
    },
    {
      "id": "CRE-6.12",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Probability of an intersection",
      "formula": "Pr(A∩ B)=Pr(B| A)Pr(A)=Pr(A| B)Pr(B)",
      "when": "The joint probability is either order: the probability of one event times the probability of the other given the first.",
      "caution": "Multiplying the two marginal probabilities is allowed only when the events are independent.",
      "aliases": [
        "Probability of an intersection",
        "CRE-6.12"
      ]
    },
    {
      "id": "CRE-6.13",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Permutation formula",
      "formula": "ₙ Pᵣ=(n!)/((n-r)!)",
      "when": "Use a permutation when the order of the r selected items matters.",
      "caution": "Dividing by r factorial as well is the combination, not the permutation.",
      "aliases": [
        "Permutation formula",
        "CRE-6.13",
        "Permutation"
      ]
    },
    {
      "id": "CRE-6.14",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Combination formula",
      "formula": "ₙ Cᵣ=C(n, r)=(n!)/(r!(n-r)!)",
      "when": "Use a combination when the order of the r selected items does not matter.",
      "caution": "Stopping after the permutation counts the same group more than once.",
      "aliases": [
        "Combination formula",
        "CRE-6.14",
        "Combination"
      ]
    },
    {
      "id": "CRE-7.1",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Normalizing with a z transformation",
      "formula": "ẑᵢ=(xᵢ-x̄)/(s)",
      "when": "The handbook writes a hat on z. Subtract the sample mean and divide by the sample standard deviation.",
      "caution": "The handbook warns that this scaling does not make a non-normal sample normal.",
      "aliases": [
        "Normalizing with a z transformation",
        "CRE-7.1",
        "z transformation",
        "z-score",
        "standardize"
      ]
    },
    {
      "id": "CRE-7.2",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Hazard over a time period",
      "formula": "λ(t)=(fraction of failures during the period)/(length of the period)",
      "when": "The period hazard is the failure fraction divided by the length of that period.",
      "caution": "Do not divide by the number of units that had already failed before the period.",
      "aliases": [
        "Hazard over a time period",
        "CRE-7.2"
      ]
    },
    {
      "id": "CRE-7.3",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Reliability function from survivors",
      "formula": "R(t)=(number surviving at the end of the period)/(number of units tested)",
      "when": "This is the empirical survivor fraction at the end of the period.",
      "caution": "The numerator is the survivors, not the failures.",
      "aliases": [
        "Reliability function from survivors",
        "CRE-7.3"
      ]
    },
    {
      "id": "CRE-9.1",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius acceleration factor",
      "formula": "A_F=exp[((E_A)/(K))((1)/(T_U)-(1)/(T_S))]",
      "when": "Temperatures are absolute. Use temperature is the cooler use condition and stress temperature is the hotter test.",
      "caution": "Reversing the two temperatures changes the sign and makes the factor smaller than 1.",
      "aliases": [
        "Arrhenius acceleration factor",
        "CRE-9.1",
        "arrhenius",
        "acceleration factor"
      ]
    },
    {
      "id": "CRE-9.2",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Power-law life model",
      "formula": "(life at rated stress)/(life at accelerated stress)=((accelerated stress)/(rated stress))^b",
      "when": "Life shortens as stress rises when the exponent b is positive.",
      "caution": "Do not invert only one of the two ratios.",
      "aliases": [
        "Power-law life model",
        "CRE-9.2",
        "Power-law life",
        "power law",
        "power-law"
      ]
    },
    {
      "id": "CRE-9.3",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius-Peck model",
      "formula": "A_F=((humidity_low)/(humidity_high))^(-2.66)×exp[((Eₐ)/(K))((1)/(T₁)-(1)/(T₂))]",
      "when": "Humidity and temperature both accelerate. The handbook writes the humidity power as minus 2.66.",
      "caution": "Dropping the humidity ratio leaves an ordinary Arrhenius factor.",
      "aliases": [
        "Arrhenius-Peck model",
        "CRE-9.3",
        "Arrhenius-Peck",
        "peck"
      ]
    },
    {
      "id": "CRE-9.4",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Seeded-defect ratio",
      "formula": "(found unknown defects)/(found known defects)=(unfound unknown defects)/(unfound known defects)",
      "when": "Known seeded defects estimate how many unknown defects remain.",
      "caution": "Do not treat the number found as the number that were there.",
      "aliases": [
        "Seeded-defect ratio",
        "CRE-9.4",
        "Seeded-defect",
        "seeded defect",
        "fault injection"
      ]
    },
    {
      "id": "CRE-10.1",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Series-system reliability",
      "formula": "R_system=Π_(i=1)^n Rᵢ",
      "when": "Every element must work. Multiply the independent reliabilities.",
      "caution": "Adding the reliabilities is not a series system.",
      "aliases": [
        "Series-system reliability",
        "CRE-10.1",
        "Series-system",
        "series system",
        "series reliability"
      ]
    },
    {
      "id": "CRE-10.2",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Parallel-system reliability",
      "formula": "R_system=1-Π_(i=1)^n(1-Rᵢ)",
      "when": "The system fails only when every element fails.",
      "caution": "The product of the reliabilities is the series answer, not the parallel answer.",
      "aliases": [
        "Parallel-system reliability",
        "CRE-10.2",
        "Parallel-system",
        "parallel system",
        "parallel reliability"
      ]
    },
    {
      "id": "CRE-10.3",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "K-out-of-N reliability",
      "formula": "R_system=Σ_(i=k)^nC(n, i) R^i(1-R)^(n-i)",
      "when": "At least k of n identical independent elements must work.",
      "caution": "Stopping at exactly k misses the cases with more than k survivors.",
      "aliases": [
        "K-out-of-N reliability",
        "CRE-10.3",
        "K-out-of-N",
        "k out of n"
      ]
    },
    {
      "id": "CRE-10.4",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius life model",
      "formula": "P(T≤ t)=Φ(t;μ=β₀+(E_A)/(KT),σ)",
      "when": "The location depends on absolute temperature through the Arrhenius term.",
      "caution": "Temperature in Celsius does not belong in the denominator.",
      "aliases": [
        "Arrhenius life model",
        "CRE-10.4",
        "Arrhenius life",
        "arrhenius"
      ]
    },
    {
      "id": "CRE-10.5",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius model, alternate form",
      "formula": "tₚ(T)=A₀exp[(E_A)/(KT)]",
      "when": "This writes a percentile life directly as a function of absolute temperature.",
      "caution": "The exponential is greater at a lower temperature, so a hotter test has a shorter life.",
      "aliases": [
        "Arrhenius model, alternate form",
        "CRE-10.5",
        "arrhenius"
      ]
    },
    {
      "id": "CRE-10.6",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius acceleration factor from percentile life",
      "formula": "AF(T)=(tₚ(T_U))/(tₚ(T_S))=exp[(E_A)/(K)((1)/(T_U)-(1)/(T_S))]",
      "when": "The factor is use life divided by stress life.",
      "caution": "Dividing in the other order estimates how much the test is slower, not faster.",
      "aliases": [
        "Arrhenius acceleration factor from percentile life",
        "CRE-10.6",
        "arrhenius",
        "acceleration factor"
      ]
    },
    {
      "id": "CRE-10.7",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Inverse-power acceleration factor",
      "formula": "AF(V)=(V^b)/(V_U^b)",
      "when": "The handbook's alternate voltage form is the stress voltage to the power b, divided by the use voltage to that power.",
      "caution": "Forgetting the exponent treats life as proportional to voltage.",
      "aliases": [
        "Inverse-power acceleration factor",
        "CRE-10.7",
        "inverse power",
        "inverse-power"
      ]
    },
    {
      "id": "CRE-10.8",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Eyring model, temperature and one stress",
      "formula": "t_f=AT^(α)exp[(Δ H)/(kT)+(B+(C)/(T))S₁]",
      "when": "Temperature appears both as a power and inside the exponential, and S1 is the added stress.",
      "caution": "Setting the stress term to zero does not remove the temperature power.",
      "aliases": [
        "Eyring model, temperature and one stress",
        "CRE-10.8",
        "eyring"
      ]
    },
    {
      "id": "CRE-10.9",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Expanded Eyring model",
      "formula": "t_f=AT^(α)exp[(Δ H)/(kT)+(B+(C)/(T))S₁+(D+(E)/(T))S₂]",
      "when": "A second stress adds one more term of the same form.",
      "caution": "Do not add the two stresses before multiplying by their own coefficients.",
      "aliases": [
        "Expanded Eyring model",
        "CRE-10.9",
        "Expanded Eyring",
        "eyring"
      ]
    },
    {
      "id": "CRE-10.10",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Eyring factor relative to Arrhenius",
      "formula": "AF_Ey=((Temp_K)/(Temp_(U,K)))^m AF_Ar",
      "when": "Both temperatures are in kelvin. The Eyring factor is the Arrhenius factor times a power of that temperature ratio.",
      "caution": "The power is not a second activation energy. Over ordinary temperature ranges the handbook often drops it and keeps Arrhenius.",
      "aliases": [
        "Eyring factor relative to Arrhenius",
        "CRE-10.10",
        "eyring"
      ]
    },
    {
      "id": "CRE-10.11",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Reliability, proportional hazards model",
      "formula": "R(t)=e^(-λ(x) t)",
      "when": "After the stresses are folded into the failure rate λ(x), reliability at time t is e^(-λ(x) t).",
      "caution": "Do not leave the stresses out of the rate. λ(x) already carries them, and this is not a series-product formula.",
      "aliases": [
        "Reliability, proportional hazards model",
        "CRE-10.11",
        "Reliability, proportional hazards",
        "proportional hazard",
        "proportional-hazards"
      ]
    },
    {
      "id": "CRE-11.1",
      "section": "V. Lifecycle Reliability",
      "name": "Sample size for a zero-failure test",
      "formula": "n=(ln(1-confidence))/(ln(reliability))",
      "when": "Both the confidence complement and the reliability are below 1, so both logarithms are negative and the sample size is positive.",
      "caution": "Using the confidence itself, instead of one minus the confidence, changes the numerator. Chapter 8 writes the same exponential sample size as log of alpha over log of R, with alpha equal to one minus the confidence.",
      "aliases": [
        "Sample size for a zero-failure test",
        "CRE-11.1",
        "zero-failure",
        "zero failure",
        "sample size"
      ]
    },
    {
      "id": "CRE-11.2",
      "section": "V. Lifecycle Reliability",
      "name": "Sample size for a continuous distribution",
      "formula": "n=((Zσ)/(E))²",
      "when": "Z is the normal factor, σ is the standard deviation, and E is the margin.",
      "caution": "The ratio is squared. Stopping before the square understates the sample.",
      "aliases": [
        "Sample size for a continuous distribution",
        "CRE-11.2",
        "Sample size for a continuous",
        "sample size"
      ]
    },
    {
      "id": "CRE-11.3",
      "section": "V. Lifecycle Reliability",
      "name": "Factor of safety",
      "formula": "factor of safety=(strength)/(stress)",
      "when": "Divide the strength by the stress applied.",
      "caution": "A factor below 1 means the stress is larger than the strength.",
      "aliases": [
        "Factor of safety",
        "CRE-11.3",
        "safety factor"
      ]
    },
    {
      "id": "CRE-11.4",
      "section": "V. Lifecycle Reliability",
      "name": "Margin of safety",
      "formula": "margin of safety=(strength)/(stress)-1",
      "when": "The margin is the factor of safety minus 1.",
      "caution": "Reporting the factor of safety itself overstates the margin by 1.",
      "aliases": [
        "Margin of safety",
        "CRE-11.4"
      ]
    },
    {
      "id": "CRE-12.1",
      "section": "V. Lifecycle Reliability",
      "name": "Availability from MTBF and MTTR",
      "formula": "A=(MTBF)/(MTBF+MTTR)",
      "when": "The handbook's worked example divides MTBF by MTBF plus MTTR.",
      "caution": "The title mentions MTTF. Use the mean the problem actually gives, and keep the repair time in the denominator.",
      "aliases": [
        "Availability from MTBF and MTTR",
        "CRE-12.1"
      ]
    },
    {
      "id": "CRE-13.1",
      "section": "V. Lifecycle Reliability",
      "name": "Inherent availability",
      "formula": "Aᵢ=(MTBF)/(MTBF+MTTR)",
      "when": "Inherent availability uses active repair time only.",
      "caution": "Logistics delay does not belong in this denominator.",
      "aliases": [
        "Inherent availability",
        "CRE-13.1"
      ]
    },
    {
      "id": "CRE-13.2",
      "section": "V. Lifecycle Reliability",
      "name": "Achieved availability",
      "formula": "Aₐ=(MTBM)/(MTBM+MMT)",
      "when": "Achieved availability uses the mean time between maintenance and the mean maintenance time.",
      "caution": "MTBF and MTTR answer the inherent question, not this one.",
      "aliases": [
        "Achieved availability",
        "CRE-13.2"
      ]
    },
    {
      "id": "CRE-13.3",
      "section": "V. Lifecycle Reliability",
      "name": "Operational availability",
      "formula": "Aₒ=(uptime)/(uptime+downtime)",
      "when": "Operational availability keeps every delay that is part of downtime.",
      "caution": "Removing logistics delay turns the result into an inherent or achieved measure.",
      "aliases": [
        "Operational availability",
        "CRE-13.3"
      ]
    },
    {
      "id": "CRE-13.4",
      "section": "V. Lifecycle Reliability",
      "name": "MTBF from an operating record",
      "formula": "MTBF=(operating hours)/(failures)",
      "when": "Divide the operating hours by the number of failures in that record.",
      "caution": "Calendar hours are too large when the item was not operating the whole time.",
      "aliases": [
        "MTBF from an operating record",
        "CRE-13.4"
      ]
    },
    {
      "id": "CRE-13.5",
      "section": "V. Lifecycle Reliability",
      "name": "MTBF from the failure rate",
      "formula": "MTBF=(1)/(λ)",
      "when": "Invert the constant failure rate.",
      "caution": "The failure rate is not already a mean time.",
      "aliases": [
        "MTBF from the failure rate",
        "CRE-13.5"
      ]
    },
    {
      "id": "CRE-13.6",
      "section": "V. Lifecycle Reliability",
      "name": "System mean repair time",
      "formula": "MTTR_system=(Σ_(i=1)^nλᵢ tᵢ)/(Σ_(i=1)^nλᵢ)",
      "when": "Weight each element's repair time by its failure rate.",
      "caution": "A plain average treats a rare failure as equal to a frequent one.",
      "aliases": [
        "System mean repair time",
        "CRE-13.6",
        "system mttr",
        "mean repair time"
      ]
    },
    {
      "id": "CRE-13.7",
      "section": "V. Lifecycle Reliability",
      "name": "Moving average for spare parts",
      "formula": "Rₜ=(X_(t-1)+X_(t-2)+cdots+X_(t-n))/(n)",
      "when": "The forecast is the average of the last n demands.",
      "caution": "The current period is not in the average. The newest demand used is the previous period.",
      "aliases": [
        "Moving average for spare parts",
        "CRE-13.7",
        "moving average"
      ]
    },
    {
      "id": "CRE-13.8",
      "section": "V. Lifecycle Reliability",
      "name": "Weighted moving average for spare parts",
      "formula": "Rₜ=(nX_(t-1)+(n-1)X_(t-2)+cdots+X_(t-n))/(n+(n-1)+cdots+1)",
      "when": "More recent demands get the larger weights, and the weights in the denominator sum to the same total.",
      "caution": "Using n as the denominator ignores the smaller weights.",
      "aliases": [
        "Weighted moving average for spare parts",
        "CRE-13.8",
        "weighted moving average"
      ]
    },
    {
      "id": "CRE-13.9",
      "section": "V. Lifecycle Reliability",
      "name": "Single exponential smoothing for spare parts",
      "formula": "Rₜ=α X_(t-1)+(1-α)R_(t-1)",
      "when": "α is the smoothing weight, usually 0.1 to 0.4. A larger α follows recent demand more closely.",
      "caution": "α is not the failure rate.",
      "aliases": [
        "Single exponential smoothing for spare parts",
        "CRE-13.9",
        "exponential smoothing"
      ]
    },
    {
      "id": "CRE-OEE",
      "section": "I. Reliability Fundamentals",
      "name": "Overall equipment effectiveness",
      "formula": "OEE =Availability×Performance×Quality\nAvailability =(actual operating time)/(planned production time)\nPerformance =(total pieces/actual operating time)/(ideal pieces/time period)\nQuality =(good pieces)/(total pieces)",
      "when": "OEE is the product of the three ratios. Planned production time is the shift less breaks. Actual operating time subtracts setup and maintenance downtime.",
      "caution": "Do not add the three ratios. A zero in any one of them makes OEE zero.",
      "aliases": [
        "Overall equipment effectiveness",
        "CRE-OEE",
        "oee"
      ]
    },
    {
      "id": "CRE-DUAN",
      "section": "I. Reliability Fundamentals",
      "name": "Duane cumulative-failure plot",
      "formula": "log₁₀((n(T))/(T))=-αlog₁₀(T)+b",
      "when": "On log-log paper the cumulative failure rate n(T)/T is a straight line in cumulative time T.",
      "caution": "n(T) is the cumulative failure count, not the instantaneous rate. The slope is negative when reliability is improving.",
      "aliases": [
        "Duane cumulative-failure plot",
        "CRE-DUAN",
        "duane"
      ]
    },
    {
      "id": "CRE-VAR",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Sample variance and standard deviation",
      "formula": "s²=(1)/(n-1)Σ_(i=1)^n(xᵢ-x̄)², s=√(s²)",
      "when": "The handbook's point estimate of variance divides by n minus 1.",
      "caution": "Equation 6.1 divides the mean by n. Using n here understates the variance.",
      "aliases": [
        "Sample variance and standard deviation",
        "CRE-VAR",
        "sample variance",
        "standard deviation"
      ]
    },
    {
      "id": "CRE-BIN",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Binomial distribution",
      "formula": "Pr(X=x| n,p) =C(n, x)p^x(1-p)^(n-x)\nPr(X≤ x| n,p) =Σ_(k=0)^xC(n, k)p^k(1-p)^(n-k)",
      "when": "Use it for a fixed number of independent trials with the same success probability.",
      "caution": "The combination, not the permutation, is the coefficient. Order does not matter inside one count.",
      "aliases": [
        "Binomial distribution",
        "CRE-BIN",
        "Binomial"
      ]
    },
    {
      "id": "CRE-NBIN",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Negative binomial distribution",
      "formula": "Pr(X=n| r,p) =C(n-1, r-1)p^r(1-p)^(n-r), n≥ r\nE(X) =(r)/(p)",
      "when": "X is the trial number on which the r-th event occurs.",
      "caution": "The binomial counts events in a fixed n. This distribution lets the number of trials vary.",
      "aliases": [
        "Negative binomial distribution",
        "CRE-NBIN",
        "Negative binomial"
      ]
    },
    {
      "id": "CRE-GEO",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Geometric distribution",
      "formula": "Pr(X=n)=p(1-p)^(n-1), E(X)=(1)/(p)",
      "when": "The geometric is the negative binomial with r equal to 1: trials until the first event.",
      "caution": "The exponent is n minus 1, not n. The mean is 1/p, not p.",
      "aliases": [
        "Geometric distribution",
        "CRE-GEO",
        "Geometric"
      ]
    },
    {
      "id": "CRE-HYP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Hypergeometric distribution",
      "formula": "Pr(X=k| N,K,n)=(C(K, k)C(N-K, n-k))/(C(N, n))",
      "when": "A sample of n is drawn without replacement from N items, of which K are the type being counted.",
      "caution": "The binomial allows replacement. Without replacement, the probability changes after each draw.",
      "aliases": [
        "Hypergeometric distribution",
        "CRE-HYP",
        "Hypergeometric"
      ]
    },
    {
      "id": "CRE-POI",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Poisson distribution",
      "formula": "Pr(X=x|λ) =(e^(-λ)λ^x)/(x!)\nPr(X≤ x|λ) =Σ_(k=0)^x(e^(-λ)λ^k)/(k!)",
      "when": "Use it for a count in a fixed window when the mean rate is constant.",
      "caution": "The mean is lambda, not the window length. Include lambda in both the power and the exponential.",
      "aliases": [
        "Poisson distribution",
        "CRE-POI",
        "Poisson"
      ]
    },
    {
      "id": "CRE-EXP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Exponential density and distribution",
      "formula": "f(t) =λ e^(-λ t)\nF(t) =1-e^(-λ t)",
      "when": "The density is the constant rate times the reliability. The cdf is one minus that reliability.",
      "caution": "Equation 2.14 is the reliability e to the minus lambda t. Do not report the density as a reliability.",
      "aliases": [
        "Exponential density and distribution",
        "CRE-EXP",
        "Exponential density and",
        "exponential distribution",
        "exponential density"
      ]
    },
    {
      "id": "CRE-WEI",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Weibull distribution",
      "formula": "f(t) =(β)/(η)((t)/(η))^(β-1)exp[-((t)/(η))^(β)]\nF(t) =1-exp[-((t)/(η))^(β)]\nR(t) =exp[-((t)/(η))^(β)]\nE(X) =η Γ(1+(1)/(β))\nSD(X) =η√(Γ(1+(2)/(β))-[Γ(1+(1)/(β))]²)",
      "when": "Beta is the shape and eta is the scale. The mean multiplies the scale by a gamma value. The reference table also gives the standard deviation. It writes the gamma arguments as 2 over beta plus 1 and 1 over beta plus 1, which are the same values.",
      "caution": "At the characteristic life t equals eta, reliability is e to the minus 1, about 0.368, not 0.50.",
      "aliases": [
        "Weibull distribution",
        "CRE-WEI",
        "Weibull"
      ]
    },
    {
      "id": "CRE-NOR",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Normal distribution",
      "formula": "f(t) =(1)/(σ√(2π))exp[-(1)/(2)((t-μ)/(σ))²]\nF(t) =Φ((t-μ)/(σ))\nZ =(X-μ)/(σ)",
      "when": "Standardize before reading a normal table. The handbook's reference table writes the same density with the square completed in the exponent.",
      "caution": "One integral display puts x, rather than the upper limit, inside Phi. Use the limit you actually integrated to.",
      "aliases": [
        "Normal distribution",
        "CRE-NOR",
        "standard normal"
      ]
    },
    {
      "id": "CRE-LOGN",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Lognormal distribution",
      "formula": "ln X ∼Normal(μ,σ²)\nf(x) =(1)/(x√(2πσ²))exp[-((ln x-μ)²)/(2σ²)]\nE(X) =exp(μ+(σ²)/(2))\nSD(X) =√(exp(2μ+σ²)(exp(σ²)-1))",
      "when": "Mu and sigma are the mean and standard deviation of the natural log, not of X. This is the reference-table density.",
      "caution": "A nearby display puts sigma squared in the denominator outside the square root. Use the reference-table form, with sigma inside the square root and x in front.",
      "aliases": [
        "Lognormal distribution",
        "CRE-LOGN",
        "Lognormal",
        "log-normal"
      ]
    },
    {
      "id": "CRE-HAZ",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Hazard function",
      "formula": "h(t)=(f(t))/(R(t))",
      "when": "The hazard is the density among the units still surviving.",
      "caution": "Do not divide the density by the cdf. The denominator is the reliability.",
      "aliases": [
        "Hazard function",
        "CRE-HAZ",
        "hazard rate"
      ]
    },
    {
      "id": "CRE-HCU",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Cumulative hazard",
      "formula": "H(t)=∫₀^t h(x) dx=-ln R(t)",
      "when": "The cumulative hazard is the area under the hazard, and it is also minus the log of reliability.",
      "caution": "Reliability is e to the minus H(t). Dropping the minus makes the result greater than 1.",
      "aliases": [
        "Cumulative hazard",
        "CRE-HCU"
      ]
    },
    {
      "id": "CRE-COND",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Conditional reliability",
      "formula": "R(t+M| t)=(R(t+M))/(R(t))",
      "when": "Given survival to t, the probability of surviving an additional mission of length M is the ratio of the two reliabilities.",
      "caution": "Do not multiply R(t) by R(M) unless the hazard is constant. That product is the exponential special case.",
      "aliases": [
        "Conditional reliability",
        "CRE-COND",
        "Conditional"
      ]
    },
    {
      "id": "CRE-KM",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Kaplan-Meier reliability",
      "formula": "R̂(t)=Π_(i: tᵢ≤ t)(1-(rᵢ)/(nᵢ))",
      "when": "At each failure time, multiply by one minus the failures in that step divided by the number still at risk.",
      "caution": "Censored units leave the risk set. They are not counted as failures in r sub i.",
      "aliases": [
        "Kaplan-Meier reliability",
        "CRE-KM",
        "Kaplan-Meier",
        "kaplan meier",
        "product limit",
        "product-limit"
      ]
    },
    {
      "id": "CRE-WPP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Weibull probability-plot line",
      "formula": "lnln((1)/(1-F(t)))=βln t-βlnη",
      "when": "A Weibull sample is a straight line when the vertical axis is the double log of one over one minus F.",
      "caution": "The slope is beta. Swapping the axes changes the slope to 1/beta.",
      "aliases": [
        "Weibull probability-plot line",
        "CRE-WPP",
        "weibull plot",
        "probability plot"
      ]
    },
    {
      "id": "CRE-CHI",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Chi-square relationship and Pearson statistic",
      "formula": "((n-1)s²)/(σ²) ∼χ²_(n-1)\nX² =Σ_(i=1)^k((Oᵢ-Eᵢ)²)/(Eᵢ)",
      "when": "The first line is the sampling distribution of the variance. The second compares observed and expected counts.",
      "caution": "Expected counts belong in the denominator. Squared differences divided by observed counts are a different statistic.",
      "aliases": [
        "Chi-square relationship and Pearson statistic",
        "CRE-CHI",
        "Chi-square relationship and Pearson",
        "chi-square",
        "chi square",
        "pearson"
      ]
    },
    {
      "id": "CRE-T1",
      "section": "III. Probability and Statistics for Reliability",
      "name": "One-sample t statistic",
      "formula": "t^(*)=(X̂-μ₀)/(σ̂/√(n))∼ t_(n-1)",
      "when": "Compare the sample mean with the hypothesized mean, in standard-error units. A paired test is this same statistic on the differences.",
      "caution": "The divisor is s over square root of n, not s itself. The degrees of freedom are n minus 1.",
      "aliases": [
        "One-sample t statistic",
        "CRE-T1",
        "One-sample t",
        "t statistic",
        "t-test",
        "student's t"
      ]
    },
    {
      "id": "CRE-MCI",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Confidence interval for a mean",
      "formula": "X̄ ± t_(α/2, n-1)√((σ̂²)/(n))\nLCL =X̄-t_(α, n-1)√((σ̂²)/(n))",
      "when": "If sigma is known, the handbook sets sigma-hat equal to sigma and replaces t with z. Otherwise sigma-hat is the sample standard deviation s. A one-sided bound uses t with alpha, not alpha over 2, and n minus 1 degrees of freedom.",
      "caution": "The standard error is the square root of sigma-hat squared over n. Leaving the square root off divides by n and makes the interval too narrow.",
      "aliases": [
        "Confidence interval for a mean",
        "CRE-MCI"
      ]
    },
    {
      "id": "CRE-FRAT",
      "section": "III. Probability and Statistics for Reliability",
      "name": "F ratio of two chi-square variables",
      "formula": "F^(*)=(χ²₁/ν₁)/(χ²₂/ν₂)∼ F_(ν₁,ν₂)",
      "when": "An F for two variances is this ratio. Each chi-square is scaled by its own degrees of freedom.",
      "caution": "The larger sample variance is not automatically the numerator. The handbook puts the hypothesized direction in the numerator.",
      "aliases": [
        "F ratio of two chi-square variables",
        "CRE-FRAT",
        "f ratio",
        "f-test"
      ]
    },
    {
      "id": "CRE-WELCH",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Two-sample t, unequal variances",
      "formula": "t^(*) =((X̂₁-X̂₂)-μ₀)/(√(s₁²/n₁+s₂²/n₂))\nν =((s₁²/n₁+s₂²/n₂)²)/((s₁²/n₁)²/(n₁-1)+(s₂²/n₂)²/(n₂-1))",
      "when": "The handbook uses this Welch form, and the Satterthwaite degrees of freedom, when the two sigmas are not pooled.",
      "caution": "Do not use n1 plus n2 minus 2 with this standard error. Those degrees of freedom belong to the pooled test.",
      "aliases": [
        "Two-sample t, unequal variances",
        "CRE-WELCH",
        "welch",
        "unequal variance"
      ]
    },
    {
      "id": "CRE-POOL",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Two-sample t, pooled variance",
      "formula": "sₚ =√(((n₁-1)s₁²+(n₂-1)s₂²)/(n₁+n₂-2))\nt^(*) =((X̂₁-X̂₂)-μ₀)/(sₚ√(1/n₁+1/n₂))",
      "when": "Pool when the handbook says the variances may be combined. The degrees of freedom are n1 plus n2 minus 2.",
      "caution": "The pooled standard deviation is not the average of the two standard deviations.",
      "aliases": [
        "Two-sample t, pooled variance",
        "CRE-POOL",
        "pooled variance",
        "pooled standard deviation"
      ]
    },
    {
      "id": "CRE-ZP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "One-proportion z statistic",
      "formula": "z^(*) =(p̂-p₀)/(√(p̂(1-p̂)/n))\np̂_AC =(x+1)/(n+2)",
      "when": "The handbook's displayed proportion statistic puts the estimated proportion in the standard error. The same table's Agresti-Caffo estimate adds one success and two trials before the proportion is formed.",
      "caution": "Some exams put the null proportion p0 under the square root instead. Read which standard error the question is using. The Agresti-Caffo proportion is not the z statistic's numerator.",
      "aliases": [
        "One-proportion z statistic",
        "CRE-ZP",
        "One-proportion z",
        "proportion",
        "z statistic"
      ]
    },
    {
      "id": "CRE-FPC",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Finite population correction",
      "formula": "fpc=√((N-n)/(N-1))",
      "when": "Multiply a standard error by this factor when the sample is a noticeable part of a finite population.",
      "caution": "The correction is less than 1. Using it when the population is effectively infinite shrinks the interval without a reason.",
      "aliases": [
        "Finite population correction",
        "CRE-FPC",
        "finite population"
      ]
    },
    {
      "id": "CRE-R3",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Rule of 3",
      "formula": "n≈(3)/(p), (0, 3/n) for a small proportion",
      "when": "With no events expected, the sample size is about 3 divided by the proportion of interest. The matching approximate interval for a small p is 0 to 3/n.",
      "caution": "This is an approximation for a rare binomial event. Equation 11.1 is the exact zero-failure sample size.",
      "aliases": [
        "Rule of 3",
        "CRE-R3",
        "rule of three"
      ]
    },
    {
      "id": "CRE-RLB",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Lower confidence bound on reliability",
      "formula": "R_L =α^(1/n)\nR_L =(n-r)/((n-r)+(r+1)F_(α,ν₁,ν₂))\nν₁ =2(r+1), ν₂=2(n-r)",
      "when": "The first bound is the no-failure test. The second allows r failures and uses an F critical value.",
      "caution": "Alpha is the error rate, not the confidence. A 95 percent bound uses alpha equal to 0.05.",
      "aliases": [
        "Lower confidence bound on reliability",
        "CRE-RLB",
        "Lower confidence bound on",
        "lower confidence bound",
        "confidence bound"
      ]
    },
    {
      "id": "CRE-PCL",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Exact interval for a proportion",
      "formula": "(ν₁ F_(α,ν₁,ν₂))/(ν₂+ν₁ F_(α,ν₁,ν₂))",
      "when": "The handbook's one-sided Clopper-Pearson limit has this form. For the upper limit, nu1 is 2(x+1) and nu2 is 2(n-x). For the lower limit, nu1 is 2x and nu2 is 2(n-x+1). A two-sided interval uses alpha over 2.",
      "caution": "The upper and lower limits do not use the same degrees of freedom.",
      "aliases": [
        "Exact interval for a proportion",
        "CRE-PCL",
        "clopper",
        "exact interval"
      ]
    },
    {
      "id": "CRE-PCI",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Normal interval for a proportion",
      "formula": "p̂ =(x)/(n)\np̂ ± z_(α/2)√((p̂(1-p̂))/(n))",
      "when": "The handbook uses this Wald interval when x is at least 10 and n minus x is at least 10. A one-sided bound uses z with alpha instead of alpha over 2.",
      "caution": "This is not the exact Clopper-Pearson interval. That limit uses an F value and different degrees of freedom on each side. The z statistic for a hypothesis test is a different card.",
      "aliases": [
        "Normal interval for a proportion",
        "CRE-PCI"
      ]
    },
    {
      "id": "CRE-NPROP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Sample size for a proportion",
      "formula": "n=((z_(α/2))/(E))²p̂(1-p̂)=(1)/(4)((z_(α/2))/(E))²",
      "when": "E is the margin of error. If the proportion is unknown, the handbook uses p equal to 0.5 because p times one minus p is then 1/4, the largest value. A one-sided margin uses z with alpha. Equation 11.2 is the matching sample size for a mean.",
      "caution": "Forgetting the square, or forgetting to multiply by p times one minus p, does not give this sample size. Do not reuse the mean formula, which has sigma in the numerator.",
      "aliases": [
        "Sample size for a proportion",
        "CRE-NPROP"
      ]
    },
    {
      "id": "CRE-EXPM",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Confidence limits for an exponential mean",
      "formula": "θ̂ =(T)/(r)\nθ_(L, time) =(2T)/(χ²_(α/2, ν=2r+2))\nθ_(L, failure) =(2T)/(χ²_(α/2, ν=2r))\nθ_U =(2T)/(χ²_(1-α/2, ν=2r))",
      "when": "T is the total time on failed and unfailed units. A time-censored test ends at a chosen time and its lower limit uses 2r+2 degrees of freedom. A failure-censored test ends on a chosen failure and its lower limit uses 2r. The upper limit uses 2r for both. A one-sided limit uses alpha instead of alpha over 2.",
      "caution": "Swapping the chi-square tails swaps the lower and upper limits.",
      "aliases": [
        "Confidence limits for an exponential mean",
        "CRE-EXPM",
        "exponential mean",
        "confidence limit"
      ]
    },
    {
      "id": "CRE-CP",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Process capability and performance, Cp and Pp",
      "formula": "Ĉₚ or P̂ₚ =(USL-LSL)/(6σ̂)\nσ̂ =(mR)/(1.128) (X-mR)\nσ̂ =(R̄)/(d₂) (X̄-R)\nσ̂ =(s̄)/(c₄) (X̄-s)",
      "when": "The same width ratio is Cp with a short-term sigma and Pp with the overall standard deviation. The handbook estimates the short-term sigma from the chart in use: moving range over 1.128, R-bar over d2, or s-bar over c4. Performance uses the ordinary standard deviation of the whole data set.",
      "caution": "One worked display writes UCL minus LCL in this ratio. Those letters are control-chart limits. The specification width is USL minus LSL. Do not put the short-term sigma into Pp.",
      "aliases": [
        "Process capability and performance, Cp and Pp",
        "CRE-CP",
        "cp",
        "process capability"
      ]
    },
    {
      "id": "CRE-CPK",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Process capability and performance, Cpk and Ppk",
      "formula": "Ĉ_pL or P̂_pL =(X̄-LSL)/(3σ̂)\nĈ_pU or P̂_pU =(USL-X̄)/(3σ̂)\nĈ_pk or P̂_pk =min(Ĉ_pL,Ĉ_pU)",
      "when": "Cpk and Ppk are the smaller of the two one-sided ratios. Capability uses a short-term sigma. Performance uses the overall standard deviation. The handbook writes the same minimum for the Ppk pair.",
      "caution": "Cp ignores where the mean sits. Cpk is smaller than Cp when the mean is off center. Do not report the short-term Cpk as Ppk.",
      "aliases": [
        "Process capability and performance, Cpk and Ppk",
        "CRE-CPK",
        "cpk",
        "process capability"
      ]
    },
    {
      "id": "CRE-TOL",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Statistical tolerance interval",
      "formula": "x̄± K s",
      "when": "K is the handbook's normal tolerance factor for the stated confidence and population coverage. It is not a t critical value.",
      "caution": "A confidence interval estimates the mean. A tolerance interval is built to cover a proportion of the individual units.",
      "aliases": [
        "Statistical tolerance interval",
        "CRE-TOL",
        "tolerance interval"
      ]
    },
    {
      "id": "CRE-XBAR",
      "section": "III. Probability and Statistics for Reliability",
      "name": "X-bar and R chart limits",
      "formula": "LCL_(X̄) =X̄̄-A₂R̄\nUCL_(X̄) =X̄̄+A₂R̄\nLCL_R =D₃R̄\nUCL_R =D₄R̄",
      "when": "Use the X-bar and R pair when the subgroup size is from 2 to 10.",
      "caution": "A2, D3, and D4 depend on the subgroup size. Do not reuse the constants from an individuals chart.",
      "aliases": [
        "X-bar and R chart limits",
        "CRE-XBAR",
        "X-bar and R chart",
        "x-bar",
        "xbar",
        "r chart"
      ]
    },
    {
      "id": "CRE-IMR",
      "section": "III. Probability and Statistics for Reliability",
      "name": "Individuals and moving-range limits",
      "formula": "LCL_X =X̄-E₂mR\nUCL_X =X̄+E₂mR\nLCL_mR =D₃mR\nUCL_mR =D₄mR",
      "when": "Use the individuals chart when each subgroup has one observation.",
      "caution": "The center of the individuals chart is a single bar, not the double bar used on an X-bar chart.",
      "aliases": [
        "Individuals and moving-range limits",
        "CRE-IMR",
        "Individuals and moving-range",
        "moving range",
        "individuals chart",
        "i-mr"
      ]
    },
    {
      "id": "CRE-XBARS",
      "section": "III. Probability and Statistics for Reliability",
      "name": "X-bar and s chart limits",
      "formula": "LCL_(X̄) =X̄̄-A₃s̄\nUCL_(X̄) =X̄̄+A₃s̄\nLCLₛ =B₃s̄\nUCLₛ =B₄s̄",
      "when": "Use X-bar and s when the subgroup size is greater than 10.",
      "caution": "One table cell labels the upper X-bar limit as a limit for R-bar. The worked example, and the matching lower limit, put A3 on the X-bar chart.",
      "aliases": [
        "X-bar and s chart limits",
        "CRE-XBARS",
        "X-bar and s chart",
        "x-bar",
        "s chart"
      ]
    },
    {
      "id": "CRE-PCH",
      "section": "III. Probability and Statistics for Reliability",
      "name": "p chart limits",
      "formula": "pᵢ =(Dᵢ)/(nᵢ)\nLCLₚ =p̄-3√((p̄(1-p̄))/(nᵢ))\nUCLₚ =p̄+3√((p̄(1-p̄))/(nᵢ))",
      "when": "The p chart plots the proportion defective. The limits change when the sample size changes.",
      "caution": "A negative calculated lower limit is plotted at zero. Do not extend it below zero.",
      "aliases": [
        "p chart limits",
        "CRE-PCH",
        "p chart",
        "p-chart"
      ]
    },
    {
      "id": "CRE-NPCH",
      "section": "III. Probability and Statistics for Reliability",
      "name": "np chart limits",
      "formula": "LCL_np =np̄-3√(np̄(1-p̄))\nUCL_np =np̄+3√(np̄(1-p̄))",
      "when": "The np chart plots the count defective when the sample size is constant.",
      "caution": "Do not use the np limits on a proportion. Divide by n first if the chart is a p chart.",
      "aliases": [
        "np chart limits",
        "CRE-NPCH",
        "np chart",
        "np-chart"
      ]
    },
    {
      "id": "CRE-CCH",
      "section": "III. Probability and Statistics for Reliability",
      "name": "c chart limits",
      "formula": "LCL_c=c̄-3√(c̄), UCL_c=c̄+3√(c̄)",
      "when": "The c chart counts defects on an inspection unit of constant size.",
      "caution": "If the opportunity size changes, the matching chart is the u chart, not the c chart.",
      "aliases": [
        "c chart limits",
        "CRE-CCH",
        "c chart",
        "c-chart"
      ]
    },
    {
      "id": "CRE-UCH",
      "section": "III. Probability and Statistics for Reliability",
      "name": "u chart limits",
      "formula": "LCLᵤ =ū-3√((ū)/(nᵢ))\nUCLᵤ =ū+3√((ū)/(nᵢ))",
      "when": "The u chart plots defects per unit when the area of opportunity can change.",
      "caution": "One table cell prints the upper-limit subscript as w. The lower limit and the formula are the u chart.",
      "aliases": [
        "u chart limits",
        "CRE-UCH",
        "u chart",
        "u-chart"
      ]
    },
    {
      "id": "CRE-GROW",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Reliability growth slope and instantaneous MTBF",
      "formula": "b=(log(θ₁/θ₀))/(log(T₁/T₀)), θ=(θₘ)/(1-b)",
      "when": "b is the growth slope between two cumulative times. Theta sub m is the cumulative MTBF, and theta is the instantaneous MTBF.",
      "caution": "The instantaneous value is larger than the cumulative MTBF while reliability is still growing. Do not report theta sub m as the current rate.",
      "aliases": [
        "Reliability growth slope and instantaneous MTBF",
        "CRE-GROW",
        "reliability growth",
        "crow-amsaa",
        "amsaa"
      ]
    },
    {
      "id": "CRE-W0",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Weibull zero-failure sample size",
      "formula": "n=(1)/(k^(β))(logα)/(log R)",
      "when": "k is the number of required lives the test runs, beta is the Weibull shape, alpha is one minus the confidence, and R is the reliability to demonstrate.",
      "caution": "Equation 11.1 is the exponential case. Leaving out 1 over k to the beta ignores a test that runs longer than one life.",
      "aliases": [
        "Weibull zero-failure sample size",
        "CRE-W0",
        "weibull",
        "zero-failure",
        "zero failure"
      ]
    },
    {
      "id": "CRE-ARATE",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Arrhenius reaction rate",
      "formula": "R=Aexp(-(E_A)/(KT))",
      "when": "This R is the reaction rate at absolute temperature T. The acceleration factor is the ratio of two such rates.",
      "caution": "Do not read this R as reliability. Equation 9.1 is the acceleration factor, and a reliability cannot contain the positive constant A in front.",
      "aliases": [
        "Arrhenius reaction rate",
        "CRE-ARATE",
        "arrhenius",
        "reaction rate"
      ]
    },
    {
      "id": "CRE-AFDEF",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Acceleration factor as a rate ratio",
      "formula": "A_F=(R_S)/(R_U)",
      "when": "The factor is the rate at the stress condition divided by the rate at the use condition. Equation 9.1 writes that ratio for the Arrhenius rate.",
      "caution": "Inverting the ratio produces a factor below 1 when the stress test is harsher.",
      "aliases": [
        "Acceleration factor as a rate ratio",
        "CRE-AFDEF",
        "Acceleration factor as a rate",
        "acceleration factor"
      ]
    },
    {
      "id": "CRE-IPL",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Inverse-power life",
      "formula": "L=(a)/(V^b), a>0, b>0",
      "when": "Life falls as voltage, or another stress V, rises. Equation 10.7 is the acceleration factor that follows from this life model.",
      "caution": "The stress belongs in the denominator. Putting it in the numerator makes life increase with stress.",
      "aliases": [
        "Inverse-power life",
        "CRE-IPL",
        "inverse power",
        "inverse-power"
      ]
    },
    {
      "id": "CRE-PHAZ",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Proportional-hazards failure rate",
      "formula": "λ(x)=Σ_(i=0)^k aᵢ xᵢ",
      "when": "The handbook's simplest proportional-hazards rate is a linear sum of the stresses. Equation 10.11 then gives reliability e to the minus lambda of x times t.",
      "caution": "Do not drop a stress that the model includes, and do not treat this sum itself as a reliability.",
      "aliases": [
        "Proportional-hazards failure rate",
        "CRE-PHAZ",
        "proportional hazard",
        "proportional-hazards"
      ]
    },
    {
      "id": "CRE-BEAR",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Ball-bearing multiplicative failure rate",
      "formula": "λ=λ_b((Lₐ)/(L_S))^y((A_C)/(0.006))^(2.36)((v₀)/(v₁))^(0.54)((C₁)/(60))^(0.67)((M_b)/(M_f))C_w",
      "when": "The handbook prints this product as a ball-bearing failure-rate model. The powers 2.36, 0.54, and 0.67 are part of that printed model.",
      "caution": "Those powers are not universal acceleration exponents. Do not reuse them for a voltage or temperature model.",
      "aliases": [
        "Ball-bearing multiplicative failure rate",
        "CRE-BEAR",
        "ball bearing",
        "bearing"
      ]
    },
    {
      "id": "CRE-FAT",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Fatigue life distribution",
      "formula": "P(N≤ n)=Φ(n; μ=(β₀)/(B)-(1)/(B)log s, σ=(σ_X)/(B))",
      "when": "This is the handbook's normal distribution for fatigue life N at stress s.",
      "caution": "Equation 10.11 is the proportional-hazards reliability. It is not this fatigue formula.",
      "aliases": [
        "Fatigue life distribution",
        "CRE-FAT",
        "Fatigue life",
        "fatigue",
        "s-n curve",
        "sn curve"
      ]
    },
    {
      "id": "CRE-WINV",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Weibull inverse for a simulated life",
      "formula": "Xᵢ=-η[ln(1-Pᵢ)]^(1/β)",
      "when": "P sub i is a random probability. The handbook uses this inverse to turn that probability into a Weibull life.",
      "caution": "The sign in front of eta is negative because the log of a probability is negative. Dropping the sign produces a negative life.",
      "aliases": [
        "Weibull inverse for a simulated life",
        "CRE-WINV",
        "weibull",
        "inverse transform"
      ]
    },
    {
      "id": "CRE-DSTEP",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "System failure by conditioning",
      "formula": "F_S=F_(S| C₁) R_(C₁)+F_(S| C₁^c) F_(C₁)",
      "when": "Condition on whether the chosen component works, then weight the two system-failure probabilities by that component's reliability and unreliability.",
      "caution": "This is not the parallel formula. The parallel formula is Equation 10.2.",
      "aliases": [
        "System failure by conditioning",
        "CRE-DSTEP",
        "decomposition",
        "conditioning"
      ]
    },
    {
      "id": "CRE-MARK",
      "section": "IV. Reliability Planning, Testing, and Modeling",
      "name": "Two-state repair transition matrix",
      "formula": "T=1-P_(S-F) P_(S-F); P_(F-S) 1-P_(F-S)",
      "when": "Rows are the state now and columns are the state next. S-F is the chance of going from success to failure.",
      "caution": "Each row sums to 1. Replacing a diagonal entry with the off-diagonal probability double-counts that row.",
      "aliases": [
        "Two-state repair transition matrix",
        "CRE-MARK",
        "markov",
        "transition matrix"
      ]
    },
    {
      "id": "CRE-SSN",
      "section": "V. Lifecycle Reliability",
      "name": "Normal stress-strength interference",
      "formula": "μ_D =μ_Y-μ_X\nσ_D =√(σ_Y²+σ_X²)\nPr(failure) =Pr(Z<(0-μ_D)/(σ_D))",
      "when": "Y is strength and X is stress. Failure is the event that their difference is negative. The handbook treats the two as independent normals.",
      "caution": "The standard deviation of the difference adds the variances, not the standard deviations.",
      "aliases": [
        "Normal stress-strength interference",
        "CRE-SSN",
        "stress-strength",
        "stress strength"
      ]
    },
    {
      "id": "CRE-SSEX",
      "section": "V. Lifecycle Reliability",
      "name": "Exponential stress-strength reliability",
      "formula": "Pr(D>0)=(β_Y)/(β_X+β_Y)",
      "when": "For independent exponential stress and strength, reliability is the strength mean divided by the sum of the two means.",
      "caution": "Failure probability is the stress mean over that same sum, and that equals one minus this reliability. Do not subtract the strength mean itself.",
      "aliases": [
        "Exponential stress-strength reliability",
        "CRE-SSEX",
        "Exponential stress-strength",
        "stress-strength",
        "stress strength"
      ]
    },
    {
      "id": "CRE-SSLN",
      "section": "V. Lifecycle Reliability",
      "name": "Lognormal stress-strength reliability",
      "formula": "m_X =e^(μ_X), m_Y=e^(μ_Y)\nPr(D>0) =Pr(Z<(ln(m_Y/m_X))/(√(s_X²+s_Y²)))",
      "when": "m is the median, e to the mu. s is the standard deviation on the log scale.",
      "caution": "Using the ordinary means of X and Y in the log ratio does not match this formula.",
      "aliases": [
        "Lognormal stress-strength reliability",
        "CRE-SSLN",
        "Lognormal stress-strength",
        "stress-strength",
        "stress strength"
      ]
    },
    {
      "id": "CRE-SN",
      "section": "V. Lifecycle Reliability",
      "name": "Taguchi signal-to-noise ratios",
      "formula": "larger is better: S/Nᵢ=-10log((1)/(nⱼ)Σ_(j=1)^(nⱼ)(1)/(y_ij²))\nsmaller is better: S/Nᵢ=-10log((1)/(nⱼ)Σ_(j=1)^(nⱼ) y_ij²)\nnominal is best: S/Nᵢ=10log((ȳᵢ²)/(sᵢ²))",
      "when": "Pick the form from the direction of the response. The nominal form uses the square of the mean over the variance.",
      "caution": "The larger-is-better sum is of reciprocal squares. Using the raw squares is the smaller-is-better ratio.",
      "aliases": [
        "Taguchi signal-to-noise ratios",
        "CRE-SN",
        "Taguchi signal-to-noise",
        "taguchi",
        "signal-to-noise",
        "signal to noise"
      ]
    },
    {
      "id": "CRE-ANO",
      "section": "V. Lifecycle Reliability",
      "name": "ANOVA error sum of squares",
      "formula": "SS_E =SS_T-SS_Treatments\nSS_E =SS_T-SS_A-SS_B-SS_AB",
      "when": "The first line is the one-factor design. The second is the two-factor design with interaction. Degrees of freedom subtract in the same pattern.",
      "caution": "A block design also subtracts the block sum of squares. Leaving a term out inflates the error.",
      "aliases": [
        "ANOVA error sum of squares",
        "CRE-ANO",
        "anova",
        "sum of squares"
      ]
    },
    {
      "id": "CRE-LAM",
      "section": "V. Lifecycle Reliability",
      "name": "Sum of constant element failure rates",
      "formula": "λ=Σ_(i=1)^nλᵢ",
      "when": "When every element must work, the constant system rate is the sum of the element rates.",
      "caution": "Equation 10.1 multiplies reliabilities. Do not multiply the rates.",
      "aliases": [
        "Sum of constant element failure rates",
        "CRE-LAM",
        "failure rate"
      ]
    },
    {
      "id": "CRE-ALLOC",
      "section": "V. Lifecycle Reliability",
      "name": "Allocated repair time",
      "formula": "tᵢ^(*)=(tᵢ)/(t) t^(*)",
      "when": "The current repair time of element i is scaled by the ratio of the target system repair time t-star to the current system repair time t.",
      "caution": "Equation 13.6 builds the system repair time. This display allocates a new target back to the elements.",
      "aliases": [
        "Allocated repair time",
        "CRE-ALLOC",
        "allocation",
        "apportionment"
      ]
    },
    {
      "id": "CRE-SPR",
      "section": "V. Lifecycle Reliability",
      "name": "Poisson demand for spare parts",
      "formula": "Pr(r)=Σ_(n=0)^r((λ t)^n e^(-λ t))/(n!)",
      "when": "The mean number of demands in time t is lambda t. The sum is the probability of r or fewer demands.",
      "caution": "Lambda alone is not the Poisson mean unless the window length is 1.",
      "aliases": [
        "Poisson demand for spare parts",
        "CRE-SPR",
        "spare",
        "spares"
      ]
    },
    {
      "id": "CRE-CRO",
      "section": "V. Lifecycle Reliability",
      "name": "Croston forecast for intermittent spares",
      "formula": "Z_(t+1) =α Xₜ+(1-α)Zₜ\nP_(t+1) =β Gₜ+(1-β)Pₜ\nR_(t+1) =(Z_(t+1))/(P_(t+1))",
      "when": "When demand is positive, smooth the size Z and the gap P, then divide those updated values. If the latest demand is zero, the handbook leaves Z, P, and the forecast unchanged. Example 13.8 uses alpha 0.2 and beta 0.3. After a demand of 16 with a gap of 2, the next size is 21.60 and the next gap is 1.30, and 21.60 divided by 1.30 is 16.62.",
      "caution": "The printed forecast line writes Z sub t over P sub t. The example header and the week-4 result divide the values just updated. Equation 13.9 smooths every period. Croston waits for a nonzero demand.",
      "aliases": [
        "Croston forecast for intermittent spares",
        "CRE-CRO",
        "croston",
        "intermittent"
      ]
    },
    {
      "id": "CRE-HUM",
      "section": "V. Lifecycle Reliability",
      "name": "Human performance reliability",
      "formula": "Rₑ(t)=exp[-∫₀^t hₑ(t) dt]",
      "when": "h sub e is the human error rate. Reliability follows the same identity as the cumulative hazard.",
      "caution": "The handbook display writes this exponential without the minus. Cumulative hazard earlier in the book is the integral of the hazard, and reliability is e to that integral with a minus. The printed plus sign would make reliability greater than 1.",
      "aliases": [
        "Human performance reliability",
        "CRE-HUM",
        "Human performance",
        "human reliability",
        "human error"
      ]
    }
  ]
};
  var LESSON = '/lessons/quality-engineering/cre-formula-encyclopedia';
  var SUB = {
    'cre-lead': 'cre-fundamentals',
    'cre-fundamentals': 'cre-fundamentals',
    'cre-risk': 'cre-risk',
    'cre-stats': 'cre-statistics',
    'cre-statistics': 'cre-statistics',
    'cre-model': 'cre-testing',
    'cre-testing': 'cre-testing',
    'cre-life': 'cre-lifecycle',
    'cre-lifecycle': 'cre-lifecycle'
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      .replace(/"/g, '"').replace(/'/g, '&#39;');
  }

  function fold(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/[‐‑‒–—−-]/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sectionByKey(key) {
    for (var i = 0; i < SOURCE.sections.length; i += 1) {
      if (SOURCE.sections[i].key === key) return SOURCE.sections[i];
    }
    return null;
  }

  function sectionById(id) {
    for (var i = 0; i < SOURCE.sections.length; i += 1) {
      if (SOURCE.sections[i].id === id) return SOURCE.sections[i];
    }
    return SOURCE.sections[0];
  }

  function sectionOf(item) {
    return sectionByKey(item.section) || SOURCE.sections[0];
  }

  function questionSection(question) {
    if (!question) return null;
    if (SUB[question.sub]) return sectionById(SUB[question.sub]);
    var bok = String(question.bok || '');
    if (/^V\./.test(bok)) return sectionById('cre-lifecycle');
    if (/^IV\./.test(bok)) return sectionById('cre-testing');
    if (/^III\./.test(bok)) return sectionById('cre-statistics');
    if (/^II\./.test(bok)) return sectionById('cre-risk');
    if (/^I\./.test(bok)) return sectionById('cre-fundamentals');
    return null;
  }

  function aliasHit(stem, alias) {
    var folded = fold(alias);
    if (!folded) return 0;
    var haystack = ' ' + fold(stem) + ' ';
    return haystack.indexOf(' ' + folded + ' ') >= 0 ? folded.length : 0;
  }

  function bestAlias(item, stem) {
    var best = 0;
    (item.aliases || []).forEach(function (alias) {
      best = Math.max(best, aliasHit(stem, alias));
    });
    return best;
  }

  function recommend(stem, section) {
    var ranked = SOURCE.formulas.map(function (item) {
      return { item: item, score: bestAlias(item, stem), here: section && sectionOf(item).id === section.id };
    }).filter(function (row) { return row.score > 0; });
    ranked.sort(function (a, b) {
      if (a.here !== b.here) return a.here ? -1 : 1;
      return b.score - a.score;
    });
    var best = ranked.reduce(function (max, row) { return Math.max(max, row.score); }, 0);
    return ranked.filter(function (row) {
      return row.here || row.score >= best - 3;
    }).slice(0, 4).map(function (row) { return row.item; });
  }

  function searchText(item) {
    return fold([item.name, item.formula, item.when, item.caution, (item.aliases || []).join(' ')].join(' '));
  }

  function lessonHref(id) {
    return LESSON + '#formula=' + encodeURIComponent(id);
  }

  function formulaHtml(item, current) {
    return '<article class="tb-refitem tb-fcard' + (current ? ' is-current' : '') + '" data-formula-id="' + esc(item.id) + '">' +
      '<div class="tb-fhead"><div class="tb-refn">' + esc(item.name) + '</div>' +
      (current ? '<span class="tb-fbadge">Current question</span>' : '') + '</div>' +
      '<div class="tb-reff">' + esc(item.formula).replace(/\n/g, '<br>') + '</div>' +
      '<div class="tb-refnote2"><strong>Use when:</strong> ' + esc(item.when) + '</div>' +
      (item.caution ? '<div class="tb-fcaution"><strong>Watch for:</strong> ' + esc(item.caution) + '</div>' : '') +
      '<div class="tb-fqmap"><a href="' + esc(lessonHref(item.id)) + '" target="_blank" rel="noopener">Open in the Reliability Formula Encyclopedia</a></div>' +
      '</article>';
  }

  function riskNote() {
    return '<div class="tb-fconcept"><strong>No handbook equation in Risk Management.</strong>' +
      '<span>Chapters 3, 4, and 5 describe hazard analysis, FMEA, fault trees, and control selection. This edition does not assign equation numbers there, so this sheet does not invent any. Search the box to look across the other four sections.</span>' +
      '<a href="' + esc(LESSON) + '#section-ii" target="_blank" rel="noopener">Open the Risk Management note in the encyclopedia</a></div>';
  }

  function refsGroups() {
    return SOURCE.sections.map(function (section) {
      var items = SOURCE.formulas.filter(function (item) { return item.section === section.key; }).map(function (item) {
        return { n: item.name, f: item.formula.replace(/\n/g, ' | '), note: item.when + (item.caution ? ' Watch for: ' + item.caution : '') };
      });
      if (!items.length) {
        items.push({
          n: 'No numbered equations',
          f: 'Chapters 3 to 5 do not assign equation numbers.',
          note: 'Risk tools in this edition are methods, not a formula sheet.'
        });
      }
      return { group: section.name, items: items };
    });
  }

  function renderContextualPane(query) {
    var host = document.getElementById('tb-reflist');
    var drawer = document.getElementById('tb-formulas');
    if (!host || !drawer || drawer.hidden) return;
    var api = window.__TB_FORMULAS_TEST__;
    var context = api && typeof api.getContext === 'function' ? api.getContext() : { question: null, sessionQuestion: null, set: null };
    var section = questionSection(context.question) || sectionById('cre-statistics');
    var stem = context.question && context.question.stem || '';
    var q = fold(query == null ? ((document.getElementById('tb-refsearch') || {}).value || '') : query);
    var html = '<div class="tb-fcontextbar"><span>' + esc(section.name) + '</span>' +
      (context.set ? '<span>Exam Set ' + esc(context.set) + '</span>' : '') +
      '<span><a href="' + esc(LESSON) + '" target="_blank" rel="noopener">Full encyclopedia</a></span></div>';

    var picked = [];
    if (!q) {
      html += '<section class="tb-refgroup tb-currentgroup"><h4>Recommended for the current question</h4>';
      if (section.id === 'cre-risk') {
        html += riskNote();
      } else {
        picked = recommend(stem, section);
        if (picked.length) {
          html += picked.map(function (item) { return formulaHtml(item, true); }).join('');
        } else {
          html += '<div class="tb-fconcept"><strong>Question ' + esc(context.sessionQuestion || '') + ' did not name a formula.</strong>' +
            '<span>No sheet entry matched the question wording. The section list below does not reveal the answer.</span></div>';
        }
      }
      html += '</section>';
    }

    if (!q && section.id === 'cre-risk') {
      host.innerHTML = html;
      return;
    }

    var pool = q ? SOURCE.formulas : SOURCE.formulas.filter(function (item) { return sectionOf(item).id === section.id; });
    var groups = {};
    pool.forEach(function (item) {
      if (!q && picked.some(function (chosen) { return chosen.id === item.id; })) return;
      if (q && searchText(item).indexOf(q) < 0) return;
      var name = sectionOf(item).name;
      groups[name] = groups[name] || [];
      groups[name].push(item);
    });
    var names = SOURCE.sections.map(function (item) { return item.name; }).filter(function (name) { return groups[name] && groups[name].length; });
    if (!names.length) {
      html += '<p class="tb-refempty">No formula matches “' + esc(query || '') + '”.</p>';
    } else {
      names.forEach(function (name) {
        html += '<section class="tb-refgroup"><h4>' + esc(q ? name : (section.id === 'cre-risk' ? name : 'Formulas for ' + name)) + '</h4>';
        if (name.indexOf('II.') === 0 && !SOURCE.formulas.some(function (item) { return sectionOf(item).name === name; })) {
          html += riskNote();
        }
        html += groups[name].map(function (item) { return formulaHtml(item, false); }).join('');
        html += '</section>';
      });
    }
    host.innerHTML = html;
  }

  function installRefs() {
    var tb = window.__TB;
    if (!tb || !tb.REFS) return false;
    tb.REFS.cre = refsGroups();
    return true;
  }

  var installed = false;
  function initialize(attempt) {
    attempt = attempt || 0;
    if (installed) return;
    if (!window.__TB) {
      if (attempt < 400) window.setTimeout(function () { initialize(attempt + 1); }, 25);
      return;
    }
    installed = true;
    installRefs();
  }

  window.__TB_CRE_FORMULAS = {
    lesson: LESSON,
    formulas: SOURCE.formulas,
    sections: SOURCE.sections,
    recommend: recommend,
    questionSection: questionSection,
    renderContextualPane: renderContextualPane,
    installRefs: installRefs
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initialize(0); }, { once: true });
  else initialize(0);
}());
