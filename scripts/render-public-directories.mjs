import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

// Build-time pre-render of the lesson library so every lesson link is in the
// initial HTML. Only the #lesson-library section is replaced; everything else
// in lessons.html (including the CollectionPage/ItemList JSON-LD) is kept
// byte-for-byte. At runtime chi-square-lesson-library.js finds each row by its
// marker attribute and does not add it again.
export async function renderPublicDirectories(siteDir) {
  const file = join(siteDir, 'lessons.html');
  const html = await readFile(file, 'utf8');
  const library = await readFile(join(siteDir, 'chi-square-lesson-library.js'), 'utf8');
  const locator = new JSDOM(html, { includeNodeLocations: true });
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/lessons', runScripts: 'outside-only' });
  try {
    const original = locator.window.document.getElementById('lesson-library');
    const location = original && locator.nodeLocation(original);
    if (!original || original.getAttribute('data-catalog-render') !== 'build' || !location?.endTag) {
      throw new Error('Lesson directory build marker is missing.');
    }
    const w = dom.window;
    w.eval(library);
    if (w.document.readyState === 'loading') {
      w.document.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true }));
    }
    await new Promise(resolve => w.setTimeout(resolve, 0));
    const root = w.document.getElementById('lesson-library');
    const rows = Array.from(root.querySelectorAll('[data-lesson-item]'));
    const paths = rows.map(row => new URL(row.getAttribute('href'), w.location.origin).pathname.replace(/\.html$/, '').replace(/\/$/, ''));
    if (new Set(paths).size !== paths.length) throw new Error('Duplicate lesson URLs after catalogue rendering.');
    const expected = [...library.matchAll(/\bpath: '([^']+)'/g)].map(m => m[1].replace(/\.html$/, '').replace(/\/$/, ''));
    const missing = expected.filter(p => !paths.includes(p));
    if (!expected.length || missing.length) throw new Error(`Lesson catalogue paths missing from the pre-rendered directory: ${missing.join(', ') || 'none found'}`);
    const output = html.slice(0, location.startOffset) + root.outerHTML + html.slice(location.endTag.endOffset);
    await writeFile(file, output, 'utf8');
    return rows.length;
  } finally {
    dom.window.close();
    locator.window.close();
  }
}
