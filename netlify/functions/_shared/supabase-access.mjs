// Shared "verify the visitor's Supabase session, then check their tier" helpers
// for Netlify Functions. Every call uses the visitor's own JWT plus the
// publishable key, so no service-role key is ever needed: Supabase decides
// access with public.can_access_content(), which is deny-by-default.
//
// Used by material-checker.mjs and lesson-content.mjs.

/** The bearer token from an Authorization header, or '' when there is none. */
export function bearerToken(request) {
  const header = String(request.headers.get('authorization') || '');
  const match = header.match(/^Bearer\s+([^\s]+)$/i);
  return match ? match[1] : '';
}

/** True when a token has the three base64url segments of a JWT and a sane length. */
export function looksLikeJwt(token) {
  return typeof token === 'string' && token.length > 0 && token.length <= 8192 &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);
}

function requestInit(init, options) {
  if (!options) return init;
  const extra = { cache: 'no-store', redirect: 'error' };
  if (options.timeoutMs) extra.signal = AbortSignal.timeout(options.timeoutMs);
  return { ...init, ...extra };
}

/**
 * Looks the session up with GET /auth/v1/user.
 * Returns { state: 'ok', user } | { state: 'unauthorized' } | { state: 'unavailable' }.
 * Network errors and timeouts are thrown to the caller.
 */
export async function lookupUser(token, config, request = fetch, options) {
  if (!token) return { state: 'unauthorized' };
  const response = await request(config.url + '/auth/v1/user', requestInit({
    headers: { apikey: config.key, Authorization: 'Bearer ' + token }
  }, options));
  if (response.status === 401 || response.status === 403) return { state: 'unauthorized' };
  if (!response.ok) return { state: 'unavailable' };
  const user = await response.json();
  return user && user.id ? { state: 'ok', user } : { state: 'unauthorized' };
}

/** The signed-in user for a token, or null (the material checker's original contract). */
export async function authenticatedUser(token, config, request = fetch, options) {
  const result = await lookupUser(token, config, request, options);
  return result.state === 'ok' ? result.user : null;
}

/**
 * Asks public.can_access_content(resourceKey) with the visitor's JWT.
 * Returns 'allowed' | 'denied' | 'unauthorized' | 'unavailable'. Anything other
 * than a literal true is never 'allowed'. Network errors are thrown.
 */
export async function accessDecision(token, resourceKey, config, request = fetch, options) {
  const response = await request(config.url + '/rest/v1/rpc/can_access_content', requestInit({
    method: 'POST',
    headers: {
      apikey: config.key,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requested_resource_key: resourceKey })
  }, options));
  if (response.status === 401) return 'unauthorized';
  if (!response.ok) return 'unavailable';
  const allowed = await response.json();
  if (allowed === true) return 'allowed';
  if (allowed === false) return 'denied';
  return 'unavailable';
}

/** True only when can_access_content returned true (the material checker's original contract). */
export async function canAccessContent(token, resourceKey, config, request = fetch, options) {
  return (await accessDecision(token, resourceKey, config, request, options)) === 'allowed';
}
