import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const sourceDirectory = join(repositoryRoot, 'source-assets', 'grade-specification-lookup');
const outputDirectory = join(repositoryRoot, 'engineering-tools', 'grade-specification-lookup');
const guideDirectory = join(outputDirectory, 'how-to-use');

const sources = {
  application: {
    file: 'grade_spec_lookup.html.gz.b64',
    sha256: '93184e755a496d5d973bf5b2c164c72be8a4c97fecd66b213234d0de96a1e6eb'
  },
  guide: {
    file: 'grade_spec_lookup_user_guide.html.gz.b64',
    sha256: '9b9246bfe5bf96ed4b2335b60b4efeff21de973900b9d506b57fdbdf4cad992f'
  }
};

async function decodeOriginal(source) {
  const encoded = await readFile(join(sourceDirectory, source.file), 'utf8');
  const original = gunzipSync(Buffer.from(encoded.trim(), 'base64'));
  const digest = createHash('sha256').update(original).digest('hex');

  if (digest !== source.sha256) {
    throw new Error(`Source integrity check failed for ${source.file}. Expected ${source.sha256}; received ${digest}.`);
  }

  return original.toString('utf8');
}

function prepareApplication(originalHtml) {
  return originalHtml
    .replace('href="grade_spec_lookup_user_guide.html"', 'href="./how-to-use/"')
    .replace(
      '</head>',
      '<meta name="description" content="Interactive steel grade specification lookup, compliance checker, comparison tool, and engineering calculators.">\n' +
      '<link rel="canonical" href="https://upskillsprint.com/engineering-tools/grade-specification-lookup/">\n' +
      '</head>'
    );
}

function prepareGuide(originalHtml) {
  return originalHtml
    .replaceAll('href="grade_spec_lookup.html#compliance"', 'href="../#compliance"')
    .replaceAll('href="grade_spec_lookup.html"', 'href="../"')
    .replace(
      '</head>',
      '<meta name="description" content="User guide for the UpSkill Sprint Grade Specification Lookup and Compliance Tool.">\n' +
      '<link rel="canonical" href="https://upskillsprint.com/engineering-tools/grade-specification-lookup/how-to-use/">\n' +
      '</head>'
    );
}

async function build() {
  const [applicationSource, guideSource] = await Promise.all([
    decodeOriginal(sources.application),
    decodeOriginal(sources.guide)
  ]);

  // The route is always rebuilt from an empty directory so no legacy loader,
  // payload fragment, alias, or wrapper can survive a deployment.
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(guideDirectory, { recursive: true });

  await Promise.all([
    writeFile(join(outputDirectory, 'index.html'), prepareApplication(applicationSource), 'utf8'),
    writeFile(join(guideDirectory, 'index.html'), prepareGuide(guideSource), 'utf8')
  ]);

  console.log('Grade Specification Lookup rebuilt from verified original sources.');
  console.log(`Application: ${join(outputDirectory, 'index.html')}`);
  console.log(`User guide: ${join(guideDirectory, 'index.html')}`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
