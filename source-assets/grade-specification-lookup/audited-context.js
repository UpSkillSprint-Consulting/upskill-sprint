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
  const numericKeys = ['widthMM', 'odMM', 'gaugeLengthMM', 'shapeFlangeThicknessMM', 'testTemperatureC', 'orderTemperatureC', 'nominalAreaMM2'];
  const booleanKeys = ['copperSpecified', 'floorPlate', 'manufacturerTestRequired'];
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
      fields.push(numberInput('standardWidth', 'Product width (mm)', saved.widthMM, 'min="0.01" step="0.01"'));
      fields.push(option('standardGauge', 'Tensile gauge length', [['50', '50 mm (SI)'], ['200', '200 mm (SI)'], ['50.8', '2 in (inch-pound)'], ['203.2', '8 in (inch-pound)']], saved.gaugeLengthMM));
      fields.push(numberInput('standardFlange', 'Shape flange thickness (mm)', saved.shapeFlangeThicknessMM, 'min="0.01" step="0.01"'));
      fields.push(option('standardShape', 'Structural shape type', [['OTHER', 'Other structural shape'], ['WIDE_FLANGE', 'Wide-flange shape']], saved.shapeDesignation));
      fields.push(option('standardCopper', 'Copper steel specified in order?', yesNo, saved.copperSpecified));
      fields.push(option('standardFloor', 'Floor plate?', yesNo, saved.floorPlate));
      fields.push(option('standardBearing', 'Bearing use', [['NONE', 'Not a bearing plate or bar'], ['BRIDGE', 'Bridge bearing'], ['NON_BRIDGE', 'Other bearing use']], saved.bearingUse));
      fields.push(option('standardManufacturerTest', 'Manufacturer tension test specified?', yesNo, saved.manufacturerTestRequired));
    } else {
      fields.push(numberInput('standardWidth', 'Product width (mm, where applicable)', saved.widthMM, 'min="0.01" step="0.01"'));
      fields.push(numberInput('standardGauge', 'Tensile gauge length (mm)', saved.gaugeLengthMM, 'min="0.01" step="0.01"'));
      fields.push(option('standardSupply', 'Delivery / heat-treatment condition', entry.bodyKey === 'CSA_Z245_1' ? Z245_AUDIT.supplyConditions.map((item) => [item.value, item.label]) : [['AS_ROLLED', 'As rolled'], ['NORMALIZED', 'Normalized'], ['CONTROLLED_ROLLED', 'Controlled rolled'], ['NORMALIZING_ROLLED', 'Normalizing rolled'], ['QUENCHED_TEMPERED', 'Quenched and tempered']], saved.supplyCondition));
      fields.push(option('standardOrientation', 'Tensile orientation', [['LONGITUDINAL', 'Longitudinal'], ['TRANSVERSE', 'Transverse']], saved.tensileOrientation));
      fields.push(option('standardSpecimen', 'Tensile specimen', [['RECTANGULAR', 'Rectangular'], ['ROUND', 'Round'], ['FULL_SECTION', 'Full section'], ['FLATTENED_STRIP', 'Flattened strip'], ['OTHER', 'Other']], saved.tensileSpecimenType || saved.tensileSpecimen));
      if (entry.bodyKey === 'CSA_G40_21') {
        fields.push(option('standardImpactCategory', 'Ordered impact category', [['1', 'Category 1 · 0°C'], ['2', 'Category 2 · −20°C'], ['3', 'Category 3 · −30°C'], ['4', 'Category 4 · −45°C'], ['5', 'Category 5 · agreed requirements']], saved.impactCategory));
        fields.push(option('standardSubtype', 'Product subtype', [['ROLLED', 'Rolled product'], ['WELDED_SHAPE', 'Welded structural shape'], ['SHEET_PILING', 'Sheet piling'], ['FLOOR_PLATE', 'Floor plate'], ['ANGLE', 'Angle']], saved.productSubtype));
        fields.push(numberInput('standardFlange', 'Shape flange thickness (mm)', saved.shapeFlangeThicknessMM, 'min="0.01" step="0.01"'));
        fields.push(option('standardShapeLocation', 'Shape tensile test location', [['FLANGE', 'Flange'], ['WEB', 'Web']], saved.shapeTestLocation));
        fields.push(option('standardShapeGroup', 'Structural shape size group', [['1', 'Group 1'], ['2', 'Group 2'], ['3', 'Group 3'], ['4', 'Group 4 · additional review'], ['5', 'Group 5 · additional review']], saved.shapeGroup));
      } else {
        fields.push(numberInput('standardOD', 'Nominal outside diameter (mm)', saved.odMM, 'min="21.3" max="2032" step="0.01"'));
        fields.push(numberInput('standardOrderTemperature', 'Ordered body toughness temperature (°C)', saved.orderTemperatureC, 'step="1"'));
        fields.push(numberInput('standardArea', 'Nominal tensile specimen area (mm²)', saved.nominalAreaMM2, 'min="0.01" step="1"'));
        fields.push(option('standardToughnessTarget', 'Toughness test location', [['BODY', 'Pipe body'], ['WELD_HAZ', 'Weld / HAZ'], ['EW_FUSION_LINE', 'EW fusion line'], ['EW_WELD_ZONE', 'EW weld zone']], saved.toughnessTarget));
        fields.push(option('standardService', 'Service requirements in order', [['BASE', 'Base standard'], ['SOUR', 'Sour service'], ['ELEVATED', 'Elevated-temperature service'], ['STRAIN', 'Strain-based design']], saved.serviceCondition));
        fields.push(numberInput('standardOrderHeats', 'Number of heats in order', saved.orderHeatCount, 'min="1" step="1"'));
        fields.push(numberInput('standardOrderShear', 'Order average shear area (%) when ≥5 heats', saved.orderAverageShear, 'min="0" max="100" step="0.1"'));
      }
    }
    const forceOpen = entry.bodyKey === 'CSA_Z245_1' && unresolved;
    return `<details class="standard-context-controls"${forceOpen ? ' open' : ''}><summary>Order & specimen details${forceOpen ? ' — required to resolve conditional limits' : ''}</summary><div class="p2-grid">${fields.join('')}</div><button type="button" class="btn primary" id="applyStandardContext">Apply details</button><p class="field-note">Product dimensions select the requirement. Specimen dimensions and measured test temperature describe the test. Keep these separate.</p></details>`;
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
    const toughness = category === 'I'
      ? '<strong>Category I:</strong> no base requirement to demonstrate notch toughness.'
      : category === 'III'
        ? `<strong>Category III:</strong> ordered test temperature; full-size CVN average ≥${requirementValue(18, 'J')}; each specimen ≥${requirementValue(12, 'J')}; no base shear-area requirement.`
        : `<strong>Category II:</strong> ordered test temperature; full-size CVN average ≥${requirementValue(27, 'J')} for OD &lt;457 mm or ≥${requirementValue(40, 'J')} for OD ≥457 mm. At OD ≤457 mm, CVN shear average ≥60% and each specimen ≥50%. At OD &gt;457 mm, DWTT average ≥60% and each specimen ≥50%. Order average shear ≥85% when five or more heats are supplied.`;
    const intermediate = !Z245_AUDIT.standardGrades.includes(number)
      ? '<p class="snapshot-note">Intermediate grade: strength values are interpolated and rounded using the attached-edition rules.</p>'
      : '';
    const sour = number <= 483
      ? `<li><strong>Sour-service overlay:</strong> TS maximum ${requirementValue(sourCap, 'MPa')}; macrohardness ≤22 HRC/250 HV10; microhardness ≤250 HV0.5; nickel ≤1.0%. Other Clause 16 requirements remain mandatory.</li>`
      : '<li><strong>Sour-service scope:</strong> the attached edition limits sour-service grades to Grade 483 and below.</li>';
    return `<section class="z245-requirement-snapshot" id="z245RequirementSnapshot" aria-labelledby="z245SnapshotHeading"><div class="snapshot-heading"><h4 id="z245SnapshotHeading">Complete conditional requirement snapshot</h4><span>CSA Z245.1:26 · Grade ${number} · Category ${category}</span></div>${intermediate}<div class="table-wrap"><table class="requirements-table snapshot-table"><thead><tr><th scope="col">Property</th><th scope="col">Minimum</th><th scope="col">Maximum</th><th scope="col">Applicability</th></tr></thead><tbody><tr><th scope="row">Yield strength</th><td>${requirementValue(tensile[0], 'MPa')}</td><td>${requirementValue(tensile[1], 'MPa')}</td><td>Maximum applies at OD ≥219.1 mm</td></tr><tr><th scope="row">Tensile strength</th><td>${requirementValue(tensile[2], 'MPa')}</td><td>${requirementValue(tensile[3], 'MPa')}</td><td>Maximum applies at OD ≥219.1 mm</td></tr><tr><th scope="row">Yield / tensile ratio</th><td>—</td><td>${esc(ratio)}</td><td>Applies at OD ≥355.6 mm</td></tr><tr><th scope="row">Base hardness</th><td>—</td><td>${hardness}</td><td>Non-sour base requirement</td></tr></tbody></table></div><div class="snapshot-toughness">${toughness}</div><ul class="snapshot-conditions"><li><strong>CVN specimen rule:</strong> three adjacent specimens; at most one below the required average and none below two-thirds of it. Use the largest feasible specimen and the tabulated subsize factors.</li><li><strong>Elongation:</strong> calculated from nominal specimen area and specified minimum tensile strength on the 50 mm basis; it is not a single fixed percentage.</li>${sour}<li><strong>Separate locations:</strong> body, SAW weld/HAZ, EW fusion line and EW weld zone have distinct applicability and order conditions.</li></ul><p class="snapshot-source">Table 8 and Clauses 7.2, 7.6–7.8, 8.1–8.6 and 16. Enter the order details below to determine which conditional values govern the assessment.</p></section>`;
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
      const fields = { standardWidth: 'widthMM', standardOD: 'odMM', standardGauge: 'gaugeLengthMM', standardFlange: 'shapeFlangeThicknessMM', standardShape: 'shapeDesignation', standardCopper: 'copperSpecified', standardFloor: 'floorPlate', standardBearing: 'bearingUse', standardManufacturerTest: 'manufacturerTestRequired', standardOrderTemperature: 'orderTemperatureC', standardImpactCategory: 'impactCategory', standardSupply: 'supplyCondition', standardOrientation: 'tensileOrientation', standardSpecimen: 'tensileSpecimenType', standardSubtype: 'productSubtype', standardShapeLocation: 'shapeTestLocation', standardShapeGroup: 'shapeGroup', standardArea: 'nominalAreaMM2', standardToughnessTarget: 'toughnessTarget', standardService: 'serviceCondition', standardOrderHeats: 'orderHeatCount', standardOrderShear: 'orderAverageShear' };
      for (const [id, key] of Object.entries(fields)) {
        const input = document.getElementById(id);
        if (input) saved[key] = input.value;
      }
      storageSet(settingsKey(entry), saved);
      render();
    });
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
