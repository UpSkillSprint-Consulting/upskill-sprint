/**
 * Excel Coach Phase 10 – Final academic closure
 * Builds on Phases 1–9.
 *
 * Adds:
 * - Clearer controlled-review outcome interpretation ready for real learner data
 * - Explicit guidance on how to confirm the “faster / better formulas” claim
 *
 * Fully offline. Enhancement hook remains optional.
 */
(function (global) {
  "use strict";

  const CoachEngine = {};

  // ─── Lightweight formula parser ────────────────────────────────
  function tokenize(formula) {
    const f = String(formula || "").trim();
    if (!f.startsWith("=")) return { error: "Formula must start with =" };
    const body = f.slice(1);
    const tokens = [];
    // Skip quoted strings so paren and != checks do not fire inside text
    const re = /("[^"]*"|'[^']*'|[A-Za-z_][A-Za-z0-9_.]*\s*\(|\$?[A-Za-z]{1,3}\$?\d+|\$?[A-Za-z]{1,3}:\$?[A-Za-z]{1,3}|[A-Za-z_][A-Za-z0-9_]*\[@?[A-Za-z0-9_ ]*\]|#|[\(\)\+\-\*\/\^&=<>!,;]|[0-9.]+)/g;
    let m;
    while ((m = re.exec(body)) !== null) {
      const t = m[1].trim();
      if (t.startsWith('"') || t.startsWith("'")) continue; // ignore quoted text
      tokens.push(t);
    }
    return { tokens, raw: f };
  }

  function extractFunctions(tokens) {
    return tokens.filter(t => t.endsWith("(")).map(t => t.slice(0, -1).toUpperCase());
  }

  function hasStructuredRef(tokens) {
    return tokens.some(t => /\[.*\]/.test(t));
  }

  function parenBalance(formula) {
    const open = (formula.match(/\(/g) || []).length;
    const close = (formula.match(/\)/g) || []).length;
    return open - close;
  }

  // ─── Course-specific examples ──────────────────────────────
  const examples = {
    filterMedian: "For example, median tap time for a given week: =MEDIAN(FILTER(E2:E28, D2:D28=M2)). Median is more robust than the mean for skewed tap times.",
    xlookup: "For example, look up a heat result: =XLOOKUP(M2, C2:C28, H2:H28, \"Not found\")",
    multi: "For example, filter by week and status: =FILTER(E2:E28, (D2:D28=M2)*(H2:H28=\"FAIL\"))",
    spc: "SPC note: a fail/hold rate is a p-chart proportion; a P90 delay is PERCENTILE.INC(...,0.9); a weighted mean uses SUMPRODUCT."
  };

  function naturalize(text) {
    if (!text) return text;
    return text
      .replace(/the production values \(e\.g\. Tap Time\)/g, "the production values such as Tap Time")
      .replace(/the filter condition \(e\.g\. WeekNum or Heat ID\)/g, "the filter condition such as WeekNum or Heat ID")
      .replace(/FILTER on the production table/g, "FILTER on the ProductionData table");
  }

  // ─── Pattern library ───────────────────────────────────
  const patterns = {
    filterAggregate: {
      detect: (fns) => fns.includes("FILTER") && (fns.includes("MEDIAN") || fns.includes("AVERAGE") || fns.includes("SUM") || fns.includes("COUNT")),
      name: "FILTER + aggregate",
      hints: [
        "Name the three parts: the production values such as Tap Time, the condition that selects rows such as WeekNum, and the final calculation.",
        "Build and test the FILTER on ProductionData by itself first. Confirm it returns the expected rows before wrapping it.",
        "Wrap the FILTER result with the aggregate (MEDIAN, AVERAGE, etc.). Handle the case when FILTER returns nothing."
      ]
    },
    xlookup: {
      detect: (fns) => fns.includes("XLOOKUP"),
      name: "XLOOKUP",
      hints: [
        "Confirm the lookup value, lookup array, and return array have matching dimensions on the production table.",
        "Add a fallback (the 4th argument) so missing Heat IDs return a clear message instead of #N/A.",
        "Use structured references so the lookup stays correct when new production rows are added."
      ]
    },
    multiCriteria: {
      detect: (tokens) => tokens.some(t => t === "*" || t === "+") && tokens.some(t => /FILTER|XLOOKUP|SUMIFS/.test(t)),
      name: "Multi-criteria (AND with *, OR with +)",
      hints: [
        "Each condition must return a Boolean array of the same length. Multiply (*) for AND, add (+) for OR.",
        "Test each Boolean condition alone before combining them.",
        "Watch for text vs number mismatches in the criteria (common with WeekNum or Result)."
      ]
    },
    let: {
      detect: (fns) => fns.includes("LET"),
      name: "LET named calculation",
      hints: [
        "List the names and values first, then the final expression that uses those names.",
        "Name intermediate results so the formula reads like a short process method.",
        "Confirm each named piece works by evaluating it alone."
      ]
    },
    dynamicArray: {
      detect: (fns) => fns.some(f => ["FILTER","SORT","UNIQUE","TAKE","CHOOSECOLS","GROUPBY","PIVOTBY"].includes(f)),
      name: "Dynamic array",
      hints: [
        "Dynamic arrays spill. Make sure there is space for the result and reference the spill with # when needed.",
        "Prefer Excel Tables + structured references so the production source grows automatically.",
        "Test the spilling function alone before nesting it."
      ]
    }
  };

  function detectPattern(tokens) {
    if (!tokens || !tokens.length) return null;
    const fns = extractFunctions(tokens);
    for (const key of Object.keys(patterns)) {
      try {
        if (patterns[key].detect(fns, tokens)) return { key, ...patterns[key] };
      } catch (e) { /* ignore pattern errors */ }
    }
    return null;
  }

  // ─── Deeper structure comparison ─────────────────────────────
  function norm(s) { return String(s || "").replace(/\s+/g, "").toUpperCase(); }
  function compareToChallenge(formula, challenge) {
    if (!challenge || !challenge.f) return null;
    const accepted = [challenge.f, ...(challenge.a || challenge.accepted || [])].map(norm);
    const learnerNorm = norm(formula);
    if (accepted.includes(learnerNorm)) return null; // never flag an accepted answer

    const learnerTokens = tokenize(formula).tokens || [];
    const expectedTokens = tokenize(challenge.f).tokens || [];
    const learnerFns = extractFunctions(learnerTokens);
    const expectedFns = extractFunctions(expectedTokens);

    const notes = [];

    const missingFns = expectedFns.filter(f => f && !learnerFns.includes(f));
    const extraFns = learnerFns.filter(f => f && !expectedFns.includes(f));
    if (missingFns.length) notes.push(`The target uses ${missingFns.join(", ")}; your formula does not. If this is an accepted equivalent, it still works.`);
    if (extraFns.length) notes.push(`The target does not use ${extraFns.join(", ")}; your formula does. If this is an accepted equivalent, it still works.`);

    if (challenge.f.includes("FILTER") && learnerFns.includes("FILTER")) {
      const expectedHasWeek = /WeekNum/i.test(challenge.f);
      const learnerHasWeek = /WeekNum/i.test(formula);
      if (expectedHasWeek && !learnerHasWeek) {
        notes.push("The target FILTER selects rows by WeekNum. Your FILTER is missing the WeekNum criterion.");
      }
      const expectedHasHeat = /Heat ID/i.test(challenge.f);
      const learnerHasHeat = /Heat ID/i.test(formula);
      if (expectedHasHeat && !learnerHasHeat) {
        notes.push("The target uses Heat ID in the lookup or filter. Your formula does not.");
      }
    }

    if (challenge.f.includes("MEDIAN") && !learnerFns.includes("MEDIAN")) {
      notes.push("The target aggregates with MEDIAN (typical for tap-time stability). Your formula does not.");
    }

    if (learnerFns.includes("XLOOKUP") && challenge.f.includes("XLOOKUP")) {
      function topLevelArgs(s, fn) {
        const re = new RegExp(fn + "\\s*\\(", "i");
        const m = re.exec(s);
        if (!m) return 0;
        let depth = 1, args = 1, i = m.index + m[0].length;
        while (i < s.length && depth > 0) {
          if (s[i] === "(") depth++;
          else if (s[i] === ")") depth--;
          else if (s[i] === "," && depth === 1) args++;
          i++;
        }
        return args;
      }
      const expectedArgs = topLevelArgs(challenge.f, "XLOOKUP");
      const learnerArgs = topLevelArgs(formula, "XLOOKUP");
      if (expectedArgs >= 4 && learnerArgs < 4) {
        notes.push({ level: "warn", msg: "The target XLOOKUP includes a fallback for missing values. Your XLOOKUP does not." });
      }
    }

    if (/\[.*\]/.test(challenge.f) && !/\[.*\]/.test(formula)) {
      notes.push("The target uses structured references (e.g. ProductionData[Tap Time]). Your formula does not.");
    }

    return notes.length ? notes : null;
  }

  // ─── Diagnostic engine ────────────────────────────────
  function diagnose(formula, challenge) {
    const findings = [];
    const f = String(formula || "").trim();
    if (!f) {
      findings.push({ level: "info", msg: "Paste the formula so I can inspect it." });
      return findings;
    }
    const stripped = f.replace(/"[^"]*"|'[^']*'/g, "");
    if (!f.startsWith("=") && !f.startsWith("+")) findings.push({ level: "error", msg: "Formula must start with =." });
    const bal = parenBalance(stripped);
    if (bal !== 0) findings.push({ level: "error", msg: `Parentheses unbalanced (${bal > 0 ? "missing closing" : "extra closing"}).` });
    if ((f.match(/"/g) || []).length % 2) findings.push({ level: "error", msg: "Unpaired double quote." });
    if (/!=/.test(stripped)) findings.push({ level: "error", msg: "Use <> for not-equal, not !=." });
    if (/#REF!/i.test(f)) findings.push({ level: "error", msg: "#REF! — a referenced cell or range no longer exists." });
    if (/#SPILL!/i.test(f)) findings.push({ level: "error", msg: "#SPILL! — the dynamic array result is blocked. Clear the cells below or to the right." });
    if (/#VALUE!/i.test(f)) findings.push({ level: "error", msg: "#VALUE! — usually a text/number mismatch or an invalid operation." });
    if (/#N\/A/i.test(f)) findings.push({ level: "error", msg: "#N/A — lookup value not found. Add a fallback argument if using XLOOKUP." });
    if (/#DIV\/0!/i.test(f)) findings.push({ level: "error", msg: "#DIV/0! — division by zero. Check the denominator." });
    if (/\/\s*0(?![\d.])/.test(stripped)) findings.push({ level: "error", msg: "#DIV/0! — division by zero. Check the denominator." });
    if (/#NAME\?/i.test(f)) findings.push({ level: "error", msg: "#NAME? — unrecognised function or named range." });
    if (/\$?[A-Z]{1,3}:\$?[A-Z]{1,3}/i.test(f) && /FILTER|SUMPRODUCT|XLOOKUP|MATCH|SUMIFS/i.test(f)) {
      findings.push({ level: "warn", msg: "Whole-column reference detected. Prefer a Table or limited range for performance and clarity." });
    }
    const parsed = tokenize(f);
    if (parsed.tokens) {
      const pattern = detectPattern(parsed.tokens);
      if (pattern) findings.push({ level: "info", msg: `Detected pattern: ${pattern.name}.` });
      if (hasStructuredRef(parsed.tokens)) findings.push({ level: "good", msg: "Uses structured references (good for maintainability)." });
    }

    const structureNotes = compareToChallenge(f, challenge);
    if (structureNotes) {
      structureNotes.forEach(n => findings.push(typeof n === "string" ? { level: "info", msg: n } : n));
    }

    // Lesson-taught mistakes — each returns an error/warn plus a specific next step
    // Unquoted text in IF / COUNTIF / SUMIF criteria (bare words, not cell refs, not LET names)
    if (/(?:IF|COUNTIF|SUMIF)\s*\([^)]*,\s*[A-Z][A-Z_]*\s*(?:,|\))/i.test(f) && !/COUNTIFS|SUMIFS/i.test(f)) {
      const bare = f.match(/(?:IF|COUNTIF|SUMIF)\s*\([^)]*,\s*([A-Z][A-Z_]*)/i);
      if (bare && !/[A-Z]+\d+/.test(bare[1])) {
        findings.push({ level: "error", msg: "Unquoted text (such as REVIEW, FAIL or OK) is treated as a name and returns #NAME?. Wrap it in double quotes. Next: change the bare word to a quoted string." });
      }
    }
    // + used to join text
    if (/\+"[^"]*"\+|\+\s*"[^"]*"/.test(f) && !/&/.test(f)) {
      findings.push({ level: "error", msg: "Use & to join text, not +. Next: rewrite as C2&\" - \"&H2." });
    }
    // AVERAGE of two cells instead of a range
    if (/AVERAGE\s*\(\s*\$?[A-Z]+\d+\s*,\s*\$?[A-Z]+\d+\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "AVERAGE of two separate cells averages only those two. Next: use a continuous range such as E2:E6." });
    }
    // Missing full absolute lock when challenge expects $M$2
    if (challenge && /\$M\$2/.test(challenge.f || "") && /=\s*E2\/(?:\$?M2|M\$2|\$M2)(?!\$)/i.test(f)) {
      findings.push({ level: "warn", msg: "The target locks both column and row ($M$2). Next: change the denominator to $M$2." });
    }
    // Missing mixed lock when challenge expects C$2
    if (challenge && /C\$2/.test(challenge.f || "") && /=\s*B4\*(?:C2|\$C\$2|\$C2)(?!\$)/i.test(f)) {
      findings.push({ level: "warn", msg: "The target uses a mixed reference (C$2) so the row stays fixed. Next: change the rate to C$2." });
    }
    // Sheet name with space but no apostrophes
    if (/[A-Za-z]+ [A-Za-z]+!/.test(f) && !/'[^']+'!/.test(f)) {
      findings.push({ level: "error", msg: "Sheet names with spaces need apostrophes. Next: use 'Production Data'!E2." });
    }
    // COUNTIF with a partial code that likely needs wildcards
    if (/COUNTIF\s*\([^,]+,\s*"A00"\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "COUNTIF with \"A00\" matches only that exact text. Next: use a wildcard such as \"A00*\" if you need codes that start with A00." });
    }
    // IFERROR missing the second argument
    if (/IFERROR\s*\([^,)]+\)/i.test(f)) {
      findings.push({ level: "error", msg: "IFERROR needs a value_if_error. Next: add a second argument, such as IFERROR(F2/E2,0)." });
    }
    // ROUND missing num_digits (only when the ROUND call itself has one argument)
    if (/ROUND\s*\(/i.test(f)) {
      const m = /ROUND\s*\(/i.exec(f);
      if (m) {
        let depth = 1, args = 1, i = m.index + m[0].length;
        while (i < f.length && depth > 0) {
          if (f[i] === "(") depth++;
          else if (f[i] === ")") depth--;
          else if (f[i] === "," && depth === 1) args++;
          i++;
        }
        if (args < 2) findings.push({ level: "error", msg: "ROUND needs num_digits. Next: add a second argument, such as ROUND(AVERAGE(E2:E6),1)." });
      }
    }
    // XLOOKUP range size mismatch (different row counts)
    const xl = f.match(/XLOOKUP\s*\([^,]+,\s*([A-Z]+\d+):([A-Z]+)(\d+)\s*,\s*([A-Z]+\d+):([A-Z]+)(\d+)/i);
    if (xl && xl[3] !== xl[6]) {
      findings.push({ level: "error", msg: "XLOOKUP lookup and return ranges have different heights. Next: make both ranges the same size (for example C2:C28 and E2:E28)." });
    }
    // XLOOKUP missing search_mode -1 when the target uses it
    if (challenge && /-1\s*\)/.test(challenge.f || "") && /XLOOKUP/i.test(f) && !/,-1\s*\)/.test(f) && !/,\s*-1\s*\)/.test(f)) {
      findings.push({ level: "warn", msg: "The target searches last-to-first. Next: add search_mode -1 as the final argument." });
    }
    // SUMIFS with arguments in the wrong order (criteria before sum range)
    if (/SUMIFS\s*\(\s*[A-Z]+\d+:[A-Z]+\d+\s*,\s*[A-Z]+\d+\s*,/i.test(f) && !/SUMIFS\s*\(\s*[A-Z]+\d+:[A-Z]+\d+\s*,\s*[A-Z]+\d+:[A-Z]+\d+/i.test(f)) {
      findings.push({ level: "error", msg: "SUMIFS expects the sum range first, then criteria ranges and criteria. Next: put the sum range (for example G2:G28) first." });
    }
    // COUNTA on a single cell when a spill is expected
    if (/COUNTA\s*\(\s*[A-Z]+\d+\s*\)/i.test(f) && challenge && /#/.test(challenge.f || "")) {
      findings.push({ level: "warn", msg: "COUNTA on a single cell counts only that cell. Next: use the spill reference, such as D2#." });
    }
    // GROUPBY / PIVOTBY with a quoted function name
    if (/(?:GROUPBY|PIVOTBY)\s*\([^)]*"[A-Z]+"/i.test(f)) {
      findings.push({ level: "error", msg: "GROUPBY and PIVOTBY take a bare function, not a quoted name. Next: use AVERAGE, not \"AVERAGE\"." });
    }
    if (/FILTER/i.test(f) && /\bAND\s*\(|\bOR\s*\(/i.test(f)) {
      findings.push({ level: "warn", msg: "AND() and OR() inside FILTER usually return a single value. Next: use * for AND and + for OR between conditions." });
    }
    if (/>=M2|<=M2|>M2|<M2/.test(f) && !/"[^"]*"\s*&/.test(f)) {
      findings.push({ level: "error", msg: "Comparison criteria need quotes joined to the cell. Next: use \">=\"&M2, not >=M2." });
    }
    if (/VLOOKUP/i.test(f) && /,\s*TRUE\s*[,)]/i.test(f)) {
      findings.push({ level: "warn", msg: "VLOOKUP with TRUE uses approximate match. Next: use FALSE or 0, or switch to XLOOKUP, unless the data is sorted." });
    }
    if (/#\s*$/.test(f) || /#\s*[,)]/.test(f)) {
      findings.push({ level: "info", msg: "A trailing # marks a spill reference. Confirm the spill is intentional." });
    }
    if (/PERCENTILE\.INC\s*\([^,]+,\s*90\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "PERCENTILE.INC expects a fraction between 0 and 1. Next: use 0.9, not 90." });
    }
    if (/IFERROR/i.test(f) && !/IFERROR\s*\([^,)]+\)/i.test(f)) {
      findings.push({ level: "info", msg: "IFERROR hides every error, including #REF! and #NAME?. Prefer a more specific test when you can." });
    }

    if (!findings.length && f.startsWith("=")) {
      findings.push({ level: "info", msg: "Detected a simple expression. No obvious syntax issues." });
    }

    return findings;
  }

  function specificNextAction(findings) {
    const structure = findings.find(f => f.msg && /WeekNum|Heat ID|Missing expected function|fallback|structured references/.test(f.msg));
    if (structure) {
      return `Next: address the structure note above (“${structure.msg.split(".")[0]}”) before rebuilding the full formula.`;
    }
    return "Next: evaluate the innermost function or Boolean test alone before rebuilding the full formula.";
  }

  // ─── Progressive-hint ladder ─────────────────────────────────────
  function progressiveHint(formula, level, challenge) {
    const ch = challenge || {};
    const prompt = ch.p || ch.prompt || "";
    const hint = ch.h || ch.hint || "";
    const lvl = (ch.l || ch.level || "").toLowerCase();
    const tone = lvl === "beginner" ? "Start simply. " : lvl === "advanced" ? "Think about the stages. " : "";
    const safeHint = hint.replace(/=.*/g, "").trim(); // never include a formula
    if (level === 0) {
      return tone + (prompt ? `Focus: ${prompt}` : "Name the single result this formula should return.") + (safeHint ? `\n\nHint: ${safeHint}` : "");
    }
    if (level === 1) {
      return tone + (safeHint || "Identify the inputs and the condition, then test the smallest inner expression.");
    }
    return tone + "Build and test one stage at a time. Use the Reveal button if you need the full formula.";
  }

  function ensureHintState(state) {
    if (!state) return { phase3: { coach: { hintLevels: {} } } };
    if (!state.phase3) state.phase3 = { coach: { hintLevels: {} } };
    if (!state.phase3.coach) state.phase3.coach = { hintLevels: {} };
    if (!state.phase3.coach.hintLevels) state.phase3.coach.hintLevels = {};
    return state;
  }

  // ─── Instrumentation + structured review ──────────────────────
  function logInteraction(meta) {
    try {
      const key = "excelCoachInteractions";
      const log = JSON.parse(localStorage.getItem(key) || "[]");
      const ch = meta.challenge || {};
      const id = ch.name || ch.n || (ch.prompt || ch.p || "").slice(0, 40) || null;
      log.push({
        t: Date.now(),
        mode: meta.mode || "default",
        hasFormula: !!meta.formula,
        formulaLen: meta.formula ? meta.formula.length : 0,
        challengeId: id,
        revealed: !!(meta.mode === "hint" && /final solution|reveal|show (me )?the (final )?answer/.test(meta.message || "")),
        coachOn: meta.coachOn !== false,
        attempts: meta.attempts || null,
        hintsUsed: meta.hintsUsed || null,
        timeToFirstCorrect: meta.timeToFirstCorrect || null
      });
      if (log.length > 200) log.shift();
      localStorage.setItem(key, JSON.stringify(log));
    } catch (e) { /* ignore storage errors */ }
  }

  CoachEngine.getInteractionLog = function () {
    try {
      return JSON.parse(localStorage.getItem("excelCoachInteractions") || "[]");
    } catch (e) { return []; }
  };

  CoachEngine.getInteractionSummary = function () {
    const log = CoachEngine.getInteractionLog();
    if (!log.length) return "No coach interactions recorded yet.";
    const total = log.length;
    const withFormula = log.filter(e => e.hasFormula).length;
    const reveals = log.filter(e => e.revealed).length;
    const avgLen = Math.round(log.filter(e => e.formulaLen).reduce((s, e) => s + e.formulaLen, 0) / (withFormula || 1));
    return `Coach interactions: ${total} total, ${withFormula} with a formula (avg length ${avgLen}), ${reveals} full reveals.`;
  };

  CoachEngine.getControlledReview = function () {
    let challengeLog = [];
    try { challengeLog = JSON.parse(localStorage.getItem("excelCoachChallengeLog") || "[]"); } catch (e) {}
    const log = CoachEngine.getInteractionLog();
    function median(arr) {
      if (!arr.length) return null;
      const s = arr.slice().sort((a, b) => a - b);
      const mid = Math.floor(s.length / 2);
      return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
    }
    function firstTry(arr) { return arr.length ? Math.round(arr.filter(e => e.correct && e.attempts === 1).length / arr.length * 100) : null; }
    function medTime(arr) {
      const times = arr.filter(e => e.tFirstCorrect && e.tStart).map(e => e.tFirstCorrect - e.tStart);
      return median(times);
    }
    const on = challengeLog.filter(e => e.coachOn);
    const off = challengeLog.filter(e => !e.coachOn);
    const cohortLines = [
      "",
      "Cohort comparison (needs real learner data):",
      `- Coach on: n=${on.length}, first-try correct ${firstTry(on) ?? "n/a"}%, median time-to-first-correct ${medTime(on) ?? "n/a"} ms`,
      `- Coach off: n=${off.length}, first-try correct ${firstTry(off) ?? "n/a"}%, median time-to-first-correct ${medTime(off) ?? "n/a"} ms`
    ];
    if (!log.length && !challengeLog.length) {
      return [
        "Controlled review: no interactions recorded yet.",
        "",
        "To confirm the outcome in practice:",
        "1. Have a handful of real learners complete challenges using the Excel Coach.",
        "2. Ask the coach for “review” (or call ExcelCoachEngine.getControlledReview()).",
        "3. Look for a positive signal (high formula-paste rate, low reveal rate, non-trivial formula length).",
        ...cohortLines
      ].join("\n");
    }
    if (!log.length) {
      return ["Controlled review (challenge log only):", ...cohortLines, "", "This report needs real learner data before any conclusion about the coach."].join("\n");
    }
    const total = log.length;
    const withFormula = log.filter(e => e.hasFormula).length;
    const reveals = log.filter(e => e.revealed).length;
    const formulaRate = Math.round((withFormula / total) * 100);
    const revealRate = Math.round((reveals / total) * 100);
    const avgLen = Math.round(log.filter(e => e.formulaLen).reduce((s, e) => s + e.formulaLen, 0) / (withFormula || 1));

    let outcome = "";
    if (formulaRate >= 60 && revealRate <= 20 && avgLen >= 40) {
      outcome = "Positive signal: high formula-paste rate, low reveal rate, and non-trivial formula length. This is consistent with learners engaging with the formulas; it does not by itself prove faster completion.";
    } else if (revealRate > 30) {
      outcome = "Caution: high reveal rate suggests some learners are still relying on the final answer. Progressive hints may need tightening.";
    } else {
      outcome = "Inconclusive with current sample size. More learner interactions are needed to confirm the outcome.";
    }

    return [
      "Controlled review (from real interaction log):",
      `- Sample size: ${total} interactions`,
      `- Formula paste rate: ${formulaRate}%`,
      `- Full-reveal rate: ${revealRate}%`,
      `- Average formula length: ${avgLen} characters`,
      "",
      outcome,
      ...cohortLines,
      "",
      "This report needs real learner data before any conclusion about the coach."
    ].join("\n");
  };

  // ─── Optional enhancement layer ───────────────────────────────────
  // Optional external enhancer. Set to an async function(reply, meta) to enrich offline replies. Leave null for pure local mode.
  CoachEngine.enhance = null;

  async function maybeEnhance(reply, meta) {
    if (typeof CoachEngine.enhance === "function") {
      try {
        const enriched = await CoachEngine.enhance(reply, meta);
        if (enriched && typeof enriched === "string") return enriched;
      } catch (e) {
        console.warn("CoachEngine.enhance failed, using offline reply", e);
      }
    }
    return reply;
  }

  // ─── Main local response (Phase 10) ─────────────────────────────
  function normalizeChallenge(ch) {
    if (!ch || typeof ch !== "object") return {};
    return {
      prompt: ch.prompt || ch.p || "",
      name: ch.name || ch.n || "",
      level: ch.level || ch.l || "",
      accepted: ch.accepted || ch.a || [],
      formula: ch.formula || ch.f || "",
      hint: ch.hint || ch.h || "",
      why: ch.why || ch.w || "",
      f: ch.f || ch.formula || "",
      p: ch.p || ch.prompt || "",
      h: ch.h || ch.hint || "",
      w: ch.w || ch.why || "",
      a: ch.a || ch.accepted || []
    };
  }

  CoachEngine.localResponse = async function (message, mode, contextFn, challenges, state) {
    const c = typeof contextFn === "function" ? contextFn() : {};
    const m = String(message || "").trim();
    const lower = m.toLowerCase();
    const rawChallenge = (challenges && state && challenges[state.current]) || {};
    const challenge = normalizeChallenge(rawChallenge);
    const formulaMatch = m.match(/=[^\n]+/);
    const formula = (formulaMatch && formulaMatch[0]) || c.formula || "";

    if (!m) return "Ask a specific question or paste a formula and I will guide the next step.";

    let reply = "";

    // Audit
    if (/workbook audit|audit finding/.test(lower)) {
      if (!c.audit) return "No workbook audit yet. Upload a workbook in the Inspector first.";
      const top = (c.audit.issues || []).slice(0, 3);
      reply = `Latest audit: ${c.audit.score}% (${c.audit.grade}).\n${top.map((x, i) => `${i + 1}. ${x.title}: ${x.detail}`).join("\n") || "No high-priority issues."}\nStart with the first item.`;
    }
    // Next skill — only when no formula is present
    else if (/\bnext skill\b|what should i learn next/.test(lower) && !formula) {
      const r = c.skill || { name: "Formula Foundations" };
      reply = `${r.name} is the current priority in the ${c.path || "Excel Foundations"} pathway. Start with one targeted challenge and explain the reference behaviour aloud.`;
    }
    // Debug / why wrong / review+formula / next-with-formula
    else if (mode === "debug" || (/\b(debug|error|fix)\b|why\b.*\b(wrong|not)\b|#value|#spill|#n\/a/.test(lower) && mode !== "hint" && !/\biferror\b/.test(lower)) || (/\breview\b/.test(lower) && formula) || (/\bnext\b/.test(lower) && formula)) {
      const findings = diagnose(formula, challenge);
      const lines = findings.map(f => `• ${f.level === "error" ? "Problem" : f.level === "warn" ? "Check" : "Note"}: ${f.msg}`).join("\n");
      reply = `Formula diagnosis:\n${lines || "No obvious syntax issues detected."}\n\n${specificNextAction(findings)}`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
    }
    // Progressive hint
    else if (mode === "hint" || /one hint|hint|help me.*challenge|current challenge/.test(lower)) {
      const s = ensureHintState(state);
      const key = String((s && s.current) || "general");
      const level = s.phase3.coach.hintLevels[key] || 0;
      const reveal = /final solution|reveal|show (me )?the (final )?answer|full formula$|complete formula/.test(lower) && !/structure|what is the full formula structure/.test(lower);
      const confirmed = /confirm reveal|yes,? reveal|i confirm/.test(lower);
      if (reveal && !confirmed) {
        reply = "To see the full formula, use the Reveal button, or reply “confirm reveal”. This will be logged.";
      } else if (reveal && confirmed) {
        s.phase3.coach.hintLevels[key] = 99;
        reply = challenge.f
          ? `Final formula: ${challenge.f}\n\nWhy it works: ${challenge.w || "Each stage feeds the next."}`
          : "No stored final formula for this activity. I can still help you test stages.";
      } else {
        s.phase3.coach.hintLevels[key] = Math.min(level + 1, 3);
        reply = progressiveHint(formula, level, challenge);
      }
    }
    // Explain
    else if (mode === "explain" || /explain|what is|how does|understand/.test(lower)) {
      reply = `You are in the ${c.path || "Excel Foundations"} pathway focusing on ${c.skill?.name || "formulas"}.`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
      reply += `\n\nPaste a formula or name the concept and I will break it into stages with a workplace example from quality or process data.`;
    }
    // Summary / progress only — "review" with a formula is handled above
    else if (/\b(summary|progress)\b|how am i doing|\bcontrolled\b/.test(lower)) {
      reply = CoachEngine.getInteractionSummary() + "\n\n" + CoachEngine.getControlledReview();
    }
    // Default Socratic
    else {
      reply = `You are working in the ${c.path || "Excel Foundations"} pathway. ${c.skill?.name || "Formula Foundations"} is the current priority.`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
      reply += `\n\nTell me the quality or process result you need and paste the formula you have tried. I will identify the first incorrect stage without giving the full solution.`;
    }

    logInteraction({ mode, formula, challenge, message: m });
    return maybeEnhance(reply, { message: m, mode, formula, challenge, context: c });
  };

  CoachEngine.diagnose = diagnose;
  CoachEngine.detectPattern = detectPattern;
  CoachEngine.progressiveHint = progressiveHint;

  global.ExcelCoachEngine = CoachEngine;
})(typeof window !== "undefined" ? window : globalThis);
