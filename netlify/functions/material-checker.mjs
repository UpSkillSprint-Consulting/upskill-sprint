import { getStore } from '@netlify/blobs';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const CHECKER_RESOURCE = 'tool:/tools/material-specification-compliance-checker';

// Both fallback values are publishable browser configuration, not secrets.
// Production may override them with environment variables.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://prerurzpikodzbnezvgz.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_CagbT4_UPEi95EieYdq4nw_TdKQ4fqH';

function json(status, body) {
  return new Response(JSON.stringify(body), {status, headers: JSON_HEADERS});
}

function bearerToken(request) {
  const header = String(request.headers.get('authorization') || '');
  const match = header.match(/^Bearer\s+([^\s]+)$/i);
  return match ? match[1] : '';
}

function requestOriginIsValid(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function authenticatedUser(token) {
  if (!token) return null;
  const response = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: {apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token}
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user && user.id ? user : null;
}

async function canAccessChecker(token) {
  const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/can_access_content', {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({requested_resource_key: CHECKER_RESOURCE})
  });
  if (!response.ok) return false;
  return (await response.json()) === true;
}

export { bearerToken, requestOriginIsValid };

export default async function materialChecker(request) {
  try {
    const token = bearerToken(request);
    const user = await authenticatedUser(token);
    if (!user) return json(401, {error: 'Authentication is required.'});
    if (!(await canAccessChecker(token))) return json(403, {error: 'Administrator access to this tool is required.'});

    const namespace = 'user-' + user.id;
    const key = namespace + '/workspace.json';
    const store = getStore('material-checker-workspaces');

    if (request.method === 'GET') {
      const record = await store.get(key, {type: 'json', consistency: 'strong'});
      return json(200, record || {workspace: null, updatedAt: null, scope: namespace});
    }

    if (request.method === 'PUT' || request.method === 'POST') {
      if (!requestOriginIsValid(request)) return json(403, {error: 'Request origin is not permitted.'});
      const raw = await request.text();
      if (!raw) return json(400, {error: 'A workspace payload is required.'});
      if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
        return json(413, {error: 'Workspace payload exceeds the 4 MB limit.'});
      }

      const payload = JSON.parse(raw);
      if (!payload?.workspace || typeof payload.workspace !== 'object' || Array.isArray(payload.workspace)) {
        return json(400, {error: 'Invalid workspace payload.'});
      }

      const updatedAt = new Date().toISOString();
      const record = {
        workspace: payload.workspace,
        updatedAt,
        updatedBy: user.email || user.id,
        scope: namespace,
        schemaVersion: 5
      };

      await store.setJSON(key, record, {
        metadata: {updatedAt, updatedBy: user.email || user.id, schemaVersion: 5}
      });
      return json(200, {ok: true, updatedAt, scope: namespace});
    }

    if (request.method === 'DELETE') {
      if (!requestOriginIsValid(request)) return json(403, {error: 'Request origin is not permitted.'});
      await store.delete(key);
      return json(200, {ok: true, deletedAt: new Date().toISOString(), scope: namespace});
    }

    return json(405, {error: 'Method not allowed.'});
  } catch (error) {
    console.error('material-checker function error', error);
    if (error instanceof SyntaxError) return json(400, {error: 'The workspace payload is not valid JSON.'});
    return json(500, {error: 'The account workspace could not be processed.'});
  }
}
