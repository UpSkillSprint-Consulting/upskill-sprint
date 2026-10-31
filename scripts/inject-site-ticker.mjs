// Adds the site updates ticker script to every public page at build time, so no
// page has to carry the tag by hand. The script fetches /site-updates.json and
// shows nothing when there are no current headlines, so the tag is safe everywhere.
//
// Skipped: pages listed in EXCLUDE_PATHS inside site-ticker.js (exams, sign-in),
// and HTML fragments that other pages fetch at runtime (no </body>).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { excluded } = require(join(root, 'site-ticker.js'));

export const TICKER_TAG = '<script src="/site-ticker.js" defer></script>';
const FRAGMENT_DIRS = ['lessons/assets/', 'test-bank-assets/'];

/** Returns the page with the tag added before </body>, or null if it should not change. */
export function injectTag(html) {
  if (html.includes('/site-ticker.js')) return null;
  const at = html.lastIndexOf('</body>');
  if (at === -1) return null;
  return html.slice(0, at) + TICKER_TAG + '\n' + html.slice(at);
}

/** Site path for a staged file, e.g. "lessons/x.html" -> "/lessons/x". */
export function sitePath(rel) {
  return '/' + rel.split(sep).join('/').replace(/(?:\/index)?\.html$/i, '');
}

export function shouldInject(rel) {
  const p = rel.split(sep).join('/');
  if (FRAGMENT_DIRS.some(d => p.startsWith(d))) return false;
  return !excluded(sitePath(rel));
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.toLowerCase().endsWith('.html')) yield full;
  }
}

export async function injectSiteTicker(siteDir) {
  let added = 0;
  for await (const file of htmlFiles(siteDir)) {
    const rel = relative(siteDir, file);
    if (!shouldInject(rel)) continue;
    const next = injectTag(await readFile(file, 'utf8'));
    if (next === null) continue;
    await writeFile(file, next);
    added++;
  }
  console.log(`Site ticker tag added to ${added} pages.`);
  return added;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await injectSiteTicker(process.argv[2] ? resolve(process.argv[2]) : join(root, 'public-site'));
}
