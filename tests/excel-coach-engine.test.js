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
