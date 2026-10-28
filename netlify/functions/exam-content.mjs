import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import publicProject from '../../supabase-config.js';

const EXAMS = new Set(['cssbb', 'mbb', 'cssgb', 'cqe', 'cmq', 'cqa', 'cre', 'pmp', 'nppe']);
const HEADERS = {
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'private, no-store, max-age=0',
  'CDN-Cache-Control':'no-store',
  'Netlify-CDN-Cache-Control':'no-store',
  'Vary':'Authorization',
  'X-Content-Type-Options':'nosniff',
  'X-Robots-Tag':'noindex'
};
const reply = (status, message) => new Response(JSON.stringify({ message }), { status, headers:HEADERS });

export function settings() {
  const read = name => typeof Netlify === 'undefined' ? undefined : Netlify.env.get(name);
  const configuredUrl = read('SUPABASE_URL');
  const configuredKey = read('SUPABASE_PUBLISHABLE_KEY') ?? read('SUPABASE_ANON_KEY');
  // A complete Functions-scoped override wins. A partial/invalid override fails
  // closed instead of combining credentials from two projects. Without an override,
  // bundle the same public configuration that the site's sign-in client uses.
  const overridden = configuredUrl != null || configuredKey != null;
  const url = overridden ? configuredUrl : publicProject.url;
  const key = overridden ? configuredKey : publicProject.anonKey;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') return null;
    if (!key || key.startsWith('sb_secret_')) return null;
    // Legacy anon JWTs are supported, but privileged service credentials are not.
    if (!key.startsWith('sb_publishable_')) {
      const claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());
      if (claims.role !== 'anon') return null;
    }
    return { url:parsed.origin, key };
  } catch { return null; }
}

export function createHandler({ getSettings = settings, request = fetch,
  loadPackage = exam => readFile(join(process.cwd(), 'content/exam-delivery-generated', `${exam}.json`), 'utf8') } = {}) {
  return async function handler(req) {
    if (req.method !== 'GET') return reply(405, 'Use GET to open an exam.');
    const url = new URL(req.url);
    const exam = url.searchParams.get('exam');
    if (!EXAMS.has(exam) || url.searchParams.getAll('exam').length !== 1) return reply(404, 'This exam is not available.');
    if ([...url.searchParams.keys()].some(key => !['exam','check'].includes(key)) ||
      url.searchParams.getAll('check').length > 1 || url.searchParams.has('check') && url.searchParams.get('check') !== '1') return reply(400, 'Invalid exam request.');
    const token = req.headers.get('authorization');
    if (!token || token.length > 8192 || !/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return reply(401, 'Sign in to open this exam.');
    const config = getSettings();
    if (!config) return reply(503, 'Exam access is temporarily unavailable. Please try again.');
    try {
      // PostgREST verifies the caller's JWT and executes this invoker RPC with
      // their identity/RLS. Never decode roles locally, accept a user_id, use a
      // service key, or cache an allow decision between requests.
      const decision = await request(`${config.url}/rest/v1/rpc/can_access_exam`, {
        method:'POST', headers:{ apikey:config.key, Authorization:token, 'Content-Type':'application/json' },
        body:JSON.stringify({ requested_exam_key:exam }), cache:'no-store', redirect:'error',
        signal:AbortSignal.timeout(8000)
      });
      if (decision.status === 401) return reply(401, 'Your sign-in has expired. Please sign in again.');
      if (!decision.ok) return reply(503, 'Exam access is temporarily unavailable. Please try again.');
      const allowed = await decision.json();
      if (allowed === false) return reply(403, 'This exam is locked. Ask an administrator to grant you access.');
      if (allowed !== true) return reply(503, 'Exam access is temporarily unavailable. Please try again.');
      if (url.searchParams.get('check') === '1') return new Response(JSON.stringify({ allowed:true, exam }), { headers:HEADERS });
      // Read exactly the authorized package only after a fresh server decision.
      return new Response(await loadPackage(exam), { headers:HEADERS });
    } catch {
      return reply(503, 'Exam access is temporarily unavailable. Please try again.');
    }
  };
}

export default createHandler();
