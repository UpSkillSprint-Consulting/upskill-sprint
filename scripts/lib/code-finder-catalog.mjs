// Code Finder catalog: loading, validation and derived views.
//
// The catalog lives in data/code-finder/ as three hand-edited JSON files:
//   taxonomy.json  - controlled facet lists (industries, categories, use cases, ...)
//   standards.json - one metadata record per code or standard (never standard text)
//   synonyms.json  - shop-floor terms that expand a search to records or facets
//
// validateCatalog() is the single gate for data changes. It runs in the Netlify
// build (scripts/validate-code-finder.mjs) and in tests, so a bad record fails
// the deploy instead of reaching users. See docs/CODE_FINDER_DATA.md.

import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

export const CATALOG_FILES = ['taxonomy.json', 'standards.json', 'synonyms.json', 'scenarios.json', 'wizard.json'];
export const ID_PATTERN = /^(api|csa|astm|iso|iec)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const STATUSES = ['active', 'withdrawn', 'superseded'];
export const ADOPTION_STYLES = ['dated', 'as-amended'];
export const LEARNING_TYPES = ['lesson', 'tool'];
export const SUMMARY_MIN = 40;
export const SUMMARY_MAX = 280;
export const KEY_POINTS_MIN = 3;
// A record has enough of our own content to deserve an indexable page.
export const isRich = record => Array.isArray(record.keyPoints) && record.keyPoints.length >= KEY_POINTS_MIN;
// Facets a standard must tag (at least one value each) and the taxonomy list each one draws from.
export const REQUIRED_FACETS = {industries: 'industries', categories: 'categories', useCases: 'useCases', jurisdictions: 'jurisdictions'};
const RECORD_KEYS = new Set(['id', 'body', 'designation', 'title', 'docType', 'status', 'summary', 'keyPoints', 'tips', 'industries', 'categories',
  'useCases', 'jurisdictions', 'materials', 'relations', 'adoptions', 'learning', 'edition', 'year', 'verified']);
const ADOPTION_KEYS = new Set(['jurisdiction', 'regulator', 'instrument', 'editionCited', 'style', 'verified']);
const SYNONYM_TARGETS = {records: null, categories: 'categories', useCases: 'useCases', industries: 'industries'};

export async function loadCatalog(dir) {
  const [taxonomy, standards, synonyms, scenarios, wizard] = await Promise.all(
    CATALOG_FILES.map(async name => JSON.parse(await readFile(join(dir, name), 'utf8'))));
  return {taxonomy, standards, synonyms, scenarios, wizard};
}

const isString = value => typeof value === 'string' && value.trim() === value && value.length > 0;

// A real calendar date in YYYY-MM-DD form that is not later than `today`.
export function isValidPastDate(value, today = new Date()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
  return value <= today.toISOString().slice(0, 10);
}

// Slug set per facet, plus a check that taxonomy lists are well formed.
function indexTaxonomy(taxonomy, errors) {
  const facets = {};
  if (!taxonomy || taxonomy.version !== 1) errors.push('taxonomy.json: version must be 1');
  const lists = {...(taxonomy?.facets || {}), materials: taxonomy?.materials || []};
  for (const facet of [...Object.values(REQUIRED_FACETS), 'docTypes', 'materials']) {
    if (!Array.isArray(lists[facet]) || !lists[facet].length) errors.push(`taxonomy.json: facet "${facet}" is missing or empty`);
  }
  for (const [facet, list] of Object.entries(lists)) {
    const slugs = new Set();
    for (const entry of Array.isArray(list) ? list : []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry?.slug || '')) errors.push(`taxonomy.json: ${facet} has a bad slug "${entry?.slug}"`);
      else if (slugs.has(entry.slug)) errors.push(`taxonomy.json: ${facet} repeats slug "${entry.slug}"`);
      if (!isString(entry?.label)) errors.push(`taxonomy.json: ${facet} "${entry?.slug}" needs a label`);
      slugs.add(entry?.slug);
    }
    for (const entry of Array.isArray(list) ? list : []) {
      if (entry?.parent !== undefined && !slugs.has(entry.parent)) errors.push(`taxonomy.json: ${facet} "${entry.slug}" has unknown parent "${entry.parent}"`);
    }
    facets[facet] = slugs;
  }
  facets.bodies = new Set((taxonomy?.bodies || []).map(body => body.code));
  facets.relationTypes = new Set((taxonomy?.relationTypes || []).map(type => type.slug));
  if (!facets.bodies.size) errors.push('taxonomy.json: bodies list is empty');
  if (!facets.relationTypes.size) errors.push('taxonomy.json: relationTypes list is empty');
  return facets;
}

function checkSlugList(where, field, values, allowed, errors, {required}) {
  if (values === undefined && !required) return;
  if (!Array.isArray(values) || (required && !values.length)) {
    errors.push(`${where}: ${field} must be a ${required ? 'non-empty ' : ''}list`);
    return;
  }
  const seen = new Set();
  for (const value of values) {
    if (!allowed.has(value)) errors.push(`${where}: ${field} has unknown value "${value}"`);
    if (seen.has(value)) errors.push(`${where}: ${field} repeats "${value}"`);
    seen.add(value);
  }
}

function learningTargetExists(root, entry) {
  const base = join(root, entry.href.replace(/^\//, ''));
  return entry.href.endsWith('/')
    ? existsSync(join(base, 'index.html'))
    : existsSync(base + '.html') || existsSync(join(base, 'index.html'));
}

// Returns a list of human-readable problems. An empty list means the catalog is valid.
// Pass `root` (repo root) to also check that lesson and tool links point at real pages.
export function validateCatalog({taxonomy, standards, synonyms, scenarios, wizard}, {root = null, today = new Date()} = {}) {
  const errors = [];
  const facets = indexTaxonomy(taxonomy, errors);
  if (!standards || standards.version !== 1 || !Array.isArray(standards.standards)) {
    errors.push('standards.json: expected {"version": 1, "standards": [...]}');
    return errors;
  }
  const records = standards.standards;
  const ids = new Set();
  const designations = new Set();
  for (const record of records) {
    if (ID_PATTERN.test(record?.id || '') && ids.has(record.id)) errors.push(`standards.json: duplicate id "${record.id}"`);
    ids.add(record?.id);
  }
  records.forEach((record, index) => {
    const where = `standards.json: ${record?.id || '#' + index}`;
    for (const key of Object.keys(record || {})) if (!RECORD_KEYS.has(key)) errors.push(`${where}: unknown field "${key}"`);
    if (!ID_PATTERN.test(record?.id || '')) errors.push(`${where}: id must look like "api-5l" (body prefix, lowercase, hyphens)`);
    for (const field of ['designation', 'title', 'summary']) if (!isString(record?.[field])) errors.push(`${where}: ${field} is required text`);
    if (isString(record?.designation)) {
      if (designations.has(record.designation)) errors.push(`${where}: duplicate designation "${record.designation}"`);
      designations.add(record.designation);
    }
    if (!facets.bodies.has(record?.body)) errors.push(`${where}: unknown body "${record?.body}"`);
    if (!facets.docTypes?.has(record?.docType)) errors.push(`${where}: unknown docType "${record?.docType}"`);
    if (!STATUSES.includes(record?.status)) errors.push(`${where}: status must be one of ${STATUSES.join(', ')}`);
    if (isString(record?.summary)) {
      if (record.summary.length < SUMMARY_MIN || record.summary.length > SUMMARY_MAX) errors.push(`${where}: summary must be ${SUMMARY_MIN}-${SUMMARY_MAX} characters (is ${record.summary.length})`);
      if (/[\r\n]/.test(record.summary)) errors.push(`${where}: summary must be one line`);
    }
    // Optional enrichment: "What it covers" key points and practical tips, in our own words.
    // A code page is only indexed once it has at least KEY_POINTS_MIN key points (see isRich).
    for (const [field, min, max] of [['keyPoints', KEY_POINTS_MIN, 6], ['tips', 1, 3]]) {
      const items = record?.[field];
      if (items === undefined) continue;
      if (!Array.isArray(items) || items.length < min || items.length > max) errors.push(`${where}: ${field} needs ${min}-${max} items`);
      for (const item of Array.isArray(items) ? items : []) {
        if (!isString(item) || item.length < 20 || item.length > 240) errors.push(`${where}: each ${field} item must be 20-240 characters`);
        else if (/\bshall\b/i.test(item)) errors.push(`${where}: ${field} item reads like standard text ("shall")`);
      }
    }
    for (const [field, facet] of Object.entries(REQUIRED_FACETS)) checkSlugList(where, field, record?.[field], facets[facet] || new Set(), errors, {required: true});
    checkSlugList(where, 'materials', record?.materials, facets.materials || new Set(), errors, {required: false});
    if (record?.verified !== null && !isValidPastDate(record?.verified, today)) errors.push(`${where}: verified must be null or a past YYYY-MM-DD date`);
    if ((record?.edition === undefined) !== (record?.year === undefined)) errors.push(`${where}: edition and year go together`);
    if (record?.edition !== undefined) {
      if (!isString(record.edition)) errors.push(`${where}: edition must be text`);
      if (!Number.isInteger(record.year) || record.year < 1900 || record.year > today.getUTCFullYear() + 1) errors.push(`${where}: year must be a whole year`);
      if (record.verified === null) errors.push(`${where}: an edition needs a verified date (unverified records leave edition out)`);
    }
    const relationKeys = new Set();
    for (const relation of Array.isArray(record?.relations) ? record.relations : (errors.push(`${where}: relations must be a list`), [])) {
      if (!ids.has(relation?.to)) errors.push(`${where}: relation points at unknown id "${relation?.to}"`);
      if (relation?.to === record.id) errors.push(`${where}: relation points at itself`);
      if (!facets.relationTypes.has(relation?.type)) errors.push(`${where}: unknown relation type "${relation?.type}"`);
      if (relation?.note !== undefined && !isString(relation.note)) errors.push(`${where}: relation note must be text`);
      const key = relation?.to + '|' + relation?.type;
      if (relationKeys.has(key)) errors.push(`${where}: repeats relation ${relation?.type} -> ${relation?.to}`);
      relationKeys.add(key);
    }
    for (const adoption of Array.isArray(record?.adoptions) ? record.adoptions : (errors.push(`${where}: adoptions must be a list`), [])) {
      for (const key of Object.keys(adoption || {})) if (!ADOPTION_KEYS.has(key)) errors.push(`${where}: adoption has unknown field "${key}"`);
      if (!facets.jurisdictions?.has(adoption?.jurisdiction)) errors.push(`${where}: adoption has unknown jurisdiction "${adoption?.jurisdiction}"`);
      for (const field of ['regulator', 'instrument', 'editionCited']) if (!isString(adoption?.[field])) errors.push(`${where}: adoption ${field} is required text`);
      if (!ADOPTION_STYLES.includes(adoption?.style)) errors.push(`${where}: adoption style must be ${ADOPTION_STYLES.join(' or ')}`);
      // A "mandatory where" claim is the riskiest data we hold, so it must always carry its own check date.
      if (!isValidPastDate(adoption?.verified, today)) errors.push(`${where}: adoption needs a past verified date`);
    }
    for (const entry of Array.isArray(record?.learning) ? record.learning : (errors.push(`${where}: learning must be a list`), [])) {
      if (!LEARNING_TYPES.includes(entry?.type)) errors.push(`${where}: learning type must be lesson or tool`);
      if (!isString(entry?.label)) errors.push(`${where}: learning label is required text (the link text users see)`);
      if (typeof entry?.href !== 'string' || !/^\/[a-z0-9\-/]+$/.test(entry.href)) errors.push(`${where}: learning href must be a site path like /lessons/...`);
      else if (root && !learningTargetExists(root, entry)) errors.push(`${where}: learning link ${entry.href} does not match a page in the repo`);
    }
  });

  if (!synonyms || synonyms.version !== 1 || !Array.isArray(synonyms.synonyms)) {
    errors.push('synonyms.json: expected {"version": 1, "synonyms": [...]}');
    return errors;
  }
  const phrases = new Map();
  for (const entry of synonyms.synonyms) {
    const where = `synonyms.json: "${entry?.term}"`;
    for (const phrase of [entry?.term, ...(Array.isArray(entry?.aliases) ? entry.aliases : [])]) {
      if (!isString(phrase) || phrase !== phrase.toLowerCase()) errors.push(`${where}: terms and aliases must be lowercase text ("${phrase}")`);
      else if (phrases.has(phrase)) errors.push(`${where}: "${phrase}" is already used by "${phrases.get(phrase)}"`);
      else phrases.set(phrase, entry.term);
    }
    let targets = 0;
    for (const [field, facet] of Object.entries(SYNONYM_TARGETS)) {
      if (entry?.[field] === undefined) continue;
      checkSlugList(where, field, entry[field], facet ? facets[facet] || new Set() : ids, errors, {required: true});
      targets += entry[field].length || 0;
    }
    if (!targets) errors.push(`${where}: needs at least one target (records, categories, useCases or industries)`);
  }
  if (scenarios !== undefined) validateScenarios(scenarios, {facets, ids, root, errors});
  if (wizard !== undefined) validateWizard(wizard, {facets, errors});
  return errors;
}

export const PACK_WHY_MAX = 160;
// Starter packs: hand-picked, ordered lists of codes for one job, each with a one-line reason.
function validateScenarios(scenarios, {facets, ids, root, errors}) {
  if (!scenarios || scenarios.version !== 1 || !Array.isArray(scenarios.packs)) {
    errors.push('scenarios.json: expected {"version": 1, "packs": [...]}');
    return;
  }
  const slugs = new Set();
  for (const pack of scenarios.packs) {
    const where = `scenarios.json: ${pack?.slug || '(no slug)'}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pack?.slug || '')) errors.push(`${where}: slug must be lowercase with hyphens`);
    else if (slugs.has(pack.slug)) errors.push(`${where}: duplicate slug`);
    slugs.add(pack?.slug);
    for (const field of ['title', 'summary']) if (!isString(pack?.[field])) errors.push(`${where}: ${field} is required text`);
    if (typeof pack?.regulated !== 'boolean') errors.push(`${where}: regulated must be true or false`);
    checkSlugList(where, 'industries', pack?.industries, facets.industries || new Set(), errors, {required: true});
    checkSlugList(where, 'useCases', pack?.useCases, facets.useCases || new Set(), errors, {required: true});
    const records = Array.isArray(pack?.records) ? pack.records : [];
    if (records.length < 3) errors.push(`${where}: a pack needs at least 3 codes`);
    const seen = new Set();
    for (const item of records) {
      if (!ids.has(item?.id)) errors.push(`${where}: unknown code "${item?.id}"`);
      if (seen.has(item?.id)) errors.push(`${where}: lists "${item?.id}" twice`);
      seen.add(item?.id);
      if (!isString(item?.why) || item.why.length > PACK_WHY_MAX) errors.push(`${where}: "${item?.id}" needs a why of 1-${PACK_WHY_MAX} characters`);
      else if (/\bshall\b/i.test(item.why)) errors.push(`${where}: "${item.id}" why reads like standard text`);
    }
    for (const lesson of Array.isArray(pack?.lessons) ? pack.lessons : (errors.push(`${where}: lessons must be a list`), [])) {
      if (!isString(lesson?.label) || typeof lesson?.href !== 'string' || !/^\/[a-z0-9\-/]+$/.test(lesson.href)) errors.push(`${where}: lesson needs a label and a site path`);
      else if (root && !learningTargetExists(root, lesson)) errors.push(`${where}: lesson ${lesson.href} does not match a page in the repo`);
    }
  }
}

// Wizard: each question filters one facet; each option maps to one or more facet values.
function validateWizard(wizard, {facets, errors}) {
  if (!wizard || wizard.version !== 1 || !Array.isArray(wizard.questions) || !wizard.questions.length) {
    errors.push('wizard.json: expected {"version": 1, "questions": [...]}');
    return;
  }
  const questionIds = new Set();
  for (const question of wizard.questions) {
    const where = `wizard.json: ${question?.id || '(no id)'}`;
    if (!isString(question?.id) || questionIds.has(question.id)) errors.push(`${where}: question ids must be unique text`);
    questionIds.add(question?.id);
    if (!isString(question?.prompt)) errors.push(`${where}: prompt is required text`);
    if (!['industries', 'useCases'].includes(question?.facet)) errors.push(`${where}: facet must be industries or useCases`);
    const options = Array.isArray(question?.options) ? question.options : [];
    if (options.length < 2) errors.push(`${where}: needs at least 2 options`);
    for (const option of options) {
      if (!isString(option?.label)) errors.push(`${where}: every option needs a label`);
      checkSlugList(`${where} "${option?.label}"`, 'values', option?.values, facets[question?.facet] || new Set(), errors, {required: true});
    }
  }
}

// Every relation seen from both ends, for "related codes" on each card.
// Symmetric types (equivalent, similar) mirror as-is; directional ones get an inverse label.
const INVERSE = {equivalent: 'equivalent', similar: 'similar', references: 'referenced-by', supersedes: 'superseded-by'};
export function relationsFor(records, id) {
  const out = new Map();
  for (const record of records) {
    for (const relation of record.relations || []) {
      if (record.id === id) out.set(relation.to + '|' + relation.type, {to: relation.to, type: relation.type, note: relation.note});
      else if (relation.to === id) {
        const type = INVERSE[relation.type];
        const key = record.id + '|' + type;
        if (!out.has(key)) out.set(key, {to: record.id, type, note: relation.note});
      }
    }
  }
  return [...out.values()];
}

// A record is stale when it was never verified or was last verified more than `months` ago.
export function isStale(record, today = new Date(), months = 12) {
  if (!record.verified) return true;
  const limit = new Date(today);
  limit.setUTCMonth(limit.getUTCMonth() - months);
  return record.verified < limit.toISOString().slice(0, 10);
}

export function catalogStats({standards}, today = new Date()) {
  const records = standards.standards;
  const byBody = {};
  for (const record of records) byBody[record.body] = (byBody[record.body] || 0) + 1;
  return {total: records.length, byBody, verified: records.filter(record => !isStale(record, today)).length,
    rich: records.filter(isRich).length};
}
