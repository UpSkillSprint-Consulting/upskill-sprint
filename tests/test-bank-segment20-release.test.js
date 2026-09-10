'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const r = require('../scripts/exam-reliability/segment20-release.cjs');
const SHA = 'a'.repeat(40);

function samples(n, v) { return Array.from({ length: n }, () => v); }
function automated() {
  return {
    schemaVersion: 1,
    examIds: [...r.segment19.REQUIRED_EXAMS],
    modes: [...r.segment19.REQUIRED_MODES],
    workloads: { ...r.segment19.profiles.workloads },
    budgets: r.segment19.profiles.budgets.filter(x => x.enforcedFromSegment <= 19).map(b => ({ id: b.id, status: 'passed' })),
    invariants: { ...r.segment19.profiles.invariants },
    unresolvedConfirmedDefects: 0,
    migrationRecovery: { freshInstall: true, backupRestore: true, rollbackSafe: true }
  };
}
function physical() {
  return { schemaVersion: 1, records: r.segment19.REQUIRED_PHYSICAL.map(id => ({ id, physical: true, emulated: false, status: 'passed', device: 'physical fixture', os: 'fixture-os', browser: 'fixture-browser', executedAt: '2026-09-10T00:00:00Z', observer: 'fixture-observer' })) };
}
function network() {
  return {
    schemaVersion: 1,
    environment: 'real_network',
    synthetic: false,
    emulated: false,
    executedAt: '2026-09-10T00:00:00Z',
    observer: 'fixture-observer',
    connection: 'witnessed connection',
    locationClass: 'controlled location',
    budgets: r.segment19.REQUIRED_REAL_NETWORK_BUDGETS.map(id => {
      const b = r.segment19.profiles.budgets.find(x => x.id === id);
      const value = Math.max(0, b.limitMs - 1);
      return { id, network: b.network, status: 'passed', valueMs: value, samplesMs: samples(b.minimumSamples, value) };
    })
  };
}
function rubric() {
  return {
    rubricVersion: r.rubric.rubricVersion,
    criteria: r.rubric.areas.flatMap(area => area.criteria.map(c => ({
      criterionId: c.id,
      status: 'passed',
      evidenceRef: `fixture://${c.id}`,
      verifiedCommit: SHA,
      environment: c.requiredEnvironment || (c.id === 'AC20' ? 'production' : 'isolated')
    })))
  };
}
function production() {
  return {
    schemaVersion: 1,
    environment: 'production',
    releaseCommit: SHA,
    deployment: { commit: SHA, deployId: 'fixture-deploy', state: 'ready', context: 'production' },
    database: { projectStatus: 'ACTIVE_HEALTHY', migrationVersions: [...r.REQUIRED_MIGRATIONS], capabilities: Object.fromEntries(r.REQUIRED_SCHEMA_CAPABILITIES.map(k => [k, true])) },
    security: { leakedPasswordProtection: true, productionDependencyAudit: true, unresolvedReleaseRisks: 0 },
    smoke: { checks: r.REQUIRED_SMOKE_CHECKS.map(id => ({ id, status: 'passed' })), lostAcknowledgedEvidence: 0, duplicateCanonicalCompletions: 0, crossAccountExposure: 0, unexplainedReconciliation: 0 },
    recovery: { rollbackRunbookVerified: true, forwardRecoveryVerified: true, backupRestoreVerified: true },
    observation: { startedAt: '2026-09-10T00:00:00Z', endedAt: '2026-09-11T00:00:00Z', status: 'passed', confirmedIncidents: 0, healthChecksPassed: 24, healthChecksTotal: 24 },
    rubric: rubric()
  };
}
function input() { return { automated: automated(), physical: physical(), network: network(), production: production() }; }

test('Segment20 can award 10/10 only after Segment19 and every production gate pass', () => {
  const result = r.releaseDecision(input());
  assert.equal(result.status, 'qualified_10_of_10');
  assert.equal(result.points, 100);
  assert.equal(result.rating, '10/10');
});

test('pending physical or real-network Segment19 evidence blocks Segment20', () => {
  let x = input(); x.physical.records[0].status = 'pending';
  assert.deepEqual(r.releaseDecision(x).stage, 'segment19');
  x = input(); x.network.budgets[0].samplesMs = [];
  assert.deepEqual(r.releaseDecision(x).stage, 'segment19');
});

test('production deploy must exactly match the scored release commit', () => {
  const x = production(); x.deployment.commit = 'b'.repeat(40);
  assert.throws(() => r.validateProduction(x), /does not match release commit/);
});

test('every canonical migration and critical schema capability is mandatory', () => {
  let x = production(); x.database.migrationVersions.pop();
  assert.throws(() => r.validateProduction(x), /migration coverage mismatch/);
  x = production(); x.database.capabilities.sessionHandoff = false;
  assert.throws(() => r.validateProduction(x), /sessionHandoff/);
});

test('hosted leaked-password protection and zero unresolved release risks are mandatory', () => {
  let x = production(); x.security.leakedPasswordProtection = false;
  assert.throws(() => r.validateProduction(x), /leaked-password/);
  x = production(); x.security.unresolvedReleaseRisks = 1;
  assert.throws(() => r.validateProduction(x), /security release risk/);
});

test('production smoke must cover all required paths and preserve hard invariants', () => {
  let x = production(); x.smoke.checks.pop();
  assert.throws(() => r.validateProduction(x), /smoke coverage mismatch/);
  for (const key of ['lostAcknowledgedEvidence','duplicateCanonicalCompletions','crossAccountExposure','unexplainedReconciliation']) {
    x = production(); x.smoke[key] = 1;
    assert.throws(() => r.validateProduction(x));
  }
});

test('recovery readiness cannot be replaced by a green deployment', () => {
  const x = production(); x.recovery.forwardRecoveryVerified = false;
  assert.throws(() => r.validateProduction(x), /recovery readiness/);
});

test('production observation requires a clean full 24-hour window', () => {
  let x = production(); x.observation.endedAt = '2026-09-10T23:59:59Z';
  assert.throws(() => r.validateProduction(x), /shorter than 24 hours/);
  x = production(); x.observation.confirmedIncidents = 1;
  assert.throws(() => r.validateProduction(x), /has not passed cleanly/);
  x = production(); x.observation.healthChecksPassed = 23;
  assert.throws(() => r.validateProduction(x), /health checks are incomplete/);
});

test('all 20 frozen rubric criteria must pass against the exact release commit', () => {
  let x = production(); x.rubric.criteria.pop();
  assert.throws(() => r.validateProduction(x), /criterion coverage mismatch/);
  x = production(); x.rubric.criteria.find(c => c.criterionId === 'AC17').environment = 'preview';
  assert.throws(() => r.validateProduction(x), /requires physical_device/);
  x = production(); x.rubric.criteria[0].verifiedCommit = 'b'.repeat(40);
  assert.throws(() => r.validateProduction(x), /release commit/);
});

test('a blocked release never receives partial credit or a numeric rating', () => {
  const x = input(); x.production.security.leakedPasswordProtection = false;
  const result = r.releaseDecision(x);
  assert.equal(result.status, 'blocked');
  assert.equal(result.stage, 'production');
  assert.equal(result.rating, null);
});
