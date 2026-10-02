import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import answers from './excel-sprint-learning-answers.json' with { type: 'json' };
import { SprintError, fail, validFormula, validateResult, resultsMatch } from './excel-sprint-grading.mjs';

// Learning receipts have their own domain and types. They cannot unlock core assignments or awards.
export const LEARNING_VERSION = 1;
export const DRILL_IDS = Object.freeze(Array.from({ length: 20 }, (_, i) => `R${Math.floor(i / 2) + 1}-A${i % 2 + 1}`));
const DOMAIN = 'excel-sprint-learning-v1.';
const MAX_TOKEN_LENGTH = 6000;
const has = (record, key) => Object.prototype.hasOwnProperty.call(record, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const exactFields = (value, fields) => record(value) && Object.keys(value).length === fields.length && fields.every(field => has(value, field));
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const runId = value => typeof value === 'string' && value.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
const invalidProof = () => fail(403, 'The learning proof is invalid.');

function drillKey(drillId) {
  if (typeof drillId !== 'string' || !DRILL_IDS.includes(drillId) || !has(answers.drills, drillId)) fail(400, 'Unknown or unavailable practice drill.');
  return answers.drills[drillId];
}

export function signLearningToken(proof, secret) {
  const encoded = Buffer.from(JSON.stringify(proof)).toString('base64url');
  const mac = createHmac('sha256', secret).update(DOMAIN + encoded).digest('base64url');
  return `${encoded}.${mac}`;
}

function validDiagnostic(proof) {
  const questions = answers.diagnostic.questions;
  return exactFields(proof, ['type', 'schema', 'learningVersion', 'diagnosticId', 'runId', 'score', 'skills', 'timestamp']) &&
    proof.diagnosticId === answers.diagnostic.id && isoDate(proof.timestamp) && Array.isArray(proof.skills) && proof.skills.length === 10 &&
    proof.skills.every((skill, index) => exactFields(skill, ['skillId', 'level', 'status']) &&
      skill.skillId === questions[index].skillId && skill.level === index + 1 && ['correct', 'incorrect', 'skipped'].includes(skill.status)) &&
    proof.score === Math.round(proof.skills.filter(skill => skill.status === 'correct').length / questions.length * 100);
}

function validDrill(proof) {
  if (!exactFields(proof, ['type', 'schema', 'learningVersion', 'drillId', 'drillVersion', 'runId', 'correct', 'submissionCorrect', 'attempts', 'firstAttemptCorrect', 'completedAt']) ||
      !DRILL_IDS.includes(proof.drillId) || !has(answers.drills, proof.drillId) || proof.drillVersion !== answers.drills[proof.drillId].version ||
      typeof proof.correct !== 'boolean' || typeof proof.submissionCorrect !== 'boolean' || typeof proof.firstAttemptCorrect !== 'boolean' ||
      !Number.isSafeInteger(proof.attempts) || proof.attempts < 1 || proof.attempts > 10000) return false;
  if (!proof.correct) return !proof.submissionCorrect && !proof.firstAttemptCorrect && proof.completedAt === null;
  return isoDate(proof.completedAt) && (proof.firstAttemptCorrect ? proof.attempts === 1 : proof.attempts >= 2);
}

export function readLearningToken(token, secret, type) {
  if (typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH || /\s/.test(token) || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token)) invalidProof();
  const [encoded, supplied] = token.split('.');
  const expected = createHmac('sha256', secret).update(DOMAIN + encoded).digest();
  const actual = Buffer.from(supplied, 'base64url');
  if (actual.length !== expected.length || actual.toString('base64url') !== supplied || Buffer.from(encoded, 'base64url').toString('base64url') !== encoded || !timingSafeEqual(actual, expected)) invalidProof();
  let proof;
  try { proof = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); }
  catch { invalidProof(); }
  if (!record(proof) || proof.schema !== 1 || proof.learningVersion !== LEARNING_VERSION || !runId(proof.runId) ||
      !['diagnostic', 'drill'].includes(proof.type) || type && proof.type !== type ||
      !(proof.type === 'diagnostic' ? validDiagnostic(proof) : validDrill(proof))) invalidProof();
  return proof;
}

function diagnosticReport(proof, receipt) {
  return { type: 'diagnostic', runId: proof.runId, completed: true, score: proof.score, skills: proof.skills, timestamp: proof.timestamp, receipt };
}

function drillReport(proof, receipt) {
  const key = drillKey(proof.drillId);
  const fallback = ['Check the source rows, output shape and units.', 'Build the calculation step by step, using the lesson functions.', 'Check blank values, numeric zero and the required rounding.'];
  return {
    type: 'drill', runId: proof.runId, drillId: proof.drillId, skillId: key.skillId, correct: proof.correct, submissionCorrect: proof.submissionCorrect,
    attempts: proof.attempts, firstAttemptCorrect: proof.firstAttemptCorrect,
    hint: proof.correct ? 'Correct. This practice drill is complete.' : key.task.hints?.[Math.min(proof.attempts, 3) - 1] || fallback[Math.min(proof.attempts, 3) - 1],
    ...(proof.correct ? { completedAt: proof.completedAt } : {}), receipt
  };
}

function diagnostic(payload, secret) {
  const questions = answers.diagnostic.questions;
  if (!Array.isArray(payload.answers) || payload.answers.length !== questions.length) fail(400, 'Answer or skip each of the ten diagnostic questions.');
  const available = new Set(questions.map(question => question.id));
  const selected = new Map();
  for (const answer of payload.answers) {
    if (!exactFields(answer, ['questionId', 'optionId']) || !available.has(answer.questionId) || selected.has(answer.questionId) ||
        !(answer.optionId === null || ['a', 'b', 'c', 'd'].includes(answer.optionId))) fail(400, 'Each question needs one valid choice, or null to skip it.');
    selected.set(answer.questionId, answer.optionId);
  }
  const skills = questions.map((question, index) => ({
    skillId: question.skillId, level: index + 1,
    status: selected.get(question.id) === null ? 'skipped' : selected.get(question.id) === question.correctOption ? 'correct' : 'incorrect'
  }));
  const proof = { type: 'diagnostic', schema: 1, learningVersion: LEARNING_VERSION, diagnosticId: answers.diagnostic.id,
    runId: randomUUID(), score: Math.round(skills.filter(skill => skill.status === 'correct').length / questions.length * 100), skills, timestamp: new Date().toISOString() };
  return diagnosticReport(proof, signLearningToken(proof, secret));
}

function grade(payload, secret) {
  const key = drillKey(payload.drillId);
  if (!validFormula(payload.formula) || !has(payload, 'result') || !validateResult(payload.result)) fail(400, 'Submit a valid Excel formula beginning with = and its result.');
  const prior = payload.receipt === undefined || payload.receipt === null ? null : readLearningToken(payload.receipt, secret, 'drill');
  if (prior && prior.drillId !== payload.drillId) fail(403, 'The learning proof belongs to another practice drill.');
  const submissionCorrect = resultsMatch(payload.result, key.task);
  const proof = prior || { type: 'drill', schema: 1, learningVersion: LEARNING_VERSION, drillId: payload.drillId, drillVersion: key.version,
    runId: randomUUID(), correct: false, submissionCorrect: false, attempts: 0, firstAttemptCorrect: false, completedAt: null };
  if (!proof.correct) {
    if (proof.attempts >= 10000) fail(400, 'Start a fresh practice run to continue this drill.');
    proof.attempts++;
    if (proof.attempts === 1) proof.firstAttemptCorrect = submissionCorrect;
    if (submissionCorrect) { proof.correct = true; proof.completedAt = new Date().toISOString(); }
  }
  proof.submissionCorrect = submissionCorrect;
  return drillReport(proof, signLearningToken(proof, secret));
}

function verify(payload, secret) {
  const proof = readLearningToken(payload.token, secret);
  return { verified: true, report: proof.type === 'diagnostic' ? diagnosticReport(proof, payload.token) : drillReport(proof, payload.token) };
}

function verifyMany(payload, secret) {
  const tokens = payload.tokens;
  if (!Array.isArray(tokens) || tokens.length < 1 || tokens.length > 31 ||
      tokens.some(token => typeof token !== 'string' || !token.length || token.length > MAX_TOKEN_LENGTH) || new Set(tokens).size !== tokens.length) {
    fail(400, 'Verify one to thirty-one unique learning proofs.');
  }
  return { results: tokens.map(token => {
    try { return { token, ...verify({ token }, secret) }; }
    catch (error) {
      if (error instanceof SprintError && error.status === 403) return { token, verified: false };
      throw error;
    }
  }) };
}

function solutions(payload, secret) {
  const key = drillKey(payload.drillId);
  const proof = readLearningToken(payload.token, secret, 'drill');
  if (!proof.correct || proof.drillId !== payload.drillId) fail(403, 'Complete this practice drill before viewing its solution.');
  return { drillId: payload.drillId, skillId: key.skillId, model: key.task.model, alternatives: key.task.alternatives || [] };
}

const ACTIONS = {
  diagnostic: { fields: ['action', 'answers'], handler: diagnostic },
  grade: { fields: ['action', 'drillId', 'formula', 'result', 'receipt'], handler: grade },
  verify: { fields: ['action', 'token'], handler: verify },
  'verify-many': { fields: ['action', 'tokens'], handler: verifyMany },
  solutions: { fields: ['action', 'drillId', 'token'], handler: solutions }
};

export function learningAction(payload, secret) {
  const action = typeof payload.action === 'string' && has(ACTIONS, payload.action) ? ACTIONS[payload.action] : null;
  if (!action || Object.keys(payload).some(field => !action.fields.includes(field))) fail(400, 'Invalid learning request fields or action.');
  return action.handler(payload, secret);
}
