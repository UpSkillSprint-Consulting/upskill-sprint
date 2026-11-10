'use strict';
// The Spread Lab and Signal or Noise preview validators must accept the lesson JSON-LD that
// build:site injects (scripts/inject-lesson-jsonld.mjs) and still reject every other change.
// Before this fix they compared the preview with the raw source, so every PR that triggered
// them failed once the injector landed (seen on PR #402).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = path.join(__dirname, '..');
const helperUrl = pathToFileURL(path.join(ROOT, 'scripts/preview-expected-source.mjs')).href;
const NETLIFY = '<div data-netlify-deploy-id="0123456789abcdef01234567" data-netlify-site-id="82c1a97f-bb8d-4e7b-8367-fe93d7ce1657" data-vcs="github" style="position:fixed"><script async src="/.netlify/scripts/cdp"></script></div>\n';

const VALIDATORS = [
  { file: 'validate-spread-lab.cjs', lesson: 'lessons/statistics/variance-covariance-correlation-and-coefficient-of-variation.html', regexes: ['NETLIFY_DEPLOYMENT_BLOCK', 'SEASONAL_EFFECTS_TAG', 'SKIP_LINK_TAGS'] },
  { file: 'validate-signal-noise.cjs', lesson: 'lessons/lean-six-sigma/signal-or-noise-arl-nelson-rules-control-limit-design.html', regexes: ['injected', 'seasonalTag', 'skipLinkTags'] }
];

function regexFrom(file, name) {
  const src = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8');
  const literal = src.match(new RegExp('const ' + name + ' ?= ?(/.*/[gimsuy]*);'))[1];
  return new Function('return ' + literal)();
}

for (const v of VALIDATORS) {
  test(`${v.file}: a preview of the staged lesson (with injected JSON-LD) passes, any other change fails`, async () => {
    const { expectedPreviewSource } = await import(helperUrl);
    const source = fs.readFileSync(path.join(ROOT, v.lesson), 'utf8');
    const expected = expectedPreviewSource(source, v.lesson);
    // These lessons carry no hand-written LearningResource graph, so the build adds one.
    assert.notEqual(expected, source, 'build:site injects JSON-LD into this lesson');
    assert.match(expected, /<script type="application\/ld\+json">[^<]*LearningResource[^<]*<\/script>\n<\/head>/);

    const strip = body => v.regexes.reduce((b, name) => b.replace(regexFrom(v.file, name), ''), body);
    const served = expected.replace(/<\/body>/, NETLIFY + '</body>');
    assert.equal(strip(served), expected, 'served preview reduces to the staged source');
    assert.notEqual(strip(served), source, 'comparing with the raw source would fail (the old bug)');

    const tampered = served.replace('"@type":"LearningResource"', '"@type":"LearningResource","teaches":"x"');
    assert.notEqual(tampered, served);
    assert.notEqual(strip(tampered), expected, 'a changed JSON-LD block is still caught');
    const extra = served.replace('</head>', '<script src="/other.js"></script>\n</head>');
    assert.notEqual(strip(extra), expected, 'other added tags are still caught');
  });

  test(`${v.file}: compares the preview with the staged source, never the raw source`, () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts', v.file), 'utf8');
    assert.match(src, /scripts\/preview-expected-source\.mjs/);
    assert.match(src, /expectedPreviewSource\(html, ?(LESSON|FILE)\)/);
    const previewBlock = src.slice(src.indexOf('preview+ROUTE') - 400, src.indexOf('preview+ROUTE') + 900);
    assert.doesNotMatch(previewBlock, /\)===html|hash\(html\)/, 'preview check must not compare with the raw source');
  });
}

test('expectedPreviewSource leaves a lesson with its own LearningResource graph unchanged', async () => {
  const { expectedPreviewSource } = await import(helperUrl);
  const own = fs.readFileSync(path.join(ROOT, 'lessons/lean-six-sigma/dmaic-in-10-minutes.html'), 'utf8');
  assert(own.includes('LearningResource'));
  assert.equal(expectedPreviewSource(own, 'lessons/lean-six-sigma/dmaic-in-10-minutes.html'), own);
});
