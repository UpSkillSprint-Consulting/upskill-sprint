/**
 * Basic tests for Excel Coach Phase 1 engine.
 * Run with: node tests/excel-coach-engine.test.js
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Load the engine in a sandbox
const enginePath = path.join(__dirname, "../assets/lessons/excel-formula-fluency/sprint/coach-engine.js");
const code = fs.readFileSync(enginePath, "utf8");
const sandbox = { window: {}, globalThis: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const Engine = sandbox.window.ExcelCoachEngine || sandbox.globalThis.ExcelCoachEngine;

assert(Engine, "ExcelCoachEngine should be exported");

// Tokenizer / diagnose tests
const diagnose = Engine.diagnose;

assert.strictEqual(diagnose("").length > 0, true, "Empty formula should produce findings");
assert.ok(diagnose("=A1+B1").some(f => f.level === "info" || f.msg.includes("Detected")), "Simple formula should be parsed");

const unbalanced = diagnose("=MEDIAN(FILTER(A2:A10, B2:B10=1");
assert.ok(unbalanced.some(f => f.msg.includes("Parentheses unbalanced")), "Should detect unbalanced parens");

const notEqual = diagnose("=IF(A1!=B1,1,0)");
assert.ok(notEqual.some(f => f.msg.includes("<>")), "Should flag != ");

const wholeCol = diagnose("=FILTER(A:A, B:B=1)");
assert.ok(wholeCol.some(f => f.msg.includes("Whole-column")), "Should warn on whole-column");

// Pattern detection
const filterMed = diagnose('=MEDIAN(FILTER(ProductionData[Tap Time], ProductionData[WeekNum]=M2))');
assert.ok(filterMed.some(f => f.msg.includes("FILTER + aggregate")), "Should detect FILTER+aggregate");

const xlookup = diagnose('=XLOOKUP(M2, ProductionData[Heat ID], ProductionData[Result], "Not found")');
assert.ok(xlookup.some(f => f.msg.includes("XLOOKUP")), "Should detect XLOOKUP");

// Progressive hint
const hint1 = Engine.progressiveHint('=MEDIAN(FILTER(A2:A10, B2:B10=1))', 0);
assert.ok(hint1.includes("values you want") || hint1.includes("formula’s job"), "First hint should be introductory");

const hint2 = Engine.progressiveHint('=MEDIAN(FILTER(A2:A10, B2:B10=1))', 1);
assert.ok(hint2.length > hint1.length || hint2 !== hint1, "Second hint should advance");

console.log("All coach-engine tests passed.");
