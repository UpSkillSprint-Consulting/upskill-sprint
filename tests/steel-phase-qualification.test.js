'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { bootTool, ready } = require('./helpers/steel-phase-harness.js');

function copy(value) { return JSON.parse(JSON.stringify(value)); }
async function tool(options) {
  const ctx = bootTool(options);
  await ready(ctx.win);
  return ctx;
}
function prepareCandidate(win) {
  const calibration = win.__SPX.calibration;
  const pkg = calibration.demo('json');
  pkg.id = 'controlled-qa-calibration-fixture';
  pkg.title = 'Controlled QA calibration fixture';
  pkg.sourceReference = 'QA fixture CAL-001';
  pkg.site = 'QA site';
  pkg.line = 'QA line';
  const result = calibration.analyze(pkg, { format: 'json' });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  return calibration.getSession();
}
function validationPackage(win, candidate) {
  const templates = candidate.package.rows.filter(row => row.role === 'calibration');
  const rows = [];
  for (let index = 0; index < 5; index += 1) {
    const template = copy(templates[index % templates.length]);
    const prediction = win.__SPX.calibration.evaluateFrozenCandidateForValidation(
      template.chemistry, template.coolingRateCPerS
    );
    rows.push({
      recordId: `EXT-${index + 1}`,
      heatId: `H-EXT-${index + 1}`,
      batchId: null,
      chemistry: template.chemistry,
      coolingRateCPerS: template.coolingRateCPerS,
      thicknessMm: 15,
      actualValue: prediction.candidateValue + [-2, -1, 0, 1, 2][index],
      timestamp: `2026-04-${String(index + 1).padStart(2, '0')}T12:00:00Z`
    });
  }
  return {
    schemaVersion: '1.0',
    packageType: 'spx-independent-validation',
    id: 'controlled-external-validation',
    revision: '1.0',
    title: 'Independent QA validation campaign',
    sourceReference: 'Controlled QA record EXT-2026-001',
    candidateModelFingerprint: candidate.analysis.modelFingerprint,
    trainingFingerprint: candidate.analysis.trainingFingerprint,
    scopeFingerprint: candidate.analysis.scopeFingerprint,
    target: candidate.analysis.target,
    groupBy: candidate.package.groupBy,
    protocol: {
      id: 'VAL-PROTOCOL-001',
      revision: '1.0',
      lockedAt: '2026-03-01T00:00:00Z',
      independentOrganization: 'Independent QA organization',
      independenceStatement: 'The external groups were not used for fitting, internal holdout decisions, threshold selection, or monitoring.',
      acceptanceCriteria: {
        minGroups: 5,
        maxAbsBias: 1,
        maxMae: 2,
        maxRmse: 2,
        minR2: null
      }
    },
    rows
  };
}
function approval() {
  return {
    reviewerName: 'Qualified Reviewer',
    role: 'Plant metallurgical authority',
    organization: 'Controlled QA organization',
    authorityReference: 'QMS-AUTH-001',
    approvedAt: new Date(Date.now() + 60_000).toISOString(),
    statement: 'I approve this frozen candidate only for the recorded plant scope and applicability envelope.',
    userAttestedQualifiedAuthority: true
  };
}

test('qualification loads after calibration and before professional integration', async t => {
  const { win, record } = await tool();
  t.after(() => win.close());
  const calibrationAt = record.loaded.indexOf('tools/steel-phase-explorer-calibration.js');
  const qualificationAt = record.loaded.indexOf('tools/steel-phase-explorer-qualification.js');
  const professionalAt = record.loaded.indexOf('tools/steel-phase-explorer-professional.js');
  assert.ok(calibrationAt >= 0 && qualificationAt > calibrationAt && professionalAt > qualificationAt);
  assert.equal(win.__SPX.qualification.contractVersion, '1.0');
  assert.equal(win.__SPX.qualification.limits.minExternalGroups, 5);
});

test('separate frozen-candidate campaign produces equal-weighted external metrics without refitting', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const candidate = prepareCandidate(win);
  const pkg = validationPackage(win, candidate);
  const correctionBefore = candidate.analysis.correction.value;
  const result = win.__SPX.qualification.analyze(pkg);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.noRefit, true);
  assert.equal(result.validationKind, 'independent external heat/batch validation');
  assert.equal(result.groupSeparation.independent, true);
  assert.equal(result.groupSeparation.externalGroups, 5);
  assert.equal(result.metrics.nRows, 5);
  assert.equal(result.metrics.nGroups, 5);
  assert.equal(result.acceptancePassed, true);
  assert.equal(result.predictionTimeGateEstablished, true);
  assert.equal(win.__SPX.calibration.getSession().analysis.correction.value, correctionBefore);
  assert.equal(win.__SPX.qualification.audit().privacy.groupIdentifiersPersisted, false);
  assert.equal(JSON.stringify(win.__SPX.qualification.audit()).includes('H-EXT-'), false);
});

test('candidate pins, predeclared protocol, group independence, and applicability envelope fail closed', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const candidate = prepareCandidate(win);
  const api = win.__SPX.qualification;

  const wrongPin = validationPackage(win, candidate);
  wrongPin.candidateModelFingerprint = 'wrong';
  assert.ok(api.parse(wrongPin).errors.some(error => error.code === 'CANDIDATE_PIN'));

  const overlap = validationPackage(win, candidate);
  overlap.rows[0].heatId = candidate.package.rows[0].heatId;
  assert.ok(api.parse(overlap).errors.some(error => error.code === 'GROUP_OVERLAP'));

  const unlocked = validationPackage(win, candidate);
  unlocked.protocol.lockedAt = '2026-05-01T00:00:00Z';
  assert.ok(api.parse(unlocked).errors.some(error => error.code === 'PROTOCOL_NOT_PREDECLARED'));

  const outside = validationPackage(win, candidate);
  outside.rows[0].chemistry.C = 0.5;
  const rejected = api.analyze(outside);
  assert.equal(rejected.ok, false);
  assert.ok(rejected.errors.some(error => error.code === 'OUTSIDE_CANDIDATE_ENVELOPE'));
  assert.equal(api.getSession().status, 'empty', 'atomic rejection preserves the prior session');
});

test('the bundled synthetic calibration demonstration cannot be promoted', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const calibration = win.__SPX.calibration;
  assert.equal(calibration.analyze(calibration.demo('json')).ok, true);
  const candidate = calibration.getSession();
  const pkg = validationPackage(win, candidate);
  const rejected = win.__SPX.qualification.analyze(pkg);
  assert.equal(rejected.ok, false);
  assert.ok(rejected.errors.some(error => error.code === 'SYNTHETIC_CANDIDATE'));
});

test('failed predeclared criteria cannot be approved', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const candidate = prepareCandidate(win);
  const pkg = validationPackage(win, candidate);
  pkg.protocol.acceptanceCriteria.maxRmse = 0.1;
  const analyzed = win.__SPX.qualification.analyze(pkg);
  assert.equal(analyzed.ok, true);
  assert.equal(analyzed.acceptancePassed, false);
  assert.equal(win.__SPX.qualification.getSession().status, 'validation-failed');
  const rejected = win.__SPX.qualification.approve(approval());
  assert.equal(rejected.ok, false);
  assert.ok(rejected.errors.some(error => error.code === 'VALIDATION_GATE'));
});

test('qualified approval promotes only the scoped candidate and prediction gate withholds out-of-envelope use', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const candidate = prepareCandidate(win);
  const pkg = validationPackage(win, candidate);
  assert.equal(win.__SPX.qualification.analyze(pkg).acceptancePassed, true);

  const missingAttestation = approval();
  missingAttestation.userAttestedQualifiedAuthority = false;
  assert.equal(win.__SPX.qualification.approve(missingAttestation).ok, false);

  const promoted = win.__SPX.qualification.approve(approval());
  assert.equal(promoted.ok, true);
  assert.equal(promoted.status, 'plant-calibrated');
  assert.equal(promoted.audit.governance.classification, 'Plant calibrated');
  assert.equal(promoted.audit.governance.browserVerifiedReviewerIdentity, false);
  assert.equal(promoted.audit.governance.specificationAcceptance, 'withheld');

  const row = pkg.rows[0];
  const permitted = win.__SPX.qualification.predict({
    chemistry: row.chemistry,
    coolingRateCPerS: row.coolingRateCPerS,
    thicknessMm: row.thicknessMm
  });
  assert.equal(permitted.ok, true);
  assert.equal(permitted.classification, 'Plant calibrated');
  assert.equal(permitted.governance.productRelease, 'withheld');

  const withheld = win.__SPX.qualification.predict({
    chemistry: row.chemistry,
    coolingRateCPerS: row.coolingRateCPerS,
    thicknessMm: 100
  });
  assert.equal(withheld.ok, false);
  assert.ok(withheld.errors.some(error => error.code === 'OUTSIDE_APPROVED_ENVELOPE'));
});

test('changing the active candidate invalidates approval and prediction permission', async t => {
  const { win } = await tool();
  t.after(() => win.close());
  const first = prepareCandidate(win);
  assert.equal(win.__SPX.qualification.analyze(validationPackage(win, first)).acceptancePassed, true);
  assert.equal(win.__SPX.qualification.approve(approval()).ok, true);

  const replacement = win.__SPX.calibration.demo('json');
  replacement.rows.find(row => row.role === 'calibration').actualValue += 5;
  assert.equal(win.__SPX.calibration.analyze(replacement).ok, true);
  const row = first.package.rows[0];
  const result = win.__SPX.qualification.predict({ chemistry: row.chemistry, coolingRateCPerS: row.coolingRateCPerS, thicknessMm: 15 });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(error => error.code === 'STALE_CANDIDATE'));
});

test('professional records report current scoped promotion but persisted audits fail closed after reload', async t => {
  const first = await tool();
  const { win } = first;
  const candidate = prepareCandidate(win);
  assert.ok(win.__SPX.professional.syncCalibrationAudit());
  assert.equal(win.__SPX.qualification.analyze(validationPackage(win, candidate)).acceptancePassed, true);
  assert.equal(win.__SPX.qualification.approve(approval()).ok, true);
  assert.ok(win.__SPX.professional.syncQualificationAudit());
  win.__SPX.professional.setStage('report', false);

  const record = win.__SPX.professional.buildRecord().calibration;
  assert.equal(record.status, 'Plant calibrated');
  assert.equal(record.screeningUse, 'permitted — approved envelope and prediction-time gates only');
  assert.equal(record.acceptance, 'withheld');
  assert.equal(record.qualification.current, true);
  assert.match(win.__SPX.professional.reportHtml(), /Plant calibrated — recorded scope only/i);
  assert.match(win.__SPX.professional.reportHtml(), /Specification acceptance \/ product release[\s\S]*Withheld/i);

  const persisted = win.localStorage.getItem('spx-professional-workflow-v1');
  win.close();
  const reloaded = await tool({ storage: { 'spx-professional-workflow-v1': persisted } });
  t.after(() => reloaded.win.close());
  const stale = reloaded.win.__SPX.professional.buildRecord().calibration;
  assert.equal(stale.status, 'Calibration candidate');
  assert.equal(stale.screeningUse, 'withheld — independent validation and qualified approval required');
  assert.equal(stale.qualification.current, false);
  assert.match(reloaded.win.__SPX.professional.reportHtml(), /Historical record — not current/i);
});
