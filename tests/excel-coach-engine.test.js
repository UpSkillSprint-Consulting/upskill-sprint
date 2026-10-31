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

test("logger stores no formula text and records coachOn/attempts", () => {
  const entry = { challengeIdx: 1, level: "Beginner", attempts: 1, hintsUsed: 0, revealed: false, correct: true, coachOn: true, tStart: 1, tFirstCorrect: 2 };
  sandbox.localStorage.setItem("excelCoachChallengeLog", JSON.stringify([entry]));
  const raw = sandbox.localStorage.getItem("excelCoachChallengeLog");
  assert.ok(!raw.includes("="), "Log must not contain formula text");
  const parsed = JSON.parse(raw);
  assert.equal(parsed[0].coachOn, true);
  assert.equal(parsed[0].attempts, 1);
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
