/* Stamp the shared dropdown markup into every copy of the primary nav.
   Menu content lives in site-nav.js; this script only writes that HTML.
   It also copies the same markup into site-sections.js so pages that build
   a header at runtime (no static nav) still get the dropdowns. */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { markup } = require(path.join(root, 'site-nav.js'));

const SKIP = new Set(['node_modules', '.git', 'public-site', '.tmp', 'artifacts']);

function currentTab(rel) {
  const file = rel.replace(/\\/g, '/');
  if (/(^|\/)start-here\.html$/.test(file)) return 'start';
  if (/(^|\/)lessons\.html$/.test(file) || file.startsWith('lessons/') || file.includes('/lessons/')) return 'lessons';
  if (/exam-practice|test-bank|admin-exam-access/.test(file)) return 'exam';
  if (file.startsWith('tools/') || file.includes('/tools/') || file.includes('engineering-tools')) return 'tools';
  if (/(^|\/)services\.html$/.test(file)) return 'services';
  if (/(^|\/)(about|faq|contact|request-topic|privacy|terms|request)\.html$/.test(file)) return 'about';
  return '';
}

function retag(open, kind) {
  let tag = open;
  if (/aria-label=/.test(tag)) tag = tag.replace(/aria-label="[^"]*"/, 'aria-label="Main"');
  else tag = tag.replace('<nav', '<nav aria-label="Main"');
  if (!/data-nav-root=/.test(tag)) tag = tag.replace('<nav', `<nav data-nav-root="${kind}"`);
  return tag;
}

function replaceNavs(source, tab) {
  return source.replace(/<nav\b([^>]*\bclass="[^"]*\b(desktop-nav|mobile-nav)\b[^"]*"[^>]*)>([\s\S]*?)<\/nav>/g, function (full, attrs, kind) {
    const open = retag(`<nav${attrs}>`, kind === 'mobile-nav' ? 'mobile' : 'desktop');
    const inner = markup(kind === 'mobile-nav' ? 'mobile' : 'desktop', tab);
    return `${open}${inner}</nav>`;
  });
}

function ensureScript(source) {
  if (source.includes('site-nav.js')) return source;
  if (!source.includes('site-sections.js') && !/<nav\b[^>]*\bdesktop-nav\b/.test(source)) return source;
  const block = '<link rel="stylesheet" href="/site-nav.css">\n<script src="/site-nav.js" defer></script>\n';
  if (source.includes('<script src="/site-sections.js"></script>')) {
    return source.replace('<script src="/site-sections.js"></script>', `${block}<script src="/site-sections.js"></script>`);
  }
  if (source.includes('<script src="/theme.js"></script>')) {
    return source.replace('<script src="/theme.js"></script>', `<script src="/theme.js"></script>\n${block}`);
  }
  if (source.includes('</head>')) return source.replace('</head>', `${block}</head>`);
  return source;
}

function ensureMobile(source, tab) {
  if (/<nav\b[^>]*\bmobile-nav\b/.test(source)) return source;
  if (!/<header\b[^>]*\bclass="[^"]*\bsite\b/.test(source)) return source;
  const block = `\n<nav class="mobile-nav" data-nav-root="mobile" aria-label="Main">${markup('mobile', tab)}</nav>`;
  return source.replace(/<header\b[^>]*\bclass="[^"]*\bsite\b[^"]*"[^>]*>[\s\S]*?<\/header>/, function (header) {
    return header + block;
  });
}

async function walk(dir, out) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
}

async function stampFallback() {
  const file = path.join(root, 'site-sections.js');
  const before = await readFile(file, 'utf8');
  const value = 'var USS_NAV_FALLBACK = ' + JSON.stringify({
    desktop: markup('desktop', ''),
    mobile: markup('mobile', '')
  }) + ';';
  const next = before.replace(
    /\/\* USS_NAV_FALLBACK_START \*\/[\s\S]*?\/\* USS_NAV_FALLBACK_END \*\//,
    '/* USS_NAV_FALLBACK_START */\n  ' + value + '\n  /* USS_NAV_FALLBACK_END */'
  );
  if (next === before) throw new Error('site-sections.js is missing the USS_NAV_FALLBACK markers');
  await writeFile(file, next);
  console.log('site-sections.js fallback markup');
}

const files = [];
await walk(root, files);
files.push(path.join(root, 'scripts', 'build-grade-specification-lookup.mjs'));
let changed = 0;
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const rel = path.relative(root, file);
  const interesting = /<nav\b[^>]*\b(desktop-nav|mobile-nav)\b/.test(before) || /<header\b[^>]*\bclass="[^"]*\bsite\b/.test(before) || before.includes('site-sections.js');
  if (!interesting) continue;
  let next = replaceNavs(before, currentTab(rel));
  if (file.endsWith('.html')) next = ensureMobile(next, currentTab(rel));
  if (file.endsWith('.html') || file.endsWith('.mjs')) next = ensureScript(next);
  if (next !== before) {
    await writeFile(file, next);
    changed += 1;
    console.log(rel);
  }
}
console.log(`Updated ${changed} files`);
await stampFallback();
