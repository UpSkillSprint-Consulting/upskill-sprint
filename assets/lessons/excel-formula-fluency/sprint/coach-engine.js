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
  // Result equality via the lesson's grader (window.ExcelFormulaGrader), if present.
  // Structured-reference rewrite uses the productionData column map from the lesson.
  const STRUCTURED_MAP = {
    "PRODUCTIONDATA[FACILITY]": "B2:B28",
    "PRODUCTIONDATA[HEAT ID]": "C2:C28",
    "PRODUCTIONDATA[WEEKNUM]": "D2:D28",
    "PRODUCTIONDATA[TAP TIME]": "E2:E28",
    "PRODUCTIONDATA[DELAY TIME]": "F2:F28",
    "PRODUCTIONDATA[TONNES]": "G2:G28",
    "PRODUCTIONDATA[STATUS]": "H2:H28",
    "PRODUCTIONDATA[DATE]": "A2:A28"
  };
  function rewriteStructured(s) {
    let out = String(s || "");
    for (const [k, v] of Object.entries(STRUCTURED_MAP)) {
      out = out.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), v);
    }
    return out;
  }
  function resultsEqual(learner, target) {
    const grader = (typeof window !== "undefined" && window.ExcelFormulaGrader) || null;
    if (!grader) return false; // offline / Node without grader: do not pretend a match
    try {
      const a = grader(rewriteStructured(learner));
      const b = grader(rewriteStructured(target));
      // Refuse on failure, throw, undefined, NaN, or missing result. Never accept because both failed.
      if (!a || !b || a.ok === false || b.ok === false) return false;
      if (a.value === undefined || b.value === undefined) return false;
      if (typeof a.value === "number" && Number.isNaN(a.value)) return false;
      if (typeof b.value === "number" && Number.isNaN(b.value)) return false;
      // Refuse constant stubs
      if (a.value === "grouped" || b.value === "grouped") return false;
      // Literal =0 / ="" / ="0" must not pass via result equality (coincident zeros).
      const learnerTrim = String(learner || "").replace(/\s+/g, "").toUpperCase();
      if (learnerTrim === "=0" || learnerTrim === "=\"\"" || learnerTrim === "=\"0\"") return false;
      // No sheet refs and a zero/empty result: cannot be computing the challenge.
      const hasRef = /\$?[A-Z]{1,3}\$?\d+/.test(learner || "");
      if (!hasRef && (a.value === 0 || a.value === "")) return false;
      return sameResult(a.value, b.value);
    } catch (e) {
      return false;
    }
  }
  function resultsDiffer(learner, target) {
    const grader = (typeof window !== "undefined" && window.ExcelFormulaGrader) || null;
    if (!grader) return false;
    try {
      const a = grader(rewriteStructured(learner));
      const b = grader(rewriteStructured(target));
      if (!a || !b || a.ok === false || b.ok === false) return false;
      if (a.value === undefined || b.value === undefined) return false;
      return !sameResult(a.value, b.value);
    } catch (e) { return false; }
  }
  function sameResult(a, b) {
    if (a === b) return true;
    // Numbers only match numbers (epsilon). No cross-type coercion.
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= Math.max(1e-7, Math.abs(b) * 1e-7);
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((v, i) => sameResult(v, b[i]));
    }
    // Strings match strings only. TRUE vs 1, "1762" vs 1762, "0" vs 0 are not equal.
    if (typeof a === "string" && typeof b === "string") return a === b;
    return false;
  }


  function norm(s) { return String(s || "").replace(/\s+/g, "").toUpperCase(); }
  function compareToChallenge(formula, challenge) {
    if (!challenge || !challenge.f) return null;
    const accepted = [challenge.f, ...(challenge.a || challenge.accepted || [])].map(norm);
    const learnerNorm = norm(formula);
    if (accepted.includes(learnerNorm)) return null; // never flag an accepted answer

    // Result-based acceptance: if the existing lesson grader says the results match, it is correct.
    if (resultsEqual(formula, challenge.f)) return null;
    if (resultsDiffer(formula, challenge.f)) {
      return [{ level: "warn", msg: "The result differs from the target on the sample data. Next: check the ranges, criteria and function so both formulas return the same value." }];
    }

    const learnerTokens = tokenize(formula).tokens || [];
    const expectedTokens = tokenize(challenge.f).tokens || [];
    const learnerFns = extractFunctions(learnerTokens);
    const expectedFns = extractFunctions(expectedTokens);

    const notes = [];

    const missingFns = expectedFns.filter(f => f && !learnerFns.includes(f));
    const extraFns = learnerFns.filter(f => f && !expectedFns.includes(f));
    if (missingFns.length) notes.push(`The target uses ${missingFns.join(", ")}; your formula does not. Next: use the target function or an equivalent that returns the same result on the sample data.`);
    if (extraFns.length) notes.push(`The target does not use ${extraFns.join(", ")}; your formula does. Next: remove the extra function or confirm it returns the same result on the sample data.`);

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

    // Lesson-taught mistakes — generic rules (not exact checklist strings)
    // Helpers: per-call arg count, ref normalization
    function callArgs(s, fnName) {
      const re = new RegExp(fnName + "\\s*\\(", "gi");
      const results = [];
      let m;
      while ((m = re.exec(s)) !== null) {
        let depth = 1, args = 1, i = m.index + m[0].length;
        const start = i;
        while (i < s.length && depth > 0) {
          if (s[i] === "(") depth++;
          else if (s[i] === ")") depth--;
          else if (s[i] === "," && depth === 1) args++;
          i++;
        }
        results.push({ args, body: s.slice(start, i - 1) });
      }
      return results;
    }
    function normRef(r) { return String(r || "").replace(/\$/g, "").replace(/\s+/g, "").toUpperCase(); }
    function extractRefs(s) {
      return (s.match(/\$?[A-Z]{1,3}\$?\d+/gi) || []).map(normRef);
    }

    // Unquoted bare words in criteria or after = (IF, COUNTIF, COUNTIFS, SUMIF, SUMIFS)
    if (/(?:IF|COUNTIF|COUNTIFS|SUMIF|SUMIFS)\s*\([^)]*(?:=|<>|,)\s*[A-Z][A-Z_]*\s*(?:,|\))/i.test(f)) {
      const bare = f.match(/(?:IF|COUNTIF|COUNTIFS|SUMIF|SUMIFS)\s*\([^)]*(?:=|<>|,)\s*([A-Z][A-Z_]*)/i);
      if (bare && !/[A-Z]+\d+/.test(bare[1]) && !/^(TRUE|FALSE|AND|OR|NOT)$/i.test(bare[1])) {
        findings.push({ level: "error", msg: "Unquoted text is treated as a name and returns #NAME?. Wrap it in double quotes. Next: change the bare word to a quoted string." });
      }
    }

    // + used to join text: quote adjacent, or target truly concatenates with & (not criteria joins, not & inside quotes)
    function isTextJoinTarget(s) {
      if (!s) return false;
      // True text-join: & between cell refs (or ref & literal & ref), not criteria joins and not string&function
      const noCrit = s.replace(/"[<>]=?"\s*&\s*\$?[A-Z]+\d+/gi, "");
      return /\$?[A-Z]+\d+\s*&/.test(noCrit) || /&\s*\$?[A-Z]+\d+/.test(noCrit);
    }
    if ((/\+\s*"|\"\s*\+/i.test(f) || (challenge && isTextJoinTarget(challenge.f) && /[A-Z]+\d+\s*\+\s*[A-Z]+\d+/i.test(f))) && !/&/.test(f)) {
      findings.push({ level: "error", msg: "Use & to join text, not +. Next: rewrite the concatenation with &." });
    }

    // AVERAGE of two cells, semicolon, or incomplete range
    if (/AVERAGE\s*\(\s*\$?[A-Z]+\d+\s*[,;]\s*\$?[A-Z]+\d+\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "AVERAGE of two separate cells (or a semicolon) averages only those cells. Next: use a continuous range such as E2:E6." });
    }
    // Range shorter than the target's simple AVERAGE range
    if (challenge && /AVERAGE\s*\(\s*\$?[A-Z]+\d+:\$?[A-Z]+\d+\s*\)/i.test(challenge.f || "") &&
        /AVERAGE\s*\(\s*\$?[A-Z]+\d+:\$?[A-Z]+\d+\s*\)/i.test(f)) {
      const t = (challenge.f.match(/AVERAGE\s*\(\s*(\$?[A-Z]+\d+:\$?[A-Z]+\d+)/i) || [])[1];
      const l = (f.match(/AVERAGE\s*\(\s*(\$?[A-Z]+\d+:\$?[A-Z]+\d+)/i) || [])[1];
      if (t && l && normRef(t) !== normRef(l)) {
        const tEnd = parseInt((t.match(/\d+$/) || ["0"])[0], 10);
        const lEnd = parseInt((l.match(/\d+$/) || ["0"])[0], 10);
        if (lEnd < tEnd) findings.push({ level: "warn", msg: `The target averages ${t}. Next: extend the range to match.` });
      }
    }

    // Absolute / mixed anchors: compare learner refs to target's locked refs
    if (challenge && challenge.f) {
      const targetLocked = (challenge.f.match(/\$?[A-Z]{1,3}\$?\d+/gi) || []).filter(r => r.includes("$"));
      const learnerRefs = f.match(/\$?[A-Z]{1,3}\$?\d+/gi) || [];
      for (const t of targetLocked) {
        const base = normRef(t);
        const learnerMatch = learnerRefs.find(r => normRef(r) === base);
        if (learnerMatch && learnerMatch.replace(/\$/g, "") === t.replace(/\$/g, "") && learnerMatch !== t) {
          findings.push({ level: "warn", msg: `The target locks ${t}. Next: change the matching reference to ${t}.` });
          break;
        }
        // Obvious column/row drift on a locked target cell
        if (!learnerMatch) {
          const tCol = t.replace(/\$/g, "").replace(/\d+/, "");
          const tRow = (t.match(/\d+/) || [])[0];
          const drift = learnerRefs.find(r => {
            const rc = r.replace(/\$/g, "");
            const c = rc.replace(/\d+/, ""), row = (rc.match(/\d+/) || [])[0];
            return (c === tCol && row !== tRow) || (row === tRow && c !== tCol);
          });
          if (drift) {
            findings.push({ level: "warn", msg: `The target locks ${t}. Next: change ${drift} to ${t}.` });
            break;
          }
        }
      }
    }

    // Sheet name with space but no apostrophes (or unquoted multi-word)
    if (/[A-Za-z][A-Za-z0-9]*\s+[A-Za-z0-9]+!/.test(f) && !/'[^']+'!/.test(f)) {
      findings.push({ level: "error", msg: "Sheet names with spaces need apostrophes. Next: wrap the sheet name in single quotes, e.g. 'Production Data'!E2." });
    }
    // ProductionData without space is fine; flag only if target has quotes and learner does not
    if (challenge && /'[^']+'!/.test(challenge.f || "") && /[A-Za-z]+!/.test(f) && !/'[^']+'!/.test(f)) {
      findings.push({ level: "error", msg: "The target uses a quoted sheet name. Next: add the single quotes around the sheet name." });
    }

    // COUNTIF / COUNTIFS with exact text that target uses a wildcard for
    if (challenge && /[*?]/.test(challenge.f || "") && /COUNTIF[S]?\s*\([^,]+,\s*"[^*?]*"\s*\)/i.test(f)) {
      findings.push({ level: "warn", msg: "The target uses a wildcard. Next: add * or ? so the criterion matches the intended codes." });
    }
    // Partial or mismatched wildcards: learner criterion has * or ? but does not match the target's pattern
    if (challenge && /[*?]/.test(challenge.f || "")) {
      const tCrit = (challenge.f.match(/COUNTIF[S]?\s*\([^,]+,\s*"([^"]*)"/i) || [])[1];
      const lCrit = (f.match(/COUNTIF[S]?\s*\([^,]+,\s*"([^"]*)"/i) || [])[1];
      if (tCrit && lCrit && /[*?]/.test(lCrit) && lCrit !== tCrit) {
        findings.push({ level: "warn", msg: "The criterion uses only a partial wildcard. Next: match the target's wildcard pattern." });
      }
    }

    // IFERROR missing the second argument (per call)
    callArgs(f, "IFERROR").forEach(c => {
      if (c.args < 2) findings.push({ level: "error", msg: "IFERROR needs a value_if_error. Next: add a second argument, such as IFERROR(F2/E2,0)." });
    });

    // ROUND / ROUNDUP arity
    ["ROUND", "ROUNDUP", "ROUNDDOWN"].forEach(fn => {
      callArgs(f, fn).forEach(c => {
        if (c.args < 2 || /,\s*$/.test(c.body)) findings.push({ level: "error", msg: `${fn} needs num_digits. Next: add a second argument, such as ${fn}(AVERAGE(E2:E6),1).` });
      });
    });

    // XLOOKUP: every call — compare start and end rows, strip $
    callArgs(f, "XLOOKUP").forEach(c => {
      const ranges = c.body.match(/\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/gi) || [];
      if (ranges.length >= 2) {
        const heights = ranges.slice(0, 2).map(r => {
          const clean = r.replace(/\$/g, "");
          const m = clean.match(/(\d+):[A-Z]*(\d+)/i);
          return m ? Math.abs(parseInt(m[2], 10) - parseInt(m[1], 10)) : null;
        });
        if (heights[0] != null && heights[1] != null && heights[0] !== heights[1]) {
          findings.push({ level: "error", msg: "XLOOKUP lookup and return ranges have different heights. Next: make both ranges the same size." });
        }
      }
    });

    // Every XLOOKUP call: missing fallback when the target has one
    if (challenge && /XLOOKUP/i.test(challenge.f || "") && /XLOOKUP/i.test(f)) {
      const tCalls = callArgs(challenge.f, "XLOOKUP");
      const lCalls = callArgs(f, "XLOOKUP");
      if (tCalls.some(c => c.args >= 4) && lCalls.some(c => c.args < 4)) {
        findings.push({ level: "warn", msg: "The target XLOOKUP includes a fallback. Next: add a fourth argument to every XLOOKUP that needs one." });
      }
    }

    // XLOOKUP missing search_mode -1 when the target uses it (any call)
    if (challenge && /-1\s*\)/.test(challenge.f || "") && /XLOOKUP/i.test(f)) {
      const hasMode = callArgs(f, "XLOOKUP").some(c => /,-1\s*$|,-1\s*,/.test(c.body));
      if (!hasMode) findings.push({ level: "warn", msg: "The target searches last-to-first. Next: add search_mode -1 as the final argument." });
    }

    // SUMIFS wrong order: second argument is a single cell (criteria before sum range)
    if (/SUMIFS\s*\(\s*\$?[A-Z]+\d+:\$?[A-Z]+\d+\s*,\s*\$?[A-Z]+\d+\s*,/i.test(f)) {
      findings.push({ level: "error", msg: "SUMIFS expects the sum range first, then criteria ranges and criteria. Next: put the sum range first." });
    }

    // SUMIFS: sum range should match the target's sum range (first arg)
    if (challenge && /SUMIFS/i.test(challenge.f || "") && /SUMIFS/i.test(f)) {
      const tArgs = callArgs(challenge.f, "SUMIFS")[0];
      const lArgs = callArgs(f, "SUMIFS")[0];
      if (tArgs && lArgs) {
        const tSum = (tArgs.body.match(/\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/i) || [])[0];
        const lSum = (lArgs.body.match(/\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/i) || [])[0];
        if (tSum && lSum && normRef(tSum) !== normRef(lSum)) {
          findings.push({ level: "error", msg: "SUMIFS expects the sum range first. Next: put the target's sum range first." });
        }
      }
    }

    // Criteria written as >=M3 without quotes and &
    if ((/(?:>=|<=|>|<)\s*\$?[A-Z]+\d+/.test(f) || /"[^"]*"\s*[A-Z]+\d+/.test(f)) && !/"[^"]*"\s*&/.test(f)) {
      findings.push({ level: "error", msg: "Comparison criteria need quotes joined to the cell. Next: use \">=\"&M2, not >=M2." });
    }

    // PERCENTILE.INC / PERCENTILE with 90 (handles nested commas by arg parse)
    callArgs(f, "PERCENTILE(?:\\.INC|\\.EXC)?").forEach(c => {
      if (/,\s*(?:[2-9]|[1-9]\d+)\s*$/.test(c.body) || /,\s*(?:[2-9]|[1-9]\d+)\s*,/.test(c.body)) {
        findings.push({ level: "warn", msg: "PERCENTILE expects a fraction between 0 and 1. Next: use 0.9 (or 0.5 / 0.75 / 0.95), not a whole percent." });
      }
    });

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
    const name = ch.n || ch.name || "this challenge";
    const hint = (ch.h || ch.hint || "").replace(/=.*/g, "").trim();
    const lvl = (ch.l || ch.level || "").toLowerCase();
    const tone = lvl === "beginner" ? "Start simply. " : lvl === "advanced" ? "Think about the stages. " : "";
    if (level === 0) {
      return tone + `Before any syntax: what decision or number should “${name}” leave in the cell?`;
    }
    if (level === 1) {
      return tone + `For “${name}”, decide which inputs matter and what kind of result you need. Do not write any syntax yet.`;
    }
    return tone + (hint || "Build and test the smallest piece, then add the next.");
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

  CoachEngine._median = function(arr){ if(!arr.length)return null; const s=arr.slice().sort((a,b)=>a-b); const mid=Math.floor(s.length/2); return s.length%2?s[mid]:(s[mid-1]+s[mid])/2; };
  CoachEngine._firstTry = function(arr){ const by=new Map(); for(const e of arr){ const k=e.challengeIdx!=null?e.challengeIdx:e; if(!by.has(k))by.set(k,e);} const rows=[...by.values()]; return rows.length?Math.round(rows.filter(e=>e.correct&&e.attempts===1).length/rows.length*100):null; };
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
    function onePerChallenge(arr) {
      const by = new Map();
      for (const e of arr) {
        const key = e.challengeIdx != null ? e.challengeIdx : e;
        if (!by.has(key)) by.set(key, e);
      }
      return [...by.values()];
    }
    function firstTry(arr) {
      const rows = onePerChallenge(arr);
      return rows.length ? Math.round(rows.filter(e => e.correct && e.attempts === 1).length / rows.length * 100) : null;
    }
    function medTime(arr) {
      const times = arr.filter(e => e.tFirstCorrect && e.tStart).map(e => e.tFirstCorrect - e.tStart);
      return median(times);
    }
    const clean = challengeLog.filter(e => !e.crossover && e.event !== "crossover");
    const crossovers = challengeLog.filter(e => e.crossover || e.event === "crossover");
    const on = clean.filter(e => e.coachOn);
    const off = clean.filter(e => !e.coachOn);
    const med = CoachEngine._median || median;
    const ft = CoachEngine._firstTry || firstTry;
    function medTimeClean(arr) {
      const times = arr.filter(e => e.tFirstCorrect && e.tStart).map(e => e.tFirstCorrect - e.tStart);
      return med(times);
    }
    const cohortLines = [
      "",
      "Cohort comparison (needs real learner data; crossovers excluded):",
      `- Coach on: n=${on.length}, first-try correct ${ft(on) ?? "n/a"}%, median time-to-first-correct ${medTimeClean(on) ?? "n/a"} ms`,
      `- Coach off: n=${off.length}, first-try correct ${ft(off) ?? "n/a"}%, median time-to-first-correct ${medTimeClean(off) ?? "n/a"} ms`,
      `- Crossovers excluded: ${crossovers.length} (switched on; not counted in either cohort)`,
      "Owner note: excelCoachExperiment is a localStorage convention, not an authenticated control."
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
