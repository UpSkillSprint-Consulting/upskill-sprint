'use strict';
// Regression guard for PR #76.
//
// The Netlify build command (netlify.toml) always runs
// scripts/build-binomial-poisson-exponential-lesson.mjs. That script reads
// chi-square-lesson-library.js as plain source and locates a literal insertion
// point before rewriting the catalog. PR #76 originally replaced the catalog
// with a gzip/eval stub (loading a base64 payload and eval-ing the decompressed
// result), which removed every literal the builder scans for. Every deploy then
// died with "Could not locate the Statistics lesson insertion point ..." before
// publishing.
//
// These tests fail if the catalog is ever swapped for a packed/eval stub or
// otherwise loses the anchor the deploy build depends on.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const LIBRARY_PATH = path.join(ROOT, 'chi-square-lesson-library.js');
const BUILDER_PATH = path.join(ROOT, 'scripts', 'build-binomial-poisson-exponential-lesson.mjs');

const library = fs.readFileSync(LIBRARY_PATH, 'utf8');
const builder = fs.readFileSync(BUILDER_PATH, 'utf8');

// Recover the exact insertion-point literal the builder requires, straight from
// the builder source, so this test tracks the real dependency instead of a copy.
function builderInsertionPoint() {
  const m = builder.match(/const insertionPoint = "([\s\S]*?)";/);
  assert.ok(m, 'could not read insertionPoint constant from the build script');
  // Un-escape the JS string literal (\n, \t, \', \\) as the builder would see it.
  return m[1]
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

test('lesson library is plain, parseable JavaScript (not a packed/eval stub)', () => {
  // A gzip/eval stub is short and self-executing; the real catalog is a large
  // literal array. Guard against the stub's tell-tale runtime packing.
  assert.ok(!/DecompressionStream/.test(library), 'library must not decompress a payload at runtime');
  assert.ok(!/\(0,\s*eval\)|\beval\s*\(/.test(library), 'library must not eval a payload at runtime');
  assert.ok(!/__USS_LIBRARY_CHUNKS/.test(library), 'library must not defer to an external base64 chunk payload');
  // It must actually parse as JS.
  assert.doesNotThrow(() => new Function(library), 'library must parse as JavaScript');
  // And it must contain literal lesson objects the builder can scan.
  const markerCount = (library.match(/marker:\s*'/g) || []).length;
  assert.ok(markerCount >= 15, `expected the full literal catalog, found only ${markerCount} markers`);
});

test('lesson library retains the exact insertion point the Netlify build requires', () => {
  const anchor = builderInsertionPoint();
  assert.ok(
    library.includes(anchor),
    'chi-square-lesson-library.js is missing the build insertion point; the deploy build would throw ' +
      '"Could not locate the Statistics lesson insertion point"'
  );
});

test('simulating the builder locate step succeeds against the committed library', () => {
  // Mirror the builder's own guard (build-binomial-poisson-exponential-lesson.mjs):
  // it only inserts if the entry is absent, and throws if the insertion point
  // is missing. Reproduce that decision here so a regression is caught in CI
  // without shelling out to the deploy build.
  const anchor = builderInsertionPoint();
  const alreadyPresent = /marker:\s*'data-binomial-poisson-exponential-distributions'/.test(library);
  const locatable = alreadyPresent || library.includes(anchor);
  assert.ok(locatable, 'the deploy builder would fail to locate its insertion point');
});

test('the new intermediate Minitab regression lesson is registered in the catalog', () => {
  assert.ok(
    library.includes("path: '/lessons/statistics/choosing-the-right-regression-analysis-in-minitab'"),
    'regression lesson path is registered'
  );
  assert.ok(
    /marker:\s*'data-choosing-right-regression-analysis-minitab'/.test(library),
    'regression lesson marker is registered'
  );
});
