const {test, before} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'data', 'code-finder');
let lib, catalog;
const clone = value => JSON.parse(JSON.stringify(value));
const TODAY = new Date('2026-11-20T12:00:00Z');

before(async () => {
  lib = await import('../scripts/lib/code-finder-catalog.mjs');
  catalog = await lib.loadCatalog(DATA);
});

// Run the validator on a mutated copy and assert one specific problem is reported.
function expectProblem(mutate, pattern, options = {}) {
  const copy = clone(catalog);
  mutate(copy);
  const errors = lib.validateCatalog(copy, {today: TODAY, ...options});
  assert.ok(errors.some(error => pattern.test(error)), `expected ${pattern} in:\n${errors.join('\n')}`);
}
const record = (copy, id) => copy.standards.standards.find(item => item.id === id);

test('the shipped catalog passes every check, including links to real lesson pages', () => {
  assert.deepEqual(lib.validateCatalog(catalog, {root: ROOT, today: TODAY}), []);
});

test('the MVP seed covers at least 150 records across API, CSA, ASTM and ISO', () => {
  const stats = lib.catalogStats(catalog, TODAY);
  assert.ok(stats.total >= 150, `only ${stats.total} records`);
  for (const body of ['API', 'CSA', 'ASTM', 'ISO']) assert.ok(stats.byBody[body] >= 25, `${body} has ${stats.byBody[body]}`);
});

test('every category and use case in the taxonomy has at least one code behind it', () => {
  const records = catalog.standards.standards;
  for (const facet of ['categories', 'useCases']) {
    const used = new Set(records.flatMap(item => item[facet]));
    const empty = catalog.taxonomy.facets[facet].map(entry => entry.slug).filter(slug => !used.has(slug));
    assert.deepEqual(empty, [], `${facet} with no records`);
  }
});

test('shop-floor words people actually type are mapped by the synonym list', () => {
  const phrases = new Set(catalog.synonyms.synonyms.flatMap(entry => [entry.term, ...entry.aliases]));
  for (const phrase of ['charpy', 'line pipe', 'linepipe', 'mtr', 'fmea', 'gauge r&r', 'cpk', 'wps', 'hydrotest', 'rbi', 'smart pig', 'loto'])
    assert.ok(phrases.has(phrase), `"${phrase}" is not mapped`);
});

test('summaries are our own plain words, not copied normative text', () => {
  for (const item of catalog.standards.standards) {
    assert.doesNotMatch(item.summary, /\bshall\b/i, `${item.id} summary reads like standard text`);
  }
});

test('edition and "mandatory where" claims only appear on verified records', () => {
  for (const item of catalog.standards.standards) {
    if (item.edition) assert.ok(item.verified, `${item.id} states an edition without a verified date`);
    for (const adoption of item.adoptions) assert.ok(adoption.verified, `${item.id} adoption is unverified`);
  }
});

test('the validator rejects facet values that are not in the taxonomy', () => {
  expectProblem(copy => record(copy, 'api-5l').categories.push('plumbing'), /api-5l: categories has unknown value "plumbing"/);
  expectProblem(copy => { record(copy, 'api-5l').useCases = []; }, /api-5l: useCases must be a non-empty list/);
});

test('the validator rejects broken relations and duplicate ids', () => {
  expectProblem(copy => record(copy, 'api-5l').relations.push({to: 'api-9999', type: 'similar'}), /unknown id "api-9999"/);
  expectProblem(copy => record(copy, 'api-5l').relations.push({to: 'api-5l', type: 'similar'}), /points at itself/);
  expectProblem(copy => record(copy, 'api-5l').relations.push({to: 'iso-3183', type: 'cousin'}), /unknown relation type "cousin"/);
  expectProblem(copy => { copy.standards.standards[1] = {...copy.standards.standards[1], id: 'api-5l'}; }, /duplicate id "api-5l"/);
});

test('the validator requires dates on editions and adoptions and refuses future dates', () => {
  expectProblem(copy => { record(copy, 'api-5l').verified = null; }, /api-5l: an edition needs a verified date/);
  expectProblem(copy => { delete record(copy, 'api-5l').adoptions[0].verified; }, /api-5l: adoption needs a past verified date/);
  expectProblem(copy => { record(copy, 'csa-z662').verified = '2027-01-01'; }, /csa-z662: verified must be null or a past/);
  expectProblem(copy => { record(copy, 'csa-z662').verified = '2026-02-30'; }, /csa-z662: verified must be null or a past/);
  expectProblem(copy => { record(copy, 'api-5l').adoptions[0].style = 'sometimes'; }, /adoption style must be dated or as-amended/);
});

test('the validator keeps records tight: summary length, unknown fields, id format', () => {
  expectProblem(copy => { record(copy, 'api-5l').summary = 'x'.repeat(300); }, /summary must be 40-280 characters/);
  expectProblem(copy => { record(copy, 'api-5l').scope = 'pasted text'; }, /unknown field "scope"/);
  expectProblem(copy => { record(copy, 'api-6a').id = 'API 6A'; }, /id must look like "api-5l"/);
});

test('the validator rejects synonym clashes and dead synonym targets', () => {
  expectProblem(copy => copy.synonyms.synonyms.push({term: 'impact', aliases: ['charpy'], records: ['astm-e23']}), /"charpy" is already used by "impact"|"charpy" is already used by "charpy"/);
  expectProblem(copy => copy.synonyms.synonyms.push({term: 'ghost', aliases: [], records: ['astm-e9999']}), /records has unknown value "astm-e9999"/);
  expectProblem(copy => copy.synonyms.synonyms.push({term: 'empty', aliases: []}), /"empty": needs at least one target/);
  expectProblem(copy => copy.synonyms.synonyms.push({term: 'Upper', aliases: [], records: ['api-5l']}), /must be lowercase/);
});

test('the validator checks lesson links against real files when given the repo root', () => {
  expectProblem(copy => record(copy, 'api-5l').learning.push({type: 'lesson', href: '/lessons/no-such-lesson'}),
    /learning link \/lessons\/no-such-lesson does not match a page/, {root: ROOT});
});

test('related codes are visible from both ends of a relation', () => {
  const records = catalog.standards.standards;
  const fromIso = lib.relationsFor(records, 'iso-3183');
  assert.ok(fromIso.some(item => item.to === 'api-5l' && item.type === 'equivalent'));
  const fromE8 = lib.relationsFor(records, 'astm-e8');
  assert.ok(fromE8.some(item => item.to === 'astm-a370' && item.type === 'referenced-by'));
  assert.ok(fromE8.some(item => item.to === 'iso-6892-1' && item.type === 'similar'));
  const keys = fromE8.map(item => item.to + '|' + item.type);
  assert.equal(new Set(keys).size, keys.length, 'no duplicate relations');
});

test('records go stale 12 months after their last check, and never-checked records are stale', () => {
  assert.equal(lib.isStale({verified: null}, TODAY), true);
  assert.equal(lib.isStale({verified: '2026-06-01'}, TODAY), false);
  assert.equal(lib.isStale({verified: '2025-11-01'}, TODAY), true);
});

test('the Netlify build runs the catalog gate before the site is staged', () => {
  const build = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const gate = build.indexOf('node scripts/validate-code-finder.mjs');
  assert.ok(gate >= 0, 'validator missing from build:site');
  assert.ok(gate < build.indexOf('node scripts/stage-public-site.mjs'), 'validator must run before staging');
});
