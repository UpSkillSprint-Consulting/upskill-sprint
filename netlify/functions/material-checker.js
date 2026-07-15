'use strict';

const {getStore} = require('@netlify/blobs');

const JSON_HEADERS = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'};
const MAX_BODY_BYTES = 4 * 1024 * 1024;

function response(statusCode, body) {
  return {statusCode, headers: JSON_HEADERS, body: JSON.stringify(body)};
}

function normalizeRole(role) {
  return String(role || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function userContext(context) {
  const user = context && context.clientContext && context.clientContext.user;
  if (!user) return null;
  const roles = user.app_metadata && Array.isArray(user.app_metadata.roles) ? user.app_metadata.roles.map(normalizeRole) : [];
  const organizationId = user.app_metadata && (user.app_metadata.organization_id || user.app_metadata.organizationId);
  return {id: user.sub || user.id, email: user.email, roles, organizationId: organizationId || null};
}

exports.handler = async function handler(event, context) {
  const user = userContext(context);
  if (!user) return response(401, {error: 'Authentication is required.'});

  const namespace = user.organizationId ? 'organization-' + user.organizationId : 'user-' + user.id;
  const key = namespace + '/workspace.json';
  const store = getStore('material-checker-workspaces');

  try {
    if (event.httpMethod === 'GET') {
      const record = await store.get(key, {type: 'json'});
      return response(200, record || {workspace: null, updatedAt: null, scope: namespace});
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      if (!event.body) return response(400, {error: 'A workspace payload is required.'});
      if (Buffer.byteLength(event.body, 'utf8') > MAX_BODY_BYTES) return response(413, {error: 'Workspace payload exceeds the 4 MB limit.'});
      const payload = JSON.parse(event.body);
      if (!payload || !payload.workspace || typeof payload.workspace !== 'object') return response(400, {error: 'Invalid workspace payload.'});
      const updatedAt = new Date().toISOString();
      const record = {
        workspace: payload.workspace,
        updatedAt,
        updatedBy: user.email || user.id,
        scope: namespace,
        schemaVersion: 4
      };
      await store.setJSON(key, record);
      return response(200, {ok: true, updatedAt, scope: namespace});
    }

    if (event.httpMethod === 'DELETE') {
      const allowed = user.roles.includes('system-administrator') || user.roles.includes('standards-administrator');
      if (!allowed) return response(403, {error: 'Administrator permission is required to delete an organization workspace.'});
      await store.delete(key);
      return response(200, {ok: true, deletedAt: new Date().toISOString(), scope: namespace});
    }

    return response(405, {error: 'Method not allowed.'});
  } catch (error) {
    console.error('material-checker function error', error);
    return response(500, {error: 'The organization workspace could not be processed.'});
  }
};
