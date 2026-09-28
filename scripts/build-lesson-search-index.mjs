#!/usr/bin/env node

/**
 * Build the lesson search index from the same catalog students see.
 *
 * The catalog is intentionally the source of truth. A lesson file that is not
 * in the catalog is not published, while a real catalog entry that cannot be
 * indexed is a build error. This makes future lesson additions automatic and
 * prevents a broken loader or misspelled path from silently disappearing from
 * search.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { normalizeHeadingSlug } = require('../lesson-search-context.js');
export const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
export const DEFAULT_OUTPUT = path.join(DEFAULT_ROOT, 'assets/search/lesson-search-index.json');
export const ANCHOR_ALGORITHM = 'lesson-section-v1';
export const MAX_SECTION_TEXT = 100_000;

const PLACEHOLDER_PATH = '/lesson-template';
const VALID_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);
const LESSON_FRAGMENT_DIRECTORY = 'lessons/assets/';
const RESERVED_DYNAMIC_MARKERS = new Set([
  'data-lesson-item', 'data-topic', 'data-level', 'data-interactive', 'data-search'
]);
const EXCLUDED_SELECTORS = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'canvas',
  'nav',
  'header.site',
  'footer.site',
  'header.lesson-sitebar',
  '.site-header',
  '.site-footer',
  '[data-site-chrome]',
  'button',
  'input',
  'textarea',
  'select',
  'option',
  '[aria-hidden="true"]',
  '[data-search-exclude]',
  '.skip-link',
  '.lesson-progress-shell',
  '.lesson-back',
  '.breadcrumb',
  '.breadcrumbs',
  '.quiz-section',
  '#quiz',
  '#lesson-quiz',
  '[id*="quiz" i]',
  '[class*="quiz" i]',
  '[data-answer]',
  '[data-correct]',
  '[data-explanation]'
].join(',');

function fail(message) {
  throw new Error(`[lesson-search-index] ${message}`);
}

function assertSectionTextWithinLimit(text, context) {
  if (text.length <= MAX_SECTION_TEXT) return;
  fail(`${context} contains ${text.length} characters, exceeding the ` +
    `${MAX_SECTION_TEXT}-character safety limit; split the section before indexing it`);
}

export function normalizeSpace(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t\r\n ]+/g, ' ')
    .trim();
}

export function slugify(value) {
  return normalizeHeadingSlug(value);
}

export function normalizeCatalogPath(value) {
  let pathname;
  try {
    pathname = new URL(String(value || ''), 'https://upskillsprint.test/lessons.html').pathname;
  } catch {
    fail(`Invalid catalog path: ${String(value)}`);
  }
  pathname = pathname.replace(/\/index\.html$/i, '').replace(/\.html$/i, '').replace(/\/+$/, '');
  return pathname || '/';
}

export function lessonPathToFile(rootDir, lessonPath) {
  const normalized = normalizeCatalogPath(lessonPath);
  if (normalized === PLACEHOLDER_PATH) return path.join(rootDir, 'lesson-template.html');
  const relative = normalized.replace(/^\//, '') + '.html';
  const resolved = path.resolve(rootDir, relative);
  const relativeCheck = path.relative(rootDir, resolved);
  if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
    fail(`Catalog path escapes the repository: ${lessonPath}`);
  }
  return resolved;
}

function findArrayLiteral(source, declarationName, sourceLabel) {
  const declaration = new RegExp(`(?:const|let|var)\\s+${declarationName}\\s*=\\s*\\[`).exec(source);
  if (!declaration) fail(`Could not find ${declarationName} in ${sourceLabel}`);
  const start = source.indexOf('[', declaration.index);
  let depth = 0;
  let quote = '';
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (character === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '[') depth += 1;
    if (character === ']') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  fail(`Unclosed ${declarationName} array in ${sourceLabel}`);
}

function evaluateLessonDefinitions(source, sourceLabel) {
  const literal = findArrayLiteral(source, 'LESSONS', sourceLabel);
  let definitions;
  try {
    definitions = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1_000 });
  } catch (error) {
    fail(`Could not parse LESSONS in ${sourceLabel}: ${error.message}`);
  }
  if (!Array.isArray(definitions)) fail(`LESSONS in ${sourceLabel} is not an array`);
  return definitions;
}

function boolValue(value) {
  return value === true || String(value).toLowerCase() === 'true';
}

function catalogBoolean(value, source) {
  if (value === true || value === false) return value;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  fail(`${source} interactive must be true or false`);
}

function parseMinutes(value) {
  const match = String(value || '').match(/(\d+)(?:\s*[\u2013-]\s*(\d+))?\s*(?:min|minute)/i);
  if (!match) return null;
  return Number(match[2] || match[1]);
}

function staticCatalogEntries(html) {
  const document = new JSDOM(html).window.document;
  return Array.from(document.querySelectorAll('[data-lesson-item]')).map((row, position) => {
    const source = `lessons.html row ${position + 1}`;
    const title = normalizeSpace(row.querySelector('h3')?.textContent);
    const href = row.getAttribute('href');
    const categorySection = row.closest('section.lesson-category');
    if (!title || !href) fail(`Static catalog row ${position + 1} is missing a title or href`);
    return {
      source,
      catalogKind: 'static',
      sectionId: normalizeSpace(categorySection?.id),
      sectionTopic: normalizeSpace(categorySection?.dataset.topic),
      categorySection: Boolean(categorySection?.hasAttribute('data-category-section')),
      path: normalizeCatalogPath(href),
      href,
      topic: normalizeSpace(row.dataset.topic),
      level: normalizeSpace(row.dataset.level).toLowerCase(),
      interactive: catalogBoolean(row.dataset.interactive, source),
      title,
      description: normalizeSpace(row.querySelector('p')?.textContent),
      catalogSearch: normalizeSpace(row.dataset.search),
      minutes: parseMinutes(row.querySelector('.lesson-meta')?.textContent)
    };
  });
}

function dynamicCatalogEntries(source, sourceLabel) {
  return evaluateLessonDefinitions(source, sourceLabel).map((definition, position) => {
    const entrySource = `${sourceLabel} LESSONS[${position}]`;
    if (!definition.path || !definition.title) {
      fail(`LESSONS entry ${position + 1} in ${sourceLabel} is missing path or title`);
    }
    return {
      source: entrySource,
      catalogKind: 'dynamic',
      sectionId: normalizeSpace(definition.sectionId),
      marker: normalizeSpace(definition.marker),
      path: normalizeCatalogPath(definition.path),
      href: definition.path,
      topic: normalizeSpace(definition.topic),
      level: normalizeSpace(definition.level).toLowerCase(),
      interactive: catalogBoolean(definition.interactive, entrySource),
      title: normalizeSpace(definition.title),
      description: normalizeSpace(definition.description),
      catalogSearch: normalizeSpace(definition.search),
      minutes: parseMinutes(definition.meta)
    };
  });
}

function assertCatalogEntry(entry) {
  if (!entry.topic) fail(`${entry.source} is missing data-topic/topic`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.topic)) {
    fail(`${entry.source} topic must be a lowercase hyphenated category slug: ${entry.topic}`);
  }
  if (!entry.level) fail(`${entry.source} is missing data-level/level`);
  if (!VALID_LEVELS.has(entry.level)) {
    fail(`${entry.source} level must be beginner, intermediate, or advanced`);
  }
  if (!entry.title) fail(`${entry.source} is missing a title`);
  if (entry.catalogKind === 'static') {
    if (!entry.sectionId || !entry.sectionTopic || !entry.categorySection) {
      fail(`${entry.source} must be inside a data-category-section lesson category`);
    }
    if (entry.sectionId !== entry.sectionTopic) {
      fail(`${entry.source} category section id must match its data-topic ` +
        `(${entry.sectionId} !== ${entry.sectionTopic})`);
    }
    if (entry.topic !== entry.sectionTopic) {
      fail(`${entry.source} data-topic must match its category section ` +
        `(${entry.topic} !== ${entry.sectionTopic})`);
    }
  } else if (entry.catalogKind === 'dynamic') {
    if (!entry.sectionId) fail(`${entry.source} is missing sectionId`);
    if (entry.topic !== entry.sectionId) {
      fail(`${entry.source} topic must exactly match sectionId (${entry.topic} !== ${entry.sectionId})`);
    }
    if (!/^data-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.marker)) {
      fail(`${entry.source} marker must be a valid lowercase data-* attribute`);
    }
    if (RESERVED_DYNAMIC_MARKERS.has(entry.marker)) {
      fail(`${entry.source} marker is reserved by the catalog runtime: ${entry.marker}`);
    }
  }
}

function validateCatalogPlacement(catalogHtml, entries) {
  const document = new JSDOM(catalogHtml).window.document;
  const topicSections = new Map();
  for (const section of document.querySelectorAll(
    'section.lesson-category[data-category-section], section.lesson-category[data-empty-category]'
  )) {
    const topic = normalizeSpace(section.dataset.topic);
    if (!topic || section.id !== topic) {
      fail(`Catalog category section ${section.id || '(missing id)'} must have matching id and data-topic`);
    }
    if (topicSections.has(topic)) fail(`Duplicate catalog category section for topic: ${topic}`);
    topicSections.set(topic, section);
  }
  if (!topicSections.size) fail('lessons.html contains no valid lesson category sections');

  const markers = new Map();
  for (const entry of entries) {
    if (!topicSections.has(entry.topic)) {
      fail(`${entry.source} topic does not match a lesson category section: ${entry.topic}`);
    }
    if (entry.catalogKind !== 'dynamic') continue;
    const section = document.getElementById(entry.sectionId);
    if (!section) fail(`${entry.source} sectionId does not exist in lessons.html: ${entry.sectionId}`);
    if (!section.matches('section.lesson-category[data-category-section], section.lesson-category[data-empty-category]')) {
      fail(`${entry.source} sectionId must identify a lesson category section: ${entry.sectionId}`);
    }
    const sectionTopic = normalizeSpace(section.dataset.topic);
    if (sectionTopic !== entry.sectionId) {
      fail(`${entry.source} section ${entry.sectionId} must declare data-topic="${entry.sectionId}"`);
    }
    if (section.querySelector(`[${entry.marker}]`)) {
      fail(`${entry.source} marker already exists in static catalog markup: ${entry.marker}`);
    }
    const key = `${entry.sectionId}|${entry.marker}`;
    const existing = markers.get(key);
    if (existing) {
      fail(`Duplicate dynamic marker ${entry.marker} in section ${entry.sectionId}: ${existing} and ${entry.source}`);
    }
    markers.set(key, entry.source);
  }
}

function mergeCatalogEntries(entries) {
  const merged = [];
  const realByPath = new Map();
  for (const entry of entries) {
    assertCatalogEntry(entry);
    if (entry.path === PLACEHOLDER_PATH) {
      merged.push({ ...entry, placeholder: true });
      continue;
    }
    const existing = realByPath.get(entry.path);
    if (!existing) {
      const next = { ...entry, placeholder: false };
      realByPath.set(entry.path, next);
      merged.push(next);
      continue;
    }
    fail(`Duplicate real catalog path ${entry.path}: ${existing.source} and ${entry.source}`);
  }
  return merged;
}

export function discoverCatalog(rootDir = DEFAULT_ROOT) {
  const catalogFile = path.join(rootDir, 'lessons.html');
  const dynamicFile = path.join(rootDir, 'chi-square-lesson-library.js');
  if (!fs.existsSync(catalogFile)) fail('Missing lessons.html');
  if (!fs.existsSync(dynamicFile)) fail('Missing chi-square-lesson-library.js');
  const catalogHtml = fs.readFileSync(catalogFile, 'utf8');
  const entries = [
    ...staticCatalogEntries(catalogHtml),
    ...dynamicCatalogEntries(fs.readFileSync(dynamicFile, 'utf8'), path.basename(dynamicFile))
  ];
  const merged = mergeCatalogEntries(entries);
  validateCatalogPlacement(catalogHtml, merged);
  return merged;
}

function walkHtmlFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkHtmlFiles(filePath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(filePath);
  }
  return files;
}

function relativePosix(rootDir, filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

function noindexRedirectTarget(html) {
  const document = new JSDOM(html).window.document;
  const isNoindex = Array.from(document.querySelectorAll('meta[name]')).some((meta) =>
    meta.getAttribute('name')?.toLowerCase() === 'robots' &&
    /(?:^|[\s,])noindex(?:$|[\s,])/i.test(meta.getAttribute('content') || '')
  );
  if (!isNoindex) return '';
  const refresh = Array.from(document.querySelectorAll('meta[http-equiv]')).find((meta) =>
    meta.getAttribute('http-equiv')?.toLowerCase() === 'refresh'
  );
  const match = refresh?.getAttribute('content')?.match(/(?:^|;)\s*url\s*=\s*["']?([^;"']+)/i);
  return normalizeSpace(match?.[1]);
}

/**
 * Enforce the reverse side of catalog discovery: a production lesson file may
 * not exist silently outside the public catalog/search index.
 *
 * Deliberately narrow exemptions:
 * - lessons/assets/** contains partial HTML assembled by a registered resolver;
 * - a legacy redirect must be both noindex and an actual meta-refresh whose
 *   destination is itself a same-origin registered lesson.
 * Test fixtures live outside the production lessons/ tree and need no bypass.
 */
export function validateFilesystemCatalogCoverage(rootDir, catalog) {
  const catalogPaths = new Set(catalog.filter((entry) => !entry.placeholder).map((entry) => entry.path));
  const lessonRoot = path.join(rootDir, 'lessons');
  for (const filePath of walkHtmlFiles(lessonRoot)) {
    const relativePath = relativePosix(rootDir, filePath);
    const html = fs.readFileSync(filePath, 'utf8');

    if (relativePath.startsWith(LESSON_FRAGMENT_DIRECTORY)) {
      if (/UPSKILLSPRINT_LESSON_META|<!doctype\s+html|<html\b|<head\b|<body\b/i.test(html)) {
        fail(`Only metadata-free partial HTML is allowed in fragment-only ` +
          `${LESSON_FRAGMENT_DIRECTORY}: ${relativePath}`);
      }
      continue;
    }

    const lessonPath = normalizeCatalogPath(`/${relativePath}`);
    if (catalogPaths.has(lessonPath)) continue;

    const redirectTarget = noindexRedirectTarget(html);
    if (redirectTarget) {
      let redirectUrl;
      try {
        redirectUrl = new URL(redirectTarget, 'https://upskillsprint.com/');
      } catch {
        fail(`Noindex redirect ${relativePath} has an invalid destination: ${redirectTarget}`);
      }
      if (redirectUrl.origin !== 'https://upskillsprint.com') {
        fail(`Noindex redirect ${relativePath} must point to a same-origin registered lesson`);
      }
      const normalizedTarget = normalizeCatalogPath(redirectUrl.pathname);
      if (!catalogPaths.has(normalizedTarget)) {
        fail(`Noindex redirect ${relativePath} points to an unregistered lesson: ${normalizedTarget}`);
      }
      continue;
    }

    fail(`Lesson HTML file is not registered in the catalog/search index: ${relativePath} (${lessonPath})`);
  }
}

export function parseLessonMetadata(html, filePath, rootDir = DEFAULT_ROOT) {
  const match = html.match(/<!--\s*UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/i);
  if (!match) fail(`Published lesson is missing UPSKILLSPRINT_LESSON_META: ${path.relative(rootDir, filePath)}`);
  let metadata;
  try {
    metadata = JSON.parse(match[1]);
  } catch (error) {
    fail(`Invalid UPSKILLSPRINT_LESSON_META in ${path.relative(rootDir, filePath)}: ${error.message}`);
  }
  const expected = path.relative(rootDir, filePath).split(path.sep).join('/');
  const suggested = String(metadata.suggested_github_path || '').replace(/^\/+/, '');
  if (!suggested) fail(`Lesson metadata is missing suggested_github_path: ${expected}`);
  if (suggested !== expected) {
    fail(`Metadata path mismatch for ${expected}: suggested_github_path is ${suggested}`);
  }
  return metadata;
}

function readJoined(rootDir, relativePaths) {
  return relativePaths.map((relativePath) => {
    const file = path.join(rootDir, relativePath);
    if (!fs.existsSync(file)) fail(`Loader asset is missing: ${relativePath}`);
    return fs.readFileSync(file, 'utf8');
  }).join('');
}

function decodeGzipBase64(value, label) {
  try {
    return zlib.gunzipSync(Buffer.from(String(value).replace(/\s+/g, ''), 'base64')).toString('utf8');
  } catch (error) {
    fail(`Could not decode ${label}: ${error.message}`);
  }
}

function mountHtml(wrapperHtml, selector, content, label) {
  const dom = new JSDOM(wrapperHtml);
  const host = dom.window.document.querySelector(selector);
  if (!host) fail(`${label} wrapper is missing ${selector}`);
  host.innerHTML = content;
  return dom.serialize();
}

function resolveChiSquare(rootDir) {
  const payloadFile = path.join(rootDir, 'assets/lessons/chi-square-goodness-of-fit/payload.js');
  if (!fs.existsSync(payloadFile)) fail('Chi-square payload.js is missing');
  const source = fs.readFileSync(payloadFile, 'utf8');
  const match = source.match(/window\.__upskillChiSquarePayload\s*=\s*(['"])([A-Za-z0-9+/=\s]+)\1\s*;/);
  if (!match) fail('Chi-square payload.js has an unsupported format');
  return { html: decodeGzipBase64(match[2], 'chi-square payload'), extraSections: [] };
}

function resolveBeyondTheBell(rootDir) {
  const names = ['part-01.txt', 'part-02.txt', 'part-03.txt', 'part-04.txt'];
  const payload = readJoined(rootDir, names.map((name) => `assets/lessons/beyond-the-bell/${name}`));
  return { html: decodeGzipBase64(payload, 'Beyond the Bell payload'), extraSections: [] };
}

function resolveDoe(rootDir, wrapperHtml) {
  const names = ['content-1.txt', 'content-2.txt', 'content-3.txt'];
  const content = readJoined(rootDir, names.map((name) => `assets/lessons/introduction-to-design-of-experiment-doe/${name}`));
  return { html: mountHtml(wrapperHtml, '#doeLessonContent', content, 'DOE'), extraSections: [] };
}

function resolveMinitabControlCharts(rootDir, wrapperHtml) {
  const names = [
    '01-intro-foundations.html',
    '02-selector.html',
    '03a-categories-core.html',
    '03b-categories-advanced.html',
    '04-workflow-example.html',
    '05-lab-interpretation.html',
    '06-mistakes-practice-quiz.html',
    '07-summary.html'
  ];
  const content = readJoined(rootDir, names.map((name) =>
    `lessons/assets/minitab-control-chart-selection-analysis/${name}`));
  return { html: mountHtml(wrapperHtml, '#lesson-fragment-root', content, 'Minitab control-chart'), extraSections: [] };
}

function extractDmaicFormulaSections(html) {
  const marker = 'const root = document.getElementById("formulaRoot");';
  const scriptStart = html.lastIndexOf('<script', html.indexOf('const formulas = ['));
  const codeStart = html.indexOf('>', scriptStart) + 1;
  const codeEnd = html.indexOf(marker, codeStart);
  if (scriptStart < 0 || codeStart <= 0 || codeEnd < 0) {
    fail('DMAIC formula payload has an unsupported data structure');
  }
  const sandbox = Object.create(null);
  try {
    vm.runInNewContext(
      `${html.slice(codeStart, codeEnd)}\nthis.__formulas = formulas; this.__phaseMeta = phaseMeta;`,
      sandbox,
      { timeout: 2_000 }
    );
  } catch (error) {
    fail(`Could not read DMAIC formula data: ${error.message}`);
  }
  if (!Array.isArray(sandbox.__formulas) || sandbox.__formulas.length === 0) {
    fail('DMAIC formula payload contains no formulas');
  }
  return sandbox.__formulas.map((formula) => {
    const heading = normalizeSpace(formula.title);
    const text = normalizeSpace([
      formula.id,
      formula.phase,
      formula.family,
      ...(Array.isArray(formula.exams) ? formula.exams : []),
      formula.eq,
      `Use: ${formula.use || ''}`,
      `Exam trap: ${formula.trap || ''}`,
      formula.source
    ].join(' '));
    assertSectionTextWithinLimit(text, `DMAIC formula section ${formula.id}`);
    return {
      id: `formula-title-${formula.id}`,
      heading,
      breadcrumb: ['DMAIC Formula Encyclopedia', normalizeSpace(formula.phase), normalizeSpace(formula.family)],
      text,
      excerpt: makeExcerpt(text),
      kinds: ['section', 'formula']
    };
  });
}

function resolveDmaic(rootDir) {
  const names = ['part-1.txt', 'part-2.txt', 'part-3.txt', 'part-4.txt'];
  const payload = readJoined(rootDir, names.map((name) => `assets/lessons/dmaic-formula-encyclopedia/${name}`));
  const html = decodeGzipBase64(payload, 'DMAIC formula payload');
  return { html, extraSections: extractDmaicFormulaSections(html), addSyntheticTitle: true };
}

const SPECIAL_RESOLVERS = new Map([
  ['/lessons/statistics/chi-square-goodness-of-fit-test', (rootDir) => resolveChiSquare(rootDir)],
  ['/lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives', (rootDir) => resolveBeyondTheBell(rootDir)],
  ['/lessons/lean-six-sigma/dmaic-formula-encyclopedia', (rootDir) => resolveDmaic(rootDir)],
  ['/lessons/power-bi-excel-sql/minitab-control-chart-selection-analysis', (rootDir, html) => resolveMinitabControlCharts(rootDir, html)],
  ['/lessons/introduction-to-design-of-experiment-doe', (rootDir, html) => resolveDoe(rootDir, html)]
]);

function validateSearchContentContract(metadata, entry) {
  const declared = normalizeSpace(metadata.search_content || 'document').toLowerCase();
  if (declared !== 'document' && declared !== 'runtime') {
    fail(`Unsupported search_content value for ${entry.path}: ${metadata.search_content}`);
  }
  const hasResolver = SPECIAL_RESOLVERS.has(entry.path);
  if (declared === 'runtime' && !hasResolver) {
    fail(`Lesson ${entry.path} declares runtime search content but has no build-time resolver`);
  }
  if (declared === 'document' && hasResolver) {
    fail(`Lesson ${entry.path} uses a search-content resolver but metadata does not declare search_content "runtime"`);
  }
}

function looksLikeUnresolvedLoader(html) {
  const dom = new JSDOM(html);
  const scripts = Array.from(dom.window.document.querySelectorAll('script'));
  const inlineSource = scripts.filter((script) => !script.src)
    .map((script) => script.textContent || '')
    .join('\n');
  const externalSources = scripts.map((script) => script.getAttribute('src') || '').filter(Boolean);

  // These are deliberately based on capabilities instead of variable names or
  // a particular promise shape. A future loader can use await, chained
  // promises, helpers, replaceChildren, DOMParser, or a module mount function
  // and still cannot silently bypass the build-time resolver contract.
  const fetches = /\bfetch\s*\(/i.test(inlineSource);
  const awaitedFetchText = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+fetch\s*\([\s\S]{0,3000}?\)[\s\S]{0,5000}?\b\1\s*\.\s*text\s*\(/i
    .test(inlineSource);
  const chainedFetchText = /fetch\s*\([\s\S]{0,3000}?\)\s*\.then\s*\(\s*\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>[\s\S]{0,1000}?\b\1\s*\.\s*text\s*\(/i
    .test(inlineSource);
  const inlineFetchText = /(?:await\s+)?fetch\s*\([\s\S]{0,3000}?\)\s*\)?\s*\.\s*text\s*\(/i
    .test(inlineSource);
  const fetchesMarkup = awaitedFetchText || chainedFetchText || inlineFetchText;
  const parsesMarkup = /\bDOMParser\b|\.parseFromString\s*\(|createContextualFragment\s*\(/i
    .test(inlineSource);
  const replacesChildren = /replaceChildren\s*\(/i.test(inlineSource);
  const writesDocument = /document\.(?:open|write)\s*\(/i
    .test(inlineSource);
  const assemblesParts = /\.innerHTML\s*=\s*parts\.join|\breadParts\s*\(/i
    .test(inlineSource);
  const importsAtRuntime = /\bimport\s*\(/i.test(inlineSource);
  const transformsPayload = /\bDecompressionStream\b|\.gunzipSync\s*\(|\batob\s*\(/i
    .test(inlineSource);
  const requestsMarkup = /\bXMLHttpRequest\b/i.test(inlineSource) &&
    /\bresponseText\b/i.test(inlineSource);
  const explicitLoaderAsset = externalSources.some((source) =>
    /(?:^|[\/_-])(?:loader|payload|fragment|content)(?:[._-]|$)/i.test(source)
  );

  return explicitLoaderAsset || importsAtRuntime || parsesMarkup || transformsPayload ||
    writesDocument || assemblesParts || requestsMarkup || fetchesMarkup ||
    (fetches && replacesChildren);
}

export function resolveLessonContent(rootDir, catalogEntry, wrapperHtml) {
  const resolver = SPECIAL_RESOLVERS.get(catalogEntry.path);
  if (resolver) return resolver(rootDir, wrapperHtml);
  return { html: wrapperHtml, extraSections: [], unresolvedLoader: looksLikeUnresolvedLoader(wrapperHtml) };
}

export function assignDeterministicHeadingIds(document, root) {
  const idCounts = new Map();
  document.querySelectorAll('[id]').forEach((element) => {
    const id = element.id;
    if (id) idCounts.set(id, (idCounts.get(id) || 0) + 1);
  });
  const used = new Set(Array.from(idCounts.keys()));
  const seenHeadingIds = new Set();

  Array.from(root.querySelectorAll('h1,h2,h3,h4')).forEach((heading) => {
    if (heading.id) {
      if ((idCounts.get(heading.id) || 0) > 1 || seenHeadingIds.has(heading.id)) {
        fail(`Duplicate heading anchor #${heading.id}`);
      }
      seenHeadingIds.add(heading.id);
      return;
    }
    const base = `lesson-section-${slugify(heading.textContent)}`;
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    heading.id = candidate;
    used.add(candidate);
    seenHeadingIds.add(candidate);
  });
}

function makeExcerpt(value) {
  const text = normalizeSpace(value);
  if (text.length <= 260) return text;
  const clipped = text.slice(0, 260);
  const breakAt = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, breakAt > 190 ? breakAt : 260).trim()}…`;
}

function classifySection(heading, breadcrumb, text) {
  const haystack = normalizeSpace(`${breadcrumb.join(' ')} ${heading} ${text}`);
  const kinds = ['section'];
  if (/\b(?:example|worked|case study|scenario|application|use case|practice|real[- ]world)\b/i.test(haystack)) {
    kinds.push('example');
  }
  if (/\b(?:formula|equation|calculation|calculate)\b/i.test(haystack) ||
      /\\(?:frac|sqrt|sum|sigma|mu|begin|mathrm|text)\b|[=±×÷∑√σμ²³]/u.test(text)) {
    kinds.push('formula');
  }
  return kinds;
}

function isHeading(node) {
  return node?.nodeType === 1 && /^H[1-4]$/.test(node.tagName);
}

export function extractSections(html, options = {}) {
  const dom = new JSDOM(html);
  const { document, NodeFilter } = dom.window;
  const root = document.querySelector('#lesson-content, main, article') || document.body;
  if (!root) fail(`No searchable content root in ${options.label || 'lesson'}`);

  // Assign before pruning. The browser helper sees quiz/chrome headings too, so
  // they must participate in collision numbering even though their content is
  // deliberately absent from the search index.
  assignDeterministicHeadingIds(document, root);
  root.querySelectorAll(EXCLUDED_SELECTORS).forEach((element) => element.remove());

  const sections = [];
  const stack = [];
  let current = null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  function finishCurrent() {
    if (!current) return;
    const text = normalizeSpace(current.parts.join(' '));
    assertSectionTextWithinLimit(
      text,
      `Searchable section "${current.heading}" in ${options.label || 'lesson'}`
    );
    current.text = text;
    current.excerpt = makeExcerpt(text || current.heading);
    current.kinds = classifySection(current.heading, current.breadcrumb, text);
    delete current.parts;
    sections.push(current);
    current = null;
  }

  let node = walker.nextNode();
  while (node) {
    if (isHeading(node)) {
      finishCurrent();
      const level = Number(node.tagName.slice(1));
      const heading = normalizeSpace(node.textContent);
      stack.length = level - 1;
      stack[level - 1] = heading;
      current = {
        id: node.id,
        heading,
        breadcrumb: stack.filter(Boolean),
        parts: []
      };
    } else if (node.nodeType === 3 && current && !node.parentElement?.closest('h1,h2,h3,h4')) {
      const text = normalizeSpace(node.nodeValue);
      if (text) current.parts.push(text);
    }
    node = walker.nextNode();
  }
  finishCurrent();

  return sections.filter((section) => section.heading && section.id);
}

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];
  for (const value of values.flat(Infinity)) {
    const clean = normalizeSpace(value);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    result.push(clean);
  }
  return result;
}

function validateMetadataAgainstPath(metadata, entry, filePath, rootDir) {
  if (!metadata.title && !metadata.card_title) {
    fail(`Lesson metadata is missing title/card_title: ${path.relative(rootDir, filePath)}`);
  }
  if (typeof metadata.interactive !== 'boolean') {
    fail(`Lesson metadata interactive must be a boolean: ${path.relative(rootDir, filePath)}`);
  }
  const metadataTopic = normalizeSpace(metadata.category_slug);
  if (!metadataTopic) {
    fail(`Lesson metadata is missing category_slug: ${path.relative(rootDir, filePath)}`);
  }
  if (metadataTopic !== entry.topic) {
    fail(`Metadata category/path mismatch for ${entry.path}: ${metadataTopic} !== ${entry.topic}`);
  }
  const expectedSlug = entry.path.split('/').filter(Boolean).pop();
  if (normalizeSpace(metadata.slug) !== expectedSlug) {
    fail(`Metadata slug/path mismatch for ${entry.path}: ${metadata.slug || '(missing)'} !== ${expectedSlug}`);
  }
  if (typeof metadata.interactive !== 'boolean') {
    fail(`Lesson metadata interactive must be boolean for ${entry.path}`);
  }

  const values = {
    level: {
      catalog: entry.level,
      metadata: normalizeSpace(metadata.level).toLowerCase()
    },
    interactive: {
      catalog: entry.interactive,
      metadata: boolValue(metadata.interactive)
    }
  };
  for (const [field, pair] of Object.entries(values)) {
    if (pair.catalog === pair.metadata) continue;
    fail(`Metadata ${field} mismatch for ${entry.path}: catalog=${pair.catalog}, metadata=${pair.metadata}`);
  }
}

function makePlaceholderRecord(entry) {
  return {
    id: `coming-soon-${slugify(entry.title)}`,
    path: entry.path,
    title: entry.title,
    description: entry.description,
    topic: entry.topic,
    level: entry.level,
    minutes: entry.minutes,
    interactive: entry.interactive,
    keywords: uniqueStrings([entry.catalogSearch]),
    placeholder: true,
    contentAvailable: false,
    sections: []
  };
}

function lessonId(entry) {
  return entry.path.replace(/^\/lessons\/?/, '').split('/').map(slugify).join('--');
}

function buildLessonRecord(rootDir, entry) {
  if (entry.placeholder) return makePlaceholderRecord(entry);
  const filePath = lessonPathToFile(rootDir, entry.path);
  if (!fs.existsSync(filePath)) {
    fail(`Published catalog lesson cannot be resolved: ${entry.path} -> ${path.relative(rootDir, filePath)}`);
  }
  const wrapperHtml = fs.readFileSync(filePath, 'utf8');
  const metadata = parseLessonMetadata(wrapperHtml, filePath, rootDir);
  validateMetadataAgainstPath(metadata, entry, filePath, rootDir);
  validateSearchContentContract(metadata, entry);
  if (!/<script\b[^>]*\bsrc\s*=\s*["'][^"']*site-sections\.js(?:[?#][^"']*)?["'][^>]*>/i.test(wrapperHtml)) {
    fail(`Published catalog lesson is missing site-sections.js for search deep links: ${entry.path}`);
  }
  const resolved = resolveLessonContent(rootDir, entry, wrapperHtml);
  let sections = extractSections(resolved.html, { label: entry.path });

  if (resolved.addSyntheticTitle && !sections.some((section) => section.heading === entry.title)) {
    sections.unshift({
      id: `lesson-section-${slugify(entry.title)}`,
      heading: entry.title,
      breadcrumb: [entry.title],
      text: normalizeSpace(metadata.card_description || entry.description),
      excerpt: makeExcerpt(metadata.card_description || entry.description || entry.title),
      kinds: ['section']
    });
  }
  if (resolved.extraSections?.length) sections.push(...resolved.extraSections);

  const anchorIds = new Set();
  for (const section of sections) {
    if (anchorIds.has(section.id)) fail(`Duplicate search anchor #${section.id} in ${entry.path}`);
    anchorIds.add(section.id);
  }
  if (resolved.unresolvedLoader) {
    fail(`Unsupported content loader for ${entry.path}; add a resolver so its loaded sections are indexed`);
  }
  const meaningfulSections = sections.filter((section) => section.text.length > 20);
  if (!meaningfulSections.length) {
    fail(`Published catalog lesson produced no searchable sections: ${entry.path}`);
  }

  return {
    id: lessonId(entry),
    path: entry.path,
    title: entry.title,
    description: normalizeSpace(entry.description || metadata.card_description || metadata.description),
    topic: entry.topic,
    level: entry.level,
    minutes: Number(metadata.estimated_minutes) || entry.minutes || null,
    interactive: entry.interactive,
    keywords: uniqueStrings([metadata.search_keywords || [], entry.catalogSearch]),
    placeholder: false,
    contentAvailable: true,
    sections
  };
}

export function buildLessonSearchIndex(rootDir = DEFAULT_ROOT) {
  const catalog = discoverCatalog(rootDir);
  validateFilesystemCatalogCoverage(rootDir, catalog);
  const lessons = catalog.map((entry) => buildLessonRecord(rootDir, entry));
  const paths = new Set();
  const ids = new Set();
  for (const lesson of lessons) {
    if (ids.has(lesson.id)) fail(`Duplicate lesson id in output: ${lesson.id}`);
    ids.add(lesson.id);
  }
  for (const lesson of lessons.filter((item) => !item.placeholder)) {
    if (paths.has(lesson.path)) fail(`Duplicate real lesson path in output: ${lesson.path}`);
    paths.add(lesson.path);
  }
  return {
    version: 1,
    anchorAlgorithm: ANCHOR_ALGORITHM,
    lessonCount: lessons.length,
    contentLessonCount: lessons.filter((lesson) => lesson.contentAvailable).length,
    sectionCount: lessons.reduce((total, lesson) => total + lesson.sections.length, 0),
    lessons
  };
}

export function serializeLessonSearchIndex(index) {
  return `${JSON.stringify(index, null, 2)}\n`;
}

export function writeLessonSearchIndex(options = {}) {
  const rootDir = options.rootDir || DEFAULT_ROOT;
  const outputFile = options.outputFile || path.join(rootDir, 'assets/search/lesson-search-index.json');
  const index = buildLessonSearchIndex(rootDir);
  const serialized = serializeLessonSearchIndex(index);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, serialized, 'utf8');
  return { index, outputFile, bytes: Buffer.byteLength(serialized) };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const outputArgument = process.argv[2];
    const result = writeLessonSearchIndex({
      rootDir: DEFAULT_ROOT,
      outputFile: outputArgument ? path.resolve(outputArgument) : DEFAULT_OUTPUT
    });
    const relativeOutput = path.relative(DEFAULT_ROOT, result.outputFile).split(path.sep).join('/');
    console.log(`Built ${relativeOutput}: ${result.index.lessonCount} lessons, ` +
      `${result.index.sectionCount} sections, ${result.bytes} bytes.`);
  } catch (error) {
    console.error(error.message || error);
    process.exitCode = 1;
  }
}
