// Adds LearningResource + BreadcrumbList structured data to every staged lesson
// page that does not already carry a LearningResource graph, at build time, so
// no lesson has to hand-write it. Run after build-sitemap.mjs on public-site/.
//
// Everything in the graph comes from the page itself and nothing is invented:
//   name           <title> minus " | UpSkill Sprint"
//   description    <meta name="description">
//   url / item     <link rel="canonical"> (or, if a page has none, the same
//                  page URL build-sitemap.mjs submits for it)
//   educationalLevel     only when the UPSKILLSPRINT_LESSON_META block has "level"
//   isAccessibleForFree  true when meta access_level is missing or "public",
//                        false for "registered" and higher tiers, omitted when
//                        the page's own signals are unclear.
// No teaches, keywords, duration or other facts are added.
//
// Skipped: pages that already contain "LearningResource" (hand-authored graphs
// stay authoritative), HTML fragments (lessons/assets/, test-bank-assets/, or
// no </head>), noindex pages and meta-refresh redirect stubs, and pages missing
// a title or description.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, pageUrl, normalizeUrl, withDirectorySlash } from './build-sitemap.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FRAGMENT_DIRS = ['lessons/assets/', 'test-bank-assets/'];
const TITLE_SUFFIX = /\s*\|\s*UpSkill Sprint\s*$/i;
export const PROVIDER = { '@type': 'Organization', name: 'UpSkill Sprint Consulting', url: SITE + '/' };
export const FREE_ACCESS = new Set(['public']);
export const GATED_ACCESS = new Set(['registered', 'premium', 'special', 'administrator']);

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', rsquo: '\u2019', lsquo: '\u2018',
  rdquo: '\u201d', ldquo: '\u201c', ndash: '\u2013', mdash: '\u2014', hellip: '\u2026', middot: '\u00b7', times: '\u00d7' };

/** Decodes the HTML entities that can appear in a title or attribute value. */
export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    }
    return Object.hasOwn(NAMED_ENTITIES, e.toLowerCase()) ? NAMED_ENTITIES[e.toLowerCase()] : m;
  });
}

/** Attributes of one start tag, any order, any quoting. Names are lower-cased. */
export function tagAttributes(tag) {
  const attrs = {};
  const body = tag.replace(/^<[a-z0-9-]+/i, '').replace(/\/?>$/, '');
  for (const m of body.matchAll(/([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

/** Blanks script/style/template contents and comments (same length) so markup inside them is never read as the page's own. */
function maskInert(html) {
  return html.replace(/(<(script|style|template)\b[^>]*>)([\s\S]*?)(<\/\2>)|<!--[\s\S]*?-->/gi,
    (m, open, _name, inner, close) => open ? open + ' '.repeat(inner.length) + close : ' '.repeat(m.length));
}

/** The lesson's UPSKILLSPRINT_LESSON_META object; null when absent, undefined when it does not parse. */
export function lessonMeta(html) {
  const block = html.match(/<!--\s*UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/);
  if (!block) return null;
  try {
    const meta = JSON.parse(block[1]);
    return meta && typeof meta === 'object' && !Array.isArray(meta) ? meta : undefined;
  } catch {
    return undefined;
  }
}

/** Reads title, description, canonical, robots and refresh from the page head. */
export function pageHead(html) {
  const masked = maskInert(html);
  const end = masked.search(/<\/head>/i);
  if (end === -1) return null;
  const head = masked.slice(0, end);
  const titleTag = /<title\b[^>]*>/i.exec(head);
  let title = null;
  if (titleTag) {
    const close = html.slice(titleTag.index + titleTag[0].length).search(/<\/title>/i);
    if (close !== -1) title = decodeEntities(html.slice(titleTag.index + titleTag[0].length, titleTag.index + titleTag[0].length + close)).replace(/\s+/g, ' ').trim();
  }
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => tagAttributes(m[0]));
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => tagAttributes(m[0]));
  const named = (name) => metas.find((a) => (a.name || '').toLowerCase() === name);
  const description = named('description')?.content?.replace(/\s+/g, ' ').trim() || null;
  const canonical = links.find((a) => (a.rel || '').toLowerCase().split(/\s+/).includes('canonical'))?.href?.trim() || null;
  const noindex = /\bnoindex\b/i.test(named('robots')?.content || '');
  const refresh = metas.some((a) => (a['http-equiv'] || '').toLowerCase() === 'refresh');
  const bodyTag = /<body\b[^>]*>/i.exec(masked);
  const body = bodyTag ? tagAttributes(bodyTag[0]) : {};
  return { title, description, canonical, noindex, refresh, headEnd: end, body };
}

/** isAccessibleForFree from the page's own signals, or undefined when they are unclear. */
export function accessibleForFree(meta, body = {}) {
  const gatedBody = 'data-require-auth' in body || 'data-access-resource' in body || 'data-required-access' in body;
  if (meta === undefined) return undefined; // unreadable meta: say nothing
  const level = meta && Object.hasOwn(meta, 'access_level') ? String(meta.access_level).trim().toLowerCase() : null;
  if (level === null || FREE_ACCESS.has(level)) return gatedBody ? undefined : true;
  if (GATED_ACCESS.has(level)) return false;
  return undefined;
}

/** Builds the @graph document for one lesson, or null if the page lacks a title, description or URL. */
export function lessonGraph({ title, description, url, level, free }) {
  const name = title ? title.replace(TITLE_SUFFIX, '').trim() : '';
  if (!name || !description || !url) return null;
  const resource = { '@type': 'LearningResource', name, description, url, learningResourceType: 'Lesson' };
  if (typeof level === 'string' && level.trim()) resource.educationalLevel = level.trim();
  if (typeof free === 'boolean') resource.isAccessibleForFree = free;
  resource.provider = { ...PROVIDER };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Lessons', item: SITE + '/lessons' },
        { '@type': 'ListItem', position: 3, name, item: url }
      ] },
      resource
    ]
  };
}

/** JSON for an inline <script>: "<" is escaped so the text can never close the element. */
export function scriptJson(value) {
  return JSON.stringify(value).replace(/[<\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

/** Returns the page with one lesson JSON-LD block added before </head>, or null if it should not change. */
export function injectLessonJsonLd(html, relPath = '') {
  if (html.includes('LearningResource')) return null;
  const head = pageHead(html);
  if (!head || head.noindex || head.refresh) return null;
  if (head.canonical && !head.canonical.startsWith(SITE + '/')) return null; // canonical points off-site
  const rel = relPath.split(sep).join('/');
  const url = head.canonical ? withDirectorySlash(rel, normalizeUrl(head.canonical)) : rel ? withDirectorySlash(rel, pageUrl(rel)) : null;
  const meta = lessonMeta(html);
  const graph = lessonGraph({
    title: head.title, description: head.description, url,
    level: meta ? meta.level : undefined,
    free: accessibleForFree(meta, head.body)
  });
  if (!graph) return null;
  const tag = '<script type="application/ld+json">' + scriptJson(graph) + '</script>\n';
  return html.slice(0, head.headEnd) + tag + html.slice(head.headEnd);
}

export function shouldInject(rel) {
  const p = rel.split(sep).join('/');
  return p.startsWith('lessons/') && p.toLowerCase().endsWith('.html') && !FRAGMENT_DIRS.some((d) => p.startsWith(d));
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.toLowerCase().endsWith('.html')) yield full;
  }
}

export async function injectLessonJsonLdAll(siteDir) {
  let added = 0;
  const lessonsDir = join(siteDir, 'lessons');
  for await (const file of htmlFiles(lessonsDir)) {
    const rel = relative(siteDir, file);
    if (!shouldInject(rel)) continue;
    const next = injectLessonJsonLd(await readFile(file, 'utf8'), rel);
    if (next === null) continue;
    await writeFile(file, next);
    added++;
  }
  console.log(`Lesson JSON-LD added to ${added} pages.`);
  return added;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await injectLessonJsonLdAll(process.argv[2] ? resolve(process.argv[2]) : join(root, 'public-site'));
}
