import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const lessonDir = path.join(root, 'lessons', 'statistics');
const sourceDir = path.join(lessonDir, 'binomial-poisson-exponential-distributions-source');
const outputPath = path.join(lessonDir, 'binomial-poisson-exponential-distributions.html');
const cssPath = path.join(lessonDir, 'binomial-poisson-exponential-distributions.css');
const scriptPaths = [
  path.join(lessonDir, 'binomial-poisson-exponential-distributions-base.js'),
  path.join(lessonDir, 'binomial-poisson-exponential-distributions-concepts.js'),
  path.join(lessonDir, 'binomial-poisson-exponential-distributions-workbench.js'),
  path.join(lessonDir, 'binomial-poisson-exponential-distributions-quality.js')
];
const partNames = ['part-01.htmlfrag', 'part-02.htmlfrag', 'part-03.htmlfrag', 'part-04.htmlfrag'];

const [parts, lessonCss, lessonScripts] = await Promise.all([
  Promise.all(partNames.map(name => readFile(path.join(sourceDir, name), 'utf8'))),
  readFile(cssPath, 'utf8'),
  Promise.all(scriptPaths.map(file => readFile(file, 'utf8')))
]);

const scriptBundle = lessonScripts
  .map((source, index) => `/* ${path.basename(scriptPaths[index])} */\n${source.trim()}`)
  .join('\n\n');

let lesson = parts.join('\n');
lesson = lesson.replace('<!-- LESSON_STYLE_BUNDLE -->', `<style>\n${lessonCss.trim()}\n</style>`);
lesson = lesson.replace('<!-- LESSON_SCRIPT_BUNDLE -->', `<script>\n${scriptBundle}\n</script>`);

const stripTags = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const extractIds = html => [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map(match => match[1]);
const duplicateValues = values => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

function validateLesson(html, css) {
  const errors = [];
  const warnings = [];
  const require = (condition, message) => { if (!condition) errors.push(message); };

  require(html.includes('UPSKILLSPRINT_LESSON_META'), 'Missing UPSKILLSPRINT_LESSON_META block.');
  const bodyTag = (html.match(/<body\b[^>]*>/i) || [''])[0];
  require(['data-lesson-page="true"', 'data-category="statistics"', 'data-level="beginner"', 'data-interactive="true"'].every(token => bodyTag.includes(token)), 'Body integration data attributes are missing.');
  require(html.includes('<!-- EDIT: Lesson styles -->'), 'Missing lesson-style edit marker.');
  require(html.includes('<!-- EDIT: Interactive lesson JavaScript -->'), 'Missing lesson-script edit marker.');
  require(!html.includes('LESSON_STYLE_BUNDLE') && !html.includes('LESSON_SCRIPT_BUNDLE'), 'Build placeholders remain in assembled HTML.');
  require(/<img\b[^>]*src=["']\/assets\/logo-icon\.png["']/i.test(html), 'Required logo path is missing.');
  require(/<a\b[^>]*class=["'][^"']*brand-link[^"']*["'][^>]*href=["']\/["']/i.test(html), 'Required home brand link is missing.');
  require(/<a\b[^>]*class=["'][^"']*back-link[^"']*["'][^>]*href=["']\/lessons#statistics["'][^>]*>\s*Back to Statistics\s*<\/a>/i.test(html), 'Required Back to Statistics header link is missing.');
  require(/<button\b[^>]*class=["'][^"']*theme-toggle[^"']*["'][^>]*data-theme-toggle=["']true["'][^>]*role=["']switch["']/i.test(html), 'Theme toggle is missing required hooks.');
  require((html.match(/<script\b[^>]*src=["']\/theme\.js["'][^>]*><\/script>/gi) || []).length === 1, 'Exactly one shared /theme.js script is required.');
  require((html.match(/<script\b[^>]*src=["']\/site-sections\.js["'][^>]*><\/script>/gi) || []).length === 1, 'Exactly one shared /site-sections.js script is required.');
  require(/<main\b[^>]*id=["']lesson-content["']/i.test(html), 'Semantic main#lesson-content is missing.');
  require(/<article\b[^>]*class=["'][^"']*lesson-wrapper/i.test(html), 'Semantic lesson article wrapper is missing.');
  require(/<a\b[^>]*class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#lesson-content["']/i.test(html), 'Skip link is missing.');
  const canonicalTag = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || html.match(/<link\b[^>]*href=["']https:\/\/upskillsprint\.com\/lessons\/statistics\/binomial-poisson-exponential-distributions["'][^>]*>/i) || [''])[0];
  require(canonicalTag.includes('https://upskillsprint.com/lessons/statistics/binomial-poisson-exponential-distributions') && !canonicalTag.includes('.html'), 'Canonical URL is missing or exposes .html.');
  require(!/href=["'][^"']+\.html(?:[?#][^"']*)?["']/i.test(html), 'Internal links must not expose .html extensions.');

  const ids = extractIds(html);
  const duplicateIds = duplicateValues(ids);
  require(duplicateIds.length === 0, `Duplicate IDs found: ${duplicateIds.join(', ')}`);

  const targetIds = new Set(ids);
  const internalTargets = [...html.matchAll(/href=["']#([^"']+)["']/gi)].map(match => match[1]);
  const missingTargets = [...new Set(internalTargets.filter(target => !targetIds.has(target)))];
  require(missingTargets.length === 0, `Internal navigation target(s) missing: ${missingTargets.join(', ')}`);

  const quizCount = (html.match(/class=["'][^"']*quiz-question[^"']*["']/gi) || []).length;
  require(quizCount === 5, `Quiz must contain exactly five questions; found ${quizCount}.`);
  require(/id=["']resetQuizBtn["']/i.test(html), 'Quiz reset control is missing.');
  require(/id=["']quizScore["'][^>]*aria-live=/i.test(html) || /aria-live=["'][^"']+["'][^>]*id=["']quizScore["']/i.test(html), 'Quiz score requires an aria-live region.');
  require(/expected count in 300 m/i.test(html), 'Quiz is missing a calculation question.');
  require(/What does P\(T &gt; 75\)/i.test(html), 'Quiz is missing an interpretation question.');
  require(/challenges a basic Poisson model/i.test(html), 'Quiz is missing an assumption question.');
  require(/different inspected lengths/i.test(html), 'Quiz is missing a practical chart-selection question.');

  require(!/\son[a-z]+\s*=/i.test(html), 'Inline event handlers are not allowed.');
  require(!/data:(?:text|application)\/[a-z0-9.+-]+;base64,/i.test(html), 'Base64-encoded source is not allowed.');
  require(!/document\.write\s*\(/i.test(html), 'document.write is not allowed.');
  require((html.match(/<style\b/gi) || []).length === 1, 'The assembled lesson must contain exactly one lesson-specific style block.');
  require((html.match(/<script(?!\b[^>]*\bsrc=)[^>]*>/gi) || []).length === 1, 'The assembled lesson must contain one bundled inline lesson script.');
  require(!/<script\b[^>]*src=["'][^"']*binomial-poisson-exponential-distributions(?:-base|-concepts|-workbench|-quality)?\.js/i.test(html), 'Lesson-specific JavaScript must be bundled into the final HTML.');
  require(!/binomial-poisson-exponential-distributions\.css/i.test(html), 'Lesson-specific CSS must be bundled into the final HTML.');

  const requiredIds = [
    'learning-objectives', 'key-concepts', 'model-selector', 'binomial',
    'rare-event-approximation', 'live-lab', 'formulas', 'memoryless',
    'worked-example', 'probability-workbench', 'quality-charts', 'attribute-lab',
    'selection-procedure', 'interpretation', 'common-mistakes', 'assumptions',
    'software', 'practice', 'quiz', 'summary'
  ];
  const missingSections = requiredIds.filter(id => !targetIds.has(id));
  require(missingSections.length === 0, `Required lesson section(s) missing: ${missingSections.join(', ')}`);

  const headingNumbers = [...html.matchAll(/<h2[^>]*>\s*(\d+)\./gi)].map(match => Number(match[1]));
  const expectedHeadingNumbers = Array.from({ length: 19 }, (_, index) => index + 1);
  require(JSON.stringify(headingNumbers) === JSON.stringify(expectedHeadingNumbers), `Numbered h2 sections must run 1–19 in order; found ${headingNumbers.join(', ')}.`);

  require(/class=["'][^"']*formula-guide[^"']*["']/i.test(html), 'Formula guidance blocks are missing.');
  require(/Symbols and units/i.test(html) && /Use it when/i.test(html) && /Do not use it when/i.test(html), 'Formula sections must explain symbols, units, use conditions, and non-use conditions.');
  require(/Problem setup/i.test(html) && /Substitution/i.test(html) && /Limitations/i.test(html), 'Worked examples must include setup, substitution, interpretation, and limitations.');
  require(/Calculation mistakes/i.test(html) && /Interpretation mistakes/i.test(html) && /Assumption mistakes/i.test(html) && /Software-output mistakes/i.test(html) && /Exam traps/i.test(html), 'Common mistakes are not organized into all required categories.');
  require(/Try it first/i.test(html), 'Practice section must prompt the learner to try before revealing the solution.');
  require(/<div\b(?=[^>]*\bid=["']practiceAnswer["'])(?=[^>]*\bhidden\b)[^>]*>/i.test(html) && /aria-controls=["']practiceAnswer["']/i.test(html), 'Primary practice answer must start hidden and be linked to its reveal control.');
  require(/<div\b(?=[^>]*\bid=["']extensionAnswer["'])(?=[^>]*\bhidden\b)[^>]*>/i.test(html) && /aria-controls=["']extensionAnswer["']/i.test(html), 'Extension answer must start hidden and be linked to its reveal control.');
  const requiredResetIds = ['resetSelectorBtn', 'resetBinomialBtn', 'resetLabBtn', 'resetCalcBtn', 'wbResetBtn', 'resetAttributeBtn', 'assumptionResetBtn', 'resetQuizBtn'];
  const missingResetIds = requiredResetIds.filter(id => !targetIds.has(id));
  require(missingResetIds.length === 0, `Required reset control(s) missing: ${missingResetIds.join(', ')}`);
  require(/References/i.test(html), 'References section is missing.');

  const requiredCssVariables = [
    '--paper', '--surface', '--surface-soft', '--ink', '--ink-soft', '--navy',
    '--teal', '--teal-dark', '--amber', '--success', '--warning', '--danger',
    '--info', '--radius-sm', '--radius-md', '--radius-lg', '--shadow-sm', '--shadow-md'
  ];
  const missingVariables = requiredCssVariables.filter(variable => !new RegExp(`${escapeRegExp(variable)}\\s*:`).test(css));
  require(missingVariables.length === 0, `Required CSS variable(s) missing: ${missingVariables.join(', ')}`);
  require(/html\[data-theme=["']dark["']\]/i.test(css), 'Dark-theme variable overrides are missing.');
  require(/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(css), 'Reduced-motion treatment is missing.');
  require(/:focus-visible/i.test(css), 'Visible keyboard focus treatment is missing.');
  require(/@media\s*\(max-width:/i.test(css), 'Responsive breakpoints are missing.');
  require(/@media\s+print/i.test(css), 'Print treatment is missing.');

  const buttons = [...html.matchAll(/<(?:button|a)\b[^>]*>([\s\S]*?)<\/(?:button|a)>/gi)].map(match => stripTags(match[1]));
  const arrowLabels = buttons.filter(label => /^[←→↔⇄▶◀]|[←→↔⇄▶◀]$/.test(label));
  require(arrowLabels.length === 0, `Navigation or button labels must not use decorative arrows: ${arrowLabels.join(' | ')}`);

  if (!/aria-describedby=["'][^"']+["']/i.test(html)) warnings.push('No aria-describedby relationships were found.');
  if (!/role=["']img["']/i.test(html)) warnings.push('No accessible chart role was found.');

  return { errors, warnings };
}

const validation = validateLesson(lesson, lessonCss);
if (validation.errors.length) {
  console.error('Binomial/Poisson/Exponential lesson validation failed:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  process.exitCode = 1;
  throw new Error(`Lesson validation failed with ${validation.errors.length} error(s).`);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, lesson, 'utf8');

const libraryPath = path.join(root, 'chi-square-lesson-library.js');
let library = await readFile(libraryPath, 'utf8');
const marker = 'data-binomial-poisson-exponential-distributions';
const insertionPoint = "    {\n      marker: 'data-beyond-the-bell',";
const entry = `    {\n      marker: 'data-binomial-poisson-exponential-distributions',\n      sectionId: 'statistics',\n      path: '/lessons/statistics/binomial-poisson-exponential-distributions',\n      topic: 'statistics',\n      level: 'beginner',\n      interactive: 'true',\n      search: 'binomial poisson exponential distributions probability event count yes no trials waiting time poisson process rare event approximation pmf cdf survival c chart u chart p chart np chart excel minitab quality engineering statistics beginner interactive simulator calculator',\n      meta: '<span>Beginner</span><span>Interactive</span><span>50 min</span><span>Excel + Minitab</span>',\n      title: 'Binomial vs. Poisson vs. Exponential',\n      description: 'Choose the right event model, calculate exact and cumulative probabilities, and explore simulations, waiting times, assumptions, and c/u charts.'\n    },\n`;

const existingEntryPattern = /    \{\n      marker: 'data-binomial-poisson-exponential-distributions',[\s\S]*?\n    \},\n/;
if (existingEntryPattern.test(library)) {
  library = library.replace(existingEntryPattern, entry);
} else {
  if (!library.includes(insertionPoint)) {
    throw new Error('Could not locate the Statistics lesson insertion point in chi-square-lesson-library.js');
  }
  library = library.replace(insertionPoint, entry + insertionPoint);
}
await writeFile(libraryPath, library, 'utf8');

console.log(`Built and validated Binomial, Poisson, and Exponential lesson (${validation.warnings.length} warning(s)).`);
validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
