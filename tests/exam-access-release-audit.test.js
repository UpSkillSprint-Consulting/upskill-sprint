const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, mkdir, writeFile, rm, symlink } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

async function withPublish(files, run) {
  const root = await mkdtemp(join(tmpdir(), 'exam-release-audit-'));
  try {
    for (const [name, content] of Object.entries(files)) {
      await mkdir(require('node:path').dirname(join(root, name)), { recursive: true });
      await writeFile(join(root, name), content);
    }
    const { auditExamPublicContent } = await import('../scripts/audit-exam-public-content.mjs');
    return await run(root, auditExamPublicContent);
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('safe catalog and runtime code do not trigger a bank-content finding', async () => {
  await withPublish({ 'exam-practice.html': '<h1>Exams</h1>', 'runtime.js': 'render(question.stem); score(question.answer);' }, async (root, audit) => {
    const report = await audit(root);
    assert.equal(report.status, 'no-known-static-findings');
    assert.equal(report.scannedFiles, 2);
    assert.equal(report.findings.length, 0);
  });
});

test('public banks, renamed inline content, source maps and exam assets block the static preflight', async () => {
  await withPublish({
    'exam-practice.html': '<h1>Exams</h1>',
    'test-bank-cre-set2.js': '/* known bank */',
    'nested/renamed.js': 'var q={stem:"Private question",answer:2};',
    'nested/page.html': '<script>var q={"stem":"Private question","answer":0};</script>',
    'leaked.map': JSON.stringify({version:3,sources:['private-bank.js'],sourcesContent:['var q={stem:"Private question",answer:1};']}),
    'test-bank-assets/figure.png': 'image',
    'supabase/schema.sql': 'private SQL'
  }, async (root, audit) => {
    const report = await audit(root);
    assert.equal(report.status, 'blocked');
    assert.equal(report.findings.length, 6);
    assert.doesNotMatch(JSON.stringify(report), /Private question|private SQL/);
  });
});

test('an absent or empty build cannot report success', async () => {
  await withPublish({}, async (root, audit) => {
    await assert.rejects(audit(root), /No HTML pages/);
    await assert.rejects(audit(join(root, 'missing')), { code: 'ENOENT' });
  });
});

test('symlink content is never silently skipped or followed outside the publish directory', async () => {
  await withPublish({ 'index.html': '<h1>Catalog</h1>' }, async (root, audit) => {
    await symlink('/unreadable/private-target', join(root, 'linked-bank.js'));
    const report = await audit(root);
    assert.equal(report.status, 'blocked');
    assert.match(report.findings[0].reason, /symlink/);
  });
});
