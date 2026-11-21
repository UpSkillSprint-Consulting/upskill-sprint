// Build gate for the Code Finder catalog (data/code-finder/).
// Exits 1 with a list of problems so a bad data PR fails the Netlify deploy.
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {catalogStats, loadCatalog, validateCatalog} from './lib/code-finder-catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = await loadCatalog(join(root, 'data', 'code-finder'));
const errors = validateCatalog(catalog, {root});
if (errors.length) {
  console.error(`Code Finder catalog has ${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
const stats = catalogStats(catalog);
console.log(`Code Finder catalog valid: ${stats.total} records ${JSON.stringify(stats.byBody)}, ${stats.verified} verified in the last 12 months, ${stats.rich} with key points (indexable pages).`);
