'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const test = require('node:test');

const moduleUrl = pathToFileURL(path.resolve(__dirname, '../netlify/functions/material-checker.mjs')).href;

test('workspace endpoint accepts only a strict bearer token shape', async () => {
  const {bearerToken} = await import(moduleUrl);
  assert.equal(bearerToken(new Request('https://example.test/api', {headers: {Authorization: 'Bearer token-123'}})), 'token-123');
  assert.equal(bearerToken(new Request('https://example.test/api', {headers: {Authorization: 'Basic token-123'}})), '');
  assert.equal(bearerToken(new Request('https://example.test/api', {headers: {Authorization: 'Bearer token with spaces'}})), '');
});

test('workspace writes reject cross-origin browser requests', async () => {
  const {requestOriginIsValid} = await import(moduleUrl);
  assert.equal(requestOriginIsValid(new Request('https://upskillsprint.com/.netlify/functions/material-checker', {
    headers: {Origin: 'https://upskillsprint.com'}
  })), true);
  assert.equal(requestOriginIsValid(new Request('https://upskillsprint.com/.netlify/functions/material-checker', {
    headers: {Origin: 'https://attacker.example'}
  })), false);
});
