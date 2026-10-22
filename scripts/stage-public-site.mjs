import { cp, readdir, rm, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';
import { privateToolPath } from '../content/tool-catalog.mjs';
import { renderMinitabGuide } from './render-minitab-guide.mjs';
import { renderPublicDirectories } from './render-public-directories.mjs';

// A separate publish directory keeps function source and grading keys off the CDN.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const excludedDirectories = new Set([
  'netlify', 'supabase', 'exam-catalog', 'nppe', 'test-bank-assets', 'node_modules', 'scripts', 'tests', 'docs', 'content', 'source-assets',
  'public-site', 'coverage', 'test-results', 'playwright-report'
]);
// Authoring aids that live at the repo root but are not public pages.
export const excludedFiles = new Set([
  'upskillsprint_lesson_theme_reference.html',
  'lesson-template.html'
]);
// The statistics calculator also uses these mathematical tables. They contain
// no exam questions, keys or learner information.
export const publicExamUtilities = new Set(['test-bank-tables.js']);
export async function stagePublicSite(source = root, destination = join(root, 'public-site')) {
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  let count = 0;
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || excludedDirectories.has(entry.name) || excludedFiles.has(entry.name)
      || entry.name === 'test-bank.html' || /^test-bank-.*\.js$/i.test(entry.name) && !publicExamUtilities.has(entry.name)) continue;
    if (entry.isDirectory()) {
      await cp(join(source, entry.name), join(destination, entry.name), {
        recursive: true,
        filter: path => !path.split('/').some(part => part.startsWith('.')) && !privateToolPath(relative(source,path))
      });
      count++;
    } else if (/\.(?:html|css|js|json|pdf|png|jpg|jpeg|svg|webp|ico|txt|xml|webmanifest)$/i.test(entry.name)
      && !/^(?:package(?:-lock)?\.json|vite\.config\.js)$/.test(entry.name)) {
      await cp(join(source, entry.name), join(destination, entry.name));
      count++;
    }
  }
  console.log(`Staged ${count} public entries; server code and private grading keys excluded.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await stagePublicSite();
  await renderMinitabGuide(join(root, 'public-site'));
  await renderPublicDirectories(join(root, 'public-site'));
}
