import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const cssPath = path.join(root, 'lessons', 'statistics', 'binomial-poisson-exponential-distributions.css');
const htmlPath = path.join(root, 'lessons', 'statistics', 'binomial-poisson-exponential-distributions.html');
const baseScriptPath = path.join(root, 'lessons', 'statistics', 'binomial-poisson-exponential-distributions-base.js');

const [css, html, baseScript] = await Promise.all([
  readFile(cssPath, 'utf8'),
  readFile(htmlPath, 'utf8'),
  readFile(baseScriptPath, 'utf8')
]);

const compact = css.replace(/\s+/g, ' ');
const failures = [];
const require = (condition, message) => { if (!condition) failures.push(message); };

require(/article\.lesson-wrapper\s*\{[^}]*display\s*:\s*block/i.test(css), 'Lesson must use a single centered reading column.');
require(!/\.lesson-wrapper\s*\{[^}]*grid-template-columns\s*:\s*250px/i.test(css), 'Persistent 250 px lesson sidebar is prohibited.');
require(/nav\.lesson-toc\s*\{[^}]*display\s*:\s*grid/i.test(css), 'Lesson contents must use the compact in-flow contents grid.');
require(!/nav\.lesson-toc\s*\{[^}]*position\s*:\s*sticky/i.test(css), 'Lesson contents must not remain as a sticky left rail.');
require(/\.lesson-card\s*\{[^}]*background\s*:\s*transparent/i.test(css), 'Ordinary lesson sections must remain unboxed.');
require(/\.lesson-card\s*\{[^}]*box-shadow\s*:\s*none/i.test(css), 'Ordinary lesson sections must not use dashboard shadows.');
require(/\.interactive-shell\s*\{[^}]*border-top\s*:\s*5px\s+solid\s+var\(--teal\)/i.test(css), 'Interactive tools require the restrained teal top accent.');
require(/main#lesson-content\s*\{[^}]*max-width\s*:\s*1060px/i.test(css), 'Reading canvas must use the approved 1060 px maximum width.');
require(/header\.site\.lesson-sitebar\s*\{[^}]*justify-content\s*:\s*flex-start/i.test(css), 'Header controls must remain grouped rather than spread across the full viewport.');
require(/\.site-actions\s*\{[^}]*margin-left\s*:\s*auto/i.test(css), 'Theme and account controls must align together on the right.');
require(/\.theme-toggle\s*\{[^}]*font-size\s*:\s*0\s*!important/i.test(css), 'Theme switch text must be visually hidden to prevent label collision.');
require(!/themeToggle\.textContent\s*=/.test(baseScript), 'Lesson JavaScript must not replace the theme switch with visible Light/Dark text.');
require(/h2\s*\{[^}]*border-bottom\s*:\s*3px\s+solid\s+var\(--amber\)/i.test(css), 'Section headings require the UpSkill Sprint amber hierarchy rule.');
require(/\.hero\s*\{[^}]*linear-gradient\(135deg,var\(--navy\),var\(--teal-dark\)\)/i.test(compact), 'Lesson hero must use the approved navy-to-teal treatment.');
require((html.match(/<nav[^>]*class=["'][^"']*lesson-toc/gi) || []).length === 1, 'Exactly one lesson contents navigation is required.');
require((html.match(/class=["'][^"']*lesson-card[^"']*["']/gi) || []).length >= 10, 'Expected lesson section hooks are missing.');

if (failures.length) {
  console.error('Probability lesson visual-contract validation failed:');
  failures.forEach(failure => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log('Probability lesson visual-contract validation passed.');
