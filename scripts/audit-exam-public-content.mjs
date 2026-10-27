import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Static release preflight only. It cannot certify runtime authorization, CDN
// configuration, encoded content, or user transitions. Findings contain paths,
// never question text, answers, tokens, or account data.
const bankFile = /(?:^|\/)test-bank-(?:cssbb|cssgb|mbb|cqe|cmq|cre|pmp|nppe)-(?:set\d+|bank\d+|diagnostic(?:-batch\d+)?|learning(?:-batch\d+)?)\.js$/i;
const textFile = /\.(?:html?|[cm]?js|json|map)$/i;
const questionLiteral = /["']?stem["']?\s*:\s*["'`]/;
const answerLiteral = /["']?(?:answer|correctAnswer)["']?\s*:\s*(?:\d|["'`])/;
// The only public question file: the free ExamPreview pool. It is allowed
// solely when every question carries an ExamPreview id, so a paid bank copied
// to this path still blocks the build.
export const FREE_POOL_PATHS = new Set(['exam-preview/cssbb-questions.json', 'exam-preview/pmp-questions.json', 'exam-preview/cssgb-questions.json', 'exam-preview/mbb-questions.json']);
export function freePoolProblem(content, path = '') {
  let data;
  try { data = JSON.parse(content); } catch { return 'Free ExamPreview pool is not valid JSON'; }
  const ids = data && data.contents && typeof data.contents === 'object' ? Object.keys(data.contents) : [];
  if (data?.pool !== 'exampreview-free' || !ids.length || ids.some(id => !idPattern(data, path).test(id))) {
    return 'Free ExamPreview pool contains non-ExamPreview questions';
  }
  return null;
}

// Each pool may only hold its own exam's ExamPreview ids (pmp:exampreview:ep-pmp-01).
function idPattern(data, path) {
  const exam = /exam-preview\/([a-z]+)-questions\.json$/.exec(path)?.[1] || data?.examId;
  if (!/^[a-z]+$/.test(exam || '') || (data?.examId && data.examId !== exam)) return /^(?!)/;
  return new RegExp(`^${exam}:exampreview:ep-${exam}-\\d{2}$`);
}

export async function auditExamPublicContent(directory) {
  const root = resolve(directory);
  if (!(await stat(root)).isDirectory()) throw new Error('Publish path must be a directory.');
  const findings = [];
  let scannedFiles = 0;
  let htmlFiles = 0;
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      const name = relative(root, path).split('\\').join('/');
      if (entry.isSymbolicLink()) {
        findings.push({ path: name, reason: 'Uninspected symlink in publish output' });
        continue;
      }
      if (entry.isDirectory()) {
        if (/^(?:supabase|node_modules|tests|scripts|netlify|nppe)(?:\/|$)/.test(name)) {
          findings.push({ path: name, reason: 'Private database/server/test tooling is publicly staged' });
        }
        await walk(path);
        continue;
      }
      if (!entry.isFile()) continue;
      scannedFiles++;
      if (/\.html?$/i.test(name)) htmlFiles++;
      if (/^test-bank-assets\//.test(name)) {
        findings.push({ path: name, reason: 'Exam-specific supporting asset needs private delivery review' });
        continue;
      }
      if (bankFile.test(name)) {
        findings.push({ path: name, reason: 'Known question-bank file is publicly staged' });
        continue;
      }
      if (textFile.test(name)) {
        const content = await readFile(path, 'utf8');
        if (FREE_POOL_PATHS.has(name)) {
          const problem = freePoolProblem(content, name);
          if (problem) findings.push({ path: name, reason: problem });
          continue;
        }
        let texts = [content];
        if (/\.map$/i.test(name)) {
          try {
            const map = JSON.parse(content);
            if (Array.isArray(map.sourcesContent)) texts = texts.concat(map.sourcesContent.filter(value => typeof value === 'string'));
          } catch {
            findings.push({ path: name, reason: 'Unparseable source map requires private-content review' });
            continue;
          }
        }
        if (texts.some(text => questionLiteral.test(text) && answerLiteral.test(text))) {
          findings.push({ path: name, reason: 'Question and answer literals found in public content' });
        }
      }
    }
  }
  await walk(root);
  if (htmlFiles === 0) throw new Error('No HTML pages found; build the site before auditing.');
  findings.sort((a, b) => a.path.localeCompare(b.path));
  return {
    check: 'exam-public-content',
    status: findings.length ? 'blocked' : 'no-known-static-findings',
    scope: 'Known bank files, exam assets, question/answer literals, and private tooling in this build. Runtime, CDN and transition checks are separate.',
    scannedFiles,
    findings
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 3) throw new Error('Usage: node scripts/audit-exam-public-content.mjs [publish-directory]');
    const result = await auditExamPublicContent(process.argv[2] || 'public-site');
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.findings.length ? 1 : 0;
  } catch (error) {
    console.error(JSON.stringify({ check: 'exam-public-content', status: 'error', message: error.message }));
    process.exitCode = 2;
  }
}
