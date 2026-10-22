import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const page = 'lessons/power-bi-excel-sql/minitab-control-chart-selection-analysis.html';
const fragmentDir = 'lessons/assets/minitab-control-chart-selection-analysis';
const fragments = [
  '01-intro-foundations.html',
  '02-selector.html',
  '03a-categories-core.html',
  '03b-categories-advanced.html',
  '04-workflow-example.html',
  '05-lab-interpretation.html',
  '06-mistakes-practice-quiz.html',
  '07-summary.html'
];

export async function renderMinitabGuide(siteDir) {
  const file = join(siteDir, page);
  const html = await readFile(file, 'utf8');
  const content = (await Promise.all(fragments.map(name =>
    readFile(join(siteDir, fragmentDir, name), 'utf8')))).join('');
  // Parse only: do not execute page scripts or fetch external resources.
  const dom = new JSDOM(html, { includeNodeLocations: true });
  try {
    const root = dom.window.document.getElementById('lesson-fragment-root');
    const location = root && dom.nodeLocation(root);
    if (root?.tagName !== 'ARTICLE' || !location?.endTag) {
      throw new Error('Minitab guide: expected the lesson-fragment-root article.');
    }
    root.innerHTML = content;
    for (const selector of ['h1', '#selector-form', '#imr-data', '#quiz-form']) {
      if (root.querySelectorAll(selector).length !== 1) {
        throw new Error('Minitab guide: expected exactly one ' + selector);
      }
    }
    root.removeAttribute('aria-live');
    root.setAttribute('data-prerendered', 'true');
    const opening = root.cloneNode(false).outerHTML.replace(/<\/article>$/, '');
    // Keep the fragments and everything outside the article byte-for-byte.
    const output = html.slice(0, location.startOffset) + opening + content
      + html.slice(location.endTag.startOffset);
    await writeFile(file, output, 'utf8');
  } finally {
    dom.window.close();
  }
}
