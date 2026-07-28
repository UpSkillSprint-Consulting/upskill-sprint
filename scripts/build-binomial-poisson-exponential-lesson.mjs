import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'lessons', 'statistics', 'binomial-poisson-exponential-distributions-source');
const outputPath = path.join(root, 'lessons', 'statistics', 'binomial-poisson-exponential-distributions.html');
const parts = ['part-01.htmlfrag', 'part-02.htmlfrag', 'part-03.htmlfrag', 'part-04.htmlfrag'];

const lesson = (await Promise.all(parts.map(name => readFile(path.join(sourceDir, name), 'utf8')))).join('');
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, lesson, 'utf8');

const libraryPath = path.join(root, 'chi-square-lesson-library.js');
let library = await readFile(libraryPath, 'utf8');
const marker = "data-binomial-poisson-exponential-distributions";
if (!library.includes(marker)) {
  const insertionPoint = "    {\n      marker: 'data-beyond-the-bell',";
  const entry = `    {\n      marker: 'data-binomial-poisson-exponential-distributions',\n      sectionId: 'statistics',\n      path: '/lessons/statistics/binomial-poisson-exponential-distributions',\n      topic: 'statistics',\n      level: 'beginner',\n      interactive: 'true',\n      search: 'binomial poisson exponential distributions probability event count yes no trials waiting time poisson process rare event approximation pmf pdf cdf survival c chart u chart p chart np chart excel minitab quality engineering statistics beginner interactive simulator calculator',\n      meta: '<span>Beginner</span><span>Interactive</span><span>25 min</span><span>Excel + Minitab</span>',\n      title: 'Binomial vs. Poisson vs. Exponential',\n      description: 'Choose the right event model, calculate exact and cumulative probabilities, and explore simulations, waiting times, assumptions, and c/u charts.'\n    },\n`;
  if (!library.includes(insertionPoint)) {
    throw new Error('Could not locate the Statistics lesson insertion point in chi-square-lesson-library.js');
  }
  library = library.replace(insertionPoint, entry + insertionPoint);
  await writeFile(libraryPath, library, 'utf8');
}

console.log('Built Binomial, Poisson, and Exponential lesson and registered it in the Statistics library.');
