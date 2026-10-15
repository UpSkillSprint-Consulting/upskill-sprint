import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { integrateNPPEDiagnostic } from './nppe-diagnostic-runtime.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const EXAM_KEYS = ['cssbb', 'mbb', 'cssgb', 'cqe', 'cmq', 'cre', 'pmp', 'nppe'];
const SHARED = new Set(['test-bank-memory-learning.js', 'test-bank-current-attempt-review.js', 'test-bank-formulas.js', 'test-bank-tables.js']);
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const PRIVATE_DIRECTORY = 'content/exam-delivery-generated';

function replaceRegion(source, start, end, replacement) {
  const from = source.indexOf(start), to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0 || source.indexOf(start, from + start.length) !== -1) {
    throw new Error('Exam source structure changed; review private bank extraction before publishing.');
  }
  return source.slice(0, from) + replacement + source.slice(to);
}

// Fixed authoring boundaries, verified at every build. Unknown or moved banks
// cannot silently become public. Original question files stay available to QA.
export function isolateRuntime(source, exam) {
  if (!EXAM_KEYS.includes(exam)) throw new Error('Unknown exam');
  let result = source;
  if (exam !== 'cssbb') {
    result = replaceRegion(result, '  var SET1=[', '  var CQE_SET1=[', '  var CSSBB_BANK=[],SET2_BANK=[];\n');
    result = replaceRegion(result, '  var SET3_BANK=[', '  var EXAMS={', '  var SET3_BANK=[];\n');
  }
  if (exam !== 'cqe') result = replaceRegion(result, '  var CQE_SET1=[', '  var SET3_BANK=', '  var CQE_SET1=[],CQE_SET2=[],CQE_SET3=[];\n');
  return exam === 'nppe' ? integrateNPPEDiagnostic(result) : result;
}

function belongsToExam(name, exam) {
  if (SHARED.has(name)) return true;
  const match = /^test-bank-(cssbb|mbb|cssgb|cqe|cmq|cre|pmp|nppe)(?:-|\.)/.exec(name);
  if (!match) throw new Error(`Unclassified private simulator script: ${name}`);
  return match[1] === exam;
}

async function collectAssets(scripts, exam, root) {
  const assets = {};
  // Assets are carried once, inside the authorized package. The browser creates
  // temporary blob URLs for images and reference links, with no CDN copies.
  const references = [...scripts.join('\n').matchAll(/\/?test-bank-assets\/[\w./-]+\.(?:png|svg|jpg|webp|json|html)/g)].map(m => m[0].replace(/^\//, ''));
  for (const name of new Set(references)) {
    if (name.includes('..') || !(exam === 'cqe' && name.startsWith('test-bank-assets/cqe-set3-source/') || exam === 'mbb' && name.startsWith('test-bank-assets/mbb-160/'))) {
      throw new Error(`Cross-exam or unclassified asset: ${name}`);
    }
    const bytes = await readFile(join(root, name));
    const types = { png:'image/png', svg:'image/svg+xml', jpg:'image/jpeg', webp:'image/webp', json:'application/json', html:'text/html' };
    assets[name] = { type: types[name.split('.').pop()], base64: bytes.toString('base64') };
  }
  return assets;
}

export async function buildExamDelivery(root = ROOT) {
  const page = await readFile(join(root, 'test-bank.html'), 'utf8');
  const edgeSource = await readFile(join(root, 'netlify/edge-functions/test-bank-mobile-picker.js'), 'utf8');
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(edgeSource).toString('base64'))).default;
  const transformed = await (await edge(new Request('https://upskillsprint.com/test-bank'), {
    next: async () => new Response(page, { headers: { 'content-type':'text/html' } })
  })).text();
  const immediate = [], deferred = [];
  let runtimeCount = 0;
  let shell = transformed.replace(SCRIPT, (tag, attrs, code) => {
    const src = /\bsrc=["']([^"']+)["']/.exec(attrs)?.[1];
    if (src && !src.startsWith('/test-bank-')) return tag;
    const runtime = code.includes('  var EXAMS={');
    if (runtime) runtimeCount++;
    (src && /\bdefer\b/.test(attrs) ? deferred : immediate).push({ name: src?.slice(1), code, runtime });
    return '';
  });
  if (runtimeCount !== 1) throw new Error('Expected exactly one simulator runtime.');
  shell = shell.replace('data-exam-delivery="source"', 'data-exam-delivery="shell"');
  // The unshipped authoring page keeps its legacy gate for source-only QA.
  // Production uses the permission endpoint and must not also require Premium.
  shell = shell.replace(/(<body\b[^>]*)(>)/, tag => tag.replace(/ data-require-auth| data-required-access="[^"]*"| data-access-resource="[^"]*"/g, ''));
  if (!shell.includes('data-exam-delivery="shell"')) throw new Error('Missing exam shell marker.');
  shell = shell.replace('</head>', '<link rel="stylesheet" href="/exam-access.css">\n<script defer src="/exam-access-loader.js"></script>\n</head>');
  shell = shell.replace(/(<body[^>]*>)/, '$1\n<section id="exam-access-status" class="exam-access-status" role="status" aria-live="polite"><h1>Checking exam access</h1><p>Please wait while we check your account.</p></section><noscript><p>Enable JavaScript and sign in to open your assigned exams.</p></noscript>');
  if (/\b(?:stem|answer)["']?\s*:\s*["'\d]/.test(shell)) throw new Error('Question data found in loading shell.');
  const output = join(root, PRIVATE_DIRECTORY);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive:true });
  const sizes = {};
  for (const exam of EXAM_KEYS) {
    const scripts = [];
    if (exam === 'nppe') {
      const batch2 = await readFile(join(root, 'test-bank-nppe-diagnostic-batch2.js'), 'utf8');
      new Script(batch2, { filename:'test-bank-nppe-diagnostic-batch2.js' });
      scripts.push(batch2);
      const diagnostic = await readFile(join(root, 'test-bank-nppe-diagnostic.js'), 'utf8');
      new Script(diagnostic, { filename:'test-bank-nppe-diagnostic.js' });
      scripts.push(diagnostic);
      // Batch 3 appends to the registrar's existing array before the runtime registers its form.
      const batch3 = await readFile(join(root, 'test-bank-nppe-diagnostic-batch3.js'), 'utf8');
      new Script(batch3, { filename:'test-bank-nppe-diagnostic-batch3.js' });
      scripts.push(batch3);
      // Batch 4 follows Batch 3, still before the exam runtime registers the final Diagnostic form.
      const batch4 = await readFile(join(root, 'test-bank-nppe-diagnostic-batch4.js'), 'utf8');
      new Script(batch4, { filename:'test-bank-nppe-diagnostic-batch4.js' });
      scripts.push(batch4);
      // The complete 50-item Diagnostic installs Batch 5 before the exam runtime registers its form.
      const batch5 = await readFile(join(root, 'test-bank-nppe-diagnostic-batch5.js'), 'utf8');
      new Script(batch5, { filename:'test-bank-nppe-diagnostic-batch5.js' });
      scripts.push(batch5);
      // Learning Batch 1 is a separate Set 1 bank, loaded only after the protected Diagnostic.
      // The NPPE runtime will register the learning bank independently from the Diagnostic.
      const learning1 = await readFile(join(root, 'test-bank-nppe-learning-batch1.js'), 'utf8');
      new Script(learning1, { filename:'test-bank-nppe-learning-batch1.js' });
      scripts.push(learning1);
      // Learning Batch 2 extends only the existing Set 1 Learning array before exam registration.
      const learning2 = await readFile(join(root, 'test-bank-nppe-learning-batch2.js'), 'utf8');
      new Script(learning2, { filename:'test-bank-nppe-learning-batch2.js' });
      scripts.push(learning2);
      // Learning Batch 3 appends NPPE-071–080 before the NPPE runtime registers Set 1 Learning.
      const learning3 = await readFile(join(root, 'test-bank-nppe-learning-batch3.js'), 'utf8');
      new Script(learning3, { filename:'test-bank-nppe-learning-batch3.js' });
      scripts.push(learning3);
      // Learning Batch 4 appends NPPE-081–090 to its protected author-owned bank.
      const learning4 = await readFile(join(root, 'test-bank-nppe-learning-batch4.js'), 'utf8');
      new Script(learning4, { filename:'test-bank-nppe-learning-batch4.js' });
      scripts.push(learning4);
      // Learning Batch 5 appends NPPE-091–100 without changing any earlier bank.
      const learning5 = await readFile(join(root, 'test-bank-nppe-learning-batch5.js'), 'utf8');
      new Script(learning5, { filename:'test-bank-nppe-learning-batch5.js' });
      scripts.push(learning5);
      // Learning Batch 6 appends NPPE-101–110; preceding authoring files stay unchanged.
      const learning6 = await readFile(join(root, 'test-bank-nppe-learning-batch6.js'), 'utf8');
      new Script(learning6, { filename:'test-bank-nppe-learning-batch6.js' });
      scripts.push(learning6);
      // Learning Batch 7 appends NPPE-111–120 without replacing preceding banks.
      const learning7 = await readFile(join(root, 'test-bank-nppe-learning-batch7.js'), 'utf8');
      new Script(learning7, { filename:'test-bank-nppe-learning-batch7.js' });
      scripts.push(learning7);
    }
    for (const item of [...immediate, ...deferred]) {
      if (item.name && !belongsToExam(item.name, exam)) continue;
      let code = item.name ? await readFile(join(root, item.name), 'utf8') : item.code;
      if (item.runtime) code = isolateRuntime(code, exam);
      new Script(code, { filename: item.name || `${exam}-runtime.js` });
      scripts.push(code);
    }
    const assets = await collectAssets(scripts, exam, root);
    const serialized = JSON.stringify({ version:1, exam, scripts, assets });
    sizes[exam] = Buffer.byteLength(serialized);
    // Leave headroom below Netlify's 6 MB buffered response ceiling.
    if (sizes[exam] > 5_500_000) throw new Error(`${exam} package exceeds delivery budget; split delivery before publishing.`);
    await writeFile(join(output, `${exam}.json`), serialized);
  }
  await mkdir(join(root, 'public-site'), { recursive:true });
  await writeFile(join(root, 'public-site/test-bank.html'), shell);
  console.log('Built private exam packages (bytes):', JSON.stringify(sizes));
  return { shell, sizes, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildExamDelivery();
