/* Stamp the shared dropdown markup into every copy of the primary nav.
   Menu content lives in site-nav.js; this script only writes that HTML.
   It also copies the same markup into site-sections.js so pages that build
   a header at runtime (no static nav) still get the dropdowns. */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { currentTab, replaceNavs, ensureScript, ensureMobile } from './lib/site-chrome.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { markup } = createRequire(import.meta.url)(path.join(root, 'site-nav.js'));

const SKIP = new Set(['node_modules', '.git', 'public-site', '.tmp', 'artifacts']);

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
