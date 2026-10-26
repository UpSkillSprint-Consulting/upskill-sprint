// Pre-render lessons whose teaching content is otherwise assembled by
// JavaScript, so the staged HTML already contains the full lesson.
//  - Chi-square and Beyond the Bell ship gzip/base64 payloads that replace the
//    loader document; we decode them here and apply the same head handling as
//    lesson-payload-swap.js (the wrapper owns title, description, canonical,
//    social tags and any JSON-LD).
//  - DOE fetches CSS, content and app fragments; we inline them and mark the
//    host data-prerendered so loader.js only runs the inlined app code.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { applySiteChrome } from './lib/site-chrome.mjs';

const SEO = 'title, meta[name="description"], link[rel~="canonical"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]';

export const compressedLessons = [
  {
    page: 'lessons/statistics/chi-square-goodness-of-fit-test.html',
    payload: async dir => (await readFile(join(dir, 'assets/lessons/chi-square-goodness-of-fit/payload.js'), 'utf8'))
      .match(/__upskillChiSquarePayload\s*=\s*'([^']+)'/)[1],
    // The wrapper's loader appends contrast-fix.js before </body>.
    appendContrastFix: true,
    marker: 'Chi-Square Goodness-of-Fit Test'
  },
  {
    page: 'lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives.html',
    payload: async dir => (await Promise.all([1, 2, 3, 4].map(i =>
      readFile(join(dir, `assets/lessons/beyond-the-bell/part-0${i}.txt`), 'utf8')))).join('').replace(/\s+/g, ''),
    appendContrastFix: false,
    marker: 'Beyond the Bell: The Normal Distribution and Its Relatives'
  }
];

export function mergeCompressedLesson(wrapperHtml, lessonHtml, { appendContrastFix = false } = {}) {
  if (appendContrastFix) lessonHtml = lessonHtml.replace('</body>', '<script src="/contrast-fix.js"></script></body>');
  const wrapper = new JSDOM(wrapperHtml).window.document;
  const dom = new JSDOM(lessonHtml);
  try {
    const doc = dom.window.document;
    const wrapperSeo = [...wrapper.head.querySelectorAll(SEO)];
    const hasWrapperLd = wrapperSeo.some(tag => tag.matches('script[type="application/ld+json"]'));
    doc.head.querySelectorAll(SEO).forEach(tag => {
      if (!hasWrapperLd && tag.matches('script[type="application/ld+json"]')) return;
      tag.remove();
    });
    for (const tag of wrapperSeo) doc.head.appendChild(doc.importNode(tag, true));
    doc.documentElement.setAttribute('data-prerendered', 'true');
    let out = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML + '\n';
    // Keep the lesson metadata comment for build tooling that reads it.
    const meta = wrapperHtml.match(/<!-- UPSKILLSPRINT_LESSON_META[\s\S]*?-->/);
    if (meta) out = out.replace(/<html\b[^>]*>/i, tag => tag + '\n' + meta[0]);
    return out;
  } finally {
    dom.window.close();
  }
}

export const doe = {
  page: 'lessons/introduction-to-design-of-experiment-doe.html',
  dir: 'assets/lessons/introduction-to-design-of-experiment-doe',
  css: ['style-1.txt', 'style-2.txt', 'style-3.txt'],
  html: ['content-1.txt', 'content-2.txt', 'content-3.txt'],
  js: ['app-1.txt', 'app-2.txt', 'app-3.txt', 'app-4.txt']
};

export function inlineDoe(html, { css, content, app }) {
  if (/<\/script/i.test(app) || /<\/style/i.test(css)) throw new Error('DOE: fragment cannot be inlined safely.');
  const open = html.match(/<div id="doeLessonContent"[^>]*>/);
  if (!open) throw new Error('DOE: expected #doeLessonContent.');
  const start = open.index;
  const end = html.indexOf('</div>', start);
  const host = '<div id="doeLessonContent" data-prerendered="true">' + content + '</div>';
  let out = html.slice(0, start) + host + html.slice(end + '</div>'.length);
  out = out.replace('</head>', () => '<style id="doe-lesson-styles">' + css + '</style>\n</head>');
  const loader = '<script src="/assets/lessons/introduction-to-design-of-experiment-doe/loader.js"></script>';
  if (!out.includes(loader)) throw new Error('DOE: loader script not found.');
  // Function replacers: fragments contain $-sequences that String#replace would expand.
  out = out.replace(loader, () => '<script type="text/plain" id="doe-lesson-app">' + app + '</script>\n' + loader);
  return out;
}

export async function renderJsLessons(siteDir) {
  for (const lesson of compressedLessons) {
    const file = join(siteDir, lesson.page);
    const wrapper = await readFile(file, 'utf8');
    const decoded = gunzipSync(Buffer.from(await lesson.payload(siteDir), 'base64')).toString('utf8');
    if (!decoded.includes(lesson.marker)) throw new Error(lesson.page + ': payload validation failed.');
    // The payloads carry an old header (retired logo, no dropdown or mobile
    // nav), so stamp the shared site chrome onto the merged page.
    await writeFile(file, applySiteChrome(mergeCompressedLesson(wrapper, decoded, lesson), lesson.page), 'utf8');
  }
  const read = names => Promise.all(names.map(n => readFile(join(siteDir, doe.dir, n), 'utf8'))).then(p => p.join(''));
  const file = join(siteDir, doe.page);
  const [css, content, app] = await Promise.all([read(doe.css), read(doe.html), read(doe.js)]);
  await writeFile(file, inlineDoe(await readFile(file, 'utf8'), { css, content, app }), 'utf8');
}
