'use strict';

const segment19 = require('./segment19-qualification.cjs');
const rubric = require('../../docs/exam-reliability/contracts/v1/release-rubric.json');

// Production has a frozen historical migration ledger that predates the
// Segment 07 canonical catalog/ingestion repair. Those historical versions are
// legitimate production history and must remain visible rather than being
// replaced by repository-only consolidation filenames. Segment 20 therefore
// validates the required release migrations as a subset while allowing only the
// explicitly reviewed historical baseline entries below.
const ACCEPTED_BASELINE_MIGRATIONS = Object.freeze([
  '20260821151016',
  '20260821153716',
  '20260821162227',
  '20260830235559',
  '20260831004551',
  '20260831010000',
  '20260831051512',
  '20260831224207',
  '20260903122940',
  '20260903123402',
  '20260903123535',
  '20260905030445'
]);
const REQUIRED_MIGRATIONS = Object.freeze([
  '20260908010000',
  '20260908180000',
  '20260909152000',
  '20260909195500',
  '20260910010000',
  '20260910030000',
  '20260910050000',
  '20260910050100',
  '20260910050200'
]);
const ACCEPTED_MIGRATIONS = Object.freeze([...ACCEPTED_BASELINE_MIGRATIONS, ...REQUIRED_MIGRATIONS]);
const REQUIRED_SCHEMA_CAPABILITIES = Object.freeze([
  'trustedClock',
  'incrementalSync',
  'sessionHandoff',
  'newOnlyV2',
  'securityReset'
]);
const REQUIRED_SMOKE_CHECKS = Object.freeze([
  'authenticatedTransport',
  'trustedClock',
  'incrementalSync',
  'sessionHandoff',
  'newOnlyV2',
  'historyReconciliation',
  'crossAccountIsolation'
]);
const REQUIRED_CRITERIA = Object.freeze(rubric.areas.flatMap(area => area.criteria.map(c => c.id)));
const MIN_OBSERVATION_MS = 24 * 60 * 60 * 1000;

function sha(value, label) {
  if (typeof value !== 'string' || !/^[0-9a-f]{40}$/.test(value)) throw Error(`${label} must be an exact 40-character commit SHA`);
  return value;
}
function requireEvidenceRef(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw Error(`${label} missing evidence provenance`);
  return value;
}
function uniqueSet(actual, label) {
  if (!Array.isArray(actual)) throw Error(`${label} must be an array`);
  const values = actual.map(value => String(value));
  const unique = new Set(values);
  if (unique.size !== values.length) throw Error(`${label} contains duplicate entries`);
  return unique;
}
function exactSet(actual, expected, label) {
  const actualSet = uniqueSet(actual, label);
  const a = [...actualSet].sort();
  const e = [...expected].sort();
  if (JSON.stringify(a) !== JSON.stringify(e)) throw Error(`${label} coverage mismatch: ${a.join(',')} != ${e.join(',')}`);
  return true;
}
function validateMigrationHistory(actual) {
  const actualSet = uniqueSet(actual, 'production migration');
  for (const value of actualSet) {
    if (!/^\d{14}$/.test(value)) throw Error(`production migration has invalid version: ${value}`);
  }
  const missing = REQUIRED_MIGRATIONS.filter(version => !actualSet.has(version));
  if (missing.length) throw Error(`production migration coverage mismatch: missing ${missing.join(',')}`);
  const accepted = new Set(ACCEPTED_MIGRATIONS);
  const unreviewed = [...actualSet].filter(version => !accepted.has(version)).sort();
  if (unreviewed.length) throw Error(`production migration contains unreviewed entries: ${unreviewed.join(',')}`);
  return true;
}
function parseTime(value, label) {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw Error(`${label} must be a valid timestamp`);
  return ms;
}
function validateRubricEvidence(evidence, releaseCommit) {
  if (!evidence || evidence.rubricVersion !== rubric.rubricVersion) throw Error('release rubric version mismatch');
  exactSet(evidence.criteria?.map(x => x.criterionId) || [], REQUIRED_CRITERIA, 'release criterion');
  let points = 0;
  for (const row of evidence.criteria) {
    const criterion = rubric.areas.flatMap(x => x.criteria).find(x => x.id === row.criterionId);
    if (row.status !== 'passed') throw Error(`release criterion ${row.criterionId} has not passed`);
    requireEvidenceRef(row.evidenceRef, `release criterion ${row.criterionId}`);
    if (!row.environment) throw Error(`release criterion ${row.criterionId} missing evidence provenance`);
    if (!rubric.allowedEnvironments.includes(row.environment)) throw Error(`release criterion ${row.criterionId} has invalid environment`);
    if (row.verifiedCommit !== releaseCommit) throw Error(`release criterion ${row.criterionId} was not verified against the release commit`);
    if (criterion.requiredEnvironment && row.environment !== criterion.requiredEnvironment) throw Error(`release criterion ${row.criterionId} requires ${criterion.requiredEnvironment}`);
    points += criterion.points;
  }
  if (points !== rubric.totalPoints) throw Error(`release rubric awarded ${points}/${rubric.totalPoints}`);
  return points;
}
function validateProduction(evidence) {
  if (!evidence || evidence.schemaVersion !== 1 || evidence.environment !== 'production') throw Error('production evidence schema/environment mismatch');
  const releaseCommit = sha(evidence.releaseCommit, 'releaseCommit');
  if (sha(evidence.deployment?.commit, 'deployment.commit') !== releaseCommit) throw Error('production deploy does not match release commit');
  if (evidence.deployment?.state !== 'ready' || evidence.deployment?.context !== 'production' || !evidence.deployment?.deployId) throw Error('production deployment is not ready');
  if (evidence.database?.projectStatus !== 'ACTIVE_HEALTHY') throw Error('production database is not healthy');
  validateMigrationHistory(evidence.database?.migrationVersions || []);
  for (const capability of REQUIRED_SCHEMA_CAPABILITIES) if (evidence.database?.capabilities?.[capability] !== true) throw Error(`production schema capability missing: ${capability}`);
  if (evidence.security?.leakedPasswordProtection !== true) throw Error('leaked-password protection is not verified enabled');
  if (evidence.security?.productionDependencyAudit !== true) throw Error('production dependency audit is not verified');
  if (evidence.security?.unresolvedReleaseRisks !== 0) throw Error('unresolved production security release risk remains');

  const smokeChecks = evidence.smoke?.checks || [];
  exactSet(smokeChecks.map(x => x.id), REQUIRED_SMOKE_CHECKS, 'production smoke');
  for (const row of smokeChecks) {
    if (row.status !== 'passed') throw Error(`production smoke ${row.id} has not passed`);
    requireEvidenceRef(row.evidenceRef, `production smoke ${row.id}`);
  }
  if (evidence.smoke?.lostAcknowledgedEvidence !== 0) throw Error('production smoke detected acknowledged evidence loss');
  if (evidence.smoke?.duplicateCanonicalCompletions !== 0) throw Error('production smoke detected duplicate canonical completion');
  if (evidence.smoke?.crossAccountExposure !== 0) throw Error('production smoke detected cross-account exposure');
  if (evidence.smoke?.unexplainedReconciliation !== 0) throw Error('production smoke detected unexplained reconciliation');
  if (evidence.recovery?.rollbackRunbookVerified !== true || evidence.recovery?.forwardRecoveryVerified !== true || evidence.recovery?.backupRestoreVerified !== true) throw Error('production recovery readiness incomplete');
  requireEvidenceRef(evidence.recovery?.evidenceRef, 'production recovery');

  const now = Date.now();
  const deployedAt = parseTime(evidence.deployment?.publishedAt, 'deployment.publishedAt');
  const databaseVerifiedAt = parseTime(evidence.database?.verifiedAt, 'database.verifiedAt');
  const securityVerifiedAt = parseTime(evidence.security?.verifiedAt, 'security.verifiedAt');
  const start = parseTime(evidence.observation?.startedAt, 'observation.startedAt');
  const end = parseTime(evidence.observation?.endedAt, 'observation.endedAt');
  const prerequisitesVerifiedAt = Math.max(deployedAt, databaseVerifiedAt, securityVerifiedAt);
  if (start < prerequisitesVerifiedAt) throw Error('production observation window begins before release prerequisites were verified');
  if (end > now) throw Error('production observation window cannot end in the future');
  if (end - start < MIN_OBSERVATION_MS) throw Error('production observation window is shorter than 24 hours');
  if (evidence.observation?.status !== 'passed' || evidence.observation?.confirmedIncidents !== 0) throw Error('production observation window has not passed cleanly');
  if (evidence.observation?.healthChecksPassed !== evidence.observation?.healthChecksTotal || !(evidence.observation?.healthChecksTotal > 0)) throw Error('production observation health checks are incomplete');
  requireEvidenceRef(evidence.observation?.evidenceRef, 'production observation');
  const points = validateRubricEvidence(evidence.rubric, releaseCommit);
  return { releaseCommit, points };
}
function releaseDecision({ automated, physical, network, production }) {
  const segment19Status = segment19.releaseStatus(automated, physical, network);
  if (segment19Status.status !== 'qualified') return { status: 'blocked', stage: 'segment19', reason: segment19Status.reason || segment19Status.status, rating: null };
  try {
    const result = validateProduction(production);
    return { status: 'qualified_10_of_10', stage: 'production', releaseCommit: result.releaseCommit, points: result.points, rating: '10/10' };
  } catch (error) {
    return { status: 'blocked', stage: 'production', reason: error.message, rating: null };
  }
}

module.exports = {
  segment19,
  rubric,
  ACCEPTED_BASELINE_MIGRATIONS,
  REQUIRED_MIGRATIONS,
  ACCEPTED_MIGRATIONS,
  REQUIRED_SCHEMA_CAPABILITIES,
  REQUIRED_SMOKE_CHECKS,
  REQUIRED_CRITERIA,
  MIN_OBSERVATION_MS,
  exactSet,
  validateMigrationHistory,
  validateRubricEvidence,
  validateProduction,
  releaseDecision
};
