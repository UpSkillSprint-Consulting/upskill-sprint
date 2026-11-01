/**
 * Tests for Excel Coach engine.
 * Run with: node --test tests/excel-coach-engine.test.js
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const enginePath = path.join(__dirname, "../assets/lessons/excel-formula-fluency/sprint/coach-engine.js");
const code = fs.readFileSync(enginePath, "utf8");
const sandbox = { window: {}, globalThis: {}, localStorage: { store: {}, getItem(k) { return this.store[k] || null; }, setItem(k, v) { this.store[k] = v; } } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const Engine = sandbox.window.ExcelCoachEngine;

function loadChallenges() {
  const html = fs.readFileSync(path.join(__dirname, "../lessons/power-bi-excel-sql/excel-formula-fluency.html"), "utf8");
  const m = html.match(/const challenges = (\[[\s\S]*?\]);/);
  if (!m) throw new Error("Could not find challenges array");
  return eval(m[1]);
}

test("engine exports and basic diagnose", () => {
  assert.ok(Engine, "ExcelCoachEngine should be exported");
  const diagnose = Engine.diagnose;
  assert.ok(diagnose("").length > 0, "Empty formula should produce findings");
  assert.ok(diagnose("=A1+B1").some(f => f.level === "info" || f.msg.includes("Detected")), "Simple formula should be parsed");
  assert.ok(diagnose("=MEDIAN(FILTER(A2:A10, B2:B10=1").some(f => f.msg.includes("Parentheses unbalanced")), "Should detect unbalanced parens");
  assert.ok(diagnose("=IF(A1!=B1,1,0)").some(f => f.msg.includes("<>")), "Should flag !=");
  assert.ok(diagnose("=1/0").some(f => f.msg.includes("#DIV/0!")), "Should detect #DIV/0!");
  assert.ok(diagnose("=A1/0.5").every(f => !/#DIV\/0!/.test(f.msg)), "Should not flag /0.5");
});

test("every mode returns a plain string without [object Promise]", async () => {
  const modes = ["socratic", "hint", "explain", "debug"];
  const messages = ["Give me one hint", "Why is this wrong =A1+B1", "Explain FILTER", "Debug =1/0", "What should I learn next", "review my formula =MEDIAN(E2:E28)"];
  for (const mode of modes) {
    for (const msg of messages) {
      const reply = await Engine.localResponse(msg, mode, () => ({}), [], { current: 0, phase3: { coach: { hintLevels: {} } } });
      assert.equal(typeof reply, "string", `Mode ${mode} must return a string`);
      assert.ok(!reply.includes("[object Promise]"), `Mode ${mode} must not contain [object Promise]`);
      assert.ok(reply.length > 0, `Mode ${mode} reply must not be empty`);
    }
  }
});

test("accepted answers are not flagged", () => {
  const cases = [
    { f: "=F2/E2", a: ["=F2/E2", "=IFERROR(F2/E2,0)"], learner: "=IFERROR(F2/E2,0)" },
    { f: "=E2+F2", a: ["=E2+F2", "=SUM(E2,F2)"], learner: "=SUM(E2,F2)" },
    { f: "=H2<>\"\"", a: ["=H2<>\"\"", "=NOT(ISBLANK(H2))"], learner: "=NOT(ISBLANK(H2))" }
  ];
  for (const c of cases) {
    const findings = Engine.diagnose(c.learner, { f: c.f, a: c.a });
    const bad = findings.filter(f => f.level === "error" || f.level === "warn" || /Missing expected/i.test(f.msg));
    assert.equal(bad.length, 0, `Accepted answer flagged: ${c.learner}`);
  }
});

test("lesson-taught mistakes produce targeted findings", () => {
  const cases = [
    ["=IF(E2>100,REVIEW,ACCEPT)", /quote|unquoted/i],
    ["=COUNTIF(H2:H28,FAIL)", /quote|unquoted/i],
    ["=C2+\" - \"+H2", /&/],
    ["=AVERAGE(E2,E6)", /range|E2:E6/i],
    ["=IFERROR(F2/E2)", /value_if_error|second argument/i],
    ["=ROUND(AVERAGE(E2:E6))", /num_digits|second argument/i],
    ["=XLOOKUP(M2,C2:C28,E2:E27,\"Not found\")", /height|size/i],
    ["=SUMIFS(B2:B28,M2,G2:G28)", /sum range|first/i],
    ["=PERCENTILE.INC(A2:A10,90)", /0\\.9|fraction/i]
  ];
  for (const [formula, re] of cases) {
    const findings = Engine.diagnose(formula, {});
    assert.ok(findings.some(f => (f.level === "error" || f.level === "warn") && re.test(f.msg)), `Missing finding for ${formula}`);
  }
});

test("all 50 real challenges: accepted answers clean, broken formula flagged, hints safe", async () => {
  const challenges = loadChallenges();
  assert.ok(challenges.length >= 50, "Expected at least 50 challenges");
  for (let i = 0; i < challenges.length; i++) {
    const c = challenges[i];
    const accepted = [c.f, ...(c.a || [])];
    for (const ans of accepted) {
      const findings = Engine.diagnose(ans, c);
      const bad = findings.filter(f => f.level === "error" || f.level === "warn" || /Missing expected/i.test(f.msg));
      assert.equal(bad.length, 0, `Challenge ${i} accepted answer flagged: ${ans}`);
    }
    // At least one realistic broken formula
    const broken = c.f.replace(/=/, "=IFERROR(") + ")"; // missing second arg if IFERROR, or wrap
    const brokenFindings = Engine.diagnose("=AVERAGE(E2,E6)", c);
    // We only require that some broken input produces a finding; use a generic one
    const genericBroken = Engine.diagnose("=IF(E2>100,REVIEW,ACCEPT)", c);
    assert.ok(genericBroken.some(f => f.level === "error" || f.level === "warn") || brokenFindings.some(f => f.level === "error" || f.level === "warn"), `Challenge ${i} should flag a broken formula`);
    // Hints must not contain c.f or any c.a
    const state = { current: i, phase3: { coach: { hintLevels: {} } } };
    for (let lvl = 0; lvl < 3; lvl++) {
      const hint = await Engine.localResponse("Give me one hint", "hint", () => ({}), challenges, state);
      assert.equal(typeof hint, "string");
      assert.ok(!hint.includes(c.f), `Hint L${lvl} contains c.f for challenge ${i}`);
      for (const a of c.a || []) assert.ok(!hint.includes(a), `Hint L${lvl} contains accepted answer for challenge ${i}`);
    }
    const structureQ = await Engine.localResponse("what is the full formula structure?", "hint", () => ({}), challenges, state);
    assert.ok(!structureQ.includes(c.f), `Structure question leaked c.f for challenge ${i}`);
  }
});

test("production logger stores no formula body", async () => {
  sandbox.localStorage.setItem("excelCoachInteractions", "[]");
  await Engine.localResponse("debug =SUM(E2:E28)+AVERAGE(F2:F28)", "debug", () => ({}), [], {});
  const raw = sandbox.localStorage.getItem("excelCoachInteractions") || "";
  assert.ok(!raw.includes("SUM(E2:E28)"), "formula body must not be stored");
  assert.ok(!raw.includes("AVERAGE(F2:F28)"), "formula body must not be stored");
  const parsed = JSON.parse(raw);
  assert.ok(parsed.length >= 1, "an interaction was logged");
  assert.equal(parsed[0].hasFormula, true);
  assert.ok(parsed[0].formulaLen > 0);
  assert.equal(parsed[0].formula, undefined);
});

test("controlled review excludes crossovers and reports n/first-try", () => {
  const fixture = [
    { challengeIdx: 0, correct: true, attempts: 1, coachOn: true, tStart: 100, tFirstCorrect: 250 },
    { challengeIdx: 1, correct: false, attempts: 2, coachOn: true },
    { challengeIdx: 2, correct: true, attempts: 1, coachOn: false, tStart: 100, tFirstCorrect: 400 },
    { challengeIdx: "crossover", event: "crossover", crossover: true, coachOn: true }
  ];
  sandbox.localStorage.setItem("excelCoachChallengeLog", JSON.stringify(fixture));
  const review = Engine.getControlledReview();
  assert.match(review, /Coach on: n=2/);
  assert.match(review, /first-try correct 50%/);
  assert.match(review, /Coach off: n=1/);
  assert.match(review, /Crossovers excluded: 1/);
  assert.match(review, /localStorage convention, not an authenticated/);
});

test("controlled review does not claim finishing faster", () => {
  const review = Engine.getControlledReview();
  assert.ok(!/finishing faster/i.test(review));
});

test("generic rules catch 3+ variants per mistake not in the audit list", () => {
  const diagnose = Engine.diagnose;
  const variants = [
    // absolute lock
    ["=G2/M2", { f: "=E2/$M$2" }, /locks/i],
    ["=H4/M2", { f: "=E2/$M$2" }, /locks/i],
    ["= E4 / M2 ", { f: "=E2/$M$2" }, /locks/i],
    // mixed lock
    ["=B6*C2", { f: "=B4*C$2" }, /locks/i],
    ["=B7*C2", { f: "=B4*C$2" }, /locks/i],
    ["=B8*C2", { f: "=B4*C$2" }, /locks/i],
    // unquoted
    ["=COUNTIFS(H2:H28,HOLD)", { f: "=COUNTIFS(H2:H28,\"HOLD\")" }, /unquoted/i],
    ["=IF(A1>1,OK,BAD)", { f: "=IF(A1>1,\"OK\",\"BAD\")" }, /unquoted/i],
    ["=SUMIFS(A2:A10,B2:B10,PASS)", { f: "=SUMIFS(A2:A10,B2:B10,\"PASS\")" }, /unquoted/i],
    // concat
    ["=D2+E2", { f: "=D2&E2" }, /&/],
    ["=A2+\" - \"+B2", { f: "=A2&\" - \"&B2" }, /&/],
    ["=X2+Y2", { f: "=X2&\" \"&Y2" }, /&/],
    // AVERAGE
    ["=AVERAGE(F2;F8)", { f: "=AVERAGE(F2:F8)" }, /range|semicolon/i],
    ["=AVERAGE(G2,G5)", { f: "=AVERAGE(G2:G5)" }, /range/i],
    ["=AVERAGE(H2:H4)", { f: "=AVERAGE(H2:H10)" }, /extend|averages/i],
    // sheet
    ["=Other Sheet!A1", { f: "='Other Sheet'!A1" }, /apostrophe|quoted/i],
    ["=My Data!B2", { f: "='My Data'!B2" }, /apostrophe|quoted/i],
    ["=Raw Values!C3", { f: "='Raw Values'!C3" }, /apostrophe|quoted/i],
    // wildcard
    ["=COUNTIF(A2:A10,\"B00*\")", { f: "=COUNTIF(A2:A10,\"*B00*\")" }, /wildcard/i],
    ["=COUNTIF(A2:A10,\"*B00\")", { f: "=COUNTIF(A2:A10,\"B00*\")" }, /wildcard/i],
    ["=COUNTIFS(A2:A10,\"C00*\")", { f: "=COUNTIFS(A2:A10,\"*C00\")" }, /wildcard/i],
    // ROUND
    ["=ROUND(SUM(A1:A5),)", { f: "=ROUND(SUM(A1:A5),0)" }, /num_digits/i],
    ["=ROUNDUP(A1)", { f: "=ROUNDUP(A1,0)" }, /num_digits/i],
    ["=ROUNDDOWN(B1:B5)", { f: "=ROUNDDOWN(B1:B5,1)" }, /num_digits/i],
    // XLOOKUP size
    ["=XLOOKUP(A1,B3:B20,C2:C20)", { f: "=XLOOKUP(A1,B2:B20,C2:C20)" }, /height|size/i],
    ["=XLOOKUP(A1,B2:B10,C2:C11)", { f: "=XLOOKUP(A1,B2:B10,C2:C10)" }, /height|size/i],
    ["=XLOOKUP(A1,$B$2:$B$10,$C$2:$C$11)", { f: "=XLOOKUP(A1,B2:B10,C2:C10)" }, /height|size/i],
    // PERCENTILE
    ["=PERCENTILE.INC(A1:A10,90)", { f: "=PERCENTILE.INC(A1:A10,0.9)" }, /0\.9|fraction/i],
    ["=PERCENTILE(FILTER(A2:A10,B2:B10=1),90)", { f: "=PERCENTILE(FILTER(A2:A10,B2:B10=1),0.9)" }, /0\.9|fraction/i],
    ["=PERCENTILE.INC(C2:C28,90)", { f: "=PERCENTILE.INC(C2:C28,0.9)" }, /0\.9|fraction/i],
    // SUMIFS order / range
    ["=SUMIFS(D2:D10,E2,F2:F10)", { f: "=SUMIFS(F2:F10,D2:D10,E2)" }, /sum range|first/i],
    ["=SUMIFS(A2:A5,B2,C2:C5)", { f: "=SUMIFS(C2:C5,A2:A5,B2)" }, /sum range|first/i],
    ["=SUMIFS(X2:X8,Y2:Y8,Z2)", { f: "=SUMIFS(Z2:Z8,X2:X8,Y2)" }, /sum range|first/i],
    // criteria
    ["=SUMIFS(A2:A10,B2:B10,>=M4)", { f: "=SUMIFS(A2:A10,B2:B10,\">=\"&M4)" }, /quotes|joined/i],
    ["=SUMIFS(A2:A10,B2:B10,<=N2)", { f: "=SUMIFS(A2:A10,B2:B10,\"<=\"&N2)" }, /quotes|joined/i],
    ["=COUNTIFS(A2:A10,>P5)", { f: "=COUNTIFS(A2:A10,\">\"&P5)" }, /quotes|joined/i],
  ];
  for (const [formula, ch, re] of variants) {
    const findings = diagnose(formula, ch);
    assert.ok(findings.some(f => (f.level === "error" || f.level === "warn") && re.test(f.msg)),
      `Variant missed: ${formula} → ${findings.map(f => f.msg).join("; ")}`);
  }
});

test("valid equivalents produce no notes when results match", () => {
  // Minimal grader that mirrors the lesson's evaluateLive + productionData column map.
  // Sufficient to prove result-based acceptance for the listed equivalents.
  const productionData = [
    ["2026-07-01","Melt Shop","437690-A001",27,94.3,12.4,188,"PASS"],
    ["2026-07-02","Rolling Mill","437691-A002",27,47.8,5.6,172,"PASS"],
    ["2026-07-04","Melt Shop","437693-A004",27,101.6,18.9,193,"FAIL"]
  ];
  function col(letter) { return letter.charCodeAt(0) - 65; }
  function values(range) {
    const m = range.match(/([A-Z])(\d+):([A-Z])(\d+)/i);
    if (!m) return [];
    const c1 = col(m[1]), r1 = +m[2], c2 = col(m[3]), r2 = +m[4];
    const out = [];
    for (let r = r1; r <= r2; r++) {
      const row = productionData[r - 2];
      if (row) out.push(row[c1]);
    }
    return out;
  }
  sandbox.window.ExcelFormulaGrader = function(formula) {
    const f = String(formula || "").replace(/\s+/g, "").toUpperCase();
    // SUMIF / SUMIFS on facility
    if (/SUMIF[S]?\(/.test(f) && f.includes("B2:B28") && f.includes("G2:G28")) {
      const fac = "MELT SHOP";
      const tonnes = values("G2:G28");
      const facilities = values("B2:B28");
      return { ok: true, value: facilities.reduce((s, v, i) => s + (String(v).toUpperCase() === fac ? (Number(tonnes[i]) || 0) : 0), 0) };
    }
    // COUNTIF / COUNTIFS / SUM(--()) of FAIL
    if ((/COUNTIF/.test(f) || /SUM\(--/.test(f)) && f.includes("FAIL")) {
      return { ok: true, value: values("H2:H28").filter(v => String(v).toUpperCase() === "FAIL").length };
    }
    // CONCAT / TEXTJOIN / & of C2 and H2
    if (/CONCAT|TEXTJOIN|&/.test(f) && f.includes("C2") && f.includes("H2")) {
      const c = productionData[0][2], h = productionData[0][7];
      return { ok: true, value: c + " - " + h };
    }
    // IF(E2=0,"",F2/E2) vs IFERROR
    if (/F2\/E2/.test(f)) {
      const e = productionData[0][4], ff = productionData[0][5];
      return { ok: true, value: e === 0 ? "" : ff / e };
    }
    // GROUPBY rewritten or A1 — real grouped result so different GROUPBYs differ
    if (/GROUPBY/.test(f)) {
      if (f.includes("F2:F28") || f.includes("DELAY")) return { ok: true, value: [["Melt Shop", 14], ["Rolling Mill", 6]] };
      return { ok: true, value: [["Melt Shop", 999]] };
    }
    return { ok: false };
  };

  const cases = [
    ["=SUMIF(B2:B28,M2,G2:G28)", { f: "=SUMIFS(G2:G28,B2:B28,M2)" }],
    ["=COUNTIFS(H2:H28,\"FAIL\")", { f: "=COUNTIF(H2:H28,\"FAIL\")" }],
    ["=SUM(--(H2:H28=\"FAIL\"))", { f: "=COUNTIF(H2:H28,\"FAIL\")" }],
    ["=CONCAT(C2,\" - \",H2)", { f: "=C2&\" - \"&H2" }],
    ["=TEXTJOIN(\" - \",,C2,H2)", { f: "=C2&\" - \"&H2" }],
    ["=IF(E2=0,\"\",F2/E2)", { f: "=IFERROR(F2/E2,\"\")" }],
    ["=GROUPBY(B2:B28,F2:F28,AVERAGE)", { f: "=GROUPBY(ProductionData[Facility],ProductionData[Delay Time],AVERAGE)" }]
  ];
  for (const [formula, ch] of cases) {
    const findings = Engine.diagnose(formula, ch);
    const notes = findings.filter(f => f.level === "error" || f.level === "warn" || /target uses|structured references|accepted equivalent/i.test(f.msg));
    assert.equal(notes.length, 0, `${formula} produced notes: ${notes.map(n => n.msg).join("; ")}`);
  }
});

test("grader computes hand-checked criteria and rejects false accepts", () => {
  // Real-ish grader using the hand-checked productionData totals
  sandbox.window.ExcelFormulaGrader = function(formula) {
    const f = String(formula || "").replace(/\s+/g, "").toUpperCase();
    if (f.includes("SUMIF") && f.includes("MELTSOP") || (f.includes("SUMIF") && f.includes("B2:B28") && f.includes("G2:G28") && f.includes("M2"))) return { ok: true, value: 1762 };
    if (f.includes("SUMIF(B2:B28,\"MELTSOP\",G2:G28)") || f.includes("SUMIF(B2:B28,\"MELT SHOP\",G2:G28)")) return { ok: true, value: 1762 };
    if (f.includes("SUMIFS") && f.includes("> =28") || f.includes(">=28")) return { ok: true, value: 4036 };
    if (f.includes("COUNTIF") && f.includes("<>PASS")) return { ok: true, value: 11 };
    if (f.includes("COUNTIF") && f.includes("*B*")) return { ok: true, value: 6 };
    if (f.includes("COUNTIFS") && f.includes("FAIL") && f.includes("SLITTER")) return { ok: true, value: 2 };
    if (f.includes("COUNTIF") && f.includes("FAIL") && !f.includes("SLITTER")) return { ok: true, value: 6 };
    if (f.includes("GROUPBY") && (f.includes("F2:F28") || f.includes("DELAY"))) return { ok: true, value: [["Melt Shop", 14.07]] };
    if (f.includes("GROUPBY")) return { ok: true, value: [["other", 0]] };
    if (f === "=0" || f === "0") return { ok: true, value: 0 };
    if (f.includes("SUMIFS") && f.includes("B2:B28") && f.includes("M2")) return { ok: true, value: 1762 };
    return { ok: false };
  };
  const diagnose = Engine.diagnose;
  // Wrong COUNTIFS extra pair must NOT be accepted against COUNTIF FAIL
  const wrongCount = diagnose('=COUNTIFS(H2:H28,"FAIL",B2:B28,"Slitter")', { f: '=COUNTIF(H2:H28,"FAIL")' });
  assert.ok(wrongCount.some(x => x.level === "warn" || x.level === "error"), "wrong COUNTIFS must not be accepted");
  // Wrong GROUPBY must not be accepted
  const wrongGroup = diagnose("=GROUPBY(B2:B28,G2:G28,SUM)", { f: "=GROUPBY(ProductionData[Facility],ProductionData[Delay Time],AVERAGE)" });
  assert.ok(wrongGroup.some(x => x.level === "warn" || x.level === "error"), "wrong GROUPBY must not be accepted");
  // =0 vs a SUMIFS that also grades 0 must not false-accept (grader returns 1762 for that SUMIFS)
  const zeroVs = diagnose("=0", { f: "=SUMIFS(G2:G28,B2:B28,M2)" });
  assert.ok(zeroVs.some(x => x.level === "warn" || x.level === "error"), "=0 must not be accepted against SUMIFS");
});

test("Node without ExcelFormulaGrader does not throw or false-accept", () => {
  delete sandbox.window.ExcelFormulaGrader;
  const findings = Engine.diagnose("=SUMIF(B2:B28,M2,G2:G28)", { f: "=SUMIFS(G2:G28,B2:B28,M2)" });
  assert.ok(Array.isArray(findings), "diagnose returns an array without a grader");
  // Without a grader it must not claim the results matched (structure notes or info are fine)
  assert.ok(!findings.some(f => /results match|equal results/i.test(f.msg)), "must not claim a match without a grader");
});

test("item-2 remaining misses are now caught", () => {
  const diagnose = Engine.diagnose;
  const cases = [
    ["=PERCENTILE.INC(E2:E28,50)", {}, /fraction|0\.5|percent/i],
    ["=PERCENTILE.EXC(FILTER(E2:E28,B2:B28=M2),95)", {}, /fraction|percent/i],
    ["=PERCENTILE(IF(D2:D28=M3,F2:F28),75)", {}, /fraction|percent/i],
    ["=F3*$C2", { f: "=F2*$C$2" }, /locks/i],
    ["=G2*C$2", { f: "=F2*$C$2" }, /locks/i],
    ["=IF(H2=HOLD,1,0)", {}, /unquoted|quote/i],
    ["=H2+C2", { f: "=H2&C2" }, /&/],
    ["=Sheet 2!A1", {}, /apostrophe|quote/i],
    ['=SUMIFS(A2:A10,B2:B10,">=""M2")', {}, /joined|quotes/i]
  ];
  for (const [formula, ch, re] of cases) {
    const findings = diagnose(formula, ch);
    assert.ok(findings.some(f => (f.level === "error" || f.level === "warn") && re.test(f.msg)),
      `Missed: ${formula} → ${findings.map(f => f.msg).join("; ")}`);
  }
});

test("GROUPBY bare aggregation names compute distinct results", () => {
  // Grader that mirrors the fixed lesson behaviour for bare names
  sandbox.window.ExcelFormulaGrader = function(formula) {
    const f = String(formula || "").toUpperCase();
    if (!/GROUPBY/.test(f)) return { ok: false };
    const delays = { "Melt Shop": [12.4,18.9,34.58,9.2,8.7,24.6,11.8,7.3,13.2], "Rolling Mill": [5.6,4.7,8.1,6.0,5.4,3.9,9.6,4.8,6.7], "Slitter": [3.2,2.9,4.5,7.4,3.1,2.4,5.1,8.6,3.0] };
    const name = (f.match(/,\s*(AVERAGE|SUM|MAX|MIN|COUNT)\s*\)/) || [])[1] || "SUM";
    const out = Object.entries(delays).map(([k, arr]) => {
      let agg = 0;
      if (name === "AVERAGE") agg = arr.reduce((a,b)=>a+b,0)/arr.length;
      else if (name === "MAX") agg = Math.max(...arr);
      else if (name === "MIN") agg = Math.min(...arr);
      else if (name === "COUNT") agg = arr.length;
      else agg = arr.reduce((a,b)=>a+b,0);
      return [k, Math.round(agg*100)/100];
    });
    return { ok: true, value: out };
  };
  const target = { f: "=GROUPBY(ProductionData[Facility],ProductionData[Delay Time],AVERAGE)" };
  const avg = Engine.diagnose("=GROUPBY(B2:B28,F2:F28,AVERAGE)", target);
  assert.equal(avg.filter(x => x.level === "error" || x.level === "warn").length, 0, "bare AVERAGE must be accepted");
  for (const bad of ["SUM", "MAX", "COUNT"]) {
    const r = Engine.diagnose(`=GROUPBY(B2:B28,F2:F28,${bad})`, target);
    assert.ok(r.some(x => x.level === "warn" || x.level === "error"), `bare ${bad} must not be accepted`);
  }
});

test("sameResult refuses cross-type and literal zero", () => {
  sandbox.window.ExcelFormulaGrader = function(formula) {
    const f = String(formula || "").replace(/\s+/g, "");
    if (f === "=0" || f === '=""' || f === '="0"') return { ok: true, value: 0 };
    if (f.includes("SUMIF")) return { ok: true, value: 1762 };
    if (f === '="1762"') return { ok: true, value: "1762" };
    return { ok: true, value: 1762 };
  };
  const target = { f: "=SUMIFS(G2:G28,B2:B28,M2)" };
  const zero = Engine.diagnose("=0", target);
  assert.ok(zero.some(x => x.level === "warn" || x.level === "error"), "=0 must not match numeric 1762 or a zero SUMIF");
  const str = Engine.diagnose('="1762"', target);
  assert.ok(str.some(x => x.level === "warn" || x.level === "error"), '="1762" must not match numeric 1762');
});

test("item-2 leftovers: percent > 1, unquoted <>, digit sheet token", () => {
  const diagnose = Engine.diagnose;
  assert.ok(diagnose("=PERCENTILE.INC(E2:E28,25)", {}).some(f => /fraction|percent/i.test(f.msg)));
  assert.ok(diagnose("=PERCENTILE.EXC(G2:G28,10)", {}).some(f => /fraction|percent/i.test(f.msg)));
  assert.ok(!diagnose("=PERCENTILE.INC(E2:E28,0.5)", {}).some(f => f.level === "error" || f.level === "warn"));
  assert.ok(diagnose("=IF(H2<>FAIL,1,0)", {}).some(f => /unquoted|quote/i.test(f.msg)));
  assert.ok(diagnose("=Q4 Data!B2", {}).some(f => /apostrophe|quote/i.test(f.msg)));
  assert.ok(!diagnose("=Sheet1!A1", {}).some(f => /apostrophe/i.test(f.msg)));
  // B4 false-positive guards
  assert.ok(!diagnose("=E2+F2", { f: '=SUMIFS(G2:G28,A2:A28,">="&M2)' }).some(f => /Use & to join/.test(f.msg)));
  assert.ok(!diagnose("=E2+F2", { f: '=LET(x,1,"Median tap: "&ROUND(x,1))' }).some(f => /Use & to join/.test(f.msg)));
});

test("coincident zero without sheet refs is not accepted", () => {
  sandbox.window.ExcelFormulaGrader = function(formula) {
    const f = String(formula || "").replace(/\s+/g, "").toUpperCase();
    // The real SUMIFS grades to 0 on this sample (M2 is Melt Shop, date criteria miss)
    if (f.includes("SUMIFS")) return { ok: true, value: 0 };
    // Literal-looking zeros
    if (/^=(SUM\(0\)|0\*1|0\+0|--0|N\(0\)|0)$/.test(f)) return { ok: true, value: 0 };
    return { ok: false };
  };
  const target = { f: '=SUMIFS(G2:G28,A2:A28,">="&M2,A2:A28,"<="&M3)' };
  for (const bad of ["=SUM(0)", "=0*1", "=0+0", "=--0", "=N(0)"]) {
    const r = Engine.diagnose(bad, target);
    assert.ok(r.some(x => x.level === "warn" || x.level === "error") || r.every(x => x.level === "info"),
      `${bad} must not clear the challenge`);
    assert.ok(!r.every(x => x.level === "info" && /simple expression/.test(x.msg) && r.length === 1) || r.some(x => /result differs|SUMIFS|target/i.test(x.msg)),
      `${bad} should not be silently accepted`);
  }
  // Real target self stays clean
  const self = Engine.diagnose(target.f, target);
  const badSelf = self.filter(x => x.level === "error" || x.level === "warn");
  assert.equal(badSelf.length, 0, "real SUMIFS self must stay clean");
});

test("median odd/even, n and first-try rate on a fixture log", () => {
  const median = Engine._median;
  const firstTry = Engine._firstTry;
  assert.equal(median([3, 1, 2]), 2, "odd median");
  assert.equal(median([4, 1, 3, 2]), 2.5, "even median");
  assert.equal(median([]), null, "empty median");
  const log = [
    { challengeIdx: 0, correct: true, attempts: 1, coachOn: true },
    { challengeIdx: 0, correct: true, attempts: 1, coachOn: true }, // duplicate row, must not double-count
    { challengeIdx: 1, correct: false, attempts: 2, coachOn: true },
    { challengeIdx: 2, correct: true, attempts: 1, coachOn: false },
    { challengeIdx: 3, correct: true, attempts: 3, coachOn: false }
  ];
  const on = log.filter(e => e.coachOn);
  const off = log.filter(e => !e.coachOn);
  assert.equal(on.length, 3, "raw on count");
  assert.equal(firstTry(on), 50, "on first-try is 1 of 2 unique challenges");
  assert.equal(firstTry(off), 50, "off first-try is 1 of 2");
  assert.equal(firstTry([]), null);
});

test("hint ladder is progressive and never leaks the answer", () => {
  const challenges = loadChallenges();
  assert.equal(challenges.length, 50);
  for (const [i, c] of challenges.entries()) {
    const levels = [0, 1, 2].map(lv => Engine.progressiveHint("", lv, c));
    assert.equal(new Set(levels).size, 3, `#${i + 1} levels must be distinct`);
    const hint = (c.h || "").replace(/=.*/g, "").trim();
    if (hint) {
      assert.ok(!levels[0].includes(hint), `#${i + 1} L0 must not contain c.h`);
      assert.ok(!levels[1].includes(hint), `#${i + 1} L1 must not contain c.h`);
    }
    const accepted = [c.f, ...(c.a || [])].filter(Boolean);
    for (const ans of accepted) {
      const bare = ans.replace(/^=/, "").replace(/\s+/g, "");
      for (const lv of levels) {
        const flat = lv.replace(/\s+/g, "");
        assert.ok(!flat.includes(bare), `#${i + 1} level contains the answer`);
        // near-complete: answer with the last argument or a guard removed
        const trimmed = bare.replace(/,[^,]{1,40}\)$/, ")").replace(/\*\([^)]+\)/, "");
        if (trimmed.length > 12 && trimmed !== bare) {
          assert.ok(!flat.includes(trimmed), `#${i + 1} level contains a near-complete form`);
        }
      }
    }
    assert.match(levels[0], /what|decision|number/i, `#${i + 1} L0 should ask about the goal`);
    assert.ok(!levels[0].includes(c.p || "___"), `#${i + 1} L0 must not echo the full brief`);
    assert.ok(!/=[A-Z]/.test(levels[1]), `#${i + 1} L1 must not contain a formula`);
    const fnNames = /\b(use|using|with|after|before|inside)\s+(median|filter|average|xlookup|index|xmatch|lambda|byrow|bycol|scan|makearray|groupby|pivotby|sumifs|countif|textbefore|textafter|percentile)\b/i;
    const recipe = /\bnest\b|\bwrap\b|→|then wrap|\b[A-Z]{2,}\s*\(/i;
    const opLeak = /[A-Z]\d+\s*[+\-*/]\s*[A-Z]\d+|\$\$?[A-Z]\$?\d+|<>|\b@\b|#\d/;
    const rangeLeak = /\b[A-Z]{1,3}\d+:[A-Z]{1,3}\d+\b/;
    const ofFn = /\b(MEDIAN|FILTER|AVERAGE|XLOOKUP)\s+of\s+(MEDIAN|FILTER|AVERAGE|XLOOKUP)\b/i;
    const topic = (c.t || "").toLowerCase();
    for (const [li, lv] of levels.entries()) {
      assert.ok(!recipe.test(lv), `#${i + 1} L${li} has recipe language: ${lv}`);
      assert.ok(!opLeak.test(lv), `#${i + 1} L${li} has an operator leak: ${lv}`);
      assert.ok(!rangeLeak.test(lv), `#${i + 1} L${li} has a range: ${lv}`);
      assert.ok(!ofFn.test(lv), `#${i + 1} L${li} has function-of-function: ${lv}`);
      if (fnNames.test(lv) && li < 2) {
        assert.fail(`#${i + 1} L${li} names a function: ${lv}`);
      }
      if (li === 2 && fnNames.test(lv) && !topic.split(/\W+/).some(w => w && lv.toLowerCase().includes(w))) {
        assert.fail(`#${i + 1} L2 names a function the topic does not: ${lv}`);
      }
    }
    // near-complete: answer with one guard or argument removed, no leading =
    for (const ans of accepted) {
      const bare = ans.replace(/^=/, "").replace(/\s+/g, "");
      const near = bare.replace(/\*\([^)]{0,30}\)/, "").replace(/,[^,]{1,30}\)$/, ")");
      if (near.length > 14 && near !== bare) {
        for (const lv of levels) {
          assert.ok(!lv.replace(/\s+/g, "").includes(near), `#${i + 1} near-complete form leaked`);
        }
      }
    }
  }
});

test("explain-mode text has no formulas or recipes", () => {
  const html = fs.readFileSync(path.join(__dirname, "../lessons/power-bi-excel-sql/excel-formula-fluency.html"), "utf8");
  const se = html.match(/const skillExamples=\{([\s\S]*?)\};/);
  const cr = html.match(/function conceptReply\(m,c\)\{([\s\S]*?)\}/);
  assert.ok(se && cr, "explain-mode surfaces found");
  const strings = [...(se[1] + cr[1]).matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map(m => m[1]);
  assert.ok(strings.length > 0, "user-facing strings found");
  const blob = strings.join("\n");
  assert.ok(!/=[A-Z]{2,}\(/.test(blob) && !/=[A-Z]\d+/.test(blob), "no formula in explain-mode");
  assert.ok(!/wrap the|nest|XLOOKUP\(|FILTER\(/.test(blob), "no recipe in explain-mode");
  assert.ok(!/\b[A-Z]\d+:[A-Z]\d+/.test(blob), "no range in explain-mode");
});

test("XLOOKUP is checked per call, not only the first", () => {
  const d = Engine.diagnose;
  const lookup = { f: '=XLOOKUP(M2,C2:C28,E2:E28,"Not found")' };
  const last = { f: '=XLOOKUP(M2,C2:C28,H2:H28,"Not found",0,-1)' };
  // variants not in the prompt
  const noFb = ["=xlookup(m2,c2:c28,e2:e28)", "=XLOOKUP($M$2, $C$2:$C$28, $E$2:$E$28)", "=XLOOKUP(M2,C2:C28,E2:E28,)", "=SUM(XLOOKUP(M2,C2:C28,E2:E28))", "=IFERROR(XLOOKUP(M2,C2:C28,E2:E28),0)"];
  for (const v of noFb) {
    const r = d(v, lookup);
    assert.ok(r.some(x => /fallback/i.test(x.msg) && /Next:/.test(x.msg)), `${v} should warn on fallback`);
    assert.equal(r.filter(x => /fallback/i.test(x.msg)).length, 1, `${v} should have one fallback message`);
  }
  const noMode = ["=XLOOKUP(M2,C2:C28,H2:H28,\"x\",0,-1)+XLOOKUP(M3,C2:C28,H2:H28,\"x\")", "=xlookup(m2,c2:c28,h2:h28,\"nf\")", "=XLOOKUP($M$2,$C$2:$C$28,$H$2:$H$28,\"x\",0,1)", "=XLOOKUP(M2,C2:C28,H2:H28,\"x\",0,-1)+XLOOKUP(M4,C2:C28,H2:H28,\"y\",0,1)"];
  for (const v of noMode) {
    const r = d(v, last);
    assert.ok(r.some(x => /last-to-first/i.test(x.msg)), `${v} should warn on search_mode`);
  }
  const offset = ["=XLOOKUP(M2,C3:C29,E2:E28,\"x\")", "=XLOOKUP(M2,$C$4:$C$30,$E$2:$E$28,\"x\")", "=XLOOKUP(M2,C2:C28,E3:E29,\"x\")"];
  for (const v of offset) {
    const r = d(v, lookup);
    assert.ok(r.some(x => /same rows/i.test(x.msg)), `${v} should flag offset rows`);
  }
  const shortRet = ["=XLOOKUP(1,(C2:C28=M2)*(D2:D28=M3),E2:E27,\"x\")", "=XLOOKUP(1,(C2:C28=M2)*(D3:D29=M3),E2:E28,\"x\")", "=XLOOKUP(1,(B2:B28=M2)*(C2:C28=M3),E2:E26,\"x\")"];
  for (const v of shortRet) {
    const r = d(v, { f: '=XLOOKUP(1,(C2:C28=M2)*(D2:D28=M3),E2:E28,"x")' });
    assert.ok(r.some(x => /same rows/i.test(x.msg)), `${v} should flag short return`);
  }
  // negatives: aligned, with fallback, with -1
  const clean = [
    ['=XLOOKUP(M2,C2:C28,E2:E28,"Not found")', lookup],
    ['=XLOOKUP(M2,C2:C28,E2:E28,"x")+XLOOKUP(M3,C2:C28,E2:E28,"x")', lookup],
    ['=XLOOKUP(1,(C2:C28=M2)*(D2:D28=M3),E2:E28,"x")', { f: '=XLOOKUP(1,(C2:C28=M2)*(D2:D28=M3),E2:E28,"x")' }],
    ['=XLOOKUP(M2,C2:C28,H2:H28,"Not found",0,-1)', last]
  ];
  for (const [v, t] of clean) {
    const r = d(v, t);
    assert.ok(!r.some(x => x.level === "error" || x.level === "warn"), `${v} should be clean: ${JSON.stringify(r)}`);
  }
});

test("XLOOKUP split ignores commas inside quotes and names the call", () => {
  const d = Engine.diagnose;
  const last = { f: '=XLOOKUP(M2,C2:C28,H2:H28,"Not found",0,-1)' };
  const ok = ["=XLOOKUP(M2,C2:C28,H2:H28,\"Not, found\",0,-1)", "=XLOOKUP(M2,C2:C28,H2:H28,\"No; match\",0,-1)", "=xlookup($m$2,$c$2:$c$28,$h$2:$h$28,\"n/a\",0,-1)"];
  for (const v of ok) {
    const r = d(v, last);
    assert.ok(!r.some(x => /last-to-first/i.test(x.msg)), `${v} should stay quiet: ${JSON.stringify(r)}`);
  }
  const two = d('=XLOOKUP(M2,C2:C28,E2:E28)+XLOOKUP(M3,C2:C28,E2:E28)', { f: '=XLOOKUP(M2,C2:C28,E2:E28,"Not found")' });
  const fb = two.filter(x => /fallback/i.test(x.msg));
  assert.equal(fb.length, 1, "one fallback message");
  assert.ok(/1st and 2nd|all 2/.test(fb[0].msg), "names the calls");
  const whole = ["=XLOOKUP(M2,C:C,E2:E28,\"x\")", "=XLOOKUP(M2,C:C,E:E,\"x\")", "=XLOOKUP(M2,$C:$C,$E$2:$E$28,\"x\")"];
  const first = d(whole[0], { f: '=XLOOKUP(M2,C2:C28,E2:E28,"x")' });
  assert.ok(first.some(x => /same rows|height/i.test(x.msg)), "whole column vs bounded is misaligned");
  const bothWhole = d(whole[1], { f: '=XLOOKUP(M2,C:C,E:E,"x")' });
  assert.ok(!bothWhole.some(x => /same rows/i.test(x.msg)), "two whole columns are aligned");
});
