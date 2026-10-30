/**
 * Excel Coach Phase 1 – Foundation (core offline intelligence)
 * Lightweight formula parser, pattern library, diagnostic engine,
 * and progressive-hint ladder for the Excel Formula Fluency lesson.
 *
 * Works fully offline. Designed to replace or enhance the existing localResponse.
 */
(function (global) {
  "use strict";

  const CoachEngine = {};

  // ─── Lightweight formula parser ────────────────────────────────────
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

  // ─── Pattern library ──────────────────────────────────────────
  const patterns = {
    filterAggregate: {
      detect: (fns, tokens) => fns.includes("FILTER") && (fns.includes("MEDIAN") || fns.includes("AVERAGE") || fns.includes("SUM") || fns.includes("COUNT")),
      name: "FILTER + aggregate",
      hints: [
        "Name the three parts: the values you want, the condition that selects rows, and the final calculation on those values.",
        "Build and test the FILTER by itself first. Confirm it returns the expected rows before wrapping it.",
        "Wrap the FILTER result with the aggregate (MEDIAN, AVERAGE, etc.). Handle the case when FILTER returns nothing."
      ]
    },
    xlookup: {
      detect: (fns) => fns.includes("XLOOKUP"),
      name: "XLOOKUP",
      hints: [
        "Confirm the lookup value, lookup array, and return array have matching dimensions.",
        "Add a fallback (the 4th argument) so missing values return a clear message instead of #N/A.",
        "Use structured references or a Table so the lookup stays correct when rows are added."
      ]
    },
    multiCriteria: {
      detect: (tokens) => tokens.some(t => t === "*" || t === "+") && tokens.some(t => /FILTER|XLOOKUP|SUMIFS/.test(t)),
      name: "Multi-criteria (AND with *, OR with +)",
      hints: [
        "Each condition must return a Boolean array of the same length. Multiply (*) for AND, add (+) for OR.",
        "Test each Boolean condition alone before combining them.",
        "Watch for text vs number mismatches in the criteria."
      ]
    },
    let: {
      detect: (fns) => fns.includes("LET"),
      name: "LET named calculation",
      hints: [
        "List the names and values first, then the final expression that uses those names.",
        "Name intermediate results so the formula reads like a short method.",
        "Confirm each named piece works by evaluating it alone."
      ]
    },
    dynamicArray: {
      detect: (fns) => fns.some(f => ["FILTER","SORT","UNIQUE","TAKE","CHOOSECOLS","GROUPBY","PIVOTBY"].includes(f)),
      name: "Dynamic array",
      hints: [
        "Dynamic arrays spill. Make sure there is space for the result and reference the spill with # when needed.",
        "Prefer Excel Tables + structured references so the source grows automatically.",
        "Test the spilling function alone before nesting it."
      ]
    }
  };

  function detectPattern(tokens) {
    const fns = extractFunctions(tokens);
    for (const key of Object.keys(patterns)) {
      if (patterns[key].detect(fns, tokens)) return { key, ...patterns[key] };
    }
    return null;
  }

  // ─── Diagnostic engine ────────────────────────────────────────
  function diagnose(formula) {
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
    if (/\$?[A-Z]{1,3}:\$?[A-Z]{1,3}/i.test(f) && /FILTER|SUMPRODUCT|XLOOKUP|MATCH|SUMIFS/i.test(f)) {
      findings.push({ level: "warn", msg: "Whole-column reference detected. Prefer a Table or limited range for performance and clarity." });
    }
    const parsed = tokenize(f);
    if (parsed.tokens) {
      const pattern = detectPattern(parsed.tokens);
      if (pattern) findings.push({ level: "info", msg: `Detected pattern: ${pattern.name}.` });
      if (hasStructuredRef(parsed.tokens)) findings.push({ level: "good", msg: "Uses structured references (good for maintainability)." });
    }
    return findings;
  }

  // ─── Progressive-hint ladder ──────────────────────────────────────
  function progressiveHint(formula, level, challengeHint) {
    const parsed = tokenize(formula);
    const pattern = parsed.tokens ? detectPattern(parsed.tokens) : null;
    const ladder = pattern ? pattern.hints : [
      "Name the formula’s job: what single result should it return?",
      "Identify the inputs and the condition that selects rows.",
      "Build and test the smallest inner expression first, then add the next layer."
    ];
    const idx = Math.min(level, ladder.length - 1);
    let msg = ladder[idx];
    if (challengeHint && level >= 1) msg += `\n\nChallenge-specific hint: ${challengeHint}`;
    return msg;
  }

  // ─── Main local response (Phase 1) ─────────────────────────────────
  CoachEngine.localResponse = function (message, mode, contextFn, challenges, state) {
    const c = typeof contextFn === "function" ? contextFn() : {};
    const m = String(message || "").trim();
    const lower = m.toLowerCase();
    const challenge = (challenges && state && challenges[state.current]) || {};
    const formulaMatch = m.match(/=[^\n]+/);
    const formula = (formulaMatch && formulaMatch[0]) || c.formula || "";

    if (!m) return "Ask a specific question or paste a formula and I will guide the next step.";

    // Audit
    if (/workbook audit|audit finding/.test(lower)) {
      if (!c.audit) return "No workbook audit yet. Upload a workbook in the Inspector first.";
      const top = (c.audit.issues || []).slice(0, 3);
      return `Latest audit: ${c.audit.score}% (${c.audit.grade}).\n${top.map((x, i) => `${i + 1}. ${x.title}: ${x.detail}`).join("\n") || "No high-priority issues."}\nStart with the first item.`;
    }

    // Next skill
    if (/next skill|what should i learn next|what.*next/.test(lower)) {
      const r = c.skill || { name: "Formula Foundations" };
      return `${r.name} is the current priority in the ${c.path || "Excel Foundations"} pathway. Start with one targeted challenge and explain the reference behavior aloud.`;
    }

    // Debug mode or error language
    if (mode === "debug" || /debug|why.*not|error|fix this|#value|#spill|#n\/a/.test(lower)) {
      const findings = diagnose(formula);
      const lines = findings.map(f => `• [${f.level.toUpperCase()}] ${f.msg}`).join("\n");
      return `Formula diagnosis:\n${lines || "No obvious syntax issues detected."}\n\nNext: evaluate the innermost function or Boolean test alone before rebuilding the full formula.`;
    }

    // Progressive hint
    if (mode === "hint" || /one hint|hint|help me.*challenge|current challenge/.test(lower)) {
      const key = String((state && state.current) || "general");
      if (!state.phase3) state.phase3 = { coach: { hintLevels: {} } };
      if (!state.phase3.coach.hintLevels) state.phase3.coach.hintLevels = {};
      const level = state.phase3.coach.hintLevels[key] || 0;
      const reveal = /final solution|reveal|show.*answer|full formula/.test(lower);
      if (reveal) {
        state.phase3.coach.hintLevels[key] = 99;
        return challenge.f
          ? `Final formula: ${challenge.f}\n\nWhy it works: ${challenge.w || "Each stage feeds the next."}`
          : "No stored final formula for this activity. I can still help you test stages.";
      }
      state.phase3.coach.hintLevels[key] = Math.min(level + 1, 3);
      return progressiveHint(formula, level, challenge.h);
    }

    // Explain
    if (mode === "explain" || /explain|what is|how does|understand/.test(lower)) {
      return `You are in the ${c.path || "Excel Foundations"} pathway focusing on ${c.skill?.name || "formulas"}.\n\nPaste a formula or name the concept and I will break it into stages with a workplace example.`;
    }

    // Default Socratic
    return `You are working in the ${c.path || "Excel Foundations"} pathway. ${c.skill?.name || "Formula Foundations"} is the current priority.\n\nTell me the result you need and paste the formula you have tried. I will identify the first incorrect stage without giving the full solution.`;
  };

  CoachEngine.diagnose = diagnose;
  CoachEngine.detectPattern = detectPattern;
  CoachEngine.progressiveHint = progressiveHint;

  global.ExcelCoachEngine = CoachEngine;
})(typeof window !== "undefined" ? window : globalThis);
