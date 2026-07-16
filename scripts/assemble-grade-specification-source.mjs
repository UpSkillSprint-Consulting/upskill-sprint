import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const sourceDirectory = join(repositoryRoot, 'source-assets', 'grade-specification-lookup');
const chunkPrefix = 'grade_spec_lookup.html.br.b64.chunk-';
const assembledPath = join(sourceDirectory, 'grade_spec_lookup.html.br.b64.part-01');

const chunkNames = (await readdir(sourceDirectory))
  .filter((name) => name.startsWith(chunkPrefix))
  .sort();

if (!chunkNames.length) {
  throw new Error(`No Grade Specification Lookup source chunks were found with prefix ${chunkPrefix}.`);
}

const chunks = await Promise.all(chunkNames.map(async (name) => {
  const text = await readFile(join(sourceDirectory, name), 'utf8');
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .join('');
}));

const assembled = chunks.join('');
if (!/^[A-Za-z0-9+/=]+$/.test(assembled)) {
  throw new Error('The assembled Grade Specification Lookup source contains invalid base64 characters.');
}

await writeFile(assembledPath, assembled, 'utf8');
console.log(`Assembled ${chunkNames.length} verified source chunks into ${assembledPath}.`);

execFileSync(process.execPath, [join(scriptDirectory, 'build-grade-specification-lookup.mjs')], {
  cwd: repositoryRoot,
  stdio: 'inherit'
});
