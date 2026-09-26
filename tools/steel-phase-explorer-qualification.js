(function () {
  'use strict';

  /*
   * Steel Phase Explorer — independent plant-qualification engine.
   *
   * This engine never fits a model. It evaluates a frozen calibration
   * candidate against a separately supplied, protocol-locked set of heats or
   * batches, then records a distinct user-attested qualified approval. Raw
   * rows remain in memory and are omitted from the compact audit record.
   */
  if (typeof window === 'undefined') return;
  window.__SPX = window.__SPX || {};
  if (window.__SPX.qualification) return;

  var CONTRACT_VERSION = '1.0';
  var PACKAGE_TYPE = 'spx-independent-validation';
  var MAX_IMPORT_BYTES = 2 * 1024 * 1024;
  var MAX_ROWS = 5000;
  var MAX_TEXT = 500;
  var MAX_DIAGNOSTICS = 200;
  var MIN_EXTERNAL_GROUPS = 5;
  var CHEMISTRY_KEYS = ['C', 'Mn', 'Si', 'Ni', 'Cr', 'Mo', 'V', 'Cu', 'B'];
  var calibration = window.__SPX.calibration;
  var session = freshSession();

  function freshSession() {
    return {
      status: 'empty', importedAt: null, analyzedAt: null,
      packageFingerprint: null, package: null, analysis: null, approval: null
    };
  }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function own(value, key) { return Object.prototype.hasOwnProperty.call(value, key); }
  function issue(list, code, path, message) {
    if (list.length >= MAX_DIAGNOSTICS) return;
    list.push({ code: code, path: path || '', message: message });
  }
  function text(value, path, errors, required, max) {
    if (value == null) value = '';
    if (typeof value !== 'string') {
      issue(errors, 'TYPE', path, 'Expected text.');
      return '';
    }
    value = value.trim();
    if (required && !value) issue(errors, 'REQUIRED', path, 'A value is required.');
    if (value.length > (max || MAX_TEXT)) {
      issue(errors, 'TEXT_LENGTH', path, 'Text exceeds the permitted length.');
      value = value.slice(0, max || MAX_TEXT);
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) issue(errors, 'CONTROL_CHARACTER', path, 'Control characters are not permitted.');
    return value;
  }
  function number(value, path, errors, min, max, required) {
    if (value == null || value === '') {
      if (required) issue(errors, 'REQUIRED', path, 'A finite number is required.');
      return null;
    }
    var result = Number(value);
    if (!isFinite(result)) {
      issue(errors, 'NUMBER', path, 'A finite number is required.');
      return null;
    }
    if (result < min || result > max) {
      issue(errors, 'RANGE', path, 'Value must be between ' + min + ' and ' + max + '.');
    }
    return result;
  }
  function iso(value, path, errors, required) {
    value = text(value, path, errors, required, 40);
    if (!value) return '';
    var millis = Date.parse(value);
    if (!isFinite(millis) || !/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      issue(errors, 'TIMESTAMP', path, 'Use an ISO 8601 date-time with an explicit time zone.');
      return '';
    }
    if (!/(Z|[+\-]\d{2}:\d{2})$/i.test(value)) {
      issue(errors, 'TIMESTAMP_ZONE', path, 'The timestamp must include Z or an explicit UTC offset.');
      return '';
    }
    return new Date(millis).toISOString();
  }
  function stableStringify(value) {
    if (value == null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    return '{' + Object.keys(value).sort().map(function (key) {
      return JSON.stringify(key) + ':' + stableStringify(value[key]);
    }).join(',') + '}';
  }
  function fingerprint(value) {
    var raw = typeof value === 'string' ? value : stableStringify(value);
    var hash = 2166136261;
    for (var i = 0; i < raw.length; i += 1) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return 'SPXQUAL-' + ('00000000' + (hash >>> 0).toString(16)).slice(-8) + '-' + raw.length;
  }
  function calibrationSession() {
    try { return calibration && calibration.getSession ? calibration.getSession() : null; }
    catch (ignore) { return null; }
  }
  function activeCandidate() {
    var current = calibrationSession();
    return current && current.status === 'analyzed' && current.package && current.analysis
      ? current : null;
  }
  function normalized(value) { return String(value || '').trim().toLowerCase(); }
  function mean(values) {
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
  }
  function metrics(rows, groupBy) {
    var buckets = Object.create(null);
    rows.forEach(function (row) {
      var key = normalized(groupBy === 'batch' ? row.batchId : row.heatId);
      if (!buckets[key]) buckets[key] = { actual: [], generic: [], candidate: [] };
      buckets[key].actual.push(row.actualValue);
      buckets[key].generic.push(row.genericValue);
      buckets[key].candidate.push(row.candidateValue);
    });
    var groups = Object.keys(buckets).sort().map(function (key) {
      return {
        actualValue: mean(buckets[key].actual),
        genericValue: mean(buckets[key].generic),
        candidateValue: mean(buckets[key].candidate)
      };
    });
    function values(predictionKey) {
      var residuals = groups.map(function (row) { return row.actualValue - row[predictionKey]; });
      var actuals = groups.map(function (row) { return row.actualValue; });
      var actualMean = mean(actuals);
      var sse = residuals.reduce(function (sum, value) { return sum + value * value; }, 0);
      var sst = actuals.reduce(function (sum, value) {
        var difference = value - actualMean;
        return sum + difference * difference;
      }, 0);
      return {
        meanBias: mean(residuals),
        mae: mean(residuals.map(Math.abs)),
        rmse: Math.sqrt(sse / residuals.length),
        r2: sst > 0 ? 1 - sse / sst : null
      };
    }
    return { nRows: rows.length, nGroups: groups.length, primaryUnit: 'group means', generic: values('genericValue'), candidate: values('candidateValue') };
  }
  function envelope(candidate) {
    var fitRows = candidate.package.rows.filter(function (row) { return row.role === 'calibration'; });
    var fields = {};
    CHEMISTRY_KEYS.forEach(function (key) {
      fields[key] = {
        min: Math.min.apply(null, fitRows.map(function (row) { return row.chemistry[key]; })),
        max: Math.max.apply(null, fitRows.map(function (row) { return row.chemistry[key]; }))
      };
    });
    fields.coolingRateCPerS = {
      min: Math.min.apply(null, fitRows.map(function (row) { return row.coolingRateCPerS; })),
      max: Math.max.apply(null, fitRows.map(function (row) { return row.coolingRateCPerS; }))
    };
    fields.thicknessMm = {
      min: candidate.package.thicknessMinMm,
      max: candidate.package.thicknessMaxMm
    };
    return fields;
  }
  function inEnvelope(value, range) {
    return range && isFinite(value) && value >= range.min && value <= range.max;
  }
  function parse(input) {
    var errors = [];
    var warnings = [];
    var raw = input;
    if (typeof raw === 'string') {
      if (new Blob([raw]).size > MAX_IMPORT_BYTES) {
        issue(errors, 'FILE_SIZE', '', 'The validation package exceeds the 2 MB limit.');
        return { ok: false, errors: errors, warnings: warnings };
      }
      try { raw = JSON.parse(raw); }
      catch (ignore) {
        issue(errors, 'JSON', '', 'The independent-validation package is not valid JSON.');
        return { ok: false, errors: errors, warnings: warnings };
      }
    } else {
      try { raw = clone(raw); }
      catch (ignoreClone) {
        issue(errors, 'INPUT', '', 'The independent-validation package could not be safely copied.');
        return { ok: false, errors: errors, warnings: warnings };
      }
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      issue(errors, 'TYPE', '', 'The package must be a JSON object.');
      return { ok: false, errors: errors, warnings: warnings };
    }
    var pkg = {
      schemaVersion: text(raw.schemaVersion, 'schemaVersion', errors, true, 20),
      packageType: text(raw.packageType, 'packageType', errors, true, 60),
      id: text(raw.id, 'id', errors, true, 120),
      revision: text(raw.revision, 'revision', errors, true, 60),
      title: text(raw.title, 'title', errors, true, 160),
      sourceReference: text(raw.sourceReference, 'sourceReference', errors, true, 300),
      candidateModelFingerprint: text(raw.candidateModelFingerprint, 'candidateModelFingerprint', errors, true, 160),
      trainingFingerprint: text(raw.trainingFingerprint, 'trainingFingerprint', errors, true, 160),
      scopeFingerprint: text(raw.scopeFingerprint, 'scopeFingerprint', errors, true, 160),
      target: text(raw.target, 'target', errors, true, 80),
      groupBy: text(raw.groupBy, 'groupBy', errors, true, 20),
      protocol: {}, rows: []
    };
    if (pkg.schemaVersion.split('.')[0] !== CONTRACT_VERSION.split('.')[0]) issue(errors, 'SCHEMA_MAJOR', 'schemaVersion', 'Unsupported schema major version.');
    if (pkg.packageType !== PACKAGE_TYPE) issue(errors, 'PACKAGE_TYPE', 'packageType', 'Expected ' + PACKAGE_TYPE + '.');
    if (['heat', 'batch'].indexOf(pkg.groupBy) < 0) issue(errors, 'GROUP_BY', 'groupBy', 'groupBy must be heat or batch.');
    var protocol = raw.protocol && typeof raw.protocol === 'object' && !Array.isArray(raw.protocol) ? raw.protocol : {};
    var criteria = protocol.acceptanceCriteria && typeof protocol.acceptanceCriteria === 'object' && !Array.isArray(protocol.acceptanceCriteria) ? protocol.acceptanceCriteria : {};
    pkg.protocol = {
      id: text(protocol.id, 'protocol.id', errors, true, 120),
      revision: text(protocol.revision, 'protocol.revision', errors, true, 60),
      lockedAt: iso(protocol.lockedAt, 'protocol.lockedAt', errors, true),
      independentOrganization: text(protocol.independentOrganization, 'protocol.independentOrganization', errors, true, 160),
      independenceStatement: text(protocol.independenceStatement, 'protocol.independenceStatement', errors, true, 500),
      acceptanceCriteria: {
        minGroups: number(criteria.minGroups, 'protocol.acceptanceCriteria.minGroups', errors, MIN_EXTERNAL_GROUPS, MAX_ROWS, true),
        maxAbsBias: number(criteria.maxAbsBias, 'protocol.acceptanceCriteria.maxAbsBias', errors, 0, 100000, true),
        maxMae: number(criteria.maxMae, 'protocol.acceptanceCriteria.maxMae', errors, 0, 100000, true),
        maxRmse: number(criteria.maxRmse, 'protocol.acceptanceCriteria.maxRmse', errors, 0, 100000, true),
        minR2: criteria.minR2 == null || criteria.minR2 === '' ? null : number(criteria.minR2, 'protocol.acceptanceCriteria.minR2', errors, -1000, 1, false)
      }
    };
    if (!Array.isArray(raw.rows) || !raw.rows.length) issue(errors, 'ROWS', 'rows', 'At least one external validation row is required.');
    if (Array.isArray(raw.rows) && raw.rows.length > MAX_ROWS) issue(errors, 'ROW_LIMIT', 'rows', 'The package exceeds the 5,000-row limit.');
    (Array.isArray(raw.rows) ? raw.rows.slice(0, MAX_ROWS) : []).forEach(function (source, index) {
      var path = 'rows[' + index + ']';
      source = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
      var chemistrySource = source.chemistry && typeof source.chemistry === 'object' && !Array.isArray(source.chemistry) ? source.chemistry : {};
      var chemistry = {};
      CHEMISTRY_KEYS.forEach(function (key) { chemistry[key] = number(chemistrySource[key], path + '.chemistry.' + key, errors, 0, 10, true); });
      pkg.rows.push({
        recordId: text(source.recordId, path + '.recordId', errors, true, 120),
        heatId: text(source.heatId, path + '.heatId', errors, pkg.groupBy === 'heat', 120),
        batchId: text(source.batchId, path + '.batchId', errors, pkg.groupBy === 'batch', 120),
        chemistry: chemistry,
        coolingRateCPerS: number(source.coolingRateCPerS, path + '.coolingRateCPerS', errors, 0.0001, 100000, true),
        thicknessMm: number(source.thicknessMm, path + '.thicknessMm', errors, 0.01, 5000, true),
        actualValue: number(source.actualValue, path + '.actualValue', errors, -100000, 100000, true),
        timestamp: iso(source.timestamp, path + '.timestamp', errors, true)
      });
    });
    var recordIds = Object.create(null);
    pkg.rows.forEach(function (row, index) {
      var recordId = normalized(row.recordId);
      if (recordIds[recordId]) issue(errors, 'DUPLICATE_RECORD', 'rows[' + index + '].recordId', 'recordId values must be unique without letter-case distinctions.');
      recordIds[recordId] = true;
    });
    var candidate = activeCandidate();
    if (!candidate) issue(errors, 'NO_FROZEN_CANDIDATE', 'candidateModelFingerprint', 'Analyze a calibration candidate before importing independent validation.');
    if (candidate) {
      var analysis = candidate.analysis;
      if (/synthetic|demo/i.test(String(candidate.package.id || '') + ' ' + String(candidate.package.title || '') + ' ' + String(candidate.package.sourceReference || ''))) issue(errors, 'SYNTHETIC_CANDIDATE', 'candidateModelFingerprint', 'A bundled or explicitly synthetic calibration candidate cannot be promoted with plant qualification.');
      if (/synthetic|demo/i.test(pkg.id + ' ' + pkg.title + ' ' + pkg.sourceReference + ' ' + pkg.protocol.independentOrganization)) issue(errors, 'SYNTHETIC_VALIDATION', 'sourceReference', 'Synthetic or demonstration results cannot establish independent plant validation.');
      if (pkg.candidateModelFingerprint !== analysis.modelFingerprint) issue(errors, 'CANDIDATE_PIN', 'candidateModelFingerprint', 'The package does not pin the active frozen candidate.');
      if (pkg.trainingFingerprint !== analysis.trainingFingerprint) issue(errors, 'TRAINING_PIN', 'trainingFingerprint', 'The package does not pin the active training set.');
      if (pkg.scopeFingerprint !== analysis.scopeFingerprint) issue(errors, 'SCOPE_PIN', 'scopeFingerprint', 'The package does not pin the active plant scope.');
      if (pkg.target !== analysis.target) issue(errors, 'TARGET_PIN', 'target', 'The target differs from the active candidate.');
      if (pkg.groupBy !== candidate.package.groupBy) issue(errors, 'GROUP_PIN', 'groupBy', 'The grouping basis differs from the active candidate.');
      var used = Object.create(null);
      candidate.package.rows.forEach(function (row) { used[normalized(pkg.groupBy === 'batch' ? row.batchId : row.heatId)] = true; });
      var external = Object.create(null);
      pkg.rows.forEach(function (row, index) {
        var group = normalized(pkg.groupBy === 'batch' ? row.batchId : row.heatId);
        external[group] = true;
        if (used[group]) issue(errors, 'GROUP_OVERLAP', 'rows[' + index + ']', 'External validation groups must not overlap candidate development, holdout, or monitoring groups.');
        if (pkg.protocol.lockedAt && row.timestamp && Date.parse(pkg.protocol.lockedAt) >= Date.parse(row.timestamp)) issue(errors, 'PROTOCOL_NOT_PREDECLARED', 'rows[' + index + '].timestamp', 'The locked protocol must predate every validation result.');
      });
      if (Object.keys(external).length < MIN_EXTERNAL_GROUPS) issue(errors, 'EXTERNAL_GROUPS', 'rows', 'At least ' + MIN_EXTERNAL_GROUPS + ' independent heat/batch groups are required.');
    }
    return { ok: errors.length === 0, package: pkg, errors: errors, warnings: warnings };
  }
  function analyze(input) {
    var parsed = parse(input);
    if (!parsed.ok) return { ok: false, errors: parsed.errors, warnings: parsed.warnings, priorSessionPreserved: true };
    var candidate = activeCandidate();
    var pkg = parsed.package;
    var ranges = envelope(candidate);
    var errors = [];
    var warnings = parsed.warnings.slice();
    var evaluated = pkg.rows.map(function (row, index) {
      var outside = [];
      CHEMISTRY_KEYS.forEach(function (key) { if (!inEnvelope(row.chemistry[key], ranges[key])) outside.push(key); });
      if (!inEnvelope(row.coolingRateCPerS, ranges.coolingRateCPerS)) outside.push('coolingRateCPerS');
      if (!inEnvelope(row.thicknessMm, ranges.thicknessMm)) outside.push('thicknessMm');
      if (outside.length) issue(errors, 'OUTSIDE_CANDIDATE_ENVELOPE', 'rows[' + index + ']', 'Outside the frozen candidate envelope: ' + outside.join(', ') + '.');
      var prediction = calibration.evaluateFrozenCandidateForValidation(row.chemistry, row.coolingRateCPerS);
      if (!prediction || prediction.ok !== true) {
        issue(errors, 'CANDIDATE_EVALUATION', 'rows[' + index + ']', 'The frozen candidate could not evaluate this row.');
        return null;
      }
      if (row.actualValue < prediction.physicalOutputRange.min || row.actualValue > prediction.physicalOutputRange.max) issue(errors, 'ACTUAL_RANGE', 'rows[' + index + '].actualValue', 'The observed result is outside the physical target sanity range.');
      if (!prediction.physicalOutputRange.valid) issue(errors, 'OUTPUT_RANGE', 'rows[' + index + ']', 'The un-clamped candidate prediction is outside the physical target range.');
      var result = clone(row);
      result.genericValue = prediction.genericValue;
      result.candidateValue = prediction.candidateValue;
      return result;
    }).filter(Boolean);
    if (errors.length) return { ok: false, errors: errors, warnings: warnings, priorSessionPreserved: true };
    var resultMetrics = metrics(evaluated, pkg.groupBy);
    var criteria = pkg.protocol.acceptanceCriteria;
    var checks = [
      { id: 'minimum-groups', label: 'Independent group count', value: resultMetrics.nGroups, operator: '>=', limit: criteria.minGroups, pass: resultMetrics.nGroups >= criteria.minGroups },
      { id: 'absolute-bias', label: 'Absolute candidate bias', value: Math.abs(resultMetrics.candidate.meanBias), operator: '<=', limit: criteria.maxAbsBias, pass: Math.abs(resultMetrics.candidate.meanBias) <= criteria.maxAbsBias },
      { id: 'mae', label: 'Candidate MAE', value: resultMetrics.candidate.mae, operator: '<=', limit: criteria.maxMae, pass: resultMetrics.candidate.mae <= criteria.maxMae },
      { id: 'rmse', label: 'Candidate RMSE', value: resultMetrics.candidate.rmse, operator: '<=', limit: criteria.maxRmse, pass: resultMetrics.candidate.rmse <= criteria.maxRmse }
    ];
    if (criteria.minR2 != null) checks.push({ id: 'r2', label: 'Candidate R²', value: resultMetrics.candidate.r2, operator: '>=', limit: criteria.minR2, pass: resultMetrics.candidate.r2 != null && resultMetrics.candidate.r2 >= criteria.minR2 });
    var passed = checks.every(function (check) { return check.pass; });
    var packageFingerprint = fingerprint(pkg);
    var analysis = {
      contractVersion: CONTRACT_VERSION,
      analyzedAt: new Date().toISOString(),
      packageFingerprint: packageFingerprint,
      candidateModelFingerprint: candidate.analysis.modelFingerprint,
      trainingFingerprint: candidate.analysis.trainingFingerprint,
      scopeFingerprint: candidate.analysis.scopeFingerprint,
      target: candidate.analysis.target,
      unit: candidate.analysis.actualUnit,
      validationKind: 'independent external heat/batch validation',
      noRefit: true,
      groupSeparation: { independent: true, overlapDetected: false, groupBy: pkg.groupBy, externalGroups: resultMetrics.nGroups },
      applicabilityEnvelope: clone(ranges),
      predictionTimeGateEstablished: true,
      physicalOutputGatePassed: true,
      metrics: resultMetrics,
      acceptanceChecks: checks,
      acceptancePassed: passed,
      qualificationStatus: passed ? 'validation-passed-awaiting-qualified-approval' : 'validation-failed',
      warnings: warnings
    };
    session = {
      status: passed ? 'validation-passed' : 'validation-failed',
      importedAt: new Date().toISOString(), analyzedAt: analysis.analyzedAt,
      packageFingerprint: packageFingerprint, package: clone(pkg),
      analysis: clone(analysis), approval: null
    };
    var output = clone(analysis);
    output.ok = true;
    return output;
  }
  function candidateStillCurrent() {
    var candidate = activeCandidate();
    return !!(candidate && session.analysis &&
      candidate.analysis.modelFingerprint === session.analysis.candidateModelFingerprint &&
      candidate.analysis.trainingFingerprint === session.analysis.trainingFingerprint &&
      candidate.analysis.scopeFingerprint === session.analysis.scopeFingerprint);
  }
  function approve(input) {
    var errors = [];
    input = input && typeof input === 'object' && !Array.isArray(input) ? clone(input) : {};
    if (!session.analysis || session.analysis.acceptancePassed !== true || session.status !== 'validation-passed') issue(errors, 'VALIDATION_GATE', 'approval', 'Independent validation must pass before approval can be recorded.');
    if (!candidateStillCurrent()) issue(errors, 'STALE_CANDIDATE', 'approval', 'The active calibration candidate no longer matches the validation record.');
    var approval = {
      reviewerName: text(input.reviewerName, 'approval.reviewerName', errors, true, 120),
      role: text(input.role, 'approval.role', errors, true, 160),
      organization: text(input.organization, 'approval.organization', errors, true, 160),
      authorityReference: text(input.authorityReference, 'approval.authorityReference', errors, true, 300),
      approvedAt: iso(input.approvedAt, 'approval.approvedAt', errors, true),
      statement: text(input.statement, 'approval.statement', errors, true, 500),
      userAttestedQualifiedAuthority: input.userAttestedQualifiedAuthority === true
    };
    if (!approval.userAttestedQualifiedAuthority) issue(errors, 'AUTHORITY_ATTESTATION', 'approval.userAttestedQualifiedAuthority', 'The reviewer must attest that they hold the required qualified authority.');
    if (approval.approvedAt && Date.parse(approval.approvedAt) < Date.parse(session.analysis.analyzedAt)) issue(errors, 'APPROVAL_CHRONOLOGY', 'approval.approvedAt', 'Approval cannot predate the validation analysis.');
    if (errors.length) return { ok: false, errors: errors, priorApprovalPreserved: true };
    approval.recordedAt = new Date().toISOString();
    approval.validationFingerprint = fingerprint({ packageFingerprint: session.packageFingerprint, analysis: session.analysis });
    approval.identityVerification = 'user-attested; not independently verified by this browser';
    session.approval = approval;
    session.status = 'plant-calibrated';
    return { ok: true, status: session.status, approval: clone(approval), audit: audit() };
  }
  function predict(input) {
    var errors = [];
    if (session.status !== 'plant-calibrated' || !session.approval) issue(errors, 'NOT_APPROVED', 'prediction', 'A current qualified approval is required.');
    if (!candidateStillCurrent()) issue(errors, 'STALE_CANDIDATE', 'prediction', 'The active candidate no longer matches the approved validation record.');
    input = input && typeof input === 'object' && !Array.isArray(input) ? clone(input) : {};
    var chemistry = input.chemistry && typeof input.chemistry === 'object' && !Array.isArray(input.chemistry) ? input.chemistry : {};
    var values = {};
    CHEMISTRY_KEYS.forEach(function (key) { values[key] = number(chemistry[key], 'chemistry.' + key, errors, 0, 10, true); });
    var coolingRate = number(input.coolingRateCPerS, 'coolingRateCPerS', errors, 0.0001, 100000, true);
    var thickness = number(input.thicknessMm, 'thicknessMm', errors, 0.01, 5000, true);
    var ranges = session.analysis && session.analysis.applicabilityEnvelope;
    if (ranges) {
      CHEMISTRY_KEYS.forEach(function (key) { if (!inEnvelope(values[key], ranges[key])) issue(errors, 'OUTSIDE_APPROVED_ENVELOPE', 'chemistry.' + key, 'Input is outside the approved envelope.'); });
      if (!inEnvelope(coolingRate, ranges.coolingRateCPerS)) issue(errors, 'OUTSIDE_APPROVED_ENVELOPE', 'coolingRateCPerS', 'Input is outside the approved envelope.');
      if (!inEnvelope(thickness, ranges.thicknessMm)) issue(errors, 'OUTSIDE_APPROVED_ENVELOPE', 'thicknessMm', 'Input is outside the approved envelope.');
    }
    if (errors.length) return { ok: false, permitted: false, errors: errors };
    var result = calibration.evaluateFrozenCandidateForValidation(values, coolingRate);
    if (!result || result.ok !== true || !result.physicalOutputRange.valid) return { ok: false, permitted: false, errors: [{ code: 'OUTPUT_GATE', path: 'prediction', message: 'The candidate output failed the prediction-time physical-range gate.' }] };
    return {
      ok: true, permitted: true, classification: 'Plant calibrated',
      candidateValue: result.candidateValue, unit: result.unit,
      scopeFingerprint: session.analysis.scopeFingerprint,
      candidateModelFingerprint: session.analysis.candidateModelFingerprint,
      governance: { screeningUse: 'permitted within the approved envelope', applicationUse: 'subject to plant change control', specificationAcceptance: 'withheld', productRelease: 'withheld' }
    };
  }
  function audit() {
    var pkg = session.package;
    var analysis = session.analysis;
    return clone({
      contractVersion: CONTRACT_VERSION,
      status: session.status,
      importedAt: session.importedAt,
      analyzedAt: session.analyzedAt,
      packageFingerprint: session.packageFingerprint,
      fingerprintMeaning: 'Deterministic change detector; not a security signature.',
      package: pkg ? {
        id: pkg.id, revision: pkg.revision, title: pkg.title,
        sourceReference: pkg.sourceReference, target: pkg.target,
        groupBy: pkg.groupBy, candidateModelFingerprint: pkg.candidateModelFingerprint,
        trainingFingerprint: pkg.trainingFingerprint,
        scopeFingerprint: pkg.scopeFingerprint,
        protocol: clone(pkg.protocol), rowCount: pkg.rows.length
      } : null,
      analysis: analysis ? clone(analysis) : null,
      approval: session.approval ? clone(session.approval) : null,
      governance: {
        classification: session.status === 'plant-calibrated' ? 'Plant calibrated' : 'Calibration candidate',
        independentValidation: !!analysis,
        validationPassed: !!(analysis && analysis.acceptancePassed),
        qualifiedApprovalRecorded: session.status === 'plant-calibrated',
        browserVerifiedReviewerIdentity: false,
        specificationAcceptance: 'withheld', productRelease: 'withheld'
      },
      privacy: { rawRowsPersisted: false, groupIdentifiersPersisted: false }
    });
  }
  function template() {
    var candidate = activeCandidate();
    return {
      schemaVersion: CONTRACT_VERSION, packageType: PACKAGE_TYPE,
      id: 'replace-with-controlled-package-id', revision: '1.0',
      title: 'Independent plant validation campaign',
      sourceReference: 'replace-with-controlled-record-reference',
      candidateModelFingerprint: candidate ? candidate.analysis.modelFingerprint : 'import-a-candidate-first',
      trainingFingerprint: candidate ? candidate.analysis.trainingFingerprint : 'import-a-candidate-first',
      scopeFingerprint: candidate ? candidate.analysis.scopeFingerprint : 'import-a-candidate-first',
      target: candidate ? candidate.analysis.target : 'hardness-hv',
      groupBy: candidate ? candidate.package.groupBy : 'heat',
      protocol: {
        id: 'replace-with-protocol-id', revision: '1.0',
        lockedAt: '2026-01-01T00:00:00Z',
        independentOrganization: 'replace-with-independent-organization',
        independenceStatement: 'Explain why these results are independent of candidate fitting and internal holdout selection.',
        acceptanceCriteria: { minGroups: 5, maxAbsBias: null, maxMae: null, maxRmse: null, minR2: null }
      },
      rows: [{ recordId: 'EXT-001', heatId: 'NEW-HEAT-001', batchId: null, chemistry: { C: null, Mn: null, Si: null, Ni: null, Cr: null, Mo: null, V: null, Cu: null, B: null }, coolingRateCPerS: null, thicknessMm: null, actualValue: null, timestamp: '2026-02-01T00:00:00Z' }]
    };
  }
  function clear() { session = freshSession(); return audit(); }

  var api = {
    contractVersion: CONTRACT_VERSION,
    packageType: PACKAGE_TYPE,
    limits: { maxImportBytes: MAX_IMPORT_BYTES, maxRows: MAX_ROWS, minExternalGroups: MIN_EXTERNAL_GROUPS },
    parse: parse, analyze: analyze, approve: approve, predict: predict,
    getSession: function () { return clone(session); },
    audit: audit, template: template, clear: clear, fingerprint: fingerprint
  };
  Object.freeze(api.limits);
  Object.freeze(api);
  window.__SPX.qualification = api;
})();
