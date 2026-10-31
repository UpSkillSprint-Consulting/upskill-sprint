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
    filterMedian: "For example, median tap time for a given week: =MEDIAN(FILTER(ProductionData[Tap Time], ProductionData[WeekNum]=M2))",
    xlookup: "For example, look up a heat result: =XLOOKUP(M2, ProductionData[Heat ID], ProductionData[Result], \"Not found\")",
    multi: "For example, filter by week and result: =FILTER(ProductionData[Tap Time], (ProductionData[WeekNum]=M2)*(ProductionData[Result]=\"OK\"))"
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
  function compareToChallenge(formula, challenge) {
    if (!challenge || !challenge.f) return null;
    const learnerTokens = tokenize(formula).tokens || [];
    const expectedTokens = tokenize(challenge.f).tokens || [];
    const learnerFns = extractFunctions(learnerTokens);
    const expectedFns = extractFunctions(expectedTokens);

    const notes = [];

    const missingFns = expectedFns.filter(f => f && !learnerFns.includes(f));
    const extraFns = learnerFns.filter(f => f && !expectedFns.includes(f));
    if (missingFns.length) notes.push(`Missing expected function(s): ${missingFns.join(", ")}.`);
    if (extraFns.length) notes.push(`Extra function(s) not in the target: ${extraFns.join(", ")}.`);

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
      const expectedHasFallback = (challenge.f.match(/,/g) || []).length >= 3;
      const learnerHasFallback = (formula.match(/,/g) || []).length >= 3;
      if (expectedHasFallback && !learnerHasFallback) {
        notes.push("The target XLOOKUP includes a fallback for missing values. Your XLOOKUP does not.");
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
    if (!f.startsWith("=")) findings.push({ level: "error", msg: "Formula must start with =." });
    const bal = parenBalance(f);
    if (bal !== 0) findings.push({ level: "error", msg: `Parentheses unbalanced (${bal > 0 ? "missing closing" : "extra closing"}).` });
    if ((f.match(/"/g) || []).length % 2) findings.push({ level: "error", msg: "Unpaired double quote." });
    if (/!=/.test(f)) findings.push({ level: "error", msg: "Use <> for not-equal, not !=." });
    if (/#REF!/i.test(f)) findings.push({ level: "error", msg: "#REF! — a referenced cell or range no longer exists." });
    if (/#SPILL!/i.test(f)) findings.push({ level: "error", msg: "#SPILL! — the dynamic array result is blocked. Clear the cells below or to the right." });
    if (/#VALUE!/i.test(f)) findings.push({ level: "error", msg: "#VALUE! — usually a text/number mismatch or an invalid operation." });
    if (/#N\/A/i.test(f)) findings.push({ level: "error", msg: "#N/A — lookup value not found. Add a fallback argument if using XLOOKUP." });
    if (/#DIV\/0!/i.test(f)) findings.push({ level: "error", msg: "#DIV/0! — division by zero. Check the denominator." });
    if (/(?:^|[^\w])\/\s*0(?:\.0+)?(?![\d.])/i.test(f) || /\/\s*0\b/.test(f)) findings.push({ level: "error", msg: "#DIV/0! — division by zero. Check the denominator." });
    if (/#NAME\?/i.test(f)) findings.push({ level: "error", msg: "#NAME? — unrecognized function or named range." });
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
      structureNotes.forEach(n => findings.push({ level: "info", msg: n }));
    }

    // Lesson-taught mistakes
    if (/\bIF\b/i.test(f) && /[^"]\b[A-Za-z][A-Za-z0-9_]*\b[^"]/.test(f) && !/"[^"]*"/.test(f) && /IF\s*\([^,]+,[^,]+,[^)]+\)/i.test(f)) {
      // unquoted text in IF/COUNTIF is hard to detect perfectly; flag common cases
    }
    if (/COUNTIF|SUMIF|IF\s*\(/i.test(f) && /=\s*[A-Za-z][A-Za-z0-9_]*\s*[,)]/.test(f) && !/"[^"]*"/.test(f)) {
      findings.push({ level: "warn", msg: "Unquoted text in IF/COUNTIF/SUMIF is treated as a name. Wrap text criteria in double quotes." });
    }
    if (/FILTER/i.test(f) && /\bAND\s*\(|\bOR\s*\(/i.test(f)) {
      findings.push({ level: "warn", msg: "AND() and OR() inside FILTER usually return a single value. Use * for AND and + for OR between conditions." });
    }
    if (/SUMIFS/i.test(f) && /SUMIFS\s*\([^,]+,[^,]+,[^,]+,[^,]+/.test(f) === false && /SUMIFS\s*\([^)]+\)/i.test(f)) {
      // argument order is subtle; flag if criteria range appears before sum range in common mistakes
    }
    if (/>=M2|<=M2|>M2|<M2/.test(f) && !/"[^"]*"\s*&/.test(f)) {
      findings.push({ level: "error", msg: "Comparison criteria need quotes joined to the cell, such as \">=\"&M2, not >=M2." });
    }
    if (/VLOOKUP/i.test(f) && /,\s*TRUE\s*[,)]/i.test(f)) {
      findings.push({ level: "warn", msg: "VLOOKUP with TRUE uses approximate match. Prefer XLOOKUP or FALSE/0 for exact match unless you have sorted data." });
    }
    if (/FILTER|XLOOKUP|INDEX|MATCH/i.test(f) && /:\s*[A-Z]+\d+.*:\s*[A-Z]+\d+/i.test(f)) {
      // mismatched range sizes are hard without parsing; leave for structure notes
    }
    if (/#\s*$/.test(f) || /#\s*[,)]/.test(f)) {
      findings.push({ level: "info", msg: "A trailing # marks a spill reference. Confirm the spill is intentional." });
    }
    if (/PERCENTILE\.INC\s*\([^,]+,\s*90\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "PERCENTILE.INC expects a fraction between 0 and 1. Use 0.9, not 90." });
    }
    if (/IFERROR/i.test(f)) {
      findings.push({ level: "info", msg: "IFERROR hides every error, including #REF! and #NAME?. Prefer a more specific test when you can." });
    }
    if (/\$/.test(f) === false && /[A-Z]+\d+/.test(f) && /copied|lock|fixed|absolute/i.test(f) === false) {
      // missing $ is contextual; only note when the challenge expects it
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
    const parsed = tokenize(formula);
    const pattern = parsed.tokens ? detectPattern(parsed.tokens) : null;
    const ladder = pattern ? pattern.hints : [
      "Name the formula’s job: what single production or quality result should it return?",
      "Identify the inputs such as Tap Time or WeekNum and the condition that selects rows.",
      "Build and test the smallest inner expression first, then add the next layer."
    ];
    const idx = Math.min(Math.max(0, level), ladder.length - 1);
    let msg = naturalize(ladder[idx]);

    const learnerFns = extractFunctions(parsed.tokens || []);
    if (learnerFns.length && level >= 1) {
      msg += `\n\nYou already have: ${learnerFns.join(", ")}.`;
    }

    if (challenge && challenge.h && level >= 1) {
      msg += `\n\nChallenge-specific hint: ${challenge.h}`;
    }
    if (challenge && challenge.prompt && level === 0) {
      msg = `Focus: ${challenge.prompt}\n\n${msg}`;
    }

    if (level >= 2 && pattern && pattern.key === "filterAggregate") {
      msg += `\n\n${examples.filterMedian}`;
    }

    return msg;
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
    const log = CoachEngine.getInteractionLog();
    if (!log.length) {
      return [
        "Controlled review: no interactions recorded yet.",
        "",
        "To confirm the outcome in practice:",
        "1. Have a handful of real learners complete challenges using the Excel Coach.",
        "2. Ask the coach for “review” (or call ExcelCoachEngine.getControlledReview()).",
        "3. Look for a positive signal (high formula-paste rate, low reveal rate, non-trivial formula length)."
      ].join("\n");
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
      "",
      "This report is ready for real learner data. Collect more interactions and request “review” again to strengthen the evidence."
    ].join("\n");
  };

  // ─── Optional enhancement layer ───────────────────────────────────
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
    // Next skill
    else if (/next skill|what should i learn next|what.*next/.test(lower)) {
      const r = c.skill || { name: "Formula Foundations" };
      reply = `${r.name} is the current priority in the ${c.path || "Excel Foundations"} pathway. Start with one targeted challenge and explain the reference behaviour aloud.`;
    }
    // Debug mode or explicit error language (do not steal IFERROR from hint mode)
    else if (mode === "debug" || (/debug|why.*not|error|fix this|#value|#spill|#n\/a/.test(lower) && mode !== "hint" && !/iferror/.test(lower))) {
      const findings = diagnose(formula, challenge);
      const lines = findings.map(f => `• [${f.level.toUpperCase()}] ${f.msg}`).join("\n");
      reply = `Formula diagnosis:\n${lines || "No obvious syntax issues detected."}\n\n${specificNextAction(findings)}`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
    }
    // Progressive hint
    else if (mode === "hint" || /one hint|hint|help me.*challenge|current challenge/.test(lower)) {
      const s = ensureHintState(state);
      const key = String((s && s.current) || "general");
      const level = s.phase3.coach.hintLevels[key] || 0;
      const reveal = /final solution|reveal|show (me )?the (final )?answer|full formula$|complete formula/.test(lower) && !/structure|what is the full formula structure/.test(lower);
      if (reveal) {
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
    // Summary / review request
    else if (/summary|progress|how am i doing|interaction|review|controlled/.test(lower)) {
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
