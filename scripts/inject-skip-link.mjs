// Adds one "Skip to main content" link to every public page that does not
// already have a skip link, at build time, so no page has to carry it by hand.
// The link is the first thing in <body> and targets the page's single <main>,
// giving that <main> an id when it has none. Pages that already have a skip
// link (older lessons, the tools) are left alone, so no page gets two.
//
// Skipped: HTML fragments (no </body>), pages with no single <main> (tool
// access shells and redirect stubs, whose real document carries its own
// link), and lesson loaders that replace themselves with the lesson document
// (lesson-payload-swap.js).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRAGMENT_DIRS = ['lessons/assets/', 'test-bank-assets/'];

export const SKIP_LINK_TEXT = 'Skip to main content';
export const SKIP_LINK_CLASS = 'uss-skip-link';
export const DEFAULT_MAIN_ID = 'main-content';
// Navy on white text is 17:1. The white-then-navy ring keeps the focused link
// visible on light and dark pages; the transparent outline shows in forced colours.
export const SKIP_LINK_STYLE = '<style id="uss-skip-link-style">' +
  '.uss-skip-link{position:fixed;left:12px;top:-200px;z-index:2147483000;padding:10px 16px;border-radius:8px;' +
  'background:#0d1b30;color:#fff;font:700 16px/1.25 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:underline}' +
  '.uss-skip-link:focus{top:12px;outline:2px solid transparent;box-shadow:0 0 0 2px #fff,0 0 0 5px #0d1b30}' +
  '@media print{.uss-skip-link{display:none}}</style>';

/** Blanks out <script>, <style>, <template> and comment contents (same length), so markup
 *  inside JavaScript strings, such as a printable report template, is never mistaken for the page's own. */
export function maskInert(html) {
  return html.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)|(<style\b[^>]*>)([\s\S]*?)(<\/style>)|(<template\b[^>]*>)([\s\S]*?)(<\/template>)|<!--[\s\S]*?-->/gi,
    (m, a, b, c, d, e, f, g, h, i) => {
      if (a) return a + ' '.repeat(b.length) + c;
      if (d) return d + ' '.repeat(e.length) + f;
      if (g) return g + ' '.repeat(h.length) + i;
      return ' '.repeat(m.length);
    });
}

/** True when the page already has an in-page link whose text starts with "Skip". */
export function hasSkipLink(html) {
  return /<a\b[^>]*\bhref="#[^"]+"[^>]*>\s*Skip\b/i.test(maskInert(html));
}

/** Returns the page with the skip link added, or null if it should not change. */
export function injectSkipLink(html) {
  if (html.includes('/lesson-payload-swap.js')) return null;
  const masked = maskInert(html);
  if (!/<\/body>/i.test(masked) || !/<\/head>/i.test(masked)) return null;
  if (/<a\b[^>]*\bhref="#[^"]+"[^>]*>\s*Skip\b/i.test(masked)) return null;
  const mains = [...masked.matchAll(/<main\b[^>]*>/gi)];
  if (mains.length !== 1) return null;
  const body = /<body\b[^>]*>/i.exec(masked);
  const head = masked.search(/<\/head>/i);
  if (!body || head > body.index) return null;

  const main = mains[0];
  let id = (/\bid="([^"]+)"/.exec(main[0]) || [])[1];
  let mainTag = main[0];
  if (!id) {
    id = DEFAULT_MAIN_ID;
    if (new RegExp('\\bid="' + id + '"').test(masked)) return null; // never create a duplicate id
    mainTag = main[0].replace(/^<main\b/i, '<main id="' + id + '"');
  }
  const link = '\n<a class="' + SKIP_LINK_CLASS + '" href="#' + id + '">' + SKIP_LINK_TEXT + '</a>';
  const bodyEnd = body.index + body[0].length;
  // Splice from the end backwards so earlier offsets stay valid.
  let page = html.slice(0, main.index) + mainTag + html.slice(main.index + main[0].length);
  page = page.slice(0, bodyEnd) + link + page.slice(bodyEnd);
  return page.slice(0, head) + SKIP_LINK_STYLE + '\n' + page.slice(head);
}

export function shouldInject(rel) {
  const p = rel.split(sep).join('/');
  return !FRAGMENT_DIRS.some(d => p.startsWith(d));
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.toLowerCase().endsWith('.html')) yield full;
  }
}

export async function injectSkipLinks(siteDir) {
  let added = 0;
  for await (const file of htmlFiles(siteDir)) {
    if (!shouldInject(relative(siteDir, file))) continue;
    const next = injectSkipLink(await readFile(file, 'utf8'));
    if (next === null) continue;
    await writeFile(file, next);
    added++;
  }
  console.log(`Skip link added to ${added} pages.`);
  return added;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await injectSkipLinks(process.argv[2] ? resolve(process.argv[2]) : join(root, 'public-site'));
}
