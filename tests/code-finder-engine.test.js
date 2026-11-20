const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');

const ROOT = join(__dirname, '..');
const E = require('../tools/code-finder/code-finder-engine.js');
const data = name => JSON.parse(readFileSync(join(ROOT, 'data', 'code-finder', name + '.json'), 'utf8'));
const catalog = {taxonomy: data('taxonomy'), standards: data('standards'), synonyms: data('synonyms')};
const index = E.buildIndex(catalog);
const top = (query, filters, n = 3) => E.search(index, query, filters || {}).results.slice(0, n).map(item => item.record.id);

// Gate 1 recall set: real questions and the code that must appear in the top 3.
// Add a row whenever a user search misses; never delete one to make the suite pass.
const RECALL = [
  ['line pipe', 'api-5l'], ['linepipe', 'iso-3183'], ['5L', 'api-5l'], ['z245.1', 'csa-z245-1'], ['Charpy', 'astm-e23'],
  ['CVN', 'iso-148-1'], ['charpey test', 'astm-e23'], ['tensile test', 'astm-e8'], ['pipeline welding', 'api-1104'],
  ['weld procedure qualification', 'iso-15614-1'], ['pressure vessel inspection', 'api-510'], ['tank inspection', 'api-653'],
  ['FMEA', 'iec-31010'], ['risk assessment', 'iso-31000'], ['gauge r&r', 'astm-e2782'], ['cpk', 'astm-e2281'],
  ['control chart', 'astm-e2587'], ['mill test report', 'iso-10204'], ['hazop', 'csa-z767'], ['lockout', 'csa-z460'],
  ['arc flash', 'csa-z462'], ['structural steel canada', 'csa-g40-20-21'], ['350W', 'csa-g40-20-21'], ['casing', 'api-5ct'],
  ['hydrotest pipeline', 'api-1110'], ['ndt certification', 'iso-9712'], ['ultrasonic pipe', 'astm-e213'],
  ['greenhouse gas reporting', 'iso-14064-1'], ['iso 9001', 'iso-9001'], ['medical device quality', 'iso-13485'],
  ['food safety', 'iso-22000'], ['lab accreditation', 'iso-iec-17025'], ['relief valve sizing', 'api-520-1'],
  ['fitness for service', 'api-579-1'], ['smart pig', 'api-1163'], ['concrete testing', 'csa-a23-1-2'],
  ['galvanized coating', 'astm-a123'], ['stainless pipe', 'astm-a312'], ['A370', 'astm-a370'], ['api 1104', 'api-1104']
];

test('recall: every question in the Gate 1 set finds its code in the top 3', () => {
  const misses = RECALL.filter(([query, id]) => !top(query).includes(id));
  assert.equal(RECALL.length, 40);
  assert.deepEqual(misses, [], 'missed: ' + misses.map(([q, id]) => `"${q}" -> ${id} (got ${top(q).join(', ')})`).join('; '));
});

test('code numbers match however they are typed', () => {
  for (const query of ['z245.1', 'Z 245.1', 'CSA Z245.1', 'z2451']) assert.equal(top(query, null, 1)[0], 'csa-z245-1', query);
  for (const query of ['5L', 'API 5L', 'api spec 5l', 'api-5l']) assert.equal(top(query, null, 1)[0], 'api-5l', query);
  assert.equal(top('E23', null, 1)[0], 'astm-e23');
  assert.equal(top('ISO 3183', null, 1)[0], 'iso-3183');
});

test('synonyms are reported so the page can say what else it searched', () => {
  const output = E.search(index, 'mtr', {});
  assert.deepEqual(output.synonyms, ['mtr']);
  assert.equal(output.results[0].record.id, 'iso-10204');
  assert.ok(output.results[0].reasons.some(reason => /Means "mtr"/.test(reason)));
});

test('nonsense finds nothing instead of padding the list', () => {
  assert.equal(E.search(index, 'zzqxv blorf', {}).total, 0);
});

test('an empty search lists every code, grouped by publisher', () => {
  const output = E.search(index, '', {});
  assert.equal(output.total, catalog.standards.standards.length);
  assert.equal(output.hasQuery, false);
  const bodies = output.results.map(item => item.record.body);
  assert.deepEqual(bodies, [...bodies].sort());
});

test('filters: OR inside a facet, AND across facets', () => {
  const either = E.search(index, '', {bodies: ['API', 'CSA']});
  assert.ok(either.results.every(item => ['API', 'CSA'].includes(item.record.body)));
  assert.ok(either.results.some(item => item.record.body === 'API') && either.results.some(item => item.record.body === 'CSA'));
  const both = E.search(index, '', {bodies: ['CSA'], categories: ['welding']});
  assert.ok(both.total > 0);
  assert.ok(both.results.every(item => item.record.body === 'CSA' && item.record.categories.includes('welding')));
});

test('picking a parent industry or region includes its children', () => {
  // The seed data always carries the parent tag too, so prove the rule on a copy
  // where one record is tagged with the sub-sector and sub-region only.
  const copy = JSON.parse(JSON.stringify(catalog));
  const z662 = copy.standards.standards.find(r => r.id === 'csa-z662');
  z662.industries = ['oil-gas-midstream'];
  z662.jurisdictions = ['ca-sk'];
  const mini = E.buildIndex(copy);
  const ids = filters => E.search(mini, '', filters).results.map(item => item.record.id);
  assert.ok(ids({industries: ['oil-gas']}).includes('csa-z662'), 'oil-gas includes midstream');
  assert.ok(ids({jurisdictions: ['ca']}).includes('csa-z662'), 'Canada includes Saskatchewan');
  assert.ok(!ids({industries: ['oil-gas-upstream']}).includes('csa-z662'), 'a sibling does not');
  assert.equal(E.search(mini, '', {}).counts.industries['oil-gas'] >= E.search(mini, '', {}).counts.industries['oil-gas-midstream'], true);
});

test('facet counts ignore their own facet so other options stay visible', () => {
  const output = E.search(index, '', {bodies: ['API']});
  assert.equal(output.counts.bodies.CSA, catalog.standards.standards.filter(r => r.body === 'CSA').length);
  const apiWelding = catalog.standards.standards.filter(r => r.body === 'API' && r.categories.includes('welding')).length;
  assert.equal(output.counts.categories.welding, apiWelding);
});

test('related codes read from both ends with plain labels', () => {
  const fromIso = E.related(index, 'iso-3183');
  assert.deepEqual(fromIso.find(item => item.to === 'api-5l'), {to: 'api-5l', type: 'equivalent', note: 'Harmonized origin; editions have diverged', label: 'Equivalent'});
  assert.equal(E.related(index, 'astm-e8').find(item => item.to === 'astm-a370').label, 'Cited by');
  assert.equal(E.related(index, 'api-5l')[0].type, 'equivalent', 'closest matches first');
});

test('URL state round-trips and drops values that are not in the taxonomy', () => {
  const state = {q: 'line pipe', filters: {bodies: ['API', 'CSA'], categories: ['pipe-tube']}, sort: 'designation'};
  const params = E.stateToParams(state);
  assert.equal(params, 'q=line+pipe&category=pipe-tube&body=API%2CCSA&sort=designation');
  assert.deepEqual(E.paramsToState(params, index), state);
  const dirty = E.paramsToState('q=' + 'x'.repeat(300) + '&body=API,NOPE&category=<script>&sort=evil', index);
  assert.equal(dirty.q.length, 120);
  assert.deepEqual(dirty.filters, {bodies: ['API'], categories: []});
  assert.equal(dirty.sort, 'relevance');
});

test('stale means never checked or checked more than a year ago', () => {
  const today = new Date('2026-11-20T00:00:00Z');
  assert.equal(E.isStale({verified: null}, today), true);
  assert.equal(E.isStale({verified: '2026-11-20'}, today), false);
  assert.equal(E.isStale({verified: '2025-10-01'}, today), true);
});
