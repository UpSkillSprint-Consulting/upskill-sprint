/**
 * Excel Coach Phase 5 – Closing the 10/10 gaps
 * Builds on Phases 1–4.
 *
 * Adds:
 * - Formula-structure comparison against the current challenge’s expected shape
 * - Course-specific language (production data, quality metrics, process context)
 * - Stronger hint targeting that references the learner’s actual tokens/functions
 * - Light instrumentation for qualitative feedback
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
    const tokens = [];
    const re = /([A-Za-z_][A-Za-z0-9_.]*\s*\(|"[^"]*"|'[^']*'|\$?[A-Z]{1,3}\$?\d+|\$?[A-Z]{1,3}:\$?[A-Z]{1,3}|[A-Za-z_][A-Za-z0-9_]*\[.*?\]|#|[\(\)\+\-\*\/\^&=<>!,;]|[0-9.]+)/g;
    let m;
    while ((m = re.exec(f.slice(1))) !== null) {
      tokens.push(m[1].trim());
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

  // ─── Course-specific vocabulary ──────────────────────────────
  const courseContext = {
    datasets: ["ProductionData", "Tap Time", "WeekNum", "Heat ID", "Result"],
    quality: ["median tap time", "process capability", "defect rate", "control limits"],
    process: "quality and process improvement"
  };

  function weaveContext(text) {
    if (!text) return text;
    return text
      .replace(/the values/g, "the production values (e.g. Tap Time)")
      .replace(/the condition/g, "the filter condition (e.g. WeekNum or Heat ID)")
      .replace(/FILTER/g, "FILTER on the production table");
  }

  // ─── Pattern library ───────────────────────────────────
  const patterns = {
    filterAggregate: {
      detect: (fns) => fns.includes("FILTER") && (fns.includes("MEDIAN") || fns.includes("AVERAGE") || fns.includes("SUM") || fns.includes("COUNT")),
      name: "FILTER + aggregate",
      hints: [
        "Name the three parts: the production values you want (e.g. Tap Time), the condition that selects rows (e.g. WeekNum), and the final calculation.",
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

  // ─── Structure comparison against challenge ────────────────────
  function compareToChallenge(formula, challenge) {
    if (!challenge || !challenge.f) return null;
    const learnerTokens = tokenize(formula).tokens || [];
    const expectedTokens = tokenize(challenge.f).tokens || [];
    const learnerFns = extractFunctions(learnerTokens);
    const expectedFns = extractFunctions(expectedTokens);

    const missingFns = expectedFns.filter(f => !learnerFns.includes(f));
    const extraFns = learnerFns.filter(f => !expectedFns.includes(f));

    const notes = [];
    if (missingFns.length) notes.push(`Missing expected function(s): ${missingFns.join(", ")}.`);
    if (extraFns.length) notes.push(`Extra function(s) not in the target: ${extraFns.join(", ")}.`);

    // Simple structural checks for common lesson patterns
    if (challenge.f.includes("FILTER") && !learnerFns.includes("FILTER")) {
      notes.push("The target uses FILTER to select production rows (e.g. by WeekNum). Your formula does not.");
    }
    if (challenge.f.includes("MEDIAN") && !learnerFns.includes("MEDIAN")) {
      notes.push("The target aggregates with MEDIAN (typical for tap-time stability). Your formula does not.");
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

    return findings;
  }

  // ─── Progressive-hint ladder ─────────────────────────────────────
  function progressiveHint(formula, level, challenge) {
    const parsed = tokenize(formula);
    const pattern = parsed.tokens ? detectPattern(parsed.tokens) : null;
    const ladder = pattern ? pattern.hints : [
      "Name the formula’s job: what single production or quality result should it return?",
      "Identify the inputs (e.g. Tap Time, WeekNum) and the condition that selects rows.",
      "Build and test the smallest inner expression first, then add the next layer."
    ];
    const idx = Math.min(Math.max(0, level), ladder.length - 1);
    let msg = weaveContext(ladder[idx]);

    // Stronger targeting: mention what the learner already has
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
    return msg;
  }

  function ensureHintState(state) {
    if (!state) return { phase3: { coach: { hintLevels: {} } } };
    if (!state.phase3) state.phase3 = { coach: { hintLevels: {} } };
    if (!state.phase3.coach) state.phase3.coach = { hintLevels: {} };
    if (!state.phase3.coach.hintLevels) state.phase3.coach.hintLevels = {};
    return state;
  }

  // ─── Light instrumentation ─────────────────────────────────────
  function logInteraction(meta) {
    try {
      const key = "excelCoachInteractions";
      const log = JSON.parse(localStorage.getItem(key) || "[]");
      log.push({
        t: Date.now(),
        mode: meta.mode || "default",
        hasFormula: !!meta.formula,
        challenge: meta.challenge && meta.challenge.prompt ? meta.challenge.prompt.slice(0, 60) : null
      });
      if (log.length > 50) log.shift();
      localStorage.setItem(key, JSON.stringify(log));
    } catch (e) { /* ignore storage errors */ }
  }

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

  // ─── Main local response (Phase 5) ──────────────────────────────
  CoachEngine.localResponse = async function (message, mode, contextFn, challenges, state) {
    const c = typeof contextFn === "function" ? contextFn() : {};
    const m = String(message || "").trim();
    const lower = m.toLowerCase();
    const challenge = (challenges && state && challenges[state.current]) || {};
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
      reply = `${r.name} is the current priority in the ${c.path || "Excel Foundations"} pathway. Start with one targeted challenge and explain the reference behavior aloud.`;
    }
    // Debug mode or error language
    else if (mode === "debug" || /debug|why.*not|error|fix this|#value|#spill|#n\/a/.test(lower)) {
      const findings = diagnose(formula, challenge);
      const lines = findings.map(f => `• [${f.level.toUpperCase()}] ${f.msg}`).join("\n");
      reply = `Formula diagnosis:\n${lines || "No obvious syntax issues detected."}\n\nNext: evaluate the innermost function or Boolean test alone before rebuilding the full formula.`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
    }
    // Progressive hint
    else if (mode === "hint" || /one hint|hint|help me.*challenge|current challenge/.test(lower)) {
      const s = ensureHintState(state);
      const key = String((s && s.current) || "general");
      const level = s.phase3.coach.hintLevels[key] || 0;
      const reveal = /final solution|reveal|show.*answer|full formula/.test(lower);
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
      reply += `\n\nPaste a formula or name the concept and I will break it into stages with a workplace example from production or quality data.`;
    }
    // Default Socratic
    else {
      reply = `You are working in the ${c.path || "Excel Foundations"} pathway. ${c.skill?.name || "Formula Foundations"} is the current priority.`;
      if (challenge.prompt) reply += `\n\nCurrent challenge: ${challenge.prompt}`;
      reply += `\n\nTell me the production or quality result you need and paste the formula you have tried. I will identify the first incorrect stage without giving the full solution.`;
    }

    logInteraction({ mode, formula, challenge });
    return maybeEnhance(reply, { message: m, mode, formula, challenge, context: c });
  };

  CoachEngine.diagnose = diagnose;
  CoachEngine.detectPattern = detectPattern;
  CoachEngine.progressiveHint = progressiveHint;

  global.ExcelCoachEngine = CoachEngine;
})(typeof window !== "undefined" ? window : globalThis);
