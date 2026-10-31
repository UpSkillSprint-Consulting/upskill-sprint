#!/usr/bin/env node

/**
 * Build the public lesson feed that drives new-lesson announcement emails.
 *
 * Output: public-site/feeds/lessons.json (build output, never committed).
 *
 * The lesson catalog (lessons.html + chi-square-lesson-library.js) is the
 * single source of truth, exactly as for the search index. After every
 * production deploy the announcer function compares this feed with the
 * lessons it has already seen in Supabase; anything new is announced once.
 *
 * Optional per-lesson tags in the lesson's <head> (docs/LESSON_CREATION_GUIDE.md §12.7):
 *   <meta name="upskill:email-teaser" content="One catchy sentence, 40–160 characters.">
 *   <meta name="upskill:email" content="skip">   (never announce this page)
 *
 * A malformed teaser fails the build, the same way a malformed catalog entry
 * fails the search-index build: better a red deploy than a bad email.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { discoverCatalog, lessonPathToFile, normalizeSpace } from './build-lesson-search-index.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '..');
export const FEED_VERSION = 1;
export const SITE_ORIGIN = 'https://upskillsprint.com';
export const TEASER_MIN = 40;
export const TEASER_MAX = 160;
const MAX_HEADINGS = 8;

function fail(message) {
  throw new Error(`[lesson-email-feed] ${message}`);
}

/** Validate an author-written teaser. Returns the cleaned teaser or throws. */
export function validateTeaser(raw, source) {
  const teaser = normalizeSpace(raw);
  if (teaser.length < TEASER_MIN || teaser.length > TEASER_MAX) {
    fail(`${source}: upskill:email-teaser must be ${TEASER_MIN}–${TEASER_MAX} characters (found ${teaser.length})`);
  }
  if (/[<>]/.test(teaser)) fail(`${source}: upskill:email-teaser must be plain text (no < or >)`);
  if (/https?:\/\/|www\./i.test(teaser)) fail(`${source}: upskill:email-teaser must not contain links`);
  if (/^replace with\b/i.test(teaser)) fail(`${source}: upskill:email-teaser still has the lesson-template placeholder text`);
  return teaser;
}

/** Read the email tags and h2 headings from one lesson file. */
export function readLessonEmailTags(html, source) {
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd === -1 ? html : html.slice(0, headEnd + 7);
  const document = new JSDOM(head).window.document;
  const meta = (name) => Array.from(document.querySelectorAll('meta[name]'))
    .find((element) => element.getAttribute('name').toLowerCase() === name);

  const teaserMeta = meta('upskill:email-teaser');
  const teaser = teaserMeta ? validateTeaser(teaserMeta.getAttribute('content'), source) : null;

  const emailMeta = meta('upskill:email');
  let email = 'announce';
  if (emailMeta) {
    const value = normalizeSpace(emailMeta.getAttribute('content')).toLowerCase();
    if (value !== 'skip' && value !== 'announce') {
      fail(`${source}: upskill:email must be "skip" or "announce" (found "${value}")`);
    }
    email = value;
  }

  const headings = [];
  const pattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let match;
  while ((match = pattern.exec(html)) && headings.length < MAX_HEADINGS) {
    const text = normalizeSpace(match[1].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"'));
    if (text && text.length <= 120 && !/check your understanding|related lessons/i.test(text)) headings.push(text);
  }
  return { teaser, email, headings };
}

/** The most recent "Lesson" ticker item that is in the feed: the default test-mode preview. */
export function previewPathFromTicker(rootDir, paths) {
  try {
    const updates = JSON.parse(fs.readFileSync(path.join(rootDir, 'site-updates.json'), 'utf8')).updates || [];
    const latest = updates
      .filter((item) => item && item.tag === 'Lesson' && typeof item.href === 'string')
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .find((item) => paths.has(item.href.replace(/\.html$/, '').replace(/\/+$/, '')));
    return latest ? latest.href.replace(/\.html$/, '').replace(/\/+$/, '') : null;
  } catch {
    return null;
  }
}

export function buildLessonEmailFeed({ rootDir = DEFAULT_ROOT, publicDir = path.join(rootDir, 'public-site'), commit = null } = {}) {
  const catalog = discoverCatalog(rootDir).filter((entry) => !entry.placeholder);
  if (!catalog.length) fail('the lesson catalog is empty');

  const lessons = catalog.map((entry) => {
    const candidates = [lessonPathToFile(publicDir, entry.path), lessonPathToFile(rootDir, entry.path)];
    const file = candidates.find((candidate) => fs.existsSync(candidate));
    if (!file) fail(`${entry.source}: no lesson file for ${entry.path}`);
    const tags = readLessonEmailTags(fs.readFileSync(file, 'utf8'), path.relative(rootDir, file));
    return {
      path: entry.path,
      url: SITE_ORIGIN + entry.path,
      title: entry.title,
      description: entry.description || null,
      teaser: tags.teaser,
      email: tags.email,
      topic: entry.topic,
      level: entry.level,
      minutes: entry.minutes ?? null,
      interactive: Boolean(entry.interactive),
      headings: tags.headings
    };
  });

  const seen = new Set();
  for (const lesson of lessons) {
    if (seen.has(lesson.path)) fail(`duplicate path ${lesson.path}`);
    seen.add(lesson.path);
  }

  const announceable = new Set(lessons.filter((lesson) => lesson.email === 'announce').map((lesson) => lesson.path));
  return {
    version: FEED_VERSION,
    generatedAt: new Date().toISOString(),
    commit,
    lessonCount: lessons.length,
    previewPath: previewPathFromTicker(rootDir, announceable) || [...announceable].at(-1) || null,
    lessons
  };
}

export function writeLessonEmailFeed(options = {}) {
  const rootDir = options.rootDir || DEFAULT_ROOT;
  const publicDir = options.publicDir || path.join(rootDir, 'public-site');
  if (!fs.existsSync(publicDir)) fail(`publish directory missing: ${publicDir} (run stage-public-site first)`);
  const feed = buildLessonEmailFeed({ rootDir, publicDir, commit: options.commit ?? process.env.COMMIT_REF ?? null });
  const outputDir = path.join(publicDir, 'feeds');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, 'lessons.json');
  fs.writeFileSync(outputFile, JSON.stringify(feed, null, 2) + '\n', 'utf8');
  const teasers = feed.lessons.filter((lesson) => lesson.teaser).length;
  const skipped = feed.lessons.filter((lesson) => lesson.email === 'skip').length;
  console.log(`[lesson-email-feed] ${feed.lessonCount} lessons (${teasers} with teasers, ${skipped} skipped) -> ${path.relative(rootDir, outputFile)}`);
  return feed;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  writeLessonEmailFeed();
}
