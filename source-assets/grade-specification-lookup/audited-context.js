// Resolve the supplied editions using explicit order and specimen context.
// Requirements from other standards keep their existing screening behavior.
(() => {
  'use strict';
  const registry = {
    ASTM: { audit: A36_AUDIT, matches: (entry) => /A36(?:\b|_)/.test(entry.gradeKey), resolve: resolveAuditedA36 },
    CSA_G40_21: { audit: G40_AUDIT, matches: () => true, resolve: resolveAuditedG40 },
    CSA_Z245_1: { audit: Z245_AUDIT, matches: () => true, resolve: resolveAuditedZ245 }
  };
  let evaluationContext = null;
  const hasLimit = (limit) => limit && Number.isFinite(limit.value);
  const isImperial = () => state.unit === 'IMPERIAL';
  const UNIT_FACTORS = Object.freeze({
    mm: ENGINE.constants.MM_TO_IN,
    mm2: ENGINE.constants.MM_TO_IN ** 2,
    MPa: ENGINE.constants.MPA_TO_KSI,
    J: ENGINE.constants.J_TO_FTLBF
  });
  const unitName = (unit) => isImperial()
    ? ({ mm: 'in', mm2: 'in²', MPa: 'ksi', J: 'ft·lbf', degC: '°F' }[unit] || displayUnit(unit))
    : ({ mm2: 'mm²' }[unit] || displayUnit(unit));
  function toDisplayUnit(value, unit) {
    const numeric = finiteNumber(value);
    if (numeric === null) return null;
    if (!isImperial()) return numeric;
    if (unit === 'degC') return numeric * 9 / 5 + 32;
    return UNIT_FACTORS[unit] ? numeric * UNIT_FACTORS[unit] : numeric;
  }
  function toCanonicalUnit(value, unit) {
    const numeric = finiteNumber(value);
    if (numeric === null) return null;
    if (!isImperial()) return numeric;
    if (unit === 'degC') return (numeric - 32) * 5 / 9;
    return UNIT_FACTORS[unit] ? numeric / UNIT_FACTORS[unit] : numeric;
  }
  function inputValue(value, unit, decimals = null) {
    const converted = toDisplayUnit(value, unit);
    if (converted === null) return '';
    const places = decimals ?? ({ mm: 4, mm2: 5, MPa: 3, J: 3, degC: 2 }[unit] || 4);
    return Number(converted.toFixed(isImperial() ? places : Math.min(places, 4)));
  }
  function measurement(value, unit, decimals = null) {
    const converted = toDisplayUnit(value, unit);
    const places = decimals ?? ({ mm: 3, mm2: 5, MPa: 2, J: 2, degC: 1 }[unit] || 3);
    return `${fmtPlain(converted, places)} ${unitName(unit)}`;
  }
  // G40.20 Clause 6.6 invokes E29: round only the final observed/calculated result.
  // ASTM's official reporting guidance describes the half-to-even tie rule:
  // https://marketing.astm.org/acton/attachment/9652/f-0b75/0/-/-/-/SO08-DP.pdf
  const roundEven = (value, interval = 1) => {
    const quotient = value / interval, lower = Math.floor(quotient), fraction = quotient - lower;
    return (Math.abs(fraction - 0.5) < 1e-10 ? (lower % 2 === 0 ? lower : lower + 1) : Math.round(quotient)) * interval;
  };
  const g40Rounded = (value, limit) => {
    if (!Number.isFinite(value) || !hasLimit(limit)) return value;
    if (limit.unit === 'MPa') return roundEven(value, 5);
    if (limit.unit === 'J') return roundEven(value);
    const places = String(limit.value).split('.')[1]?.length || 0;
    const decimals = limit.unit === 'wt_pct' ? Math.max(2, places) : places;
    return roundEven(value, 10 ** -decimals);
  };
  const originalCheckLimit = ENGINE.checkLimit;
  ENGINE.checkLimit = function checkLimitAtRequiredPrecision(value, limit) {
    return originalCheckLimit.call(this, evaluationContext?.attachedBody === 'CSA_G40_21' ? g40Rounded(value, limit) : value, limit);
  };
  const auditedEntry = (entry) => {
    const record = registry[entry?.bodyKey];
    return record?.matches(entry) && entry.grade.specEdition === record.audit.edition ? record : null;
  };
  const settingsKey = (entry) => `gradeSpecAttachedEditionContext:v1:${entry.bodyKey}`;
  const settingsFor = (entry) => storageGet(settingsKey(entry), {});
  const numericKeys = ['widthMM', 'odMM', 'gaugeLengthMM', 'shapeFlangeThicknessMM', 'testTemperatureC', 'orderTemperatureC', 'nominalAreaMM2', 'orderedCvnEnergyJ', 'fusionLineOrderTemperatureC'];
  const booleanKeys = ['copperSpecified', 'floorPlate', 'manufacturerTestRequired', 'elongationConvertedTo50MM', 'sawWeldToughnessOrdered', 'ewFusionLineAtBodyTemperaturePassed'];
  function contextFor(entry, thicknessMM = state.thicknessMM, overrides = {}) {
    const saved = settingsFor(entry);
    const context = { ...saved, form: state.form, thicknessMM, unitBasis: state.unit, ...overrides };
    for (const key of numericKeys) context[key] = finiteNumber(context[key]);
    for (const key of booleanKeys) {
      if (context[key] === 'YES') context[key] = true;
      else if (context[key] === 'NO') context[key] = false;
      else if (typeof context[key] !== 'boolean') context[key] = undefined;
    }
    if (context.od !== undefined) context.odMM = finiteNumber(context.od);
    if (context.tMM !== undefined) context.thicknessMM = finiteNumber(context.tMM);
    context.flangeThicknessMM = context.shapeFlangeThicknessMM ?? finiteNumber(context.flangeThicknessMM);
    context.tensileSpecimen = context.tensileSpecimenType || context.tensileSpecimen;
    if (context.orderTemperatureC !== null) context.testTemperatureC = context.orderTemperatureC;
    if ((context.overlayKeys || []).some((key) => /SOUR/i.test(key))) context.serviceCondition = 'SOUR';
    context.attachedBody = entry.bodyKey;
    return context;
  }
  const textOf = (item) => typeof item === 'string' ? item : item?.text || item?.description || item?.label || item?.requirement || '';
  function evaluateStandard(entry, thicknessMM = state.thicknessMM, overrides = {}) {
    const record = auditedEntry(entry);
    if (!record) return null;
    const context = contextFor(entry, thicknessMM, overrides);
    const result = record.resolve(deepClone(entry.grade), context);
    return { ...result, context, audit: record.audit, missingContext: result.missingContext || [], manualChecks: result.manualChecks || [], contextNotes: result.contextNotes || [] };
  }
  function withContext(context, action) {
    const previous = evaluationContext;
    evaluationContext = context;
    try { return action(); } finally { evaluationContext = previous; }
  }
  const originalEffectiveFor = resolveEffectiveFor;
  resolveEffectiveFor = (entry, overlays = []) => {
    const assessment = evaluateStandard(entry, evaluationContext?.thicknessMM ?? state.thicknessMM, { ...(evaluationContext || {}), overlayKeys: [...overlays] });
    // Resolve the governing base standard before applying customer overlays.
    const effective = originalEffectiveFor(assessment ? { ...entry, grade: assessment.grade } : entry, overlays);
    return { ...effective, standardAssessment: assessment };
  };
  const originalResolveContext = resolveContext;
  resolveContext = (entry, thicknessMM = state.thicknessMM, overlays = state.activeOverlays) => withContext({ ...(evaluationContext || {}), thicknessMM }, () => {
    const resolved = originalResolveContext(entry, thicknessMM, overlays);
    return { ...resolved, form: resolved.standardAssessment?.context.form || resolved.form };
  });
  const originalRunCompliance = runCompliance;
  runCompliance = (input, entry, overlays = state.activeOverlays) => {
    if (!auditedEntry(entry)) return originalRunCompliance(input, entry, overlays);
    const context = contextFor(entry, finiteNumber(input.tMM) ?? state.thicknessMM, { ...input, ...(input.standardContext || {}), overlayKeys: [...overlays] });
    return withContext(context, () => {
      const processed = { ...input };
      if (context.odMM !== null) processed.od = context.odMM;
      if (entry.bodyKey === 'CSA_Z245_1') {
        for (const key of ['ys', 'uts']) {
          const number = finiteNumber(input[key]);
          if (number !== null && number >= 0) processed[key] = Math.round(number);
        }
      }
      if (entry.bodyKey === 'CSA_G40_21') for (const key of ['ys', 'uts']) {
        const value = finiteNumber(input[key]);
        if (value !== null && value >= 0) processed[key] = roundEven(value, 5);
      }
      const report = originalRunCompliance(processed, entry, overlays);
      if (['CSA_Z245_1', 'CSA_G40_21'].includes(entry.bodyKey)) report.results = report.results.filter((row) => row.name !== 'Pcm');
      const extraErrors = [];
      if (finiteNumber(input.ys) !== null && finiteNumber(input.uts) !== null && Number(input.ys) > Number(input.uts)) extraErrors.push('Yield strength cannot exceed tensile strength.');
      for (const key of ['shear1', 'shear2', 'shear3', 'dwtt1', 'dwtt2', 'orderAverageShear']) {
        const value = finiteNumber(input[key]);
        if (value !== null && (value < 0 || value > 100)) extraErrors.push(`${key}: shear area must be between 0 and 100%.`);
      }
      if (extraErrors.length) { report.inputErrors = [...new Set([...(report.inputErrors || []), ...extraErrors])]; report.verdict = 'INVALID_INPUT'; }
      const baseAssessment = evaluateStandard(entry, context.thicknessMM, context);
      const assessment = entry.bodyKey === 'CSA_Z245_1'
        ? evaluateAuditedZ245(processed, context, entry.grade, { ...baseAssessment, grade: resolveContext(entry, context.thicknessMM, overlays).grade })
        : baseAssessment;
      if (entry.bodyKey === 'CSA_Z245_1') {
        report.coverage.missing = report.coverage.missing.filter((label) => label !== 'DWTT average shear area');
        report.results = report.results.filter((row) => row.name !== 'Pcm');
        for (const row of report.results) if (row.name === 'CE_IIW') row.name = 'CSA carbon equivalent';
      }
      if (entry.bodyKey === 'ASTM') report.results = report.results.filter((row) => row.category !== 'Carbon equivalent');
      const missing = assessment.missingContext.map(textOf).filter(Boolean);
      const manual = assessment.manualChecks.map(textOf).filter(Boolean);
      report.coverage.missing = [...new Set([...report.coverage.missing, ...missing.map((label) => `Standard context: ${label}`)])];
      report.coverage.required += missing.length;
      report.standardAssessment = { edition: entry.grade.specEdition, missingContext: missing, manualChecks: manual, contextNotes: assessment.contextNotes.map(textOf), context };
      if (assessment.additionalChecks?.length) {
        const replaced = new Set(assessment.replaceCategories || []);
        if (replaced.size) report.results = report.results.filter((row) => !replaced.has(row.category));
        report.results.push(...assessment.additionalChecks.map((row) => resultRow(row.name, row.value ?? '', typeof row.limit === 'object' ? row.limit : null, row.status, row.detail, { clauseRef: row.clauseRef || '', category: row.category || 'Standard applicability', verified: true })));
      }
      for (const item of assessment.manualChecks) {
        report.results.push(resultRow('Documented requirement', '', null, 'WARN', textOf(item), { clauseRef: item?.clauseRef || '', verified: true, category: 'Standard applicability' }));
      }
      if (manual.length) report.warnings.push(`${manual.length} documented requirements need review; numerical screening does not establish full standard compliance.`);
      if (missing.length) report.warnings.unshift(`Resolve ${missing.length} standard-specific context item${missing.length === 1 ? '' : 's'} before accepting this assessment.`);
      if (!['FAIL', 'INVALID_INPUT'].includes(report.verdict)) {
        if (report.coverage.missing.length) report.verdict = 'INCOMPLETE';
        else if (manual.length) report.verdict = 'PASS_WITH_WARNINGS';
      }
      report.failures = report.results.filter((row) => row.status === 'FAIL').length;
      report.unverified = [...new Set(report.results.filter((row) => row.verified === false && ['PASS', 'FAIL', 'WARN', 'INFO'].includes(row.status)).map((row) => `${row.name} — ${row.clauseRef || 'UNKNOWN'}`))];
      if (!report.unverified.length) report.warnings = report.warnings.filter((warning) => !/requirement values involved.*not been independently verified/.test(warning));
      report.coverage.provided = Math.max(0, report.coverage.required - report.coverage.missing.length);
      if (report.verdict !== 'INVALID_INPUT' && report.failures) report.verdict = 'FAIL';
      else if (report.verdict === 'FAIL') report.verdict = report.coverage.missing.length ? 'INCOMPLETE' : report.warnings.length || report.unverified.length ? 'PASS_WITH_WARNINGS' : 'PASS';
      if (entry.bodyKey === 'CSA_Z245_1' && (processed.ys !== input.ys || processed.uts !== input.uts)) {
        report.standardAssessment.contextNotes.push('Strength comparisons use results rounded to the nearest MPa under CSA Z245.1:26, Clause 7.2.1.');
      }
      if (entry.bodyKey === 'CSA_G40_21') {
        report.results.push(resultRow('Result rounding', '', null, 'INFO', 'G40.20 Clause 6.6: strength results are rounded to the nearest 5 MPa; other results use the specified final-place precision under ASTM E29. Final CVN mean and individual observations use whole joules; derived two-thirds thresholds are retained, with fractional-boundary interpretation documented for review.', { clauseRef: 'CSA G40.20-13, Clause 6.6', category: 'Standard applicability', verified: true }));
      }
      report.meta = { ...report.meta, standardContext: context, attachedEditionAudit: true, contextSelection: JSON.stringify(settingsFor(entry)) };
      return report;
    });
  };

  // Order dimensions are distinct from test-specimen dimensions and actual CVN temperature.
  Object.assign(PHASE2_FIELDS, {
    PRODUCT_WIDTH: 'Product width (mm)', GAUGE_LENGTH: 'Tensile gauge length (mm)',
    FLANGE_THICKNESS: 'Shape flange thickness (mm)', ORDER_TEMPERATURE: 'Ordered toughness temperature (°C)',
    CVN_SHEAR_1: 'CVN specimen 1 shear area (%)', CVN_SHEAR_2: 'CVN specimen 2 shear area (%)', CVN_SHEAR_3: 'CVN specimen 3 shear area (%)',
    DWTT_1: 'DWTT specimen 1 shear area (%)', DWTT_2: 'DWTT specimen 2 shear area (%)', ORDER_HEATS: 'Number of heats in order', ORDER_SHEAR: 'Order average shear area (%)'
  });
  const originalAutoMap = autoMapHeader;
  autoMapHeader = (header, entry) => {
    const normalized = String(header).toUpperCase().replace(/[^A-Z0-9]+/g, '');
    const fields = { PRODUCTWIDTH: 'PRODUCT_WIDTH', PLATEWIDTH: 'PRODUCT_WIDTH', GAUGELENGTH: 'GAUGE_LENGTH', TENSILEGAUGELENGTH: 'GAUGE_LENGTH', FLANGETHICKNESS: 'FLANGE_THICKNESS', ORDERTEMPERATURE: 'ORDER_TEMPERATURE', ORDEREDTOUGHNESSTEMPERATURE: 'ORDER_TEMPERATURE', CVNSHEAR1: 'CVN_SHEAR_1', CVNSHEAR2: 'CVN_SHEAR_2', CVNSHEAR3: 'CVN_SHEAR_3' };
    Object.assign(fields, { DWTTSHEAR1: 'DWTT_1', DWTTSHEAR2: 'DWTT_2', DWTT1: 'DWTT_1', DWTT2: 'DWTT_2', ORDERHEATCOUNT: 'ORDER_HEATS', ORDERAVERAGESHEAR: 'ORDER_SHEAR' });
    return fields[normalized] || originalAutoMap(header, entry);
  };
  const originalMapping = rowFromMapping;
  rowFromMapping = (row, mapping, entry) => {
    const input = originalMapping(row, mapping, entry);
    const fields = { PRODUCT_WIDTH: 'widthMM', GAUGE_LENGTH: 'gaugeLengthMM', FLANGE_THICKNESS: 'shapeFlangeThicknessMM', ORDER_TEMPERATURE: 'orderTemperatureC', CVN_SHEAR_1: 'shear1', CVN_SHEAR_2: 'shear2', CVN_SHEAR_3: 'shear3', DWTT_1: 'dwtt1', DWTT_2: 'dwtt2', ORDER_HEATS: 'orderHeatCount', ORDER_SHEAR: 'orderAverageShear' };
    for (const [index, target] of Object.entries(mapping)) if (fields[target]) input[fields[target]] = row[Number(index)] ?? '';
    return input;
  };

  const originalCE = ENGINE.computeCE;
  ENGINE.computeCE = function computeCEFromGoverningStandard(chemistry, section) {
    if (!/tanh|CSA_CE/.test(section.ceIiw.formula)) {
      const calculation = originalCE.call(this, chemistry, section);
      if (section.selectionRule.type === 'ALWAYS_IIW') return { ...calculation, governing: 'CE_IIW', limit: section.ceIiw.limit };
      return calculation;
    }
    const calculation = computeAuditedZ245CE(chemistry);
    const iiw = { ...calculation, scope: chemistry, value: calculation.value, expression: section.ceIiw.formula };
    const pcm = { value: null, symbols: [], scope: {}, expression: 'Not a CSA Z245.1:26 acceptance equation' };
    return { ceIiw: calculation.value, cePcm: null, iiw, pcm, governing: 'CE_IIW', limit: section.ceIiw.limit, selectionRule: section.selectionRule };
  };
  const originalFormulaWithValues = ENGINE.formulaWithValues;
  ENGINE.formulaWithValues = function formulaWithStandardFactor(formula, scope) {
    const result = originalFormulaWithValues.call(this, formula, scope);
    return /tanh|CSA_CE/.test(formula) ? `${result} · F = ${fmtPlain(computeAuditedZ245CE(scope).F, 5)}` : result;
  };
  const originalBindCE = bindCE;
  const originalInputElements = inputChemElements;
  inputChemElements = (entry) => auditedEntry(entry)
    ? [...new Set([...Object.keys(entry.grade.chemistry.elements), ...(entry.bodyKey === 'ASTM' ? [] : numericElementsFromFormula(entry.grade.chemistry.carbonEquivalent.ceIiw.formula))])]
    : originalInputElements(entry);
  const originalCEPanel = renderCEPanel;
  renderCEPanel = (entry) => {
    if (!auditedEntry(entry)) return originalCEPanel(entry);
    if (entry.bodyKey !== 'ASTM') {
      const section = entry.grade.chemistry.carbonEquivalent;
      return originalCEPanel({ ...entry, grade: { ...entry.grade, chemistry: { ...entry.grade.chemistry, carbonEquivalent: { ...section, cePcm: { ...section.cePcm, formula: '' } } } } });
    }
    return `<section class="tool-panel ${state.phase2Tab === 'ce' ? 'active' : ''}" data-panel="ce" id="calculators"><div class="p2-section-head"><h2>Carbon equivalent</h2></div><div class="p2-card" id="ceOutput">ASTM A36/A36M-19 does not specify a base carbon-equivalent acceptance equation or maximum. Apply any welding or purchase-order criteria separately.</div></section>`;
  };
  bindCE = (entry) => {
    if (entry.bodyKey === 'ASTM' && auditedEntry(entry)) return;
    if (!['CSA_Z245_1', 'CSA_G40_21'].includes(entry.bodyKey)) return originalBindCE(entry);
    const update = () => {
      const chemistry = {};
      document.querySelectorAll('[data-ce-el]').forEach((input) => { const value = finiteNumber(input.value); if (value !== null) chemistry[input.dataset.ceEl] = value; });
      storageSet('gradeSpecCalc:ce', chemistry);
      const section = resolveContext(entry).grade.chemistry.carbonEquivalent;
      const required = numericElementsFromFormula(section.ceIiw.formula);
      const missing = required.filter((element) => finiteNumber(chemistry[element]) === null);
      const output = document.getElementById('ceOutput');
      if (!output) return;
      if (missing.length) { output.innerHTML = `<div class="p2-empty">Enter all CSA equation inputs. Missing: ${missing.map(esc).join(', ')}.</div>`; return; }
      const calculation = entry.bodyKey === 'CSA_Z245_1' ? computeAuditedZ245CE(chemistry) : ENGINE.computeCE(chemistry, section).iiw;
      const check = ENGINE.checkLimit(entry.bodyKey === 'CSA_G40_21' ? g40Rounded(calculation.value, section.ceIiw.limit) : calculation.value, section.ceIiw.limit);
      output.innerHTML = `<div class="calc-result wide"><span>${entry.bodyKey === 'CSA_Z245_1' ? 'CSA carbon equivalent' : 'IIW carbon equivalent'}</span><strong class="mono">${fmtPlain(calculation.value, 4)}</strong><code>${esc(section.ceIiw.formula)}</code>${entry.bodyKey === 'CSA_Z245_1' ? `<p>Carbon-dependent factor F = ${fmtPlain(calculation.F, 5)}.</p>` : ''}${hasLimit(section.ceIiw.limit) ? `${renderLimit(section.ceIiw.limit)} <span class="status-pill ${check.status.toLowerCase()}">${check.status}</span>` : '<p>An acceptance maximum must be specified in the order where applicable.</p>'}</div>`;
    };
    document.querySelectorAll('[data-ce-el]').forEach((input) => input.addEventListener('input', update));
    update();
  };
  const originalCollected = collectComplianceInput;
  collectComplianceInput = (entry) => {
    const input = originalCollected(entry);
    for (const [key, id] of Object.entries({ shear1: 'checkShear1', shear2: 'checkShear2', shear3: 'checkShear3', dwtt1: 'checkDWTT1', dwtt2: 'checkDWTT2', orderHeatCount: 'checkOrderHeats', orderAverageShear: 'checkOrderShear' })) input[key] = document.getElementById(id)?.value ?? '';
    return input;
  };
  const originalCheckState = getCheckState;
  getCheckState = (entry) => {
    const saved = originalCheckState(entry);
    if (auditedEntry(entry) && saved.lastResult && (!saved.lastResult.meta?.attachedEditionAudit || saved.lastResult.meta?.specEdition !== entry.grade.specEdition || saved.lastResult.meta?.form !== state.form || saved.lastResult.meta?.standardContext?.unitBasis !== state.unit || saved.lastResult.meta?.contextSelection !== JSON.stringify(settingsFor(entry)))) saved.lastResult = null;
    return saved;
  };
  const originalCompliancePanel = renderCompliancePanel;
  renderCompliancePanel = (entry) => {
    const assessment = evaluateStandard(entry, finiteNumber(getCheckState(entry).tMM) ?? state.thicknessMM);
    let html = originalCompliancePanel(assessment ? { ...entry, grade: assessment.grade } : entry);
    if (entry.bodyKey === 'CSA_Z245_1') {
      const saved = getCheckState(entry);
      const shear = `<div class="p2-card"><h3>Charpy shear area</h3><div class="p2-grid three">${numberInput('checkShear1', 'Specimen 1 shear area (%)', saved.shear1, 'min="0" max="100" step="0.1"')}${numberInput('checkShear2', 'Specimen 2 shear area (%)', saved.shear2, 'min="0" max="100" step="0.1"')}${numberInput('checkShear3', 'Specimen 3 shear area (%)', saved.shear3, 'min="0" max="100" step="0.1"')}</div><p class="field-note">Complete where the selected category and diameter require CVN shear-area assessment. Order-wide shear requirements need the full documented test population.</p></div>`;
      html = html.replace('<div class="p2-card paste-card">', `${shear}<div class="p2-card paste-card">`);
      html = html.replace(numberInput('checkDWTTShear', 'Average shear area (%)', saved.dwttShear, 'step="0.1" min="0" max="100"'), '');
      html = html.replace('<div class="p2-card paste-card">', `<div class="p2-card"><h3>DWTT and order shear</h3><div class="p2-grid">${numberInput('checkDWTT1', 'DWTT specimen 1 shear area (%)', saved.dwtt1, 'min="0" max="100" step="0.1"')}${numberInput('checkDWTT2', 'DWTT specimen 2 shear area (%)', saved.dwtt2, 'min="0" max="100" step="0.1"')}${numberInput('checkOrderHeats', 'Number of heats in order', finiteNumber(saved.orderHeatCount) ?? settingsFor(entry).orderHeatCount, 'min="1" step="1"')}${numberInput('checkOrderShear', 'Order average shear area (%)', finiteNumber(saved.orderAverageShear) ?? settingsFor(entry).orderAverageShear, 'min="0" max="100" step="0.1"')}</div></div><div class="p2-card paste-card">`);
    }
    if (auditedEntry(entry)) html = html.replace('<option value="CUSTOM"', '<option value="10x6.7">2/3 size · verify geometry</option><option value="10x3.3">1/3 size · verify geometry</option><option value="10x2.5">1/4 size · verify geometry</option><option value="CUSTOM"');
    return html;
  };
  const originalCharpyPanel = renderCharpyCalcPanel;
  const originalBindCharpy = bindCharpyCalc;
  renderCharpyCalcPanel = (entry) => {
    const assessment = evaluateStandard(entry);
    if (assessment && (!assessment.grade.charpy.required || !hasLimit(assessment.grade.charpy.energyFullSize.average.min))) {
      return `<section class="tool-panel ${state.phase2Tab === 'charpycalc' ? 'active' : ''}" data-panel="charpycalc"><div class="p2-section-head"><h2>Charpy requirements</h2></div><div class="p2-card"><p>No resolved base Charpy acceptance requirement applies to this selection. Where impact testing is ordered, enter the agreed temperature, energies, specimen basis and applicable referenced test requirements before assessment.</p></div></section>`;
    }
    let html = originalCharpyPanel(entry);
    if (assessment) html = html.replace('<option value="CUSTOM"', '<option value="10x6.7">2/3 size · verify specimen geometry</option><option value="10x3.3">1/3 size · verify specimen geometry</option><option value="10x2.5">1/4 size · verify specimen geometry</option><option value="CUSTOM"');
    return html;
  };
  bindCharpyCalc = (entry) => { if (document.getElementById('charpyCalcSize')) originalBindCharpy(entry); };

  const originalElongPanel = renderElongPanel;
  const originalBindElong = bindElong;
  renderElongPanel = (entry) => {
    if (!auditedEntry(entry)) return originalElongPanel(entry);
    const saved = getCalcState('elong', { measured: '' });
    const area = entry.bodyKey === 'CSA_Z245_1' ? numberInput('elongNominalArea', 'Nominal specimen area (mm²)', settingsFor(entry).nominalAreaMM2, 'min="0.01" step="1"') : '';
    return `<section class="tool-panel ${state.phase2Tab === 'elongcalc' ? 'active' : ''}" data-panel="elongcalc"><div class="p2-section-head"><h2>Elongation requirement</h2></div><div class="p2-card"><div class="p2-grid">${area}${numberInput('elongMeasured', 'Measured elongation (%) on the selected gauge basis', saved.measured, 'min="0" step="0.1"')}</div><div id="elongOutput" class="calc-output"></div></div></section>`;
  };
  bindElong = (entry) => {
    if (!auditedEntry(entry)) return originalBindElong(entry);
    const update = () => {
      const measured = finiteNumber(document.getElementById('elongMeasured')?.value);
      storageSet('gradeSpecCalc:elong', { ...getCalcState('elong', {}), measured });
      const area = finiteNumber(document.getElementById('elongNominalArea')?.value);
      const assessment = evaluateStandard(entry, state.thicknessMM, entry.bodyKey === 'CSA_Z245_1' ? { nominalAreaMM2: area } : {});
      const row = resolveThicknessRow(assessment.grade, state.thicknessMM);
      const limit = row?.elongation?.fixedMin;
      const output = document.getElementById('elongOutput');
      if (!hasLimit(limit)) {
        output.innerHTML = `<div class="p2-empty">${assessment.missingContext.length ? 'Resolve the applicable order, product and specimen details to obtain an elongation requirement.' : 'No base elongation minimum is required for this product selection.'}</div>`;
        return;
      }
      const check = ENGINE.checkLimit(entry.bodyKey === 'CSA_G40_21' ? g40Rounded(measured, limit) : measured, limit);
      output.innerHTML = `<div class="calc-result wide"><span>Applicable minimum</span>${renderLimit(limit)}<p>${esc(limit.displayNote || '')}</p>${measured !== null ? `<span class="status-pill ${check.status.toLowerCase()}">${check.status === 'PASS' ? 'Meets displayed minimum' : 'Below displayed minimum'}</span>` : ''}<p>Comparison covers elongation only. Apply the selected gauge basis, test method and remaining order requirements.</p></div>`;
    };
    ['elongNominalArea', 'elongMeasured'].forEach((id) => document.getElementById(id)?.addEventListener('input', update));
    update();
  };

  renderHydroPanel = (entry) => {
    const context = resolveContext(entry, state.thicknessMM);
    const saved = getCalcState(`hydro:${entry.gradeKey}`, {});
    const configured = context.grade.testing.hydrotest.fiberStressPct.value;
    const od = finiteNumber(saved.od) ?? (entry.bodyKey === 'CSA_Z245_1' ? contextFor(entry).odMM : null);
    const thickness = finiteNumber(saved.thickness) ?? state.thicknessMM;
    const fiber = finiteNumber(saved.fiber) ?? (configured === null ? '' : configured * 100);
    const scopeWarning = configured === null && entry.bodyKey !== 'CSA_Z245_1'
      ? `<div class="input-warning"><strong>No grade default:</strong> ${esc(context.grade.testing.hydrotest.notes)} Enter a fiber-stress percentage only when the governing product specification or order supplies one.</div>`
      : '';
    return `<section class="tool-panel ${state.phase2Tab === 'hydro' ? 'active' : ''}" data-panel="hydro"><div class="p2-section-head"><div><div class="eyebrow">P = 2·S·t/D</div><h2>${entry.bodyKey === 'CSA_Z245_1' ? 'CSA mill hydrotest requirement' : 'Hydrotest Pressure Calculator'}</h2></div></div><div class="p2-card">${scopeWarning}<div class="p2-grid three">${numberInput('hydroOD', `${entry.bodyKey === 'CSA_Z245_1' ? 'Nominal ' : ''}outside diameter (${unitName('mm')})`, inputValue(od, 'mm'), `step="${isImperial() ? '0.001' : '0.01'}" min="0"`)}${numberInput('hydroThickness', `${entry.bodyKey === 'CSA_Z245_1' ? 'Nominal ' : ''}wall thickness (${unitName('mm')})`, inputValue(thickness, 'mm'), `step="${isImperial() ? '0.0001' : '0.001'}" min="0"`)}${entry.bodyKey === 'CSA_Z245_1' ? '' : numberInput('hydroFiber', 'Fiber stress (% SMYS)', fiber, 'step="0.1" min="0" max="100"')}</div><div id="hydroOutput" class="calc-output"></div></div></section>`;
  };
  bindHydro = (entry) => {
    const update = () => {
      const od = toCanonicalUnit(document.getElementById('hydroOD')?.value, 'mm');
      const thickness = toCanonicalUnit(document.getElementById('hydroThickness')?.value, 'mm');
      const fiber = finiteNumber(document.getElementById('hydroFiber')?.value);
      storageSet(`gradeSpecCalc:hydro:${entry.gradeKey}`, { od: od ?? '', thickness: thickness ?? '', ...(entry.bodyKey === 'CSA_Z245_1' ? {} : { fiber: fiber ?? '' }) });
      const output = document.getElementById('hydroOutput');
      if (entry.bodyKey === 'CSA_Z245_1') {
        const context = contextFor(entry, thickness, { odMM: od });
        if (od === null || thickness === null || od < 21.3 || od > 2032 || thickness <= 0 || thickness >= od / 2 || !entry.grade.applicableForms.includes(context.form)) {
          output.innerHTML = `<div class="p2-empty">Select the pipe manufacturing method and enter valid nominal OD and wall dimensions within ${measurement(21.3, 'mm', isImperial() ? 3 : 1)} to ${measurement(2032, 'mm', isImperial() ? 3 : 0)} OD.</div>`;
          return;
        }
        const calculation = computeAuditedZ245Hydro(context, Number(entry.grade.displayName.match(/Grade\s+(\d+)/)?.[1]));
        const pressure = isImperial()
          ? `${fmtPlain(calculation.minimumPressureMPa * ENGINE.constants.MPA_TO_PSI, 0)} psi`
          : `${fmtPlain(calculation.minimumPressureMPa, 1)} MPa`;
        output.innerHTML = `<div class="calc-result wide"><span>Minimum mill test pressure</span><strong class="mono">${pressure}</strong><p>${calculation.tablePressureMPa !== null ? 'Listed Table 1 pressure applies.' : `Calculated using ${fmtPlain(calculation.fiberStressFraction * 100, 0)}% of SMYS, rounded in the governing standard and limited by the applicable Table 1 cap.`}</p><p>Hold at least ${calculation.holdSeconds} seconds; each finished length must have no leakage.</p><p>${esc(calculation.scope)} This is a mill acceptance test, not a design or working-pressure rating.</p><span class="clause">${esc(calculation.clauseRef)}</span></div>`;
        return;
      }
      const context = resolveContext(entry, thickness || state.thicknessMM);
      const smys = context.row?.yieldStrength.min?.value;
      const calculation = ENGINE.hydro(smys, thickness, od, fiber === null ? null : fiber / 100);
      const hydro = context.grade.testing.hydrotest;
      if (!calculation) { output.innerHTML = '<div class="p2-empty">Enter OD, thickness, and a fiber-stress percentage greater than 0 and no greater than 100.</div>'; return; }
      const pressure = isImperial()
        ? `<div><span>Raw</span><strong class="mono">${fmtPlain(calculation.rawPsi, 2)} psi</strong></div><div><span>Rounded display</span><strong class="mono">${fmtPlain(calculation.roundedPsi, 0)} psi</strong></div>`
        : `<div><span>Raw</span><strong class="mono">${fmtPlain(calculation.rawMPa, 5)} MPa · ${fmtPlain(calculation.rawKPa, 1)} kPa</strong></div><div><span>Rounded display</span><strong class="mono">${fmtPlain(calculation.roundedMPa, 2)} MPa · ${fmtPlain(calculation.roundedKPa, 0)} kPa</strong></div>`;
      output.innerHTML = `<div class="calc-result wide"><span>Resolved SMYS</span><strong class="mono">${measurement(smys, 'MPa', 2)}</strong><code>P = 2 × (${fmtPlain(toDisplayUnit(smys, 'MPa'), 2)} × ${fmtPlain(fiber / 100, 4)}) × ${fmtPlain(toDisplayUnit(thickness, 'mm'), 4)} / ${fmtPlain(toDisplayUnit(od, 'mm'), 4)}</code><div class="calc-grid">${pressure}</div><p><span class="clause">${esc(hydro.fiberStressPct.clauseRef)}</span> ${!hydro.fiberStressPct.verified ? '<span class="verify">⚠ verify</span>' : ''}</p></div>`;
    };
    ['hydroOD', 'hydroThickness', 'hydroFiber'].forEach((id) => document.getElementById(id)?.addEventListener('input', update));
    update();
  };

  renderReversePanel = () => {
    const saved = getCalcState('reverse', { ys: 359, uts: '', cvn: '', temp: '', thickness: 15, form: state.form || 'ALL' });
    const forms = [{ value: 'ALL', label: 'All product forms' }, ...[...ENUMS.forms].map((form) => ({ value: form, label: formatForm(form) }))];
    if (!saved.form) saved.form = state.form || 'ALL';
    return `<section class="tool-panel ${state.phase2Tab === 'reverse' ? 'active' : ''}" data-panel="reverse" id="reverseLookup"><div class="p2-section-head"><div><div class="eyebrow">Cross-spec screening</div><h2>What Grade Meets This?</h2></div><button class="btn primary" id="runReverseBtn">Search grades</button></div><div class="p2-card"><div class="p2-grid">${selectInput('reverseForm', 'Product form', forms, saved.form)}${numberInput('reverseYS', `Required YS min (${unitName('MPa')})`, inputValue(saved.ys, 'MPa'), 'step="0.1"')}${numberInput('reverseUTS', `Required UTS min (${unitName('MPa')}, optional)`, inputValue(saved.uts, 'MPa'), 'step="0.1"')}${numberInput('reverseCVN', `Required CVN average (${unitName('J')}, optional)`, inputValue(saved.cvn, 'J'), 'step="0.1"')}${numberInput('reverseTemp', `Maximum test temperature (${unitName('degC')}, optional)`, inputValue(saved.temp, 'degC'), 'step="1"')}${numberInput('reverseThickness', `Material thickness (${unitName('mm')})`, inputValue(saved.thickness, 'mm'), `step="${isImperial() ? '0.0001' : '0.001'}" min="0"`)}</div><p class="form-filter-note">Results are screened by product form and show data-verification status. A match is not an equivalency determination.</p><div id="reverseResults" class="calc-output" aria-live="polite"></div></div></section>`;
  };
  bindReverse = () => {
    const run = () => {
      const criteria = {
        form: document.getElementById('reverseForm')?.value || 'ALL',
        ys: toCanonicalUnit(document.getElementById('reverseYS')?.value, 'MPa'),
        uts: toCanonicalUnit(document.getElementById('reverseUTS')?.value, 'MPa'),
        cvn: toCanonicalUnit(document.getElementById('reverseCVN')?.value, 'J'),
        temp: toCanonicalUnit(document.getElementById('reverseTemp')?.value, 'degC'),
        thickness: toCanonicalUnit(document.getElementById('reverseThickness')?.value, 'mm')
      };
      const stored = Object.fromEntries(Object.entries(criteria).map(([key, value]) => [key, value === null ? '' : value]));
      storageSet('gradeSpecCalc:reverse', stored);
      const hits = searchReverse(criteria);
      const output = document.getElementById('reverseResults');
      output.innerHTML = hits.length ? `<div class="table-wrap"><table class="spec-table reverse-table"><thead><tr><th>Grade</th><th>Spec / edition</th><th>Product forms</th><th>YS min</th><th>UTS min</th><th>CVN / temp</th><th>YS margin</th><th>Data status</th><th></th></tr></thead><tbody>${hits.map((hit) => `<tr class="${hit.unverified ? 'reverse-unverified' : ''}"><td><strong>${esc(hit.entry.grade.displayName)}</strong></td><td>${esc(hit.entry.bodyName)}<br><small>${esc(hit.entry.grade.specEdition)}</small></td><td>${hit.entry.grade.applicableForms.map((item) => esc(formatForm(item))).join(', ')}</td><td>${renderLimit(hit.ctx.row.yieldStrength.min)}</td><td>${renderLimit(hit.ctx.row.tensileStrength.min)}</td><td>${hit.ctx.grade.charpy.required ? `${renderLimit(hit.ctx.grade.charpy.energyFullSize.average.min)}<br>${renderScalar(hit.ctx.grade.charpy.testTemp, { kind: 'MAX' })}` : 'Not mandatory'}</td><td class="mono">+${measurement(hit.margin, 'MPa', 2)}</td><td class="data-status-cell">${hit.edition ? 'Superseded edition<br>' : ''}${hit.unverified ? '⚠ Unverified' : 'Verified'}</td><td><button class="btn" data-open-body="${hit.entry.bodyKey}" data-open-grade="${hit.entry.gradeKey}">Open</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="p2-empty">No grades meet all entered criteria for the selected product form.</div>';
      document.querySelectorAll('[data-open-grade]').forEach((button) => {
        button.onclick = () => {
          const selected = findEntry({ bodyKey: button.dataset.openBody, gradeKey: button.dataset.openGrade });
          if (selected) { selectEntry(selected); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        };
      });
    };
    document.getElementById('runReverseBtn').onclick = run;
  };

  const originalHydroPanel = renderHydroPanel;
  const originalBindHydro = bindHydro;
  renderHydroPanel = (entry) => {
    if (entry.bodyKey !== 'CSA_Z245_1') return originalHydroPanel(entry);
    const context = contextFor(entry), saved = getCalcState(`hydro:${entry.gradeKey}`, {});
    return `<section class="tool-panel ${state.phase2Tab === 'hydro' ? 'active' : ''}" data-panel="hydro"><div class="p2-section-head"><h2>CSA mill hydrotest requirement</h2></div><div class="p2-card"><div class="p2-grid">${numberInput('hydroOD', 'Nominal outside diameter (mm)', finiteNumber(saved.od) ?? context.odMM, 'min="21.3" max="2032" step="0.01"')}${numberInput('hydroThickness', 'Nominal wall thickness (mm)', finiteNumber(saved.thickness) ?? state.thicknessMM, 'min="0.01" step="0.01"')}</div><div id="hydroOutput" class="calc-output"></div></div></section>`;
  };
  bindHydro = (entry) => {
    if (entry.bodyKey !== 'CSA_Z245_1') return originalBindHydro(entry);
    const update = () => {
      const values = { od: document.getElementById('hydroOD').value, thickness: document.getElementById('hydroThickness').value };
      storageSet(`gradeSpecCalc:hydro:${entry.gradeKey}`, values);
      const od = finiteNumber(values.od), thickness = finiteNumber(values.thickness);
      const context = contextFor(entry, thickness, { odMM: od });
      const output = document.getElementById('hydroOutput');
      if (od === null || thickness === null || od < 21.3 || od > 2032 || thickness <= 0 || thickness >= od / 2 || !entry.grade.applicableForms.includes(context.form)) {
        output.innerHTML = '<div class="p2-empty">Select the pipe manufacturing method and enter valid nominal OD and wall dimensions within the standard scope.</div>'; return;
      }
      const calculation = computeAuditedZ245Hydro(context, Number(entry.grade.displayName.match(/Grade\s+(\d+)/)?.[1]));
      output.innerHTML = `<div class="calc-result wide"><span>Minimum mill test pressure</span><strong class="mono">${fmtPlain(calculation.minimumPressureMPa, 1)} MPa</strong><p>${calculation.tablePressureMPa !== null ? 'Listed Table 1 pressure applies.' : `Calculated using ${fmtPlain(calculation.fiberStressFraction * 100, 0)}% of SMYS, rounded to 0.1 MPa and limited by the applicable Table 1 cap.`}</p><p>Hold at least ${calculation.holdSeconds} seconds; each finished length must have no leakage.</p><p>${esc(calculation.scope)} This is a mill acceptance test, not a design or working-pressure rating.</p><span class="clause">${esc(calculation.clauseRef)}</span></div>`;
    };
    ['hydroOD', 'hydroThickness'].forEach((id) => document.getElementById(id)?.addEventListener('input', update));
    update();
  };

  searchReverse = (criteria) => {
    const ys = finiteNumber(criteria.ys), uts = finiteNumber(criteria.uts), cvn = finiteNumber(criteria.cvn), temp = finiteNumber(criteria.temp), thickness = finiteNumber(criteria.thickness);
    const form = criteria.form || 'ALL';
    if (ys === null || thickness === null || thickness <= 0) return [];
    const hits = [];
    for (const entry of allGrades()) {
      if (form !== 'ALL' && !entry.grade.applicableForms.includes(form)) continue;
      const productForm = form === 'ALL' ? (entry.grade.applicableForms.includes(state.form) ? state.form : entry.grade.applicableForms[0]) : form;
      const ctx = withContext({ form: productForm }, () => resolveContext(entry, thickness, [])), row = ctx.row;
      if (!row) continue;
      const y = row.yieldStrength.min?.value, u = row.tensileStrength.min?.value;
      const c = ctx.grade.charpy.energyFullSize.average.min?.value, ct = ctx.grade.charpy.testTemp?.value;
      if (y === null || y < ys || (uts !== null && (u === null || u < uts))) continue;
      if (cvn !== null && (!ctx.grade.charpy.required || c === null || c < cvn)) continue;
      if (temp !== null && (!ctx.grade.charpy.required || ct === null || ct > temp)) continue;
      const limits = [row.yieldStrength.min, ...(uts !== null ? [row.tensileStrength.min] : []), ...(cvn !== null ? [ctx.grade.charpy.energyFullSize.average.min] : []), ...(temp !== null ? [ctx.grade.charpy.testTemp] : [])];
      const gradeVerified = Boolean(entry.grade.verification?.lastVerifiedBy && entry.grade.verification?.lastVerifiedDate);
      const contextIncomplete = Boolean(ctx.standardAssessment?.missingContext.length);
      hits.push({ entry, ctx, ys: y, uts: u, cvn: c, temp: ct, margin: y - ys, contextIncomplete, unverified: !gradeVerified || contextIncomplete || limits.some((limit) => limit?.verified !== true), edition: window.__gradeSpecQA.editionStatus(entry) });
    }
    return hits.sort((a, b) => a.margin - b.margin || a.ys - b.ys || a.entry.grade.displayName.localeCompare(b.entry.grade.displayName));
  };
  const originalBindReverse = bindReverse;
  bindReverse = () => {
    originalBindReverse();
    document.getElementById('runReverseBtn')?.addEventListener('click', () => {
      document.querySelectorAll('.reverse-unverified').forEach((row) => {
        const button = row.querySelector('[data-open-grade]');
        const entry = button && findEntry({ bodyKey: button.dataset.openBody, gradeKey: button.dataset.openGrade });
        if (auditedEntry(entry)) row.querySelector('.data-status-cell').textContent = 'Context required';
      });
    });
  };
  const originalMechanical = renderMechanical;
  renderMechanical = (effective, compared) => {
    // The Z245 governing-requirements snapshot is the canonical mechanical
    // presentation. Do not repeat a second, partially resolved table below it.
    if (effective.grade.specEdition === Z245_AUDIT.edition) return '';
    const html = originalMechanical(effective, compared);
    const row = resolveThicknessRow(effective.grade, state.thicknessMM);
    if (!row || (row.tMax_mm < 1000000 && !effective.standardAssessment?.allThicknesses)) return html;
    const template = document.createElement('template');
    template.innerHTML = html;
    const range = template.content.querySelector('.thickness-context')?.children[1];
    if (range) range.textContent = 'Requirements resolved for the selected product and specimen context.';
    return template.innerHTML;
  };

  function option(id, label, values, saved) {
    return selectInput(id, label, [{ value: '', label: 'Select when applicable' }, ...values.map(([value, text]) => ({ value, label: text }))], saved === true ? 'YES' : saved === false ? 'NO' : saved ?? '');
  }
  function contextControls(entry, unresolved = false) {
    const saved = settingsFor(entry);
    const yesNo = [['NO', 'No'], ['YES', 'Yes']];
    const fields = [];
    if (entry.bodyKey === 'ASTM') {
      fields.push(numberInput('standardWidth', `Product width (${unitName('mm')})`, inputValue(saved.widthMM, 'mm'), `min="${isImperial() ? '0.0004' : '0.01'}" step="${isImperial() ? '0.0001' : '0.01'}"`));
      const gaugeOptions = isImperial()
        ? [['50', '1.969 in'], ['200', '7.874 in'], ['50.8', '2 in'], ['203.2', '8 in']]
        : [['50', '50 mm'], ['200', '200 mm'], ['50.8', '50.8 mm'], ['203.2', '203.2 mm']];
      fields.push(option('standardGauge', 'Tensile gauge length', gaugeOptions, saved.gaugeLengthMM));
      fields.push(numberInput('standardFlange', `Shape flange thickness (${unitName('mm')})`, inputValue(saved.shapeFlangeThicknessMM, 'mm'), `min="${isImperial() ? '0.0004' : '0.01'}" step="${isImperial() ? '0.0001' : '0.01'}"`));
      fields.push(option('standardShape', 'Structural shape type', [['OTHER', 'Other structural shape'], ['WIDE_FLANGE', 'Wide-flange shape']], saved.shapeDesignation));
      fields.push(option('standardCopper', 'Copper steel specified in order?', yesNo, saved.copperSpecified));
      fields.push(option('standardFloor', 'Floor plate?', yesNo, saved.floorPlate));
      fields.push(option('standardBearing', 'Bearing use', [['NONE', 'Not a bearing plate or bar'], ['BRIDGE', 'Bridge bearing'], ['NON_BRIDGE', 'Other bearing use']], saved.bearingUse));
      fields.push(option('standardManufacturerTest', 'Manufacturer tension test specified?', yesNo, saved.manufacturerTestRequired));
    } else {
      fields.push(numberInput('standardWidth', `Product width (${unitName('mm')}, where applicable)`, inputValue(saved.widthMM, 'mm'), `min="${isImperial() ? '0.0004' : '0.01'}" step="${isImperial() ? '0.0001' : '0.01'}"`));
      fields.push(numberInput('standardGauge', `Tensile gauge length (${unitName('mm')})`, inputValue(saved.gaugeLengthMM, 'mm'), `min="${isImperial() ? '0.0004' : '0.01'}" step="${isImperial() ? '0.0001' : '0.01'}"`));
      fields.push(option('standardSupply', 'Delivery / heat-treatment condition', entry.bodyKey === 'CSA_Z245_1' ? Z245_AUDIT.supplyConditions.map((item) => [item.value, item.label]) : [['AS_ROLLED', 'As rolled'], ['NORMALIZED', 'Normalized'], ['CONTROLLED_ROLLED', 'Controlled rolled'], ['NORMALIZING_ROLLED', 'Normalizing rolled'], ['QUENCHED_TEMPERED', 'Quenched and tempered']], saved.supplyCondition));
      fields.push(option('standardOrientation', 'Tensile orientation', [['LONGITUDINAL', 'Longitudinal'], ['TRANSVERSE', 'Transverse']], saved.tensileOrientation));
      fields.push(option('standardSpecimen', 'Tensile specimen', [['RECTANGULAR', 'Rectangular'], ['ROUND', 'Round'], ['FULL_SECTION', 'Full section'], ['FLATTENED_STRIP', 'Flattened strip'], ['OTHER', 'Other']], saved.tensileSpecimenType || saved.tensileSpecimen));
      if (entry.bodyKey === 'CSA_G40_21') {
        fields.push(option('standardImpactCategory', 'Ordered impact category', [['1', `Category 1 · ${measurement(0, 'degC', 0)}`], ['2', `Category 2 · ${measurement(-20, 'degC', 0)}`], ['3', `Category 3 · ${measurement(-30, 'degC', 0)}`], ['4', `Category 4 · ${measurement(-45, 'degC', 0)}`], ['5', 'Category 5 · agreed requirements']], saved.impactCategory));
        fields.push(option('standardSubtype', 'Product subtype', [['ROLLED', 'Rolled product'], ['WELDED_SHAPE', 'Welded structural shape'], ['SHEET_PILING', 'Sheet piling'], ['FLOOR_PLATE', 'Floor plate'], ['ANGLE', 'Angle']], saved.productSubtype));
        fields.push(numberInput('standardFlange', `Shape flange thickness (${unitName('mm')})`, inputValue(saved.shapeFlangeThicknessMM, 'mm'), `min="${isImperial() ? '0.0004' : '0.01'}" step="${isImperial() ? '0.0001' : '0.01'}"`));
        fields.push(option('standardShapeLocation', 'Shape tensile test location', [['FLANGE', 'Flange'], ['WEB', 'Web']], saved.shapeTestLocation));
        fields.push(option('standardShapeGroup', 'Structural shape size group', [['1', 'Group 1'], ['2', 'Group 2'], ['3', 'Group 3'], ['4', 'Group 4 · additional review'], ['5', 'Group 5 · additional review']], saved.shapeGroup));
      } else {
        fields.push(numberInput('standardOD', `Nominal outside diameter (${unitName('mm')})`, inputValue(saved.odMM, 'mm'), `min="${inputValue(21.3, 'mm')}" max="${inputValue(2032, 'mm')}" step="${isImperial() ? '0.001' : '0.01'}"`));
        fields.push(numberInput('standardOrderTemperature', `Ordered body toughness temperature (${unitName('degC')})`, inputValue(saved.orderTemperatureC, 'degC'), `step="${isImperial() ? '1' : '1'}"`));
        fields.push(numberInput('standardArea', `Nominal tensile specimen area (${unitName('mm2')})`, inputValue(saved.nominalAreaMM2, 'mm2'), `min="${isImperial() ? '0.00002' : '0.01'}" step="${isImperial() ? '0.0001' : '1'}"`));
        fields.push(option('standardElongationConverted', `Non-${measurement(50, 'mm', isImperial() ? 3 : 0)} elongation converted to ${measurement(50, 'mm', isImperial() ? 3 : 0)}?`, yesNo, saved.elongationConvertedTo50MM));
        fields.push(numberInput('standardOrderedEnergy', `Additional ordered CVN average energy (${unitName('J')})`, inputValue(saved.orderedCvnEnergyJ, 'J'), `min="0" step="${isImperial() ? '0.1' : '0.1'}"`));
        fields.push(option('standardToughnessTarget', 'Toughness test location', [['BODY', 'Pipe body'], ['SAW_WELD', 'SAW weld'], ['SAW_HAZ', 'SAW heat-affected zone'], ['EW_FUSION_LINE', 'EW fusion line'], ['EW_WELD_ZONE', 'EW weld zone']], saved.toughnessTarget));
        fields.push(numberInput('standardFusionLineTemp', `Ordered EW fusion-line temperature (${unitName('degC')})`, inputValue(saved.fusionLineOrderTemperatureC, 'degC'), 'step="1"'));
        fields.push(option('standardSawToughness', 'SAW weld / HAZ toughness ordered?', yesNo, saved.sawWeldToughnessOrdered));
        fields.push(option('standardEwWaiver', 'EW fusion-line tests passed at body temperature?', yesNo, saved.ewFusionLineAtBodyTemperaturePassed));
        fields.push(option('standardService', 'Service requirements in order', [['BASE', 'Base standard'], ['SOUR', 'Sour service'], ['ELEVATED', 'Elevated-temperature service'], ['STRAIN', 'Strain-based design']], saved.serviceCondition));
        fields.push(numberInput('standardOrderHeats', 'Number of heats in order', saved.orderHeatCount, 'min="1" step="1"'));
        fields.push(numberInput('standardOrderShear', 'Order average shear area (%) when ≥5 heats', saved.orderAverageShear, 'min="0" max="100" step="0.1"'));
      }
    }
    const needsContext = entry.bodyKey === 'CSA_Z245_1' && unresolved;
    return `<details class="standard-context-controls"><summary>Order & specimen details${needsContext ? ' — required to resolve conditional limits' : ''}</summary><div class="p2-grid">${fields.join('')}</div><button type="button" class="btn primary" id="applyStandardContext">Apply details</button><p class="field-note">Product dimensions select the requirement. Specimen dimensions and measured test temperature describe the test. Keep these separate.</p></details>`;
  }
  function requirementValue(value, unit) {
    const converted = ENGINE.convert(value, unit, state.unit);
    return `${fmtNumber(converted.value, converted.unit)} ${displayUnit(converted.unit)}`.trim();
  }
  function z245RequirementSnapshot(entry) {
    if (entry.bodyKey !== 'CSA_Z245_1') return '';
    const number = Number(entry.grade.displayName.match(/Grade\s+(\d+)/)?.[1]);
    const tensile = z245TensileValues(number);
    if (!tensile) return '';
    const category = String(entry.grade.category || '').replace('CAT_', '');
    const ratio = tensile[4] === tensile[5] ? String(tensile[4]) : `${tensile[4]} flattened strip / ${tensile[5]} other specimen`;
    const hardness = number >= 483 ? '30 HRC or 302 HV10' : '27 HRC or 279 HV10';
    const sourCap = number <= 386 ? 625 : number < 483 ? 650 : 665;
    const od457 = measurement(457, 'mm', isImperial() ? 3 : 0);
    const toughness = category === 'I'
      ? '<strong>Category I:</strong> no base requirement to demonstrate notch toughness.'
      : category === 'III'
        ? `<strong>Category III:</strong> ordered test temperature; full-size CVN average ≥${requirementValue(18, 'J')}; each specimen ≥${requirementValue(12, 'J')}; no base shear-area requirement.`
        : `<strong>Category II:</strong> ordered test temperature; full-size CVN average ≥${requirementValue(27, 'J')} for OD &lt;${od457} or ≥${requirementValue(40, 'J')} for OD ≥${od457}. At OD ≤${od457}, CVN shear average ≥60% and each specimen ≥50%. At OD &gt;${od457}, DWTT average ≥60% and each specimen ≥50%. Order average shear ≥85% when five or more heats are supplied.`;
    const intermediate = !Z245_AUDIT.standardGrades.includes(number)
      ? '<p class="snapshot-note">Intermediate grade: strength values are interpolated and rounded using the attached-edition rules.</p>'
      : '';
    const sour = number <= 483
      ? `<li><strong>Sour-service overlay:</strong> TS maximum ${requirementValue(sourCap, 'MPa')}; macrohardness ≤22 HRC/250 HV10; microhardness ≤250 HV0.5; nickel ≤1.0%. Other Clause 16 requirements remain mandatory.</li>`
      : '<li><strong>Sour-service scope:</strong> the attached edition limits sour-service grades to Grade 483 and below.</li>';
    const gauge50 = measurement(50, 'mm', isImperial() ? 3 : 0);
    const elongationFormula = isImperial()
      ? '<span class="formula">e = 1244.71 × A<sup>0.2</sup> ÷ U<sup>0.9</sup></span><p><strong>A</strong> = nominal specimen cross-sectional area in in², rounded to the nearest 0.00155 in² and capped at 0.775 in². <strong>U</strong> = the grade’s specified minimum tensile strength in ksi—not the measured tensile result. The equivalent Imperial expression preserves the governing formula and conversions. Round the calculated elongation to the nearest whole percent. A result on another gauge basis requires the specified ISO 2566-1 conversion or documented agreement.</p>'
      : '<span class="formula">e = 1940 × A<sup>0.2</sup> ÷ U<sup>0.9</sup></span><p><strong>A</strong> = nominal specimen cross-sectional area in mm², rounded to the nearest 1 mm² and capped at 500 mm². <strong>U</strong> = the grade’s specified minimum tensile strength in MPa—not the measured tensile result. Round the calculated elongation to the nearest whole percent. A result on another gauge basis requires the specified ISO 2566-1 conversion or documented agreement.</p>';
    return `<section class="z245-requirement-snapshot" id="z245RequirementSnapshot" aria-labelledby="z245SnapshotHeading"><div class="snapshot-heading"><h4 id="z245SnapshotHeading">Key calculated and conditional requirements</h4><span>CSA Z245.1:26 · Grade ${number} · Category ${category}</span></div>${intermediate}<div class="table-wrap"><table class="requirements-table snapshot-table"><thead><tr><th scope="col">Property</th><th scope="col">Minimum</th><th scope="col">Maximum</th><th scope="col">Applicability</th></tr></thead><tbody><tr><th scope="row">Yield strength</th><td>${requirementValue(tensile[0], 'MPa')}</td><td>${requirementValue(tensile[1], 'MPa')}</td><td>Maximum applies at OD ≥${measurement(219.1, 'mm', isImperial() ? 3 : 1)}</td></tr><tr><th scope="row">Tensile strength</th><td>${requirementValue(tensile[2], 'MPa')}</td><td>${requirementValue(tensile[3], 'MPa')}</td><td>Maximum applies at OD ≥${measurement(219.1, 'mm', isImperial() ? 3 : 1)}</td></tr><tr><th scope="row">Yield / tensile ratio</th><td>—</td><td>${esc(ratio)}</td><td>Applies at OD ≥${measurement(355.6, 'mm', isImperial() ? 3 : 1)}</td></tr><tr><th scope="row">Base hardness</th><td>—</td><td>${hardness}</td><td>Non-sour base requirement</td></tr></tbody></table></div><details class="snapshot-details"><summary><span class="snapshot-details-closed">Show additional requirements &amp; calculation details</span><span class="snapshot-details-open">Hide additional requirements &amp; calculation details</span></summary><div class="snapshot-details-body"><div class="snapshot-formula"><strong>Body elongation minimum (${gauge50} basis)</strong>${elongationFormula}</div><div class="snapshot-toughness">${toughness}</div><ul class="snapshot-conditions"><li><strong>Strength reporting:</strong> measured yield and tensile strength are rounded to the nearest ${measurement(1, 'MPa', isImperial() ? 3 : 0)}. Grades 241–620 use yield at 0.5% total extension under load; higher grades use 0.2% offset.</li><li><strong>Weld tension:</strong> applicable SAW weld specimens must meet the Table 8 tensile-strength requirement and at least 10% elongation on the ${gauge50} basis; applicable EW weld specimens require tensile strength. Body and weld tests are separate.</li><li><strong>Elevated service:</strong> where ordered and otherwise applicable, Table 8 permits only the maximum YS to increase—${measurement(75, 'MPa', isImperial() ? 1 : 0)} through Grade 448 or ${measurement(100, 'MPa', isImperial() ? 1 : 0)} above Grade 448. It does not increase maximum TS.</li><li><strong>CVN specimen rule:</strong> three adjacent specimens; at most one below the required average and none below two-thirds of it. Use the largest feasible specimen and the tabulated subsize factors.</li>${sour}<li><strong>Separate toughness locations:</strong> body, SAW weld, SAW HAZ, EW fusion line and EW weld zone have distinct applicability, temperature and waiver conditions.</li></ul><p class="snapshot-source">This snapshot covers key machine-readable limits; it is not a complete product-certification checklist. The detailed 69-topic source catalog below retains manufacturing, sampling, retest, NDE, dimensional, hydrotest, marking and certification conditions. Table 8 and Clauses 7.2, 7.6–7.8, 8.1–8.6 and 16.</p></div></details></section>`;
  }
  function catalogItems(audit) {
    const raw = audit.catalog || audit.requirements || [];
    return Array.isArray(raw) ? raw : Object.entries(raw).map(([topic, text]) => ({ topic, text }));
  }
  function renderStandardReference(entry) {
    const assessment = evaluateStandard(entry);
    if (!assessment) return '';
    const audit = assessment.audit;
    const missing = assessment.missingContext.map(textOf).filter(Boolean);
    const notes = assessment.contextNotes.map(textOf).filter(Boolean);
    const items = catalogItems(audit);
    const catalog = items.map((item) => `<li><strong>${esc(item.topic || item.title || item.id || 'Requirement')}</strong>${item.clauseRef || item.clause ? `<span class="standard-clause">${esc(item.clauseRef || item.clause)}</span>` : ''}<p>${esc(textOf(item))}</p></li>`).join('');
    return `<section class="card standard-reference" id="standardReference"><div class="card-head"><h3>Governing requirements</h3><span class="standard-edition">${esc(entry.grade.specEdition)}</span></div><div class="card-body"><p class="standard-source-note">Requirements checked against the supplied edition. Conditions in the order and referenced standards still apply.</p>${z245RequirementSnapshot(entry)}${missing.length ? `<p class="standard-context-status">To resolve this record: ${missing.map(esc).join('; ')}.</p>` : '<p class="standard-context-status resolved">Selection context resolved.</p>'}${notes.length ? `<ul class="standard-context-notes">${notes.map((text) => `<li>${esc(text)}</li>`).join('')}</ul>` : ''}${contextControls(entry, missing.length > 0)}<details class="standard-catalog"><summary>Detailed requirements & clause references <span>${items.length}</span></summary><ul>${catalog}</ul></details></div></section>`;
  }
  const originalRender = render;
  render = () => {
    originalRender();
    const entry = currentEntry();
    if (!auditedEntry(entry)) return;
    if (entry.bodyKey === 'CSA_Z245_1') {
      const od = document.getElementById('checkOD');
      if (od && finiteNumber(od.value) === null) od.value = settingsFor(entry).odMM ?? '';
    }
    document.querySelector('#app .grade-header')?.insertAdjacentHTML('afterend', renderStandardReference(entry));
    if (entry.bodyKey === 'CSA_Z245_1') {
      document.querySelectorAll('.anchor-bar a[href="#mechanical"]').forEach((link) => link.setAttribute('href', '#z245RequirementSnapshot'));
    }
    const banner = document.querySelector('.data-integrity-banner');
    if (banner) banner.innerHTML = '<div class="data-status-heading"><strong>Supplied edition checked</strong><span>Numerical screening; order and documentary requirements still apply.</span></div>';
    if (entry.bodyKey === 'ASTM') {
      const box = document.querySelector('#chemistry .formula-box');
      if (box) box.innerHTML = '<p class="field-note">No base carbon-equivalent acceptance maximum is specified in ASTM A36/A36M-19.</p>';
    }
    if (['CSA_Z245_1', 'CSA_G40_21'].includes(entry.bodyKey)) {
      document.querySelectorAll('#chemistry .formula-box .metric').forEach((metric) => {
        const label = metric.querySelector('.metric-label');
        if (label?.textContent === 'CE_IIW' && entry.bodyKey === 'CSA_Z245_1') label.textContent = 'CSA carbon equivalent';
        if (label?.textContent === 'Pcm') metric.remove();
      });
      document.querySelectorAll('#chemistry .formula-rule').forEach((rule) => {
        const label = rule.querySelector('strong');
        if (label?.textContent === 'Pcm') rule.remove();
        if (label?.textContent === 'CE_IIW' && entry.bodyKey === 'CSA_Z245_1') label.textContent = 'CSA carbon equivalent';
      });
      const selection = document.querySelector('#chemistry .formula-details > .subcard');
      if (selection) selection.textContent = entry.bodyKey === 'CSA_Z245_1' ? 'Use the CSA equation and its carbon-dependent factor F. Pcm and IIW are not acceptance equations for this edition.' : 'Use the IIW equation where an acceptance maximum applies. General grades require an agreed maximum; WM/WMT has the Clause 7.7 limit.';
    }
    document.getElementById('applyStandardContext')?.addEventListener('click', () => {
      const saved = settingsFor(entry);
      const fields = { standardWidth: 'widthMM', standardOD: 'odMM', standardGauge: 'gaugeLengthMM', standardFlange: 'shapeFlangeThicknessMM', standardShape: 'shapeDesignation', standardCopper: 'copperSpecified', standardFloor: 'floorPlate', standardBearing: 'bearingUse', standardManufacturerTest: 'manufacturerTestRequired', standardOrderTemperature: 'orderTemperatureC', standardImpactCategory: 'impactCategory', standardSupply: 'supplyCondition', standardOrientation: 'tensileOrientation', standardSpecimen: 'tensileSpecimenType', standardSubtype: 'productSubtype', standardShapeLocation: 'shapeTestLocation', standardShapeGroup: 'shapeGroup', standardArea: 'nominalAreaMM2', standardElongationConverted: 'elongationConvertedTo50MM', standardOrderedEnergy: 'orderedCvnEnergyJ', standardToughnessTarget: 'toughnessTarget', standardFusionLineTemp: 'fusionLineOrderTemperatureC', standardSawToughness: 'sawWeldToughnessOrdered', standardEwWaiver: 'ewFusionLineAtBodyTemperaturePassed', standardService: 'serviceCondition', standardOrderHeats: 'orderHeatCount', standardOrderShear: 'orderAverageShear' };
      const units = { standardWidth: 'mm', standardOD: 'mm', standardGauge: 'mm', standardFlange: 'mm', standardOrderTemperature: 'degC', standardArea: 'mm2', standardOrderedEnergy: 'J', standardFusionLineTemp: 'degC' };
      for (const [id, key] of Object.entries(fields)) {
        const input = document.getElementById(id);
        if (input) saved[key] = units[id] && input.tagName === 'INPUT' ? (toCanonicalUnit(input.value, units[id]) ?? '') : input.value;
      }
      storageSet(settingsKey(entry), saved);
      render();
    });
  };

  // Keep all editable values in the canonical SI data model. The selected unit
  // system affects every user-facing label/value and every value read from the UI.
  function localizeInputMarkup(html, specifications) {
    const template = document.createElement('template');
    template.innerHTML = html;
    for (const [id, specification] of Object.entries(specifications)) {
      const input = template.content.querySelector(`#${id}`);
      if (!input) continue;
      input.value = inputValue(input.value, specification.unit, specification.decimals);
      const label = input.closest('label')?.querySelector('span');
      if (label) label.textContent = `${specification.label} (${unitName(specification.unit)})`;
      if (specification.step) input.step = specification.step;
      if (specification.min !== undefined) input.min = inputValue(specification.min, specification.unit, specification.decimals);
      if (specification.max !== undefined) input.max = inputValue(specification.max, specification.unit, specification.decimals);
    }
    return template;
  }
  function charpySizeLabel(size, suffix = '') {
    const dimensions = String(size).split('x').map(Number);
    if (dimensions.length !== 2 || dimensions.some((value) => !Number.isFinite(value))) return suffix || size;
    const values = dimensions.map((value) => fmtPlain(toDisplayUnit(value, 'mm'), isImperial() ? 3 : 1));
    return `${values.join(' × ')} ${unitName('mm')}${suffix ? ` · ${suffix}` : ''}`;
  }
  function localizeCharpyOptions(template, selectId) {
    const select = template.content.querySelector(`#${selectId}`);
    if (!select) return;
    for (const option of select.options) {
      if (/^10x/.test(option.value)) {
        const qualifier = /verify/i.test(option.textContent) ? 'verify geometry' : '';
        option.textContent = charpySizeLabel(option.value, qualifier);
      }
    }
  }
  function localizeNarrative(text) {
    if (!isImperial()) return text;
    const pattern = /(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(mm²|MPa|°C|J|mm)(?![\w²])/g;
    return String(text).replace(pattern, (match, raw, unit) => {
      const value = Number(raw.replaceAll(',', ''));
      const key = unit === 'mm²' ? 'mm2' : unit;
      return measurement(value, key, key === 'mm' || key === 'mm2' ? 4 : key === 'degC' ? 1 : 2);
    });
  }
  const canonicalRenderLimit = renderLimit;
  renderLimit = (...args) => {
    const markup = canonicalRenderLimit(...args);
    if (!isImperial()) return markup;
    const template = document.createElement('template');
    template.innerHTML = markup;
    template.content.querySelectorAll('.import-note').forEach((note) => { note.textContent = localizeNarrative(note.textContent); });
    return template.innerHTML;
  };

  const metricCompliancePanel = renderCompliancePanel;
  renderCompliancePanel = (entry) => {
    const template = localizeInputMarkup(metricCompliancePanel(entry), {
      checkThickness: { label: 'Wall thickness', unit: 'mm', decimals: 4, min: 0.001, step: isImperial() ? '0.0001' : '0.001' },
      checkYS: { label: 'Yield strength', unit: 'MPa', decimals: 3, step: '0.1' },
      checkUTS: { label: 'Tensile strength', unit: 'MPa', decimals: 3, step: '0.1' },
      checkStripWidth: { label: 'Strip width', unit: 'mm', decimals: 4, step: isImperial() ? '0.0001' : '0.01' },
      checkStripThickness: { label: 'Specimen thickness', unit: 'mm', decimals: 4, step: isImperial() ? '0.0001' : '0.01' },
      checkRoundDiameter: { label: 'Round diameter', unit: 'mm', decimals: 4, step: isImperial() ? '0.0001' : '0.01' },
      checkCVN1: { label: 'Specimen 1 energy', unit: 'J', decimals: 3, step: '0.1' },
      checkCVN2: { label: 'Specimen 2 energy', unit: 'J', decimals: 3, step: '0.1' },
      checkCVN3: { label: 'Specimen 3 energy', unit: 'J', decimals: 3, step: '0.1' },
      checkCVNCustomWidth: { label: 'Custom width', unit: 'mm', decimals: 4, min: 0, max: 10, step: isImperial() ? '0.001' : '0.1' },
      checkCVNTemp: { label: 'Test temperature', unit: 'degC', decimals: 2, step: '1' },
      checkOD: { label: 'Outside diameter', unit: 'mm', decimals: 4, step: isImperial() ? '0.001' : '0.01' },
      checkDWTTTemp: { label: 'Actual test temperature', unit: 'degC', decimals: 2, step: '1' }
    });
    localizeCharpyOptions(template, 'checkCVNSize');
    return template.innerHTML;
  };

  const collectMetricComplianceInput = collectComplianceInput;
  collectComplianceInput = (entry) => {
    const input = collectMetricComplianceInput(entry);
    const specifications = {
      tMM: ['checkThickness', 'mm'], ys: ['checkYS', 'MPa'], uts: ['checkUTS', 'MPa'],
      stripWidth: ['checkStripWidth', 'mm'], stripThickness: ['checkStripThickness', 'mm'], roundDiameter: ['checkRoundDiameter', 'mm'],
      cvn1: ['checkCVN1', 'J'], cvn2: ['checkCVN2', 'J'], cvn3: ['checkCVN3', 'J'], cvnCustomWidth: ['checkCVNCustomWidth', 'mm'],
      cvnTemp: ['checkCVNTemp', 'degC'], od: ['checkOD', 'mm'], dwttTemp: ['checkDWTTTemp', 'degC']
    };
    for (const [key, [id, unit]] of Object.entries(specifications)) {
      const element = document.getElementById(id);
      if (!element) continue;
      const converted = toCanonicalUnit(element.value, unit);
      input[key] = converted === null ? '' : converted;
    }
    if (finiteNumber(input.tMM) === null) input.tMM = state.thicknessMM;
    return input;
  };

  displayEntered = (row) => {
    if (row.entered === null || row.entered === undefined || row.entered === '') return '—';
    if (Array.isArray(row.entered)) {
      return row.entered.map((value) => Number.isFinite(Number(value)) && row.unit ? fmtPlain(toDisplayUnit(value, row.unit), 4) : esc(value)).join(', ');
    }
    if (typeof row.entered === 'number') return `${fmtPlain(toDisplayUnit(row.entered, row.unit), 4)}${row.unit ? ` ${unitName(row.unit)}` : ''}`;
    return esc(row.entered);
  };
  marginText = (row) => {
    if (row.margin === null || row.margin === undefined) return '—';
    const value = isImperial() && row.unit === 'degC'
      ? Number(row.margin) * 9 / 5
      : toDisplayUnit(row.margin, row.unit);
    return `${value >= 0 ? '+' : ''}${fmtPlain(value, 4)}${row.unit ? ` ${unitName(row.unit)}` : ''}`;
  };
  const metricComplianceResult = renderComplianceResult;
  renderComplianceResult = (result) => {
    if (!result) return metricComplianceResult(result);
    const template = document.createElement('template');
    template.innerHTML = metricComplianceResult(result);
    const thicknessPill = [...template.content.querySelectorAll('.meta-pill')].find((item) => /^t\s*=/.test(item.textContent.trim()));
    if (thicknessPill) thicknessPill.textContent = `t = ${measurement(result.meta.tMM, 'mm', isImperial() ? 4 : 3)}`;
    if (isImperial()) {
      template.content.querySelectorAll('.check-table tbody td:last-child').forEach((cell) => {
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => { if (!node.parentElement?.closest('.clause')) node.nodeValue = localizeNarrative(node.nodeValue); });
      });
    }
    return template.innerHTML;
  };

  const metricCharpyPanel = renderCharpyCalcPanel;
  renderCharpyCalcPanel = (entry) => {
    const template = localizeInputMarkup(metricCharpyPanel(entry), {
      charpyCalcCustom: { label: 'Custom width', unit: 'mm', decimals: 4, min: 0, max: 10, step: isImperial() ? '0.001' : '0.1' },
      charpyCalcEnergy: { label: 'Measured energy', unit: 'J', decimals: 3, step: '0.1' }
    });
    localizeCharpyOptions(template, 'charpyCalcSize');
    return template.innerHTML;
  };
  bindCharpyCalc = (entry) => {
    const sizeInput = document.getElementById('charpyCalcSize');
    if (!sizeInput) return;
    const update = () => {
      const size = sizeInput.value;
      const customWidth = toCanonicalUnit(document.getElementById('charpyCalcCustom')?.value, 'mm');
      const energy = toCanonicalUnit(document.getElementById('charpyCalcEnergy')?.value, 'J');
      storageSet('gradeSpecCalc:charpy', { size, customWidth: customWidth ?? '', energy: energy ?? '' });
      const grade = resolveContext(entry).grade;
      const sub = ENGINE.subSize(grade.charpy, size, customWidth);
      const output = document.getElementById('charpyCalcOutput');
      if (!sub) {
        output.innerHTML = `<div class="p2-empty">Enter a custom width greater than 0 and no greater than ${measurement(10, 'mm', isImperial() ? 3 : 0)}.</div>`;
        return;
      }
      const average = grade.charpy.energyFullSize.average.min?.value;
      const single = grade.charpy.energyFullSize.single.min?.value;
      const averageRequired = average === null || average === undefined ? null : average * sub.factor;
      const singleRequired = single === null || single === undefined ? null : single * sub.factor;
      if (size === 'CUSTOM') {
        output.innerHTML = `<div class="calc-result wide"><span class="estimate-only">Engineering estimate only</span><strong>No compliance status is assigned</strong><p>The proportional factor ${fmtPlain(sub.factor, 3)} is derived from stored ratios, not a tabulated acceptance factor for this custom size.</p><p>Estimated average: ${measurement(averageRequired, 'J', 2)} · estimated single: ${measurement(singleRequired, 'J', 2)}</p></div>`;
        return;
      }
      const status = energy === null || singleRequired === null ? 'NA' : energy >= singleRequired ? 'PASS' : 'FAIL';
      output.innerHTML = `<div class="calc-result wide"><span>Convention applied</span><strong>Requirement scaled down</strong><code>sub-size requirement = full-size requirement × factor</code><p>Factor <span class="mono">${fmtPlain(sub.factor, 3)}</span> from ${esc(localizeNarrative(sub.source))} <span class="clause">${esc(sub.clauseRef)}</span></p><p>Average requirement: <span class="mono">${measurement(average, 'J', 2)} × ${fmtPlain(sub.factor, 3)} = ${measurement(averageRequired, 'J', 2)}</span></p><p>Single-specimen requirement: <span class="mono">${measurement(single, 'J', 2)} × ${fmtPlain(sub.factor, 3)} = ${measurement(singleRequired, 'J', 2)}</span> ${energy !== null ? `<span class="status-pill ${status.toLowerCase()}">${status}</span>` : ''}</p></div>`;
    };
    ['charpyCalcSize', 'charpyCalcCustom', 'charpyCalcEnergy'].forEach((id) => document.getElementById(id)?.addEventListener('input', update));
    update();
  };

  renderElongPanel = (entry) => {
    const saved = getCalcState('elong', { specimenType: 'STRIP', width: 38.1, thickness: state.thicknessMM, diameter: '', uts: '', measured: '' });
    if (auditedEntry(entry)) {
      const areaMM2 = finiteNumber(saved.nominalAreaMM2) ?? finiteNumber(settingsFor(entry).nominalAreaMM2);
      const area = entry.bodyKey === 'CSA_Z245_1'
        ? numberInput('elongNominalArea', `Nominal specimen area (${unitName('mm2')})`, inputValue(areaMM2, 'mm2'), `min="${isImperial() ? '0.00002' : '0.01'}" step="${isImperial() ? '0.0001' : '1'}"`)
        : '';
      return `<section class="tool-panel ${state.phase2Tab === 'elongcalc' ? 'active' : ''}" data-panel="elongcalc"><div class="p2-section-head"><h2>Elongation requirement</h2></div><div class="p2-card"><div class="p2-grid">${area}${numberInput('elongMeasured', 'Measured elongation (%) on the selected gauge basis', saved.measured, 'min="0" step="0.1"')}</div><div id="elongOutput" class="calc-output"></div></div></section>`;
    }
    return `<section class="tool-panel ${state.phase2Tab === 'elongcalc' ? 'active' : ''}" data-panel="elongcalc"><div class="p2-section-head"><div><div class="eyebrow">Data-driven minimum</div><h2>Elongation Calculator</h2></div></div><div class="p2-card"><div class="p2-grid three">${selectInput('elongType', 'Specimen type', [{ value: 'STRIP', label: 'Strip — width × thickness' }, { value: 'ROUND', label: 'Round bar — diameter' }], saved.specimenType)}${numberInput('elongWidth', `Strip width (${unitName('mm')})`, inputValue(saved.width, 'mm'), `step="${isImperial() ? '0.0001' : '0.01'}"`)}${numberInput('elongThickness', `Strip thickness (${unitName('mm')})`, inputValue(saved.thickness, 'mm'), `step="${isImperial() ? '0.0001' : '0.01'}"`)}${numberInput('elongDiameter', `Round diameter (${unitName('mm')})`, inputValue(saved.diameter, 'mm'), `step="${isImperial() ? '0.0001' : '0.01'}"`)}${numberInput('elongUTS', `Measured UTS (${unitName('MPa')})`, inputValue(saved.uts, 'MPa'), 'step="0.1"')}${numberInput('elongMeasured', 'Measured elongation (%)', saved.measured, 'step="0.1"')}</div><div id="elongOutput" class="calc-output"></div></div></section>`;
  };
  bindElong = (entry) => {
    const update = () => {
      const measured = finiteNumber(document.getElementById('elongMeasured')?.value);
      if (auditedEntry(entry)) {
        const areaMM2 = toCanonicalUnit(document.getElementById('elongNominalArea')?.value, 'mm2');
        storageSet('gradeSpecCalc:elong', { ...getCalcState('elong', {}), measured: measured ?? '', nominalAreaMM2: areaMM2 ?? '' });
        const assessment = evaluateStandard(entry, state.thicknessMM, entry.bodyKey === 'CSA_Z245_1' ? { nominalAreaMM2: areaMM2 } : {});
        const limit = resolveThicknessRow(assessment.grade, state.thicknessMM)?.elongation?.fixedMin;
        const output = document.getElementById('elongOutput');
        if (!hasLimit(limit)) {
          output.innerHTML = `<div class="p2-empty">${assessment.missingContext.length ? 'Resolve the applicable order, product and specimen details to obtain an elongation requirement.' : 'No base elongation minimum is required for this product selection.'}</div>`;
          return;
        }
        const check = measured === null ? null : ENGINE.checkLimit(entry.bodyKey === 'CSA_G40_21' ? g40Rounded(measured, limit) : measured, limit);
        output.innerHTML = `<div class="calc-result wide"><span>Applicable minimum</span>${renderLimit(limit)}<p>${esc(localizeNarrative(limit.displayNote || ''))}</p>${check ? `<span class="status-pill ${check.status.toLowerCase()}">${check.status === 'PASS' ? 'Meets displayed minimum' : 'Below displayed minimum'}</span>` : ''}<p>Comparison covers elongation only. Apply the selected gauge basis, test method and remaining order requirements.</p></div>`;
        return;
      }
      const stored = {
        specimenType: document.getElementById('elongType').value,
        width: toCanonicalUnit(document.getElementById('elongWidth').value, 'mm'),
        thickness: toCanonicalUnit(document.getElementById('elongThickness').value, 'mm'),
        diameter: toCanonicalUnit(document.getElementById('elongDiameter').value, 'mm'),
        uts: toCanonicalUnit(document.getElementById('elongUTS').value, 'MPa'), measured: measured ?? ''
      };
      storageSet('gradeSpecCalc:elong', stored);
      const rule = resolveContext(entry, state.thicknessMM).row?.elongation;
      const output = document.getElementById('elongOutput');
      if (!rule) { output.innerHTML = '<div class="p2-empty">No resolved mechanical row.</div>'; return; }
      if (rule.type === 'FIXED') {
        const check = measured === null ? null : ENGINE.checkLimit(measured, rule.fixedMin);
        output.innerHTML = `<div class="calc-result wide"><span>Fixed minimum</span>${renderLimit(rule.fixedMin)}${check ? `<span class="status-pill ${check.status.toLowerCase()}">${check.status}</span>` : ''}</div>`;
        return;
      }
      const area = ENGINE.area(stored.specimenType, stored.width, stored.thickness, stored.diameter);
      const calculation = ENGINE.elongation(rule, area, stored.uts);
      if (!calculation) { output.innerHTML = '<div class="p2-empty">Enter valid specimen dimensions and UTS.</div>'; return; }
      const check = measured === null ? null : ENGINE.checkLimit(measured, calculation.limit);
      const parameters = rule.params || {};
      const coefficient = isImperial()
        ? parameters.C * Math.pow(1 / UNIT_FACTORS.mm2, parameters.exponentArea) / Math.pow(1 / UNIT_FACTORS.MPa, parameters.exponentUts)
        : parameters.C;
      const formula = `${fmtPlain(coefficient, isImperial() ? 3 : 0)} × ${fmtPlain(toDisplayUnit(area, 'mm2'), 4)}^${parameters.exponentArea} / ${fmtPlain(toDisplayUnit(stored.uts, 'MPa'), 3)}^${parameters.exponentUts}`;
      output.innerHTML = `<div class="calc-result wide"><span>Cross-sectional area</span><strong class="mono">${measurement(area, 'mm2', 4)}</strong><span>Minimum elongation</span><strong class="mono">${fmtPlain(calculation.minimum, 4)}%</strong><code>e_min = ${esc(formula)}</code><p>${esc(calculation.rounding)} <span class="clause">${esc(rule.clauseRef)}</span> ${!rule.verified ? '<span class="verify">⚠ verify</span>' : ''}</p>${check ? `<span class="status-pill ${check.status.toLowerCase()}">${check.status}</span>` : ''}</div>`;
    };
    ['elongNominalArea', 'elongMeasured', 'elongType', 'elongWidth', 'elongThickness', 'elongDiameter', 'elongUTS'].forEach((id) => document.getElementById(id)?.addEventListener('input', update));
    update();
  };

  // The attached-edition resolver installs a Z245-specific hydro wrapper after
  // the generic calculator. Restore the unit-aware implementation for all bodies.
  renderHydroPanel = originalHydroPanel;
  bindHydro = originalBindHydro;

  const metricRowFromMapping = rowFromMapping;
  rowFromMapping = (row, mapping, entry) => {
    const input = metricRowFromMapping(row, mapping, entry);
    const targets = {
      thickness: ['tMM', 'mm'], YS: ['ys', 'MPa'], UTS: ['uts', 'MPa'],
      STRIP_WIDTH: ['stripWidth', 'mm'], STRIP_THICKNESS: ['stripThickness', 'mm'], ROUND_DIAMETER: ['roundDiameter', 'mm'],
      CVN1: ['cvn1', 'J'], CVN2: ['cvn2', 'J'], CVN3: ['cvn3', 'J'], CVN_TEMP: ['cvnTemp', 'degC'],
      OD: ['od', 'mm'], DWTT_TEMP: ['dwttTemp', 'degC'], PRODUCT_WIDTH: ['widthMM', 'mm'],
      GAUGE_LENGTH: ['gaugeLengthMM', 'mm'], FLANGE_THICKNESS: ['shapeFlangeThicknessMM', 'mm'], ORDER_TEMPERATURE: ['orderTemperatureC', 'degC']
    };
    for (const [index, target] of Object.entries(mapping)) {
      const specification = targets[target];
      const raw = row[Number(index)] ?? '';
      if (!specification || String(raw).trim() === '') continue;
      const converted = toCanonicalUnit(raw, specification[1]);
      if (converted !== null) input[specification[0]] = converted;
    }
    return input;
  };
  function updateImportUnitLabels() {
    Object.assign(PHASE2_FIELDS, {
      thickness: `Material thickness (${unitName('mm')})`, YS: `Yield strength (${unitName('MPa')})`, UTS: `Tensile strength (${unitName('MPa')})`,
      STRIP_WIDTH: `Strip width (${unitName('mm')})`, STRIP_THICKNESS: `Specimen thickness (${unitName('mm')})`, ROUND_DIAMETER: `Round diameter (${unitName('mm')})`,
      CVN1: `CVN specimen 1 (${unitName('J')})`, CVN2: `CVN specimen 2 (${unitName('J')})`, CVN3: `CVN specimen 3 (${unitName('J')})`,
      CVN_TEMP: `CVN test temperature (${unitName('degC')})`, OD: `Outside diameter (${unitName('mm')})`, DWTT_TEMP: `DWTT test temperature (${unitName('degC')})`,
      PRODUCT_WIDTH: `Product width (${unitName('mm')})`, GAUGE_LENGTH: `Tensile gauge length (${unitName('mm')})`,
      FLANGE_THICKNESS: `Shape flange thickness (${unitName('mm')})`, ORDER_TEMPERATURE: `Ordered toughness temperature (${unitName('degC')})`
    });
  }
  const renderWithCanonicalUnits = render;
  render = () => {
    updateImportUnitLabels();
    renderWithCanonicalUnits();
  };
  // Printing includes the conditional requirement catalog and all source notes.
  let printDetails = [];
  window.addEventListener('beforeprint', () => {
    printDetails = [...document.querySelectorAll('.standard-reference details, .section-references, .formula-details, .audit-details, .requirement-reference')].filter((detail) => !detail.open);
    printDetails.forEach((detail) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    printDetails.forEach((detail) => { detail.open = false; });
    printDetails = [];
  });
  Object.assign(window.__gradeSpecQA, {
    attachedAudits: () => ({ A36: A36_AUDIT, G40: G40_AUDIT, Z245: Z245_AUDIT }),
    resolveAttached: (reference, context = {}) => evaluateStandard(findEntry(reference), context.thicknessMM ?? state.thicknessMM, context)
  });
})();
