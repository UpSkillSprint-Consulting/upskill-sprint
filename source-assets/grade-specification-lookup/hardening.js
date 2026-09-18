// Safety and usability hardening layered onto the verified standalone source.
// Kept readable here so compliance behavior can be reviewed and regression-tested.
(() => {
  'use strict';

  const HARDENED_VERSION = '3.0.0';
  const OFFICIAL_SOURCES = {
    API_5L: {
      label: 'API Spec 5L, 47th Edition',
      url: 'https://www.apiwebstore.org/standards/5L',
      supersededPattern: /46th Edition \(2018\)/
    },
    CSA_Z245_1: {
      label: 'CSA Z245.1:26',
      url: 'https://www.csagroup.org/store/product/CSA_Z245.1:26/',
      supersededPattern: /Z245\.1:22/
    }
  };

  function walkStrings(value, replacement) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') value[index] = replacement(item);
        else walkStrings(item, replacement);
      });
      return;
    }
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (typeof item === 'string') value[key] = replacement(item);
      else walkStrings(item, replacement);
    }
  }

  function applyKnownDesignationCorrections() {
    const apiGrades = SPEC_DATA.specBodies?.API_5L?.grades || {};
    const corrections = {
      X60M_PSL2: ['Grade L415 / Grade X60 PSL2', 'Grade L415M / Grade X60M PSL2'],
      X65M_PSL2: ['Grade L450 / Grade X65 PSL2', 'Grade L450M / Grade X65M PSL2'],
      X70M_PSL2: ['Grade L485 / Grade X70 PSL2', 'Grade L485M / Grade X70M PSL2']
    };
    for (const [gradeKey, [before, after]] of Object.entries(corrections)) {
      const grade = apiGrades[gradeKey];
      if (!grade) continue;
      walkStrings(grade, (text) => text.replaceAll(before, after));
    }
  }

  applyKnownDesignationCorrections();

  function datasetAudit(data = SPEC_DATA) {
    let grades = 0;
    let verifiedGrades = 0;
    let requirementRecords = 0;
    let verifiedRequirementRecords = 0;
    for (const body of Object.values(data.specBodies || {})) {
      for (const grade of Object.values(body.grades || {})) {
        grades += 1;
        if (grade.verification?.lastVerifiedBy && grade.verification?.lastVerifiedDate) verifiedGrades += 1;
      }
    }
    (function visit(value) {
      if (!value || typeof value !== 'object') return;
      if (!Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, 'value') && typeof value.verified === 'boolean') {
        requirementRecords += 1;
        if (value.verified) verifiedRequirementRecords += 1;
      }
      Object.values(value).forEach(visit);
    })(data);
    return { grades, verifiedGrades, requirementRecords, verifiedRequirementRecords };
  }

  function editionStatus(entry) {
    const source = OFFICIAL_SOURCES[entry?.bodyKey];
    if (!source || !source.supersededPattern.test(entry.grade.specEdition || '')) return null;
    return source;
  }

  const baseValidateData = validateData;
  validateData = function validateDataHardened(data, options = {}) {
    const out = baseValidateData(data, options);
    const add = (level, code, path, message) => {
      if (!out.some((item) => item.level === level && item.code === code && item.path === path && item.message === message)) {
        out.push(issue(level, code, path, message));
      }
    };

    (function visit(value, path) {
      if (!value || typeof value !== 'object') return;
      if (!Array.isArray(value)) {
        if (Object.prototype.hasOwnProperty.call(value, 'verified') && typeof value.verified !== 'boolean') {
          add('error', 'TYPE', `${path}.verified`, 'verified must be boolean.');
        }
        if (Object.prototype.hasOwnProperty.call(value, 'value') && value.value !== null && (!Number.isFinite(value.value))) {
          add('error', 'FINITE_NUMBER', `${path}.value`, 'value must be a finite number or null.');
        }
        if (value.bound && path.endsWith('.min') && value.bound !== 'MIN') {
          add('error', 'BOUND_PATH_MISMATCH', `${path}.bound`, 'A value stored in a min field must use bound MIN.');
        }
        if (value.bound && path.endsWith('.max') && value.bound !== 'MAX') {
          add('error', 'BOUND_PATH_MISMATCH', `${path}.bound`, 'A value stored in a max field must use bound MAX.');
        }
      }
      for (const [key, item] of Object.entries(value)) visit(item, Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`);
    })(data, 'SPEC_DATA');

    for (const [bodyKey, body] of Object.entries(data.specBodies || {})) {
      for (const [gradeKey, grade] of Object.entries(body.grades || {})) {
        const gp = `SPEC_DATA.specBodies.${bodyKey}.grades.${gradeKey}`;
        const verifier = grade.verification?.lastVerifiedBy;
        const date = grade.verification?.lastVerifiedDate;
        if (Boolean(verifier) !== Boolean(date)) add('error', 'VERIFICATION_PAIR', `${gp}.verification`, 'Verifier and verification date must be supplied together.');
        if (date && Number.isNaN(Date.parse(date))) add('error', 'VERIFICATION_DATE', `${gp}.verification.lastVerifiedDate`, 'Verification date must be a valid date.');

        const specimens = new Set();
        (grade.charpy?.subSizeFactors || []).forEach((factor, index) => {
          const fp = `${gp}.charpy.subSizeFactors[${index}]`;
          if (specimens.has(factor.specimen)) add('error', 'DUPLICATE_SUBSIZE', `${fp}.specimen`, 'Duplicate Charpy specimen size.');
          specimens.add(factor.specimen);
          if (!Number.isFinite(factor.factor) || factor.factor <= 0 || factor.factor > 1) add('error', 'SUBSIZE_FACTOR', `${fp}.factor`, 'Charpy sub-size factor must be greater than 0 and no greater than 1.');
        });

        for (const [index, rule] of (grade.footnoteRules || []).entries()) {
          const rp = `${gp}.footnoteRules[${index}]`;
          if (typeof rule.verified !== 'boolean') add('error', 'TYPE', `${rp}.verified`, 'verified must be boolean.');
          if (rule.type === 'COMBINED_MAX') {
            if (!Array.isArray(rule.elements) || !rule.elements.length) add('error', 'FOOTNOTE_ELEMENTS', `${rp}.elements`, 'COMBINED_MAX requires at least one element.');
            if (!Number.isFinite(rule.limit)) add('error', 'FOOTNOTE_LIMIT', `${rp}.limit`, 'COMBINED_MAX limit must be finite.');
            if (!ENUMS.units.has(rule.unit)) add('error', 'ENUM', `${rp}.unit`, 'Unknown footnote unit.');
          }
          if (rule.type === 'TRADEOFF_ADJUST') {
            const adjustment = rule.adjustPerUnit || {};
            if (!(adjustment.sourceDecrement > 0) || !(adjustment.targetIncrement >= 0) || !Number.isFinite(rule.ceiling)) {
              add('error', 'TRADEOFF_PARAMETERS', rp, 'Tradeoff decrement, increment, and ceiling must be finite and valid.');
            }
          }
          if (rule.type === 'CONDITIONAL_LIMIT') {
            if (!['GT', 'GTE', 'LT', 'LTE', 'EQ'].includes(rule.condition?.operator)) add('error', 'CONDITION_OPERATOR', `${rp}.condition.operator`, 'Unsupported conditional operator.');
            if (!Number.isFinite(rule.condition?.value) || !Number.isFinite(rule.effect?.limit)) add('error', 'CONDITION_LIMIT', rp, 'Conditional threshold and effect limit must be finite.');
          }
        }

        for (const [index, equivalent] of (grade.equivalents || []).entries()) {
          if (!data.specBodies?.[equivalent.specBody]?.grades?.[equivalent.gradeKey]) {
            add('error', 'EQUIVALENT_REF', `${gp}.equivalents[${index}]`, 'Equivalent grade reference does not resolve.');
          }
        }
      }
    }

    const audit = datasetAudit(data);
    if (audit.verifiedGrades < audit.grades || audit.verifiedRequirementRecords < audit.requirementRecords) {
      add(
        'warning',
        'DATASET_UNVERIFIED',
        'SPEC_DATA',
        `${audit.verifiedGrades}/${audit.grades} grade records and ${audit.verifiedRequirementRecords}/${audit.requirementRecords} requirement records are independently verified.`
      );
    }
    for (const [bodyKey, source] of Object.entries(OFFICIAL_SOURCES)) {
      const editions = Object.values(data.specBodies?.[bodyKey]?.grades || {}).map((grade) => grade.specEdition);
      if (editions.some((edition) => source.supersededPattern.test(edition || ''))) {
        add('warning', 'SUPERSEDED_EDITION', `SPEC_DATA.specBodies.${bodyKey}`, `Embedded records use a superseded edition; the current published edition is ${source.label}.`);
      }
    }
    return out;
  };

  phase2StorageKey = function phase2StorageKeyHardened(entry) {
    return `gradeSpecPhase3:${HARDENED_VERSION}:${entry.bodyKey}:${entry.gradeKey}`;
  };

  numberInput = function numberInputHardened(id, label, value = '', attrs = '') {
    return `<label class="p2-field"><span>${esc(label)}</span><input id="${esc(id)}" type="number" value="${esc(value ?? '')}" ${attrs}></label>`;
  };

  const baseDefaultCheckInput = defaultCheckInput;
  defaultCheckInput = function defaultCheckInputHardened(entry) {
    return {
      ...baseDefaultCheckInput(entry),
      stripWidth: '',
      stripThickness: '',
      cvnTemp: '',
      od: '',
      dwttShear: '',
      dwttTemp: ''
    };
  };

  const baseCollectComplianceInput = collectComplianceInput;
  collectComplianceInput = function collectComplianceInputHardened(entry) {
    const input = baseCollectComplianceInput(entry);
    for (const [key, id] of Object.entries({ od: 'checkOD', dwttShear: 'checkDWTTShear', dwttTemp: 'checkDWTTTemp' })) {
      input[key] = document.getElementById(id)?.value ?? input[key] ?? '';
    }
    return input;
  };

  const baseRenderCompliancePanel = renderCompliancePanel;
  renderCompliancePanel = function renderCompliancePanelHardened(entry) {
    const saved = getCheckState(entry);
    let html = baseRenderCompliancePanel(entry)
      .replaceAll('wall-thickness', 'material-thickness')
      .replaceAll('Wall thickness', 'Material thickness')
      .replace('Custom width</option>', 'Custom width — estimate only</option>');
    const charpyNote = '<p class="field-note">A complete Charpy assessment requires exactly three results, a tabulated specimen size, and the actual test temperature.</p>';
    html = html.replace('<div class="p2-card paste-card">', `${charpyNote}<div class="p2-card paste-card">`);
    if (entry.grade.dwtt) {
      const dwttCard = `<div class="p2-card"><h3>Drop-weight tear test (DWTT)</h3><div class="p2-grid three">${numberInput('checkOD', 'Outside diameter (mm)', saved.od, 'step="0.01" min="0"')}${numberInput('checkDWTTShear', 'Average shear area (%)', saved.dwttShear, 'step="0.1" min="0" max="100"')}${numberInput('checkDWTTTemp', 'Actual test temperature (°C)', saved.dwttTemp, 'step="1"')}</div><p class="field-note">Outside diameter determines whether the stored DWTT rule applies.</p></div>`;
      html = html.replace('<div class="p2-card paste-card">', `${dwttCard}<div class="p2-card paste-card">`);
    }
    return html;
  };

  Object.assign(PHASE2_FIELDS, {
    OD: 'Outside diameter (mm)',
    DWTT_SHEAR: 'DWTT average shear area (%)',
    DWTT_TEMP: 'DWTT test temperature (°C)'
  });

  const baseAutoMapHeader = autoMapHeader;
  autoMapHeader = function autoMapHeaderHardened(header, entry) {
    const normalized = String(header).toUpperCase().replace(/[^A-Z0-9]+/g, '');
    if (/^(OD|OUTSIDEDIAMETER|PIPEOD)$/.test(normalized)) return 'OD';
    if (/DWTT.*(SHEAR|AREA)|(SHEAR|AREA).*DWTT/.test(normalized)) return 'DWTT_SHEAR';
    if (/DWTT.*TEMP|TEMP.*DWTT/.test(normalized)) return 'DWTT_TEMP';
    return baseAutoMapHeader(header, entry);
  };

  const baseRowFromMapping = rowFromMapping;
  rowFromMapping = function rowFromMappingHardened(row, mapping, entry) {
    const input = baseRowFromMapping(row, mapping, entry);
    const fields = { OD: 'od', DWTT_SHEAR: 'dwttShear', DWTT_TEMP: 'dwttTemp' };
    for (const [index, target] of Object.entries(mapping)) {
      if (fields[target]) input[fields[target]] = row[Number(index)] ?? '';
    }
    return input;
  };

  function isPresent(value) {
    return finiteNumber(value) !== null;
  }

  function hasLimit(limit) {
    return limit && Number.isFinite(limit.value);
  }

  function collectRequiredInputs(input, ctx) {
    const required = new Map();
    const need = (label, present) => required.set(label, Boolean(present));
    const grade = ctx.grade;
    const row = ctx.row;
    const analysisKey = String(input.analysisType || 'HEAT').toLowerCase();

    need('Material thickness', isPresent(input.tMM));
    if (!row) need('Applicable material-thickness row', false);

    for (const [element, record] of Object.entries(grade.chemistry.elements || {})) {
      const limits = record?.[analysisKey];
      if (hasLimit(limits?.min) || hasLimit(limits?.max)) need(`${element} ${String(input.analysisType || 'HEAT').toUpperCase()} analysis`, isPresent(input.chemistry?.[element]));
    }

    const ce = grade.chemistry.carbonEquivalent;
    if (hasLimit(ce.ceIiw.limit) || hasLimit(ce.cePcm.limit)) {
      for (const element of new Set([...numericElementsFromFormula(ce.ceIiw.formula), ...numericElementsFromFormula(ce.cePcm.formula)])) {
        need(`${element} for carbon-equivalent calculation`, isPresent(input.chemistry?.[element]));
      }
    }

    for (const rule of grade.footnoteRules || []) {
      if (rule.type === 'COMBINED_MAX') for (const element of rule.elements || []) need(`${element} for ${rule.id}`, isPresent(input.chemistry?.[element]));
      if (rule.type === 'TRADEOFF_ADJUST') {
        need(`${rule.sourceElement} for ${rule.id}`, isPresent(input.chemistry?.[rule.sourceElement]));
        need(`${rule.targetElement} for ${rule.id}`, isPresent(input.chemistry?.[rule.targetElement]));
      }
      if (rule.type === 'CONDITIONAL_LIMIT') {
        const element = rule.condition?.element;
        need(`${element} for ${rule.id}`, isPresent(input.chemistry?.[element]));
        const actual = finiteNumber(input.chemistry?.[element]);
        const threshold = rule.condition?.value;
        const triggered = actual === null ? false : ({ GT: actual > threshold, GTE: actual >= threshold, LT: actual < threshold, LTE: actual <= threshold, EQ: actual === threshold }[rule.condition?.operator] ?? false);
        if (triggered) for (const affected of rule.effect?.elements || []) need(`${affected} for ${rule.id}`, isPresent(input.chemistry?.[affected]));
      }
    }

    if (row) {
      if (hasLimit(row.yieldStrength?.min) || hasLimit(row.yieldStrength?.max) || hasLimit(row.ytRatio?.max)) need('Yield strength', isPresent(input.ys));
      if (hasLimit(row.tensileStrength?.min) || hasLimit(row.tensileStrength?.max) || hasLimit(row.ytRatio?.max) || row.elongation?.type === 'FORMULA') need('Tensile strength', isPresent(input.uts));
      if (row.elongation) {
        need('Measured elongation', isPresent(input.elongation));
        if (row.elongation.type === 'FORMULA') {
          if (input.specimenType === 'ROUND') need('Round tensile specimen diameter', isPresent(input.roundDiameter));
          else {
            need('Strip tensile specimen width', isPresent(input.stripWidth));
            need('Strip tensile specimen thickness', isPresent(input.stripThickness));
          }
        }
      }
      if (hasLimit(row.hardness?.max)) need('Hardness', isPresent(input.hardness));
    }

    if (grade.charpy.required) {
      need('CVN specimen 1 energy', isPresent(input.cvn1));
      need('CVN specimen 2 energy', isPresent(input.cvn2));
      need('CVN specimen 3 energy', isPresent(input.cvn3));
      need('Actual CVN test temperature', isPresent(input.cvnTemp));
      need('Tabulated CVN specimen size', input.cvnSize !== 'CUSTOM' && Boolean(ENGINE.subSize(grade.charpy, input.cvnSize, null)));
      if (!hasLimit(grade.charpy.energyFullSize.average?.min) || !hasLimit(grade.charpy.energyFullSize.single?.min)) need('Audited CVN energy requirement', false);
    }

    if (grade.dwtt) {
      const od = finiteNumber(input.od);
      need('Outside diameter for DWTT applicability', od !== null);
      if (od !== null && od >= grade.dwtt.applicabilityRule.odMin_mm) {
        need('DWTT average shear area', isPresent(input.dwttShear));
        need('Actual DWTT test temperature', isPresent(input.dwttTemp));
      }
    }

    for (const requirement of ctx.added || []) need(`Human confirmation: ${requirement.description}`, false);
    const missing = [...required.entries()].filter(([, present]) => !present).map(([label]) => label);
    return { required: required.size, provided: required.size - missing.length, missing };
  }

  function collectInputErrors(input) {
    const errors = [];
    const add = (message) => { if (!errors.includes(message)) errors.push(message); };
    const t = finiteNumber(input.tMM);
    if (t !== null && t <= 0) add('Material thickness must be greater than zero.');
    for (const [element, raw] of Object.entries(input.chemistry || {})) {
      const value = finiteNumber(raw);
      if (value !== null && (value < 0 || value > 100)) add(`${element} must be between 0 and 100 wt%.`);
      if (element === 'C' && value !== null && value > 2) add('C greater than 2 wt% is outside the supported steel-grade domain.');
    }
    for (const [label, raw] of [['Yield strength', input.ys], ['Tensile strength', input.uts], ['Hardness', input.hardness]]) {
      const value = finiteNumber(raw);
      if (value !== null && value < 0) add(`${label} cannot be negative.`);
    }
    const ys = finiteNumber(input.ys), uts = finiteNumber(input.uts);
    if (ys !== null && uts !== null && ys > uts) add('Yield strength cannot exceed tensile strength.');
    const elongation = finiteNumber(input.elongation);
    if (elongation !== null && (elongation < 0 || elongation > 100)) add('Elongation must be between 0 and 100%.');
    for (const [index, raw] of [input.cvn1, input.cvn2, input.cvn3].entries()) {
      const value = finiteNumber(raw);
      if (value !== null && value < 0) add(`CVN specimen ${index + 1} energy cannot be negative.`);
    }
    for (const [label, raw] of [['Strip width', input.stripWidth], ['Specimen thickness', input.stripThickness], ['Round diameter', input.roundDiameter], ['Outside diameter', input.od]]) {
      const value = finiteNumber(raw);
      if (value !== null && value <= 0) add(`${label} must be greater than zero.`);
    }
    const shear = finiteNumber(input.dwttShear);
    if (shear !== null && (shear < 0 || shear > 100)) add('DWTT average shear area must be between 0 and 100%.');
    return errors;
  }

  function makeScaledLimit(base, factor, clauseRef, factorVerified) {
    if (!base) return null;
    return {
      ...deepClone(base),
      value: base.value === null ? null : base.value * factor,
      clauseRef,
      verified: base.verified === true && factorVerified !== false
    };
  }

  function removeIncompleteCarbonEquivalentRows(input, grade, results) {
    if (!Object.keys(input.chemistry || {}).length) return results;
    const ce = grade.chemistry.carbonEquivalent;
    const symbols = [...new Set([...numericElementsFromFormula(ce.ceIiw.formula), ...numericElementsFromFormula(ce.cePcm.formula)])];
    const missing = symbols.filter((element) => !isPresent(input.chemistry?.[element]));
    if (!missing.length) return results;
    const retained = results.filter((row) => !['CE_IIW', 'Pcm', 'Carbon equivalent'].includes(row.name));
    retained.push(resultRow('Carbon equivalent', '', null, 'WARN', `Not evaluated; missing chemistry required by the stored formulas: ${missing.join(', ')}.`, { category: 'Carbon equivalent' }));
    return retained;
  }

  function rebuildCharpyRows(input, ctx, results) {
    const grade = ctx.grade;
    if (!grade.charpy.required) return results;
    const retained = results.filter((row) => row.category !== 'Charpy');
    const energies = [input.cvn1, input.cvn2, input.cvn3].map(finiteNumber);
    const completeSet = energies.every((value) => value !== null);
    if (completeSet && input.cvnSize !== 'CUSTOM') {
      const sub = ENGINE.subSize(grade.charpy, input.cvnSize, null);
      if (sub) {
        const average = energies.reduce((total, value) => total + value, 0) / 3;
        const minimum = Math.min(...energies);
        const factorVerified = sub.verified !== false;
        const averageLimit = makeScaledLimit(grade.charpy.energyFullSize.average.min, sub.factor, sub.clauseRef, factorVerified);
        const singleLimit = makeScaledLimit(grade.charpy.energyFullSize.single.min, sub.factor, sub.clauseRef, factorVerified);
        addLimitChecks(retained, 'CVN average (3 specimens)', average, [averageLimit], { category: 'Charpy', detail: `Three-specimen average; full-size requirement × ${fmtPlain(sub.factor, 3)} (${sub.source}).` });
        addLimitChecks(retained, 'CVN minimum specimen', minimum, [singleLimit], { category: 'Charpy', detail: `Lowest of three specimens; full-size requirement × ${fmtPlain(sub.factor, 3)} (${sub.source}).` });
      }
    }
    const actualTemp = finiteNumber(input.cvnTemp);
    const requiredTemp = grade.charpy.testTemp?.value;
    if (actualTemp !== null && requiredTemp !== null) {
      const limit = { ...deepClone(grade.charpy.testTemp), bound: 'MAX' };
      const check = ENGINE.checkLimit(actualTemp, limit);
      retained.push(resultRow(
        'CVN test temperature',
        actualTemp,
        limit,
        check.status,
        actualTemp <= requiredTemp
          ? `Tested at or colder than the maximum permitted temperature of ${fmtPlain(requiredTemp, 1)} °C.`
          : `Tested warmer than the maximum permitted temperature of ${fmtPlain(requiredTemp, 1)} °C.`,
        { margin: check.margin, verified: grade.charpy.testTemp.verified, unit: 'degC', category: 'Charpy' }
      ));
    }
    return retained;
  }

  function appendDwttRows(input, ctx, results) {
    const dwtt = ctx.grade.dwtt;
    if (!dwtt) return results;
    const od = finiteNumber(input.od);
    if (od === null) return results;
    const applies = od >= dwtt.applicabilityRule.odMin_mm;
    results.push(resultRow(
      'DWTT applicability',
      od,
      { value: dwtt.applicabilityRule.odMin_mm, bound: 'MIN', unit: 'mm', clauseRef: dwtt.applicabilityRule.clauseRef, verified: dwtt.applicabilityRule.verified, footnoteIds: [], displayNote: dwtt.applicabilityRule.description },
      'INFO',
      applies ? 'DWTT applies at this outside diameter.' : 'DWTT does not apply below the stored outside-diameter threshold.',
      { verified: dwtt.applicabilityRule.verified, unit: 'mm', category: 'DWTT' }
    ));
    if (!applies) return results;
    const shear = finiteNumber(input.dwttShear);
    if (shear !== null) addLimitChecks(results, 'DWTT average shear area', shear, [dwtt.shearAreaAvg.min], { category: 'DWTT' });
    const actualTemp = finiteNumber(input.dwttTemp);
    if (actualTemp !== null && dwtt.testTemp.value !== null) {
      const limit = { ...deepClone(dwtt.testTemp), bound: 'MAX' };
      const check = ENGINE.checkLimit(actualTemp, limit);
      results.push(resultRow('DWTT test temperature', actualTemp, limit, check.status, actualTemp <= limit.value ? 'Tested at or colder than the maximum permitted temperature.' : 'Tested warmer than the maximum permitted temperature.', { margin: check.margin, verified: dwtt.testTemp.verified, unit: 'degC', category: 'DWTT' }));
    }
    return results;
  }

  const baseRunCompliance = runCompliance;
  runCompliance = function runComplianceHardened(input, entry, overlayKeys = state.activeOverlays) {
    const tMM = finiteNumber(input.tMM) ?? state.thicknessMM;
    const ctx = resolveContext(entry, tMM, overlayKeys);
    const base = baseRunCompliance(input, entry, overlayKeys);
    let results = base.results.map((row) => row.name === 'Wall thickness' ? { ...row, name: 'Material thickness' } : row);
    results = removeIncompleteCarbonEquivalentRows(input, ctx.grade, results);
    results = rebuildCharpyRows(input, ctx, results);
    results = appendDwttRows(input, ctx, results);

    const coverage = collectRequiredInputs(input, ctx);
    const inputErrors = collectInputErrors(input);
    results.sort((a, b) => (PHASE2_STATUS_ORDER[a.status] ?? 9) - (PHASE2_STATUS_ORDER[b.status] ?? 9) || a.name.localeCompare(b.name));
    const failures = results.filter((row) => row.status === 'FAIL');
    const warnRows = results.filter((row) => row.status === 'WARN');
    const unverified = [];
    for (const row of results) {
      if (['PASS', 'FAIL', 'WARN', 'INFO'].includes(row.status) && row.verified === false) {
        const label = `${row.name} — ${row.clauseRef || row.limit?.clauseRef || 'UNKNOWN'}`;
        if (!unverified.includes(label)) unverified.push(label);
      }
    }

    const warnings = base.warnings.filter((warning) => !/CVN test temperature|differs from required|No sub-size factor|CE calculation assumed 0/i.test(warning));
    const edition = editionStatus(entry);
    if (edition) warnings.push(`Embedded ${entry.grade.specEdition} data is superseded; verify against ${edition.label}.`);
    if (unverified.length) warnings.push('One or more requirement values involved in this assessment have not been independently verified.');
    if (coverage.missing.length) warnings.unshift(`Assessment incomplete: ${coverage.missing.length} applicable input${coverage.missing.length === 1 ? '' : 's'} missing.`);
    const uniqueWarnings = [...new Set([...warnings, ...warnRows.map((row) => row.detail || row.name)])];

    let verdict;
    if (inputErrors.length) verdict = 'INVALID_INPUT';
    else if (failures.length) verdict = 'FAIL';
    else if (coverage.missing.length) verdict = 'INCOMPLETE';
    else if (unverified.length || uniqueWarnings.length || warnRows.length) verdict = 'PASS_WITH_WARNINGS';
    else verdict = 'PASS';

    return {
      ...base,
      verdict,
      failures: failures.length,
      warnings: uniqueWarnings,
      unverified,
      results,
      coverage,
      inputErrors,
      meta: { ...base.meta, form: ctx.form, hardeningVersion: HARDENED_VERSION }
    };
  };

  verdictLabel = function verdictLabelHardened(verdict) {
    return ({ PASS_WITH_WARNINGS: 'PASS WITH WARNINGS', INVALID_INPUT: 'INVALID INPUT', INCOMPLETE: 'INCOMPLETE' })[verdict] || verdict;
  };

  renderComplianceResult = function renderComplianceResultHardened(result) {
    if (!result) return '<div class="p2-empty">Enter all applicable results and run the compliance check. Missing inputs produce INCOMPLETE, never PASS.</div>';
    const verdict = result.verdict;
    const overlays = result.meta.overlays.length ? result.meta.overlays.join(', ') : 'None';
    const coverage = result.coverage || { required: 0, provided: 0, missing: [] };
    const rows = result.results.length
      ? result.results.map((row) => `<tr class="status-${row.status.toLowerCase()}"><td><strong>${esc(row.name)}</strong>${row.ruleId ? `<br><span class="clause">${esc(row.ruleId)}</span>` : ''}</td><td class="mono">${displayEntered(row)}</td><td>${resultLimitHTML(row)}</td><td class="mono">${marginText(row)}</td><td><span class="status-pill ${row.status.toLowerCase()}">${row.status}</span></td><td>${esc(row.detail || '')}${row.clauseRef && !row.limit ? ` <span class="clause">${esc(row.clauseRef)}</span>` : ''}</td></tr>`).join('')
      : '<tr><td colspan="6">No result values were evaluated.</td></tr>';
    return `<article class="check-report" id="checkReport"><header class="check-report-head"><div><div class="eyebrow">Compliance screening report</div><h3>${esc(result.meta.grade)}</h3><div class="meta"><span class="meta-pill">${esc(result.meta.specEdition)}</span><span class="meta-pill">t = ${fmtPlain(result.meta.tMM, 3)} mm</span><span class="meta-pill">Form: ${esc(formatForm(result.meta.form))}</span><span class="meta-pill">Overlays: ${esc(overlays)}</span><span class="meta-pill">${esc(new Date(result.meta.dateTime).toLocaleString())}</span></div></div><div class="verdict ${verdict.toLowerCase().replaceAll('_', '-')}">${verdictLabel(verdict)}${result.failures ? `<small>${result.failures} failure${result.failures === 1 ? '' : 's'}</small>` : ''}</div></header><div class="coverage-summary" aria-label="Assessment coverage"><div><span>Required</span><strong>${coverage.required}</strong></div><div><span>Provided</span><strong>${coverage.provided}</strong></div><div><span>Missing</span><strong>${coverage.missing.length}</strong></div></div>${result.inputErrors?.length ? `<section class="input-errors"><h4>Correct these inputs</h4><ul>${result.inputErrors.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}${coverage.missing.length ? `<section class="missing-inputs"><h4>Missing before a complete assessment</h4><ul>${coverage.missing.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}${result.warnings.length ? `<div class="input-warning"><strong>Warnings:</strong> ${result.warnings.map(esc).join(' · ')}</div>` : ''}<div class="table-wrap"><table class="spec-table check-table"><thead><tr><th>Result</th><th>Entered / computed</th><th>Applicable limit</th><th>Margin</th><th>Status</th><th>Detail</th></tr></thead><tbody>${rows}</tbody></table></div>${result.unverified.length ? `<section class="unverified-list"><h4>Unverified values involved in this verdict</h4><ul>${result.unverified.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}<footer class="report-disclaimer">Screening only — verify every applicable value against the current controlled specification, purchase order, customer supplements, and service requirements.</footer></article>`;
  };

  const baseHydro = ENGINE.hydro.bind(ENGINE);
  ENGINE.hydro = function hydroHardened(smys, thickness, outsideDiameter, fiberRatio) {
    const fiber = finiteNumber(fiberRatio);
    if (fiber === null || fiber <= 0 || fiber > 1) return null;
    return baseHydro(smys, thickness, outsideDiameter, fiber);
  };

  const baseRenderHydroPanel = renderHydroPanel;
  renderHydroPanel = function renderHydroPanelHardened(entry) {
    return baseRenderHydroPanel(entry)
      .replace('step="0.1" min="0"', 'step="0.1" min="0" max="100"')
      .replace('a positive fiber-stress percentage', 'a fiber-stress percentage greater than 0 and no greater than 100');
  };

  const baseBindHydro = bindHydro;
  bindHydro = function bindHydroHardened(entry) {
    baseBindHydro(entry);
    const fiber = document.getElementById('hydroFiber');
    const validate = () => {
      const value = finiteNumber(fiber?.value);
      if (value !== null && value > 100) document.getElementById('hydroOutput').innerHTML = '<div class="input-warning">Fiber stress cannot exceed 100% of SMYS.</div>';
    };
    fiber?.addEventListener('input', validate);
    validate();
  };

  const baseRenderCharpyCalcPanel = renderCharpyCalcPanel;
  renderCharpyCalcPanel = function renderCharpyCalcPanelHardened(entry) {
    return baseRenderCharpyCalcPanel(entry).replace('Custom width</option>', 'Custom width — estimate only</option>');
  };

  const baseBindCharpyCalc = bindCharpyCalc;
  bindCharpyCalc = function bindCharpyCalcHardened(entry) {
    baseBindCharpyCalc(entry);
    const updateEstimate = () => {
      if (document.getElementById('charpyCalcSize')?.value !== 'CUSTOM') return;
      const grade = resolveContext(entry).grade;
      const sub = ENGINE.subSize(grade.charpy, 'CUSTOM', finiteNumber(document.getElementById('charpyCalcCustom')?.value));
      const output = document.getElementById('charpyCalcOutput');
      if (!sub) {
        output.innerHTML = '<div class="p2-empty">Enter a custom width greater than 0 and no greater than 10 mm.</div>';
        return;
      }
      const average = grade.charpy.energyFullSize.average.min?.value;
      const single = grade.charpy.energyFullSize.single.min?.value;
      output.innerHTML = `<div class="calc-result wide"><span class="estimate-only">Engineering estimate only</span><strong>No compliance status is assigned</strong><p>The proportional factor ${fmtPlain(sub.factor, 3)} is derived from stored ratios, not a tabulated acceptance factor for this custom size.</p><p>Estimated average: ${fmtPlain(average === null ? null : average * sub.factor, 2)} J · estimated single: ${fmtPlain(single === null ? null : single * sub.factor, 2)} J</p></div>`;
    };
    ['charpyCalcSize', 'charpyCalcCustom', 'charpyCalcEnergy'].forEach((id) => document.getElementById(id)?.addEventListener('input', updateEstimate));
    updateEstimate();
  };

  const baseBindCE = bindCE;
  bindCE = function bindCEHardened(entry) {
    baseBindCE(entry);
    const preventPartialCalculation = () => {
      const section = resolveContext(entry).grade.chemistry.carbonEquivalent;
      const symbols = [...new Set([...numericElementsFromFormula(section.ceIiw.formula), ...numericElementsFromFormula(section.cePcm.formula)])];
      const missing = symbols.filter((element) => finiteNumber(document.querySelector(`[data-ce-el="${element}"]`)?.value) === null);
      const anyEntered = symbols.some((element) => finiteNumber(document.querySelector(`[data-ce-el="${element}"]`)?.value) !== null);
      if (anyEntered && missing.length) document.getElementById('ceOutput').innerHTML = `<div class="p2-empty">Enter all formula inputs before calculating. Missing: ${missing.map(esc).join(', ')}.</div>`;
    };
    document.querySelectorAll('[data-ce-el]').forEach((input) => input.addEventListener('input', preventPartialCalculation));
    preventPartialCalculation();
  };

  renderReversePanel = function renderReversePanelHardened() {
    const saved = getCalcState('reverse', { ys: 359, uts: '', cvn: '', temp: '', thickness: 15, form: state.form || 'ALL' });
    const forms = [{ value: 'ALL', label: 'All product forms' }, ...[...ENUMS.forms].map((form) => ({ value: form, label: formatForm(form) }))];
    if (!saved.form) saved.form = state.form || 'ALL';
    return `<section class="tool-panel ${state.phase2Tab === 'reverse' ? 'active' : ''}" data-panel="reverse" id="reverseLookup"><div class="p2-section-head"><div><div class="eyebrow">Cross-spec screening</div><h2>What Grade Meets This?</h2></div><button class="btn primary" id="runReverseBtn">Search grades</button></div><div class="p2-card"><div class="p2-grid">${selectInput('reverseForm', 'Product form', forms, saved.form)}${numberInput('reverseYS', 'Required YS min (MPa)', saved.ys, 'step="0.1"')}${numberInput('reverseUTS', 'Required UTS min (MPa, optional)', saved.uts, 'step="0.1"')}${numberInput('reverseCVN', 'Required CVN average (J, optional)', saved.cvn, 'step="0.1"')}${numberInput('reverseTemp', 'Maximum test temperature (°C, optional)', saved.temp, 'step="1"')}${numberInput('reverseThickness', 'Material thickness (mm)', saved.thickness, 'step="0.001" min="0"')}</div><p class="form-filter-note">Results are screened by product form and show data-verification status. A match is not an equivalency determination.</p><div id="reverseResults" class="calc-output" aria-live="polite"></div></div></section>`;
  };

  searchReverse = function searchReverseHardened(criteria) {
    const ys = finiteNumber(criteria.ys), uts = finiteNumber(criteria.uts), cvn = finiteNumber(criteria.cvn), temp = finiteNumber(criteria.temp), thickness = finiteNumber(criteria.thickness);
    const form = criteria.form || 'ALL';
    if (ys === null || thickness === null || thickness <= 0) return [];
    const hits = [];
    for (const entry of allGrades()) {
      if (form !== 'ALL' && !entry.grade.applicableForms.includes(form)) continue;
      const ctx = resolveContext(entry, thickness, []), row = ctx.row;
      if (!row) continue;
      const y = row.yieldStrength.min?.value, u = row.tensileStrength.min?.value;
      const c = ctx.grade.charpy.energyFullSize.average.min?.value, ct = ctx.grade.charpy.testTemp?.value;
      if (y === null || y < ys) continue;
      if (uts !== null && (u === null || u < uts)) continue;
      if (cvn !== null && (!ctx.grade.charpy.required || c === null || c < cvn)) continue;
      if (temp !== null && (!ctx.grade.charpy.required || ct === null || ct > temp)) continue;
      const involved = [row.yieldStrength.min];
      if (uts !== null) involved.push(row.tensileStrength.min);
      if (cvn !== null) involved.push(ctx.grade.charpy.energyFullSize.average.min);
      if (temp !== null) involved.push(ctx.grade.charpy.testTemp);
      const gradeVerified = Boolean(entry.grade.verification?.lastVerifiedBy && entry.grade.verification?.lastVerifiedDate);
      hits.push({ entry, ctx, ys: y, uts: u, cvn: c, temp: ct, margin: y - ys, unverified: !gradeVerified || involved.some((value) => value?.verified !== true), edition: editionStatus(entry) });
    }
    return hits.sort((a, b) => a.margin - b.margin || a.ys - b.ys || a.entry.grade.displayName.localeCompare(b.entry.grade.displayName));
  };

  bindReverse = function bindReverseHardened() {
    const run = () => {
      const criteria = {
        form: document.getElementById('reverseForm')?.value || 'ALL',
        ys: document.getElementById('reverseYS')?.value,
        uts: document.getElementById('reverseUTS')?.value,
        cvn: document.getElementById('reverseCVN')?.value,
        temp: document.getElementById('reverseTemp')?.value,
        thickness: document.getElementById('reverseThickness')?.value
      };
      storageSet('gradeSpecCalc:reverse', criteria);
      const hits = searchReverse(criteria);
      const output = document.getElementById('reverseResults');
      output.innerHTML = hits.length ? `<div class="table-wrap"><table class="spec-table reverse-table"><thead><tr><th>Grade</th><th>Spec / edition</th><th>Product forms</th><th>YS min</th><th>UTS min</th><th>CVN / temp</th><th>YS margin</th><th>Data status</th><th></th></tr></thead><tbody>${hits.map((hit) => `<tr class="${hit.unverified ? 'reverse-unverified' : ''}"><td><strong>${esc(hit.entry.grade.displayName)}</strong></td><td>${esc(hit.entry.bodyName)}<br><small>${esc(hit.entry.grade.specEdition)}</small></td><td>${hit.entry.grade.applicableForms.map((item) => esc(formatForm(item))).join(', ')}</td><td>${renderLimit(hit.ctx.row.yieldStrength.min)}</td><td>${renderLimit(hit.ctx.row.tensileStrength.min)}</td><td>${hit.ctx.grade.charpy.required ? `${renderLimit(hit.ctx.grade.charpy.energyFullSize.average.min)}<br>${renderScalar(hit.ctx.grade.charpy.testTemp, { kind: 'MAX' })}` : 'Not mandatory'}</td><td class="mono">+${fmtPlain(hit.margin, 2)} MPa</td><td class="data-status-cell">${hit.edition ? 'Superseded edition<br>' : ''}${hit.unverified ? '⚠ Unverified' : 'Verified'}</td><td><button class="btn" data-open-body="${hit.entry.bodyKey}" data-open-grade="${hit.entry.gradeKey}">Open</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="p2-empty">No grades meet all entered criteria for the selected product form.</div>';
      document.querySelectorAll('[data-open-grade]').forEach((button) => {
        button.onclick = () => {
          const selected = findEntry({ bodyKey: button.dataset.openBody, gradeKey: button.dataset.openGrade });
          if (selected) {
            selectEntry(selected);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };
      });
    };
    document.getElementById('runReverseBtn').onclick = run;
  };

  const baseShowSearch = showSearch;
  showSearch = function showSearchAccessible(query) {
    baseShowSearch(query);
    const input = document.getElementById('globalSearch');
    const results = document.getElementById('searchResults');
    input?.setAttribute('aria-expanded', results?.classList.contains('show') ? 'true' : 'false');
    results?.setAttribute('role', 'listbox');
    results?.querySelectorAll('button').forEach((button) => button.setAttribute('role', 'option'));
  };

  function enhanceAccessibility() {
    const tabs = document.querySelector('.tool-tabs');
    tabs?.setAttribute('role', 'tablist');
    tabs?.querySelectorAll('[data-p2-tab]').forEach((tab) => {
      const key = tab.dataset.p2Tab;
      tab.id = `tab-${key}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(state.phase2Tab === key));
      tab.setAttribute('aria-controls', `panel-${key}`);
      tab.tabIndex = state.phase2Tab === key ? 0 : -1;
      const panel = document.querySelector(`[data-panel="${key}"]`);
      if (panel) {
        panel.id = `panel-${key}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.hidden = state.phase2Tab !== key;
      }
    });
    document.querySelectorAll('[data-overlay]').forEach((button) => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    document.getElementById('siBtn')?.setAttribute('aria-pressed', String(state.unit === 'SI'));
    document.getElementById('impBtn')?.setAttribute('aria-pressed', String(state.unit === 'IMPERIAL'));
    document.getElementById('favoriteBtn')?.setAttribute('aria-pressed', String(isFavorite(currentEntry())));
    document.getElementById('checkResults')?.setAttribute('aria-live', 'polite');
    document.getElementById('toast')?.setAttribute('role', 'status');
    const search = document.getElementById('globalSearch');
    search?.setAttribute('role', 'combobox');
    search?.setAttribute('aria-autocomplete', 'list');
    search?.setAttribute('aria-controls', 'searchResults');
    search?.setAttribute('aria-expanded', document.getElementById('searchResults')?.classList.contains('show') ? 'true' : 'false');
    const diagnosticsToggle = document.getElementById('diagToggle');
    diagnosticsToggle?.setAttribute('aria-controls', 'diagBody');
    diagnosticsToggle?.setAttribute('aria-expanded', String(document.getElementById('diagBody')?.classList.contains('open')));
    if (diagnosticsToggle && !diagnosticsToggle.dataset.a11yBound) {
      diagnosticsToggle.dataset.a11yBound = 'true';
      diagnosticsToggle.addEventListener('click', () => diagnosticsToggle.setAttribute('aria-expanded', String(document.getElementById('diagBody')?.classList.contains('open'))));
    }
  }

  function renderDataStatus(entry) {
    const app = document.getElementById('app');
    if (!app) return;
    const audit = datasetAudit();
    const banner = document.createElement('section');
    banner.className = 'data-integrity-banner';
    banner.setAttribute('role', 'note');
    banner.innerHTML = `<strong>Screening data — independent audit incomplete.</strong> ${audit.verifiedGrades}/${audit.grades} grade records and ${audit.verifiedRequirementRecords}/${audit.requirementRecords} requirement records carry independent verification. A complete numerical assessment therefore returns PASS WITH WARNINGS at best. Always check the current controlled standard.`;
    app.prepend(banner);
    const edition = editionStatus(entry);
    if (edition) {
      const alert = document.createElement('section');
      alert.className = 'edition-alert';
      alert.innerHTML = `<strong>Superseded embedded edition.</strong> This record uses ${esc(entry.grade.specEdition)}. Review the current <a href="${edition.url}" target="_blank" rel="noopener noreferrer">${esc(edition.label)}</a> before use.`;
      banner.insertAdjacentElement('afterend', alert);
    }
  }

  const baseRender = render;
  render = function renderHardened() {
    baseRender();
    const entry = currentEntry();
    if (entry) renderDataStatus(entry);
    enhanceAccessibility();
  };

  window.__gradeSpecQA = {
    version: HARDENED_VERSION,
    audit: () => datasetAudit(),
    data: () => SPEC_DATA,
    state,
    findEntry,
    runCompliance: (input, entry, overlays = []) => runCompliance(input, entry, overlays),
    searchReverse: (criteria) => searchReverse(criteria),
    validateData: (data, options) => validateData(data, options),
    defaultCheckInput: (entry) => defaultCheckInput(entry),
    editionStatus
  };
})();
