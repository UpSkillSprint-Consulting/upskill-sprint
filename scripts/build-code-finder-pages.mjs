// Builds the indexable Code Finder pages into the staged site (public-site/):
//   /codes/                          hub: every publisher, category, industry and pack
//   /codes/{prefix}/{number}/        one page per code (api-5l -> /codes/api/5l/)
//   /codes/category/{slug}/          codes in a category
//   /codes/industry/{slug}/          codes used in an industry
//   /codes/pack/{slug}/              a starter pack, with the reason for each code
//   /codes/compare/{a}-vs-{b}/       equivalent or similar codes side by side
// Output is build-only (never committed). Data: data/code-finder/. Chrome is
// copied from tools/code-finder/index.html so it always matches the tool page.
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {isRich, loadCatalog} from './lib/code-finder-catalog.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://upskillsprint.com';
const E = createRequire(import.meta.url)('../tools/code-finder/code-finder-engine.js');
const TITLE_MAX = 65;
const SUFFIX = ' | UpSkill Sprint';

export const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// api-5l -> /codes/api/5l/ ; iso-iec-17025 -> /codes/iso/iec-17025/
export function codePath(id) {
  const cut = id.indexOf('-');
  return `/codes/${id.slice(0, cut)}/${id.slice(cut + 1)}/`;
}
export const comparePath = (a, b) => `/codes/compare/${[a, b].sort().join('-vs-')}/`;

// Fit "<main> | UpSkill Sprint" into 65 characters, shortening the main part at a word boundary.
export function pageTitle(main) {
  const room = TITLE_MAX - SUFFIX.length;
  if (main.length <= room) return main + SUFFIX;
  const cut = main.slice(0, room - 1).replace(/[\s,:;—-]+\S*$/, '');
  return cut + '…' + SUFFIX;
}
// Meta description: 120-160 characters where the text allows.
export function metaDescription(text, tail) {
  let out = text.trim();
  if (out.length < 120 && tail) out = (out.replace(/\.$/, '') + '. ' + tail).trim();
  if (out.length > 160) out = out.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return out;
}

// Oxford-free Canadian list: "ASTM"; "ASTM and ISO"; "API, CSA and ISO".
export function formatCanadianList(items) {
  const list = [...items].filter(Boolean);
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

export function publishersPresent(records, bodyOrder) {
  const present = new Set(records.map(record => record.body));
  const ordered = bodyOrder.filter(code => present.has(code));
  for (const code of present) {
    if (!ordered.includes(code)) ordered.push(code);
  }
  return ordered;
}

export function facetCodesPhrase(records, bodyOrder) {
  const n = records.length;
  const pubs = formatCanadianList(publishersPresent(records, bodyOrder));
  const noun = n === 1 ? 'code' : 'codes';
  return `${n} ${pubs} ${noun}`;
}

function chrome(toolHtml) {
  const header = toolHtml.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>\n/)?.[0];
  const footer = toolHtml.match(/<footer class="site">[\s\S]*?<\/footer>\n?/)?.[0];
  if (!header || !footer) throw new Error('Code Finder pages: could not copy header/footer from tools/code-finder/index.html');
  return {header, footer};
}

// Thin pages stay live and linked but are kept out of search until they have our own content.
function layout({title, description, path, breadcrumb, about, body, chromeParts, index = true}) {
  const url = SITE + path;
  const graph = [{
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map(([name, href], i) => ({'@type': 'ListItem', position: i + 1, name, item: SITE + href}))
  }, {'@type': 'WebPage', name: breadcrumb[breadcrumb.length - 1][0], description, url, isPartOf: {'@type': 'WebSite', name: 'UpSkill Sprint', url: SITE + '/'},
    ...(about ? {about} : {}), publisher: {'@type': 'Organization', name: 'UpSkill Sprint Consulting', url: SITE + '/'}}];
  const crumbs = breadcrumb.map(([name, href], i) => i === breadcrumb.length - 1
    ? `<li aria-current="page">${esc(name)}</li>` : `<li><a href="${esc(href)}">${esc(name)}</a></li>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${index ? '' : '<meta name="robots" content="noindex, follow">\n'}<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://upskillsprint.com/assets/logo-og.png">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/lessons-theme.css">
<script src="/theme.js"></script>
<script src="/site-sections.js"></script>
<link rel="stylesheet" href="/site-nav.css">
<script src="/site-nav.js" defer></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/osiris-tool-theme.css">
<link rel="stylesheet" href="/tools/code-finder/code-finder.css">
<script type="application/ld+json">
${JSON.stringify({'@context': 'https://schema.org', '@graph': graph}, null, 1).replace(/</g, '\\u003c')}
</script>
</head>
<body class="osx-page" data-code-page>
${chromeParts.header}<main id="code-page" class="osx-tool cf-app cf-page">
<nav class="cf-crumbs" aria-label="Breadcrumb"><ol>${crumbs}</ol></nav>
${body}
<aside class="cf-disclaimer osx-panel" aria-labelledby="cf-disclaimer-h">
  <h2 id="cf-disclaimer-h" class="osx-label">Before you rely on a code</h2>
  <p>This page lists facts about the code in our own words, never the code text. Editions change and regulators adopt specific editions. Confirm the current edition with the publisher and check which edition your regulator or contract calls for.</p>
</aside>
</main>
<section aria-label="Return to Code Finder" class="cf-back">
  <a href="/tools/code-finder/">&larr; Back to Code Finder</a>
</section>
${chromeParts.footer}</body>
</html>
`;
}

const list = (items, render) => items.length ? `<ul class="cf-page-list">${items.map(render).join('')}</ul>` : '';
const codeLink = record => `<a href="${codePath(record.id)}">${esc(record.designation)}</a>`;

function codeRow(record, extra = '') {
  const status = E.isStale(record) ? '<span class="cf-check-todo">Not yet checked</span>' : `<span class="cf-check-ok">Checked ${esc(record.verified)}</span>`;
  return `<li class="cf-page-row osx-panel"><p class="cf-desig">${codeLink(record)}</p><p class="cf-page-row-title">${esc(record.title)}</p>${extra}<p class="cf-summary">${esc(record.summary)}</p><p class="cf-page-row-meta">${esc(record.body)} · ${status}</p></li>`;
}

function statusBlock(record) {
  if (!E.isStale(record)) {
    return `<p class="cf-check-ok"><span class="cf-flag" aria-hidden="true">✓</span> Checked against the publisher on ${esc(record.verified)}${record.edition ? `. Current edition: <strong>${esc(record.edition)}</strong> (${esc(record.year)})` : ''}.</p>`;
  }
  return '<p class="cf-check-todo"><span class="cf-flag" aria-hidden="true">!</span> Not yet checked against the publisher. Confirm the current edition before you use it.</p>';
}

export async function buildCodeFinderPages(siteDir = join(ROOT, 'public-site')) {
  const catalog = await loadCatalog(join(ROOT, 'data', 'code-finder'));
  const index = E.buildIndex(catalog);
  const chromeParts = chrome(await readFile(join(ROOT, 'tools', 'code-finder', 'index.html'), 'utf8'));
  const records = catalog.standards.standards;
  const label = (facet, slug) => index.labels[facet][slug] || slug;
  const bodyName = Object.fromEntries(catalog.taxonomy.bodies.map(body => [body.code, body.name]));
  const bodyCatalog = Object.fromEntries(catalog.taxonomy.bodies.map(body => [body.code, body.catalog]));
  const packsFor = id => catalog.scenarios.packs.filter(pack => pack.records.some(item => item.id === id));
  const pages = new Map();
  const add = (path, html) => { if (pages.has(path)) throw new Error('Duplicate Code Finder page ' + path); pages.set(path, html); };
  const base = [['Home', '/'], ['Engineering Tools', '/engineering-tools'], ['Code Finder', '/tools/code-finder/']];
  const facetLinks = (facet, slugs, kind) => slugs.map(slug => kind
    ? `<a class="cf-why-chip" href="/codes/${kind}/${slug}/">${esc(label(facet, slug))}</a>`
    : `<span class="cf-why-chip">${esc(label(facet, slug))}</span>`).join(' ');

  // ---------- One page per code ----------
  const comparePairs = new Map();
  for (const record of records) {
    const related = E.related(index, record.id).filter(item => index.byId[item.to]);
    for (const item of related) {
      if (item.type === 'equivalent' || item.type === 'similar') comparePairs.set([record.id, item.to].sort().join('|'), item.type);
    }
    const adoptions = record.adoptions.map(a => `<li><strong>${esc(label('jurisdictions', a.jurisdiction))}:</strong> ${esc(a.regulator)} requires it through ${esc(a.instrument)}, which calls for ${a.style === 'dated' ? 'a fixed edition: ' + esc(a.editionCited) : 'each new edition (' + esc(a.editionCited) + ')'}. Checked ${esc(a.verified)}.</li>`);
    const packs = packsFor(record.id);
    const main = `${record.designation}: ${record.title}`;
    const body = `
<header class="cf-page-head">
  <p class="osx-brand cf-kicker">${esc(bodyName[record.body] || record.body)} · ${esc(label('docTypes', record.docType))}</p>
  <h1>${esc(record.designation)}: ${esc(record.title)}</h1>
  <p class="cf-lead">${esc(record.summary)}</p>
  ${statusBlock(record)}
  <p class="cf-page-actions"><a class="osx-btn" href="/tools/code-finder/?q=${encodeURIComponent(record.designation)}">Open in Code Finder</a> <a class="osx-btn-ghost" href="${esc(bodyCatalog[record.body])}" rel="noopener">Find it in the ${esc(bodyName[record.body] || record.body)} catalog</a></p>
</header>
${isRich(record) ? `<section class="cf-page-section" aria-labelledby="h-covers"><h2 id="h-covers">What ${esc(record.designation)} covers</h2><ul class="cf-page-list">${record.keyPoints.map(point => `<li>${esc(point)}</li>`).join('')}</ul></section>` : ''}
${record.tips ? `<section class="cf-page-section" aria-labelledby="h-tips"><h2 id="h-tips">Practical tips</h2><ul class="cf-page-list">${record.tips.map(tip => `<li>${esc(tip)}</li>`).join('')}</ul></section>` : ''}
<section class="cf-page-section" aria-labelledby="h-where"><h2 id="h-where">Where ${esc(record.designation)} is used</h2>
  <div class="cf-details-grid">
    <div class="cf-dl"><h3>Industries</h3><p>${facetLinks('industries', record.industries, 'industry')}</p></div>
    <div class="cf-dl"><h3>Categories</h3><p>${facetLinks('categories', record.categories, 'category')}</p></div>
    <div class="cf-dl"><h3>Use it to</h3><p>${facetLinks('useCases', record.useCases)}</p></div>
    <div class="cf-dl"><h3>Region</h3><p>${facetLinks('jurisdictions', record.jurisdictions)}</p></div>
  </div>
</section>
${adoptions.length ? `<section class="cf-page-section" aria-labelledby="h-law"><h2 id="h-law">Where it is mandatory</h2><ul>${adoptions.join('')}</ul></section>` : ''}
${related.length ? `<section class="cf-page-section" aria-labelledby="h-rel"><h2 id="h-rel">Related codes</h2>${list(related, item => {
      const other = index.byId[item.to];
      const compare = item.type === 'equivalent' || item.type === 'similar' ? ` · <a href="${comparePath(record.id, other.id)}">Compare ${esc(record.designation)} vs ${esc(other.designation)}</a>` : '';
      return `<li><span class="cf-rel-type">${esc(item.label)}</span> ${codeLink(other)}: ${esc(other.title)}${item.note ? ` <span class="cf-rel-note">(${esc(item.note)})</span>` : ''}${compare}</li>`;
    })}</section>` : ''}
${packs.length ? `<section class="cf-page-section" aria-labelledby="h-packs"><h2 id="h-packs">Starter packs that include it</h2>${list(packs, pack => `<li><a href="/codes/pack/${pack.slug}/">${esc(pack.title)}</a>: ${esc(pack.records.find(item => item.id === record.id).why)}</li>`)}</section>` : ''}
${record.learning.length ? `<section class="cf-page-section" aria-labelledby="h-learn"><h2 id="h-learn">Learn it on UpSkill Sprint</h2>${list(record.learning, item => `<li><a href="${esc(item.href)}">${esc(item.label)}${item.type === 'lesson' ? ' lesson' : ''}</a></li>`)}</section>` : ''}`;
    add(codePath(record.id), layout({
      title: pageTitle(main),
      description: metaDescription(record.summary, `What ${record.designation} covers, where it applies and related codes.`),
      path: codePath(record.id), breadcrumb: [...base, ['Codes', '/codes/'], [record.designation, codePath(record.id)]],
      about: {'@type': 'CreativeWork', name: main, publisher: {'@type': 'Organization', name: bodyName[record.body] || record.body}},
      body, chromeParts, index: isRich(record)
    }));
  }

  // ---------- Category and industry lists ----------
  const bodyOrder = catalog.taxonomy.bodies.map(body => body.code);
  for (const [facet, kind, noun] of [['categories', 'category', 'category'], ['industries', 'industry', 'industry']]) {
    for (const entry of catalog.taxonomy.facets[facet]) {
      const matches = E.search(index, '', {[facet]: [entry.slug]}).results.map(item => item.record);
      if (!matches.length) continue;
      const path = `/codes/${kind}/${entry.slug}/`;
      const h1 = kind === 'category' ? `${entry.label} codes and standards` : `Codes and standards for ${entry.label.toLowerCase()}`;
      const summary = matches.length === 1 ? 'with a plain-language summary' : 'each with a plain-language summary';
      add(path, layout({
        title: pageTitle(h1),
        description: metaDescription(`${facetCodesPhrase(matches, bodyOrder)} for ${entry.label.toLowerCase()}, ${summary}`, 'Filter them further in the free Code Finder tool.'),
        path, breadcrumb: [...base, ['Codes', '/codes/'], [entry.label, path]],
        body: `<header class="cf-page-head"><p class="osx-brand cf-kicker">Code Finder · by ${noun}</p><h1>${esc(h1)}</h1><p class="cf-lead">${matches.length} codes, grouped by publisher. <a href="/tools/code-finder/?${E.PARAM[facet]}=${entry.slug}">Filter and search them in Code Finder</a>.</p></header><ul class="cf-page-rows">${matches.map(record => codeRow(record)).join('')}</ul>`,
        chromeParts
      }));
    }
  }

  // ---------- Starter packs ----------
  for (const pack of catalog.scenarios.packs) {
    const path = `/codes/pack/${pack.slug}/`;
    const view = E.packResults(index, pack.slug);
    add(path, layout({
      title: pageTitle(`${pack.title}: codes and standards`),
      description: metaDescription(pack.summary, `${view.total} codes, each with the reason it is on the list.`),
      path, breadcrumb: [...base, ['Codes', '/codes/'], [pack.title, path]],
      body: `<header class="cf-page-head"><p class="osx-brand cf-kicker">Starter pack · ${view.total} codes</p><h1>${esc(pack.title)}</h1><p class="cf-lead">${esc(pack.summary)}</p>
<p class="cf-page-actions"><a class="osx-btn" href="/tools/code-finder/?pack=${pack.slug}">Open this pack in Code Finder to download it</a></p></header>
${pack.regulated ? `<aside class="cf-consult" aria-labelledby="h-consult"><h2 id="h-consult">Need help applying this?</h2><p>This work is regulated, and the edition your regulator or contract calls for matters. We help teams turn code requirements into inspection plans, procedures and audit-ready records.</p><a class="osx-btn" href="/services#consulting-support">Talk to us about consulting support</a></aside>` : ''}
<ol class="cf-page-rows">${view.results.map(item => codeRow(item.record, `<p class="cf-pack-why"><strong>Why it is in this pack:</strong> ${esc(item.why)}</p>`)).join('')}</ol>
${pack.lessons.length ? `<section class="cf-page-section" aria-labelledby="h-learn"><h2 id="h-learn">Learn the methods behind this pack</h2>${list(pack.lessons, lesson => `<li><a href="${esc(lesson.href)}">${esc(lesson.label)} lesson</a></li>`)}</section>` : ''}`,
      chromeParts
    }));
  }

  // ---------- Comparisons (equivalent or similar pairs) ----------
  for (const [key, type] of comparePairs) {
    const [a, b] = key.split('|').map(id => index.byId[id]);
    const path = comparePath(a.id, b.id);
    const row = (name, fa, fb) => `<tr><th scope="row">${name}</th><td>${fa}</td><td>${fb}</td></tr>`;
    const facets = (record, facet) => record[facet].map(slug => esc(label(facet, slug))).join(', ');
    const note = (a.relations.find(r => r.to === b.id) || b.relations.find(r => r.to === a.id) || {}).note;
    const h1 = `${a.designation} vs ${b.designation}`;
    add(path, layout({
      title: pageTitle(`${h1}: what is the difference?`),
      description: metaDescription(`${a.designation} and ${b.designation} compared: publisher, scope, industries and where each applies`, `They are ${type === 'equivalent' ? 'technically equivalent' : 'similar but not interchangeable'}.`),
      path, breadcrumb: [...base, ['Codes', '/codes/'], [h1, path]],
      body: `<header class="cf-page-head"><p class="osx-brand cf-kicker">Compare codes</p><h1>${esc(h1)}</h1>
<p class="cf-lead">${type === 'equivalent' ? 'These codes are technically equivalent or come from the same harmonized text' : 'These codes cover similar ground but are not interchangeable'}${note ? `: ${esc(note)}` : ''}. Check which one your contract, purchase order or regulator names.</p></header>
<div class="cf-table-wrap" role="region" aria-label="${esc(h1)} comparison" tabindex="0"><table class="cf-compare"><thead><tr><th scope="col"><span class="cf-sr">Item</span></th><th scope="col">${codeLink(a)}</th><th scope="col">${codeLink(b)}</th></tr></thead><tbody>
${row('Title', esc(a.title), esc(b.title))}
${row('Publisher', esc(bodyName[a.body] || a.body), esc(bodyName[b.body] || b.body))}
${row('Document type', esc(label('docTypes', a.docType)), esc(label('docTypes', b.docType)))}
${row('What it covers', esc(a.summary), esc(b.summary))}
${row('Region', facets(a, 'jurisdictions'), facets(b, 'jurisdictions'))}
${row('Industries', facets(a, 'industries'), facets(b, 'industries'))}
${row('Mandatory in', a.adoptions.map(x => esc(x.regulator + ' (' + x.instrument + ')')).join('; ') || 'None recorded', b.adoptions.map(x => esc(x.regulator + ' (' + x.instrument + ')')).join('; ') || 'None recorded')}
${row('Check status', E.isStale(a) ? 'Not yet checked' : 'Checked ' + esc(a.verified), E.isStale(b) ? 'Not yet checked' : 'Checked ' + esc(b.verified))}
</tbody></table></div>
${isRich(a) && isRich(b) ? `<div class="cf-details-grid cf-compare-points">${[a, b].map(r => `<section class="cf-page-section" aria-labelledby="h-kp-${r.id}"><h2 id="h-kp-${r.id}">What ${esc(r.designation)} covers</h2><ul class="cf-page-list">${r.keyPoints.map(point => `<li>${esc(point)}</li>`).join('')}</ul></section>`).join('')}</div>` : ''}`,
      chromeParts, index: isRich(a) && isRich(b)
    }));
  }

  // ---------- Hub ----------
  const byBody = catalog.taxonomy.bodies.map(body => ({body, rows: records.filter(r => r.body === body.code)
    .sort((x, y) => x.designation.localeCompare(y.designation, 'en', {numeric: true}))}));
  const facetIndex = (facet, kind) => list(catalog.taxonomy.facets[facet].filter(entry => pages.has(`/codes/${kind}/${entry.slug}/`)),
    entry => `<li><a href="/codes/${kind}/${entry.slug}/">${esc(entry.label)}</a></li>`);
  add('/codes/', layout({
    title: pageTitle('API, CSA, ASTM and ISO codes and standards index'),
    description: metaDescription(`Browse ${records.length} API, CSA, ASTM and ISO codes and standards by publisher, category, industry or starter pack, each with a plain-language summary`, ''),
    path: '/codes/', breadcrumb: [...base, ['Codes', '/codes/']],
    body: `<header class="cf-page-head"><p class="osx-brand cf-kicker">Code Finder</p><h1>API, CSA, ASTM and ISO codes and standards</h1><p class="cf-lead">${records.length} codes with plain-language summaries, related codes and where each is mandatory. <a href="/tools/code-finder/">Search them in Code Finder</a>.</p></header>
<section class="cf-page-section" aria-labelledby="h-packs"><h2 id="h-packs">Starter packs</h2>${list(catalog.scenarios.packs, pack => `<li><a href="/codes/pack/${pack.slug}/">${esc(pack.title)}</a></li>`)}</section>
<section class="cf-page-section" aria-labelledby="h-cat"><h2 id="h-cat">By category</h2>${facetIndex('categories', 'category')}</section>
<section class="cf-page-section" aria-labelledby="h-ind"><h2 id="h-ind">By industry</h2>${facetIndex('industries', 'industry')}</section>
${byBody.map(({body, rows}) => `<section class="cf-page-section" aria-labelledby="h-${body.code.toLowerCase()}"><h2 id="h-${body.code.toLowerCase()}">${esc(body.name)} (${rows.length})</h2>${list(rows, r => `<li>${codeLink(r)}: ${esc(r.title)}</li>`)}</section>`).join('\n')}`,
    chromeParts
  }));

  for (const [path, html] of pages) {
    const file = join(siteDir, path, 'index.html');
    await mkdir(dirname(file), {recursive: true});
    await writeFile(file, html);
  }
  const indexed = [...pages.values()].filter(html => !html.includes('<meta name="robots" content="noindex')).length;
  const counts = {codes: records.length, packs: catalog.scenarios.packs.length, compare: comparePairs.size, total: pages.size, indexed};
  console.log('Code Finder pages built:', JSON.stringify(counts));
  return {pages, counts};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildCodeFinderPages(process.argv[2] ? resolve(process.argv[2]) : undefined);
}
