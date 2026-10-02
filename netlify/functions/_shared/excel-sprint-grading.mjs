import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import answers from './excel-sprint-answers.json' with { type: 'json' };

// This module and the answer JSON are function inputs, never public site assets.
export const CURRICULUM_VERSION = 1;
export const PACKAGE_IDS = Object.freeze(Array.from({ length: 50 }, (_, i) => `L${Math.floor(i / 5) + 1}-A${i % 5 + 1}`));
// Expert Track v1 has a fixed Levels 1–6 prerequisite. Future core releases do not change its proofs.
export const EXPERT_IDS = Object.freeze(['EX-A1', 'EX-A2', 'EX-A3']);
export const EXPERT_CORE_IDS = Object.freeze(PACKAGE_IDS.slice(0, 30));
export const ALL_PACKAGE_IDS = Object.freeze([...PACKAGE_IDS, ...EXPERT_IDS]);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_TOKEN_LENGTH = 12000;
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff'
};

export class SprintError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function json(status, body) { return new Response(JSON.stringify(body), { status, headers: HEADERS }); }
export function fail(status, message) { throw new SprintError(status, message); }
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const validInteger = value => Number.isSafeInteger(value) && value >= 0 && value <= 10000;

export function signingSecret() {
  // Use the direct platform identifier so Netlify's bundler injects the env API.
  const secret = typeof Netlify === 'undefined' ? undefined : Netlify.env.get('EXCEL_SPRINT_SIGNING_SECRET');
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32) {
    fail(503, 'Grading is temporarily unavailable. Please try again later.');
  }
  return secret;
}

export async function readPayload(request, allowedFields) {
  if (request.method !== 'POST') fail(405, 'Use POST for this request.');
  const origin = request.headers.get('origin');
  if (origin) {
    try { if (new URL(origin).origin !== new URL(request.url).origin) fail(403, 'Request origin is not permitted.'); }
    catch (error) { if (error instanceof SprintError) throw error; fail(403, 'Request origin is not permitted.'); }
  }
  const type = request.headers.get('content-type') || '';
  if (!/^application\/json(?:\s*;|$)/i.test(type)) fail(415, 'Send an application/json payload.');
  const length = Number(request.headers.get('content-length'));
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) fail(413, 'The submission is too large.');
  // Read incrementally to limit memory even when Content-Length is missing or false.
  const reader = request.body?.getReader();
  if (!reader) fail(400, 'A JSON payload is required.');
  const chunks = []; let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) { await reader.cancel(); fail(413, 'The submission is too large.'); }
    chunks.push(value);
  }
  let payload;
  try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail(400, 'The payload is not valid JSON.'); }
  if (!isRecord(payload) || Object.keys(payload).some(key => !allowedFields.includes(key))) fail(400, 'Invalid request fields.');
  return payload;
}

export async function handleRequest(request, fields, action) {
  try {
    const payload = await readPayload(request, fields);
    const secret = signingSecret();
    return json(200, await action(payload, secret));
  } catch (error) {
    if (error instanceof SprintError) return json(error.status, { error: error.message });
    // Do not return exceptions, submitted formulas, or private answer-key values.
    return json(500, { error: 'The request could not be processed. Please try again.' });
  }
}

export function packageKey(packageId) {
  if (typeof packageId !== 'string' || !ALL_PACKAGE_IDS.includes(packageId) || !has(answers, packageId)) fail(400, 'Unknown or unavailable assignment.');
  return answers[packageId];
}

export function tokenHash(token) { return createHash('sha256').update(token).digest('base64url'); }
export function signToken(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = createHmac('sha256', secret).update(`excel-sprint-v1.${encoded}`).digest('base64url');
  return `${encoded}.${mac}`;
}

export function readToken(token, secret, type) {
  if (typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) fail(403, 'The progress proof is invalid.');
  const [encoded, supplied] = token.split('.');
  const expected = createHmac('sha256', secret).update(`excel-sprint-v1.${encoded}`).digest();
  const actual = Buffer.from(supplied, 'base64url');
  if (actual.length !== expected.length || actual.toString('base64url') !== supplied ||
      Buffer.from(encoded, 'base64url').toString('base64url') !== encoded || !timingSafeEqual(actual, expected)) fail(403, 'The progress proof is invalid.');
  let proof;
  try { proof = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); }
  catch { fail(403, 'The progress proof is invalid.'); }
  if (!isRecord(proof) || proof.type !== type || proof.schema !== 1 || proof.curriculumVersion !== CURRICULUM_VERSION ||
      !ALL_PACKAGE_IDS.includes(proof.packageId) || proof.packageVersion !== packageKey(proof.packageId).version ||
      typeof proof.chainId !== 'string' || !/^[0-9a-f-]{36}$/.test(proof.chainId) ||
      !(proof.predecessorHash === null || typeof proof.predecessorHash === 'string' && /^[A-Za-z0-9_-]{43}$/.test(proof.predecessorHash))) {
    fail(403, 'The progress proof is invalid.');
  }
  if (proof.packageId === PACKAGE_IDS[0] && proof.predecessorHash !== null || proof.packageId !== PACKAGE_IDS[0] && proof.predecessorHash === null) fail(403, 'The progress proof is invalid.');
  if (type === 'completion') validateCompletion(proof);
  else if (type === 'receipt') validateReceipt(proof);
  return proof;
}

function validTaskState(state) {
  return isRecord(state) && validInteger(state.attempts) && typeof state.solved === 'boolean' &&
    (state.attempts === 0 ? state.firstAttemptCorrect === null && !state.solved : typeof state.firstAttemptCorrect === 'boolean');
}

function validateReceipt(proof) {
  const key = packageKey(proof.packageId);
  if (!isRecord(proof.taskStates) || Object.keys(proof.taskStates).length !== key.tasks.length ||
      key.tasks.some(task => !has(proof.taskStates, task.id) || !validTaskState(proof.taskStates[task.id])) ||
      (key.bonus && !validTaskState(proof.bonusState)) ||
      !(proof.completionToken === null || typeof proof.completionToken === 'string')) fail(403, 'The progress proof is invalid.');
}

function validateCompletion(proof) {
  const key = packageKey(proof.packageId);
  if (proof.score !== 100 || typeof proof.timestamp !== 'string' || !Number.isFinite(Date.parse(proof.timestamp)) ||
      !isRecord(proof.attempts) || !isRecord(proof.firstAttemptCorrect) ||
      Object.keys(proof.attempts).length !== key.tasks.length || Object.keys(proof.firstAttemptCorrect).length !== key.tasks.length ||
      key.tasks.some(task => !has(proof.attempts, task.id) || !validInteger(proof.attempts[task.id]) || proof.attempts[task.id] < 1 || typeof proof.firstAttemptCorrect[task.id] !== 'boolean') ||
      proof.firstAttemptScore !== Math.round(key.tasks.filter(task => proof.firstAttemptCorrect[task.id]).length / key.tasks.length * 100)) fail(403, 'The progress proof is invalid.');
}

export function predecessorFor(packageId, predecessorToken, secret) {
  const path = EXPERT_IDS.includes(packageId) ? [...EXPERT_CORE_IDS, ...EXPERT_IDS] : PACKAGE_IDS;
  const index = path.indexOf(packageId);
  if (index < 0) fail(400, 'Unknown or unavailable assignment.');
  if (index === 0) {
    if (predecessorToken !== undefined && predecessorToken !== null && predecessorToken !== '') fail(403, 'This assignment starts a new learning path.');
    return null;
  }
  const previous = readToken(predecessorToken, secret, 'completion');
  if (previous.packageId !== path[index - 1]) fail(403, 'Complete the preceding assignment first.');
  return { chainId: previous.chainId, hash: tokenHash(predecessorToken) };
}

function emptyState() { return { attempts: 0, solved: false, firstAttemptCorrect: null }; }
function newReceipt(packageId, key, previous) {
  return {
    type: 'receipt', schema: 1, curriculumVersion: CURRICULUM_VERSION, packageId, packageVersion: key.version,
    chainId: previous?.chainId || randomUUID(), predecessorHash: previous?.hash || null,
    taskStates: Object.fromEntries(key.tasks.map(task => [task.id, emptyState()])),
    bonusState: key.bonus ? emptyState() : null, completionToken: null
  };
}

export function validFormula(formula) {
  if (typeof formula !== 'string' || formula.length > 4096 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(formula)) return false;
  const expression = formula.trim();
  if (!expression.startsWith('=') || !expression.slice(1).trim() || !/[A-Za-z0-9"']/.test(expression.slice(1)) || /[,;:+*/^&=<>!\-]$/.test(expression)) return false;
  const stack = []; let quote = null;
  for (let i = 1; i < expression.length; i++) {
    const char = expression[i];
    if (quote) { if (char === quote) { if (expression[i + 1] === quote) i++; else quote = null; } continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if ('([{'.includes(char)) stack.push(char);
    else if (')]}'.includes(char) && stack.pop() !== ({ ')': '(', ']': '[', '}': '{' })[char]) return false;
  }
  return !quote && stack.length === 0;
}

export function validateResult(value, depth = 0, count = { cells: 0 }) {
  if (depth > 2) return false;
  if (Array.isArray(value)) return value.length > 0 && value.length <= 1000 && value.every(cell => validateResult(cell, depth + 1, count));
  count.cells++;
  return count.cells <= 3000 && (typeof value === 'string' && value.length <= 16000 || typeof value === 'number' && Number.isFinite(value) || typeof value === 'boolean');
}

const numericText = value => typeof value === 'string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim());
function primitiveEqual(actual, expected, tolerance) {
  if (typeof expected === 'number') {
    const value = typeof actual === 'number' ? actual : numericText(actual) ? Number(actual.trim()) : NaN;
    return Number.isFinite(value) && Math.abs(value - expected) <= tolerance + Number.EPSILON * Math.max(1, Math.abs(expected));
  }
  if (typeof expected === 'boolean') return actual === expected || typeof actual === 'string' && actual.trim().toUpperCase() === String(expected).toUpperCase();
  return typeof actual === 'string' && actual.trim() === String(expected).trim();
}

function resultMatrix(value) {
  if (typeof value === 'string') {
    const text = value.trim();
    if (text.startsWith('[')) { try { value = JSON.parse(text); } catch { return null; } }
    else value = text.split(/\r?\n/).map(row => row.split('\t'));
  }
  if (!Array.isArray(value)) return null;
  if (value.every(cell => !Array.isArray(cell))) {
    // A flat JSON vector means an Excel column; a two-dimensional row remains a row.
    value = value.map(cell => [cell]);
  }
  if (!value.every(row => Array.isArray(row) && row.length > 0 && row.every(cell => !Array.isArray(cell) && validateResult(cell)))) return null;
  const width = value[0]?.length;
  return value.every(row => row.length === width) ? value : null;
}

export function resultsMatch(actual, task) {
  const expected = task.answer; const tolerance = Number.isFinite(task.tolerance) && task.tolerance >= 0 ? task.tolerance : 1e-6;
  if (!Array.isArray(expected)) return !Array.isArray(actual) && primitiveEqual(actual, expected, tolerance);
  const matrix = resultMatrix(actual);
  const target = expected.every(cell => !Array.isArray(cell)) ? expected.map(cell => [cell]) : expected;
  if (!matrix || matrix.length !== target.length || matrix.some((row, i) => row.length !== target[i].length)) return false;
  const rowMatches = (row, targetRow) => row.every((cell, col) => primitiveEqual(cell, targetRow[col], tolerance));
  if (!task.orderInsensitive) return matrix.every((row, i) => rowMatches(row, target[i]));
  const unused = target.map((_, i) => i);
  // Consume each row once, so duplicated answers cannot masquerade as unique results.
  return matrix.every(row => { const pos = unused.findIndex(i => rowMatches(row, target[i])); if (pos < 0) return false; unused.splice(pos, 1); return true; });
}

function taskResponse(task, state, submittedCorrect) {
  const fallback = ['The result does not yet match. Check the output range, units, and all rows.', 'Review the functions and reference styles in the assignment lesson.', 'Rebuild the formula step by step and leave the key argument to fill in.'];
  return {
    taskId: task.id, correct: state.solved, attempts: state.attempts, firstAttemptCorrect: state.firstAttemptCorrect,
    ...(submittedCorrect === undefined ? {} : { submissionCorrect: submittedCorrect }),
    hint: state.solved ? submittedCorrect === false ? 'The revised result does not match. Your earlier correct result remains recorded.' : 'Correct. This task is complete.' : state.attempts ? (task.hints?.[Math.min(state.attempts, 3) - 1] || fallback[Math.min(state.attempts, 3) - 1]) : null
  };
}

export function gradeSubmission(payload, secret) {
  const { packageId, submissions, predecessorToken, receipt } = payload;
  const key = packageKey(packageId);
  if (!Array.isArray(submissions) || !submissions.length || submissions.length > key.tasks.length + (key.bonus ? 1 : 0)) fail(400, 'Submit one or more task formulas and results.');
  const available = new Map([...key.tasks, ...(key.bonus ? [key.bonus] : [])].map(task => [task.id, task]));
  const seen = new Set();
  for (const entry of submissions) {
    if (!isRecord(entry) || Object.keys(entry).some(field => !['taskId', 'formula', 'result'].includes(field)) ||
        !available.has(entry.taskId) || seen.has(entry.taskId) || !validFormula(entry.formula) || !has(entry, 'result') || !validateResult(entry.result)) {
      fail(400, 'Each task needs a unique task ID, a valid Excel formula beginning with =, and its result.');
    }
    seen.add(entry.taskId);
  }
  const previous = predecessorFor(packageId, predecessorToken, secret);
  const proof = receipt ? readToken(receipt, secret, 'receipt') : newReceipt(packageId, key, previous);
  if (proof.packageId !== packageId || proof.predecessorHash !== (previous?.hash || null) || previous && proof.chainId !== previous.chainId) fail(403, 'The progress proof belongs to another assignment or learning path.');
  if (proof.completionToken) {
    const completed = readToken(proof.completionToken, secret, 'completion');
    if (completed.packageId !== packageId || completed.chainId !== proof.chainId || completed.predecessorHash !== proof.predecessorHash) fail(403, 'The progress proof is invalid.');
  }
  const currentResults = new Map();
  for (const entry of submissions) {
    const task = available.get(entry.taskId);
    const state = entry.taskId === key.bonus?.id ? proof.bonusState : proof.taskStates[entry.taskId];
    const correct = resultsMatch(entry.result, task);
    currentResults.set(entry.taskId, correct);
    if (!state.solved) {
      if (state.attempts >= 10000) fail(400, 'Export your progress and contact support about this assignment.');
      state.attempts++;
      if (state.attempts === 1) state.firstAttemptCorrect = correct;
      if (correct) state.solved = true;
    }
  }
  const solved = key.tasks.filter(task => proof.taskStates[task.id].solved).length;
  const score = Math.round(solved / key.tasks.length * 100);
  const firstAttemptScore = Math.round(key.tasks.filter(task => proof.taskStates[task.id].firstAttemptCorrect === true).length / key.tasks.length * 100);
  const completed = solved === key.tasks.length;
  if (completed && !proof.completionToken) {
    proof.completionToken = signToken({
      type: 'completion', schema: 1, curriculumVersion: CURRICULUM_VERSION, packageId, packageVersion: key.version,
      score: 100, firstAttemptScore, timestamp: new Date().toISOString(), chainId: proof.chainId, predecessorHash: proof.predecessorHash,
      attempts: Object.fromEntries(key.tasks.map(task => [task.id, proof.taskStates[task.id].attempts])),
      firstAttemptCorrect: Object.fromEntries(key.tasks.map(task => [task.id, proof.taskStates[task.id].firstAttemptCorrect]))
    }, secret);
  }
  return {
    packageId, curriculumVersion: CURRICULUM_VERSION, score, firstAttemptScore, completed,
    tasks: key.tasks.map(task => taskResponse(task, proof.taskStates[task.id], currentResults.get(task.id))),
    ...(key.bonus ? { bonus: taskResponse(key.bonus, proof.bonusState, currentResults.get(key.bonus.id)) } : {}),
    receipt: signToken(proof, secret), ...(proof.completionToken ? { completionToken: proof.completionToken } : {})
  };
}

export function verifyProgress(payload, secret) {
  if (!Array.isArray(payload.tokens) || payload.tokens.length > PACKAGE_IDS.length) fail(400, 'Provide the ordered completion proofs.');
  const completions = []; let previousToken = null; let chainId = null;
  for (let index = 0; index < payload.tokens.length; index++) {
    const token = payload.tokens[index]; const proof = readToken(token, secret, 'completion');
    if (proof.packageId !== PACKAGE_IDS[index] || proof.predecessorHash !== (previousToken ? tokenHash(previousToken) : null) || chainId && proof.chainId !== chainId) fail(403, 'Completion proofs must form one continuous learning path.');
    chainId = proof.chainId; previousToken = token;
    completions.push({ packageId: proof.packageId, score: proof.score, firstAttemptScore: proof.firstAttemptScore, timestamp: proof.timestamp, attempts: proof.attempts, firstAttemptCorrect: proof.firstAttemptCorrect, chainId: proof.chainId, curriculumVersion: proof.curriculumVersion, completionToken: token });
  }
  const expertTokens = payload.expertTokens === undefined ? [] : payload.expertTokens;
  if (!Array.isArray(expertTokens) || expertTokens.length > EXPERT_IDS.length) fail(400, 'Provide the ordered Expert Track completion proofs.');
  if (expertTokens.length && completions.length < EXPERT_CORE_IDS.length) fail(403, 'Complete Levels 1–6 before starting Expert Track.');
  const expertCompletions = [];
  previousToken = payload.tokens[EXPERT_CORE_IDS.length - 1];
  for (let index = 0; index < expertTokens.length; index++) {
    const token = expertTokens[index], proof = readToken(token, secret, 'completion');
    if (proof.packageId !== EXPERT_IDS[index] || proof.chainId !== chainId || proof.predecessorHash !== tokenHash(previousToken)) fail(403, 'Expert proofs must continue the same learning path in order.');
    expertCompletions.push({ packageId: proof.packageId, score: proof.score, firstAttemptScore: proof.firstAttemptScore, timestamp: proof.timestamp, attempts: proof.attempts, firstAttemptCorrect: proof.firstAttemptCorrect, chainId: proof.chainId, curriculumVersion: proof.curriculumVersion, completionToken: token });
    previousToken = token;
  }
  return { verified: true, curriculumVersion: CURRICULUM_VERSION, completions, nextPackageId: PACKAGE_IDS[completions.length] || null,
    expertCompletions, nextExpertPackageId: completions.length >= EXPERT_CORE_IDS.length ? EXPERT_IDS[expertCompletions.length] || null : null };
}

export function packageSolutions(payload, secret) {
  const key = packageKey(payload.packageId); const proof = readToken(payload.completionToken, secret, 'completion');
  if (proof.packageId !== payload.packageId) fail(403, 'Complete this assignment before reviewing its solutions.');
  const model = task => {
    const note = task.note || task.modelNote;
    return { taskId: task.id, model: task.model, alternatives: task.alternatives || [], ...(note ? { note } : {}) };
  };
  return { packageId: payload.packageId, curriculumVersion: CURRICULUM_VERSION, tasks: key.tasks.map(model), ...(key.bonus ? { bonus: model(key.bonus) } : {}) };
}
