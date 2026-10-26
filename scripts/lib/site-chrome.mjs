/* Shared helpers that bring a page's header, nav and logo in line with the
   site-wide chrome. Used by scripts/sync-site-nav.mjs for committed pages and
   by build steps that generate lesson HTML at build time (pre-rendered
   compressed lessons, the interactive SQL lesson), which sync-site-nav.mjs
   never sees. Menu content lives in site-nav.js. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { markup } = require(path.join(root, 'site-nav.js'));

export function currentTab(rel) {
  const file = rel.replace(/\\/g, '/');
  if (/(^|\/)start-here\.html$/.test(file)) return 'start';
  if (/(^|\/)lessons\.html$/.test(file) || file.startsWith('lessons/') || file.includes('/lessons/')) return 'lessons';
  if (/exam-practice|test-bank|admin-exam-access/.test(file)) return 'exam';
  if (file.startsWith('tools/') || file.includes('/tools/') || file.includes('engineering-tools')) return 'tools';
  if (/(^|\/)services\.html$/.test(file)) return 'services';
  if (/(^|\/)(about|faq|contact|request-topic|privacy|terms|request)\.html$/.test(file)) return 'about';
  return '';
}

function retag(open, kind) {
  let tag = open;
  if (/aria-label=/.test(tag)) tag = tag.replace(/aria-label="[^"]*"/, 'aria-label="Main"');
  else tag = tag.replace('<nav', '<nav aria-label="Main"');
  if (!/data-nav-root=/.test(tag)) tag = tag.replace('<nav', `<nav data-nav-root="${kind}"`);
  return tag;
}

export function replaceNavs(source, tab) {
  return source.replace(/<nav\b([^>]*\bclass="[^"]*\b(desktop-nav|mobile-nav)\b[^"]*"[^>]*)>([\s\S]*?)<\/nav>/g, function (full, attrs, kind) {
    const open = retag(`<nav${attrs}>`, kind === 'mobile-nav' ? 'mobile' : 'desktop');
    const inner = markup(kind === 'mobile-nav' ? 'mobile' : 'desktop', tab);
    return `${open}${inner}</nav>`;
  });
}

export function ensureScript(source) {
  if (source.includes('site-nav.js')) return source;
  if (!source.includes('site-sections.js') && !/<nav\b[^>]*\bdesktop-nav\b/.test(source)) return source;
  const block = '<link rel="stylesheet" href="/site-nav.css">\n<script src="/site-nav.js" defer></script>\n';
  if (source.includes('<script src="/site-sections.js"></script>')) {
    return source.replace('<script src="/site-sections.js"></script>', `${block}<script src="/site-sections.js"></script>`);
  }
  if (source.includes('<script src="/theme.js"></script>')) {
    return source.replace('<script src="/theme.js"></script>', `<script src="/theme.js"></script>\n${block}`);
  }
  if (source.includes('</head>')) return source.replace('</head>', `${block}</head>`);
  return source;
}

export function ensureMobile(source, tab) {
  if (/<nav\b[^>]*\bmobile-nav\b/.test(source)) return source;
  if (!/<header\b[^>]*\bclass="[^"]*\bsite\b/.test(source)) return source;
  const block = `\n<nav class="mobile-nav" data-nav-root="mobile" aria-label="Main">${markup('mobile', tab)}</nav>`;
  return source.replace(/<header\b[^>]*\bclass="[^"]*\bsite\b[^"]*"[^>]*>[\s\S]*?<\/header>/, function (header) {
    return header + block;
  });
}

const LIGHT_WORDMARK = '<img class="logo-wordmark" src="/assets/logo-wordmark.png" data-logo-light="/assets/logo-wordmark.png" data-logo-dark="/assets/logo-wordmark-on-dark.png" alt="UpSkill Sprint Consulting">';
const DARK_WORDMARK = '<img class="logo-wordmark" src="/assets/logo-wordmark-on-dark.png" alt="UpSkill Sprint Consulting">';
const LEGACY_BRAND = /<img\b[^>]*\bsrc="\/assets\/logo-icon\.png"[^>]*>\s*<span>\s*UpSkill Sprint Consulting\s*<\/span>/g;

/* Swap the retired logo-icon.png brand (which now 404s) for the approved
   wordmark: the theme-aware one in the header, the on-dark one in the footer. */
export function replaceLegacyLogo(source) {
  const footerAt = source.search(/<footer\b/);
  return source
    .replace(LEGACY_BRAND, (match, offset) => (footerAt >= 0 && offset > footerAt ? DARK_WORDMARK : LIGHT_WORDMARK))
    .replace(/(<meta\b[^>]*\bcontent=")https:\/\/upskillsprint\.com\/assets\/logo-icon\.png"/g, '$1https://upskillsprint.com/assets/logo-og.png"');
}

/* Full chrome refresh for HTML produced at build time. */
export function applySiteChrome(source, rel) {
  const tab = currentTab(rel);
  let next = replaceLegacyLogo(source);
  next = replaceNavs(next, tab);
  next = ensureMobile(next, tab);
  return ensureScript(next);
}
