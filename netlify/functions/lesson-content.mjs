// Serves the protected body of a gated lesson to a signed-in visitor whose tier
// allows it (docs/plans/gated-lesson-content-plan.md, Options A + D).
//
//   GET /api/lesson-content?resource=lesson:/lessons/<category>/<slug>
//   Authorization: Bearer <Supabase access token>
//
// 1. The resource key must be in content/protected-lesson-catalog.mjs (else 404).
// 2. The token must belong to a live Supabase session (/auth/v1/user, else 401).
// 3. public.can_access_content(resource) must return true for that token (else 403).
// 4. 200: { version: 1, resource, html } — never cached, never indexed.
//
// Error bodies are fixed short messages; they never include lesson text, the
// fragment path or upstream responses. No service-role key is used.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PROTECTED_LESSON_DIRECTORY, protectedLessonFile } from '../../content/protected-lesson-catalog.mjs';
import { accessDecision, bearerToken, looksLikeJwt, lookupUser } from './_shared/supabase-access.mjs';
import { settings } from './exam-content.mjs';

export const config = {
  path: '/api/lesson-content',
  method: 'GET',
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'] }
};

export const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
  'Vary': 'Authorization',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex'
};
const UPSTREAM = { timeoutMs: 8000 };
const reply = (status, message) => new Response(JSON.stringify({ message }), { status, headers: HEADERS });

export function createHandler({ getSettings = settings, request = fetch,
  loadLesson = file => readFile(join(process.cwd(), PROTECTED_LESSON_DIRECTORY, file), 'utf8') } = {}) {
  return async function handler(req) {
    if (req.method !== 'GET') return reply(405, 'Use GET to open a lesson.');
    const params = new URL(req.url).searchParams;
    const resource = params.get('resource');
    const file = protectedLessonFile(resource);
    if (!file || params.getAll('resource').length !== 1) return reply(404, 'This lesson is not available.');
    if ([...params.keys()].some(key => key !== 'resource')) return reply(400, 'Invalid lesson request.');

    const token = bearerToken(req);
    if (!looksLikeJwt(token)) return reply(401, 'Sign in to read this lesson.');
    const supabase = getSettings();
    if (!supabase) return reply(503, 'Lesson access is temporarily unavailable.');

    try {
      const session = await lookupUser(token, supabase, request, UPSTREAM);
      if (session.state === 'unauthorized') return reply(401, 'Your sign-in has expired. Sign in again to read this lesson.');
      if (session.state !== 'ok') return reply(503, 'Lesson access is temporarily unavailable.');

      const decision = await accessDecision(token, resource, supabase, request, UPSTREAM);
      if (decision === 'unauthorized') return reply(401, 'Your sign-in has expired. Sign in again to read this lesson.');
      if (decision === 'denied') return reply(403, 'Your account does not have access to this lesson yet.');
      if (decision !== 'allowed') return reply(503, 'Lesson access is temporarily unavailable.');

      const html = await loadLesson(file);
      return new Response(JSON.stringify({ version: 1, resource, html }), { status: 200, headers: HEADERS });
    } catch {
      return reply(503, 'Lesson access is temporarily unavailable.');
    }
  };
}

export default createHandler();
