(function () {
  'use strict';

  const STORAGE_KEY = 'upskill-material-compliance-assessments-v2';
  const EXPORT_VERSION = 3;
  const SECTION_KEYS = ['chemistry', 'mechanical', 'charpy', 'dimensions', 'process'];
  const Config = window.MaterialCheckerConfig;
  const Engine = window.MaterialCheckerEngine;
  if (!Config || !Engine) return;

  const DEF = Config.DEF;
  const LIB = Config.LIB;
  let state = defaultState();
  let activeSection = 'chemistry';
  let result = null;

  const one = selector => document.querySelector(selector);
  const all = selector => Array.from(document.querySelectorAll(selector));

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
  }

  function toNumber(value) {
    return Engine.toNumber(value);
  }

  function format(value) {
    return Engine.formatNumber(value);
  }

  function options(values, selected) {
    return values.map(value => '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>').join('');
  }

  function unitOptions(values, selected) {
    const current = String(selected == null ? '' : selected);
    const allowed = values.map(value => String(value));
    const display = allowed.includes(current) ? allowed : [current].concat(allowed);
    return Array.from(new Set(display)).map(value => {
      const unsupported = !allowed.includes(value);
      const label = value ? value + (unsupported ? ' (unsupported — select a valid unit)' : '') : 'Unit not supplied';
      return '<option value="' + esc(value) + '"' + (value === current ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  function newRow(section, unitSystem) {
    const metric = unitSystem !== 'imperial';
    if (section === 'charpy') {
      return {
        id: uid(), propertyCode: '', name: '', testTemp: '', tempUnit: metric ? '°C' : '°F',
        specimenCount: '', avg: '', individual: '', eUnit: metric ? 'J' : 'ft-lb',
        reqTemp: '', reqTempUnit: metric ? '°C' : '°F', reqSpecimenCount: '3',
        reqAvg: '', reqIndividual: '', reqUnit: metric ? 'J' : 'ft-lb',
        source: '', mandatory: true
      };
    }
    if (section === 'process') {
      return {id: uid(), propertyCode: '', name: '', evidence: 'unknown', source: '', mandatory: true};
    }
    const unit = section === 'chemistry' ? '%' : section === 'mechanical' ? (metric ? 'MPa' : 'ksi') : (metric ? 'mm' : 'in');
    return {id: uid(), propertyCode: '', name: '', actual: '', aUnit: unit, min: '', max: '', rUnit: unit, source: '', mandatory: true};
  }

  function defaultState() {
    return {
      scope: {
        materialId: '', heatNumber: '', productForm: '',
        sourceOrg: 'CSA', sourceStandard: 'CSA G40.21', sourceGrade: 'Grade 350W', sourceCustom: '',
        sourceEdition: '', certificateRef: '', requirementStatus: 'unknown',
        assessmentDate: Engine.localISODate(), reviewer: '',
        targetOrg: 'ASTM', targetStandard: 'ASTM A572/A572M', targetGrade: 'Grade 50', targetCustom: '',
        targetEdition: '', thickness: '', thicknessUnit: 'mm', width: '', widthUnit: 'mm', notes: ''
      },
      unitSystem: 'metric',
      selected: Object.fromEntries(SECTION_KEYS.map(section => [section, true])),
      rows: Object.fromEntries(SECTION_KEYS.map(section => [section, [newRow(section, 'metric')]]))
    };
  }

  function selectedSections() {
    return SECTION_KEYS.filter(section => state.selected[section]);
  }

  function specificationOptions(side) {
    const organization = state.scope[side + 'Org'];
    const standards = LIB[organization] || LIB.Other;
    const standardNames = Object.keys(standards);
    if (!standardNames.includes(state.scope[side + 'Standard'])) state.scope[side + 'Standard'] = standardNames[0];
    const grades = standards[state.scope[side + 'Standard']] || ['Custom designation'];
    if (!grades.includes(state.scope[side + 'Grade'])) state.scope[side + 'Grade'] = grades[0];

    const organizationSelect = one('[data-spec="' + side + '-org"]');
    const standardSelect = one('[data-spec="' + side + '-standard"]');
    const gradeSelect = one('[data-spec="' + side + '-grade"]');
    const customField = one('[data-custom="' + side + '"]');
    if (!organizationSelect || !standardSelect || !gradeSelect || !customField) return;
    organizationSelect.innerHTML = options(Object.keys(LIB), organization);
    standardSelect.innerHTML = options(standardNames, state.scope[side + 'Standard']);
    gradeSelect.innerHTML = options(grades, state.scope[side + 'Grade']);
    customField.hidden = !(
      ['Customer', 'Internal', 'Other'].includes(organization) ||
      state.scope[side + 'Standard'] === 'Other / not listed' ||
      ['Other / not listed', 'Custom designation'].includes(state.scope[side + 'Grade']) ||
      String(state.scope[side + 'Custom'] || '').trim()
    );
  }

  function fillScope() {
    specificationOptions('source');
    specificationOptions('target');
    all('[data-scope]').forEach(control => {
      control.value = state.scope[control.dataset.scope] == null ? '' : state.scope[control.dataset.scope];
    });
    one('#unitSystem').value = state.unitSystem;
    all('#selectors input').forEach(input => { input.checked = Boolean(state.selected[input.value]); });
  }

  function findProperty(section, row) {
    const catalogue = Config.PROPERTIES && Config.PROPERTIES[section] || [];
    if (row.propertyCode) {
      const byCode = catalogue.find(item => item.code === row.propertyCode);
      if (byCode) return byCode;
    }
    const normalized = Engine.normalize(row.name);
    return catalogue.find(item => [item.code, item.label].concat(item.aliases || []).some(alias => Engine.normalize(alias) === normalized)) || null;
  }

  function propertySelector(section, row) {
    const catalogue = Config.PROPERTIES && Config.PROPERTIES[section] || [];
    const property = findProperty(section, row);
    const code = property ? property.code : '';
    const label = section === 'process' ? 'Required evidence' : section === 'charpy' ? 'Test location / orientation' : 'Requirement / property';
    const placeholder = section === 'process' ? 'Select required evidence' : section === 'charpy' ? 'Select test location / orientation' : 'Select a ' + section + ' requirement';
    return '<label class="row-field">' + label +
      '<select data-f="propertyCode" data-property-select="' + esc(section) + '"><option value="">' + esc(placeholder) + '</option>' +
      catalogue.map(item => '<option value="' + esc(item.code) + '"' + (item.code === code ? ' selected' : '') + '>' + esc(item.label) + '</option>').join('') +
      '</select><input type="hidden" data-f="name" value="' + esc(property ? property.label : row.name) + '"></label>';
  }

  function rowUnits(section, row) {
    const property = findProperty(section, row);
    return property && property.units && property.units.length ? property.units : DEF[section].units;
  }

  function renderRow(section, row) {
    const propertyField = propertySelector(section, row);
    const removeLabel = 'Remove ' + (row.name || DEF[section].title) + ' requirement';
    if (section === 'process') {
      return '<div class="req-row process" data-sec="' + section + '" data-id="' + esc(row.id) + '">' +
        propertyField +
        '<label class="row-field">Evidence status<select data-f="evidence">' + options(['yes', 'no', 'unknown', 'not-applicable'], row.evidence) + '</select></label>' +
        '<label class="row-field">Clause / evidence reference<input data-f="source" value="' + esc(row.source) + '"></label>' +
        '<label class="mandatory"><input type="checkbox" data-f="mandatory"' + (row.mandatory ? ' checked' : '') + '>Mandatory</label>' +
        '<button class="remove" data-remove type="button" aria-label="' + esc(removeLabel) + '">×</button></div>';
    }
    if (section === 'charpy') {
      const reqTempUnit = row.reqTempUnit || row.tempUnit || '°C';
      return '<div class="req-row charpy" data-sec="' + section + '" data-id="' + esc(row.id) + '">' +
        propertyField +
        '<label class="row-field">Test temperature<input type="number" step="any" data-f="testTemp" value="' + esc(row.testTemp) + '"></label>' +
        '<label class="row-field">Actual temperature unit<select data-f="tempUnit">' + unitOptions(['°C', '°F'], row.tempUnit) + '</select></label>' +
        '<label class="row-field">Specimens tested<input type="number" min="1" step="1" data-f="specimenCount" value="' + esc(row.specimenCount) + '"></label>' +
        '<label class="row-field">Actual average<input type="number" min="0" step="any" data-f="avg" value="' + esc(row.avg) + '"></label>' +
        '<label class="row-field">Actual minimum<input type="number" min="0" step="any" data-f="individual" value="' + esc(row.individual) + '"></label>' +
        '<label class="row-field">Actual energy unit<select data-f="eUnit">' + unitOptions(['J', 'ft-lb'], row.eUnit) + '</select></label>' +
        '<label class="row-field">Required maximum temperature<input type="number" step="any" data-f="reqTemp" value="' + esc(row.reqTemp) + '"></label>' +
        '<label class="row-field">Requirement temperature unit<select data-f="reqTempUnit">' + unitOptions(['°C', '°F'], reqTempUnit) + '</select></label>' +
        '<label class="row-field">Required specimen count<input type="number" min="1" step="1" data-f="reqSpecimenCount" value="' + esc(row.reqSpecimenCount == null ? '3' : row.reqSpecimenCount) + '"></label>' +
        '<label class="row-field">Required average<input type="number" min="0" step="any" data-f="reqAvg" value="' + esc(row.reqAvg) + '"></label>' +
        '<label class="row-field">Required individual<input type="number" min="0" step="any" data-f="reqIndividual" value="' + esc(row.reqIndividual) + '"></label>' +
        '<label class="row-field">Requirement energy unit<select data-f="reqUnit">' + unitOptions(['J', 'ft-lb'], row.reqUnit) + '</select></label>' +
        '<label class="row-field">Clause / source<input data-f="source" value="' + esc(row.source) + '"></label>' +
        '<label class="mandatory"><input type="checkbox" data-f="mandatory"' + (row.mandatory ? ' checked' : '') + '>Mandatory</label>' +
        '<button class="remove" data-remove type="button" aria-label="' + esc(removeLabel) + '">×</button></div>';
    }

    const units = rowUnits(section, row);
    const actualUnit = String(row.aUnit == null ? '' : row.aUnit);
    const requirementUnit = String(row.rUnit == null ? '' : row.rUnit);
    return '<div class="req-row quant" data-sec="' + section + '" data-id="' + esc(row.id) + '">' +
      propertyField +
      '<label class="row-field">Actual<input type="number" step="any" data-f="actual" value="' + esc(row.actual) + '"></label>' +
      '<label class="row-field">Actual unit<select data-f="aUnit">' + unitOptions(units, actualUnit) + '</select></label>' +
      '<label class="row-field">Minimum<input type="number" step="any" data-f="min" value="' + esc(row.min) + '"></label>' +
      '<label class="row-field">Maximum<input type="number" step="any" data-f="max" value="' + esc(row.max) + '"></label>' +
      '<label class="row-field">Requirement unit<select data-f="rUnit">' + unitOptions(units, requirementUnit) + '</select></label>' +
      '<label class="row-field">Clause / source<input data-f="source" value="' + esc(row.source) + '"></label>' +
      '<label class="mandatory"><input type="checkbox" data-f="mandatory"' + (row.mandatory ? ' checked' : '') + '>Mandatory</label>' +
      '<button class="remove" data-remove type="button" aria-label="' + esc(removeLabel) + '">×</button></div>';
  }

  function renderRows() {
    const selected = selectedSections();
    if (!selected.includes(activeSection)) activeSection = selected[0] || '';
    one('#tabs').innerHTML = selected.map(section => {
      const active = section === activeSection;
      return '<button class="tab" id="tab-' + section + '" data-tab="' + section + '" role="tab" aria-controls="panel-' + section + '" aria-selected="' + active + '" tabindex="' + (active ? '0' : '-1') + '">' + esc(DEF[section].title) + '</button>';
    }).join('');
    one('#panels').innerHTML = selected.length ? selected.map(section => {
      const active = section === activeSection;
      const rows = state.rows[section] || [];
      return '<section class="panel" id="panel-' + section + '" data-panel="' + section + '" role="tabpanel" aria-labelledby="tab-' + section + '"' + (active ? '' : ' hidden') + '>' +
        '<div class="panel-head"><div><h3>' + esc(DEF[section].title) + '</h3><p>' + esc(DEF[section].desc) + '</p></div>' +
        '<button class="btn outline" data-add="' + section + '" type="button">Add requirement</button></div>' +
        '<div class="req-list">' + (rows.length ? rows.map(row => renderRow(section, row)).join('') : '<div class="empty">No requirements configured.</div>') + '</div></section>';
    }).join('') : '<div class="empty">Select at least one evidence section.</div>';
  }

  function resultRow(section, name, actual, rule, status, basis, detail) {
    return {
      section: DEF[section] ? DEF[section].title : section,
      sec: section,
      name: name || 'Unnamed requirement',
      actual: actual || '—',
      rule: rule || '—',
      status,
      basis: basis || 'Controlled source not recorded',
      detail: detail || ''
    };
  }

  function scopeRows() {
    const rows = [];
    const traceability = [state.scope.materialId, state.scope.heatNumber, state.scope.certificateRef].some(value => String(value || '').trim());
    if (!traceability) rows.push(resultRow('process', 'Material traceability', 'Missing', 'Record a material ID, heat number, or certificate reference', 'missing', 'Material and specification scope', 'At least one traceability identifier is required.'));
    if (!String(state.scope.productForm || '').trim()) rows.push(resultRow('process', 'Product form', 'Missing', 'Product form must be identified', 'missing', 'Material and specification scope', 'Product-form applicability cannot be confirmed.'));
    if (!String(state.scope.sourceEdition || '').trim()) rows.push(resultRow('process', 'Source specification edition', 'Missing', 'Edition or revision must be recorded', 'missing', 'Material and specification scope', 'Record the exact source material specification edition or revision.'));
    if (!String(state.scope.targetEdition || '').trim()) rows.push(resultRow('process', 'Target specification edition', 'Missing', 'Edition or revision must be recorded', 'missing', 'Material and specification scope', 'Record the exact controlled target edition or revision.'));
    const sourceNeedsCustom = ['Customer', 'Internal', 'Other'].includes(state.scope.sourceOrg) || state.scope.sourceStandard === 'Other / not listed' || ['Other / not listed', 'Custom designation'].includes(state.scope.sourceGrade);
    const targetNeedsCustom = ['Customer', 'Internal', 'Other'].includes(state.scope.targetOrg) || state.scope.targetStandard === 'Other / not listed' || ['Other / not listed', 'Custom designation'].includes(state.scope.targetGrade);
    if (sourceNeedsCustom && !String(state.scope.sourceCustom || '').trim()) rows.push(resultRow('process', 'Source custom designation', 'Missing', 'Exact controlled designation must be recorded', 'missing', 'Material and specification scope', 'Complete the custom source specification or material designation.'));
    if (targetNeedsCustom && !String(state.scope.targetCustom || '').trim()) rows.push(resultRow('process', 'Target custom designation', 'Missing', 'Exact controlled designation must be recorded', 'missing', 'Material and specification scope', 'Complete the custom target requirement designation.'));
    if (!Engine.isValidDateNotFuture(state.scope.assessmentDate)) {
      rows.push(resultRow('process', 'Assessment date', state.scope.assessmentDate || 'Missing', 'A valid date no later than today', 'invalid', 'Material and specification scope', 'Enter a valid assessment date that is not in the future.'));
    }
    if (state.scope.requirementStatus !== 'controlled') {
      const working = state.scope.requirementStatus === 'working';
      rows.push(resultRow('process', 'Controlled target requirement', working ? 'Working copy only' : 'Not verified', 'Controlled copy must be verified', working ? 'review' : 'missing', 'Material and specification scope', 'Final compliance cannot be released without a verified controlled requirement source.'));
    }

    [['thickness', 'Nominal thickness'], ['width', 'Nominal width / OD']].forEach(([key, label]) => {
      const raw = state.scope[key];
      if (raw === '' || raw == null) return;
      const value = toNumber(raw);
      const unit = state.scope[key + 'Unit'];
      if (value == null || value <= 0) rows.push(resultRow('dimensions', label, String(raw) + ' ' + unit, 'A finite value greater than zero', 'invalid', 'Material and specification scope', label + ' is physically invalid.'));
    });
    return rows;
  }

  function currentActuals() {
    const actuals = {};
    ['chemistry', 'mechanical', 'dimensions'].forEach(section => {
      (state.rows[section] || []).forEach(row => {
        const property = findProperty(section, row);
        if (property && toNumber(row.actual) != null) actuals[property.code] = {value: row.actual, unit: row.aUnit};
      });
    });
    return actuals;
  }

  function evaluateQuantitative(section, row, derived) {
    const property = findProperty(section, row);
    const name = property ? property.label : String(row.name || '').trim();
    if (!name) return null;
    const code = property ? property.code : row.propertyCode || '';
    const minimum = toNumber(row.min);
    const maximum = toNumber(row.max);
    const ruleText = [
      minimum != null ? '≥ ' + format(minimum) + ' ' + row.rUnit : '',
      maximum != null ? '≤ ' + format(maximum) + ' ' + row.rUnit : ''
    ].filter(Boolean).join(' and ') || 'No limit entered';
    const basis = String(row.source || '').trim();
    const allowedUnits = rowUnits(section, row);

    if (minimum == null && maximum == null) return resultRow(section, name, row.actual === '' ? '—' : format(toNumber(row.actual)) + ' ' + row.aUnit, ruleText, 'review', basis, 'Enter at least one acceptance limit.');
    if (minimum != null && maximum != null && minimum > maximum) return resultRow(section, name, row.actual === '' ? '—' : row.actual + ' ' + row.aUnit, ruleText, 'invalid', basis, 'Rule configuration is invalid because the minimum exceeds the maximum.');
    if (!allowedUnits.includes(row.rUnit)) return resultRow(section, name, row.actual === '' ? '—' : row.actual + ' ' + row.aUnit, ruleText, 'invalid', basis, 'The requirement unit is missing or unsupported for this property. Select a valid unit before evaluating the rule.');

    const invalidLimit = minimum != null ? Engine.numericDomainError(minimum, row.rUnit, code, {limit: true}) : '';
    const invalidMaximum = maximum != null ? Engine.numericDomainError(maximum, row.rUnit, code, {limit: true}) : '';
    if (invalidLimit || invalidMaximum) return resultRow(section, name, row.actual === '' ? '—' : row.actual + ' ' + row.aUnit, ruleText, 'invalid', basis, 'Rule configuration is invalid. ' + (invalidLimit || invalidMaximum));

    let actual = toNumber(row.actual);
    let actualUnit = row.aUnit;
    let derivedNote = '';
    const derivedMap = {chem_ceiiw: 'ceiiw', chem_pcm: 'pcm', mech_yt_ratio: 'ytRatio'};
    const derivedValue = derivedMap[code] && derived[derivedMap[code]];
    if (actual == null && derivedValue && derivedValue.ready) {
      actual = derivedValue.value;
      actualUnit = derivedValue.unit;
      derivedNote = ' Automatically calculated using ' + derivedValue.formula + '.';
    }
    if (actual == null) return resultRow(section, name, 'Missing', ruleText, row.mandatory ? 'missing' : 'review', basis, 'Actual result is not available.');
    if (!allowedUnits.includes(actualUnit)) return resultRow(section, name, format(actual) + (actualUnit ? ' ' + actualUnit : ''), ruleText, 'invalid', basis, 'The actual unit is missing or unsupported for this property. Select a valid unit; the value was not relabelled or converted automatically.');

    const invalidActual = Engine.numericDomainError(actual, actualUnit, code, {limit: false});
    if (invalidActual) return resultRow(section, name, format(actual) + ' ' + actualUnit, ruleText, 'invalid', basis, invalidActual);
    const converted = Engine.convert(actual, actualUnit, row.rUnit);
    if (converted == null) return resultRow(section, name, format(actual) + ' ' + actualUnit, ruleText, 'review', basis, 'No defined conversion exists between the selected units.');

    const outside = (minimum != null && converted < minimum - 1e-9) || (maximum != null && converted > maximum + 1e-9);
    const actualText = format(actual) + ' ' + actualUnit + (actualUnit !== row.rUnit ? ' (' + format(converted) + ' ' + row.rUnit + ')' : '');
    if (!basis) {
      return resultRow(section, name, actualText, ruleText, 'review', '', (outside ? 'The value would be outside the entered limit, but ' : 'The numerical comparison is favorable, but ') + 'the controlled clause or source is missing.' + derivedNote);
    }
    return resultRow(section, name, actualText, ruleText, outside ? 'fail' : 'pass', basis, (outside ? 'Actual result is outside the entered limit.' : 'Actual result satisfies the entered limit.') + derivedNote);
  }

  function evaluateCharpy(row) {
    const property = findProperty('charpy', row);
    const name = property ? property.label : String(row.name || '').trim();
    if (!name) return null;
    const testTemperature = toNumber(row.testTemp);
    const specimenCount = toNumber(row.specimenCount);
    const average = toNumber(row.avg);
    const individual = toNumber(row.individual);
    const requiredTemperature = toNumber(row.reqTemp);
    const requiredAverage = toNumber(row.reqAvg);
    const requiredIndividual = toNumber(row.reqIndividual);
    const requiredCount = toNumber(row.reqSpecimenCount) == null ? 3 : toNumber(row.reqSpecimenCount);
    const requirementTemperatureUnit = row.reqTempUnit || row.tempUnit;
    const hasEnergyRule = requiredAverage != null || requiredIndividual != null;
    const hasRule = requiredTemperature != null || hasEnergyRule;
    const ruleText = [
      requiredTemperature != null ? 'test at ≤ ' + format(requiredTemperature) + ' ' + requirementTemperatureUnit : '',
      hasEnergyRule ? 'specimens ≥ ' + format(requiredCount) : '',
      requiredAverage != null ? 'average ≥ ' + format(requiredAverage) + ' ' + row.reqUnit : '',
      requiredIndividual != null ? 'individual ≥ ' + format(requiredIndividual) + ' ' + row.reqUnit : ''
    ].filter(Boolean).join('; ') || 'No limit entered';
    const actualText = [
      testTemperature != null ? format(testTemperature) + ' ' + row.tempUnit : 'temperature missing',
      specimenCount != null ? format(specimenCount) + ' specimens' : 'specimen count missing',
      average != null ? 'avg ' + format(average) + ' ' + row.eUnit : 'average missing',
      individual != null ? 'min ' + format(individual) + ' ' + row.eUnit : 'individual missing'
    ].join('; ');
    const basis = String(row.source || '').trim();

    if (!hasRule) return resultRow('charpy', name, actualText, ruleText, 'review', basis, 'Enter at least one Charpy acceptance requirement.');
    if (!Number.isInteger(requiredCount) || requiredCount < 1) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, 'Required specimen count must be a positive whole number.');
    if (requiredTemperature != null) {
      const problem = Engine.numericDomainError(requiredTemperature, requirementTemperatureUnit, 'charpy_test_temperature', {limit: true});
      if (problem) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, problem);
    }
    for (const value of [requiredAverage, requiredIndividual]) {
      if (value != null) {
        const problem = Engine.numericDomainError(value, row.reqUnit, 'charpy_energy', {limit: true});
        if (problem) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, problem);
      }
    }
    if (requiredAverage != null && requiredIndividual != null && requiredIndividual > requiredAverage) {
      return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, 'Required individual energy cannot exceed the required average energy.');
    }

    const missing = (requiredTemperature != null && testTemperature == null) ||
      (hasEnergyRule && (!Number.isInteger(specimenCount) || specimenCount < 1)) ||
      (requiredAverage != null && average == null) ||
      (requiredIndividual != null && individual == null);
    if (missing) return resultRow('charpy', name, actualText, ruleText, row.mandatory ? 'missing' : 'review', basis, 'Actual evidence needed for a configured criterion is missing.');

    if (testTemperature != null) {
      const problem = Engine.numericDomainError(testTemperature, row.tempUnit, 'charpy_test_temperature', {limit: false});
      if (problem) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, problem);
    }
    for (const value of [average, individual]) {
      if (value != null) {
        const problem = Engine.numericDomainError(value, row.eUnit, 'charpy_energy', {limit: false});
        if (problem) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, problem);
      }
    }
    if (average != null && individual != null && individual > average) return resultRow('charpy', name, actualText, ruleText, 'invalid', basis, 'The reported minimum individual energy cannot exceed the reported average.');

    let conversionProblem = false;
    let outside = false;
    if (requiredTemperature != null) {
      const convertedTemperature = Engine.convert(testTemperature, row.tempUnit, requirementTemperatureUnit);
      conversionProblem = convertedTemperature == null;
      outside = outside || (convertedTemperature != null && convertedTemperature > requiredTemperature + 1e-9);
    }
    if (hasEnergyRule) outside = outside || specimenCount < requiredCount;
    if (requiredAverage != null) {
      const convertedAverage = Engine.convert(average, row.eUnit, row.reqUnit);
      conversionProblem = conversionProblem || convertedAverage == null;
      outside = outside || (convertedAverage != null && convertedAverage < requiredAverage - 1e-9);
    }
    if (requiredIndividual != null) {
      const convertedIndividual = Engine.convert(individual, row.eUnit, row.reqUnit);
      conversionProblem = conversionProblem || convertedIndividual == null;
      outside = outside || (convertedIndividual != null && convertedIndividual < requiredIndividual - 1e-9);
    }
    if (conversionProblem) return resultRow('charpy', name, actualText, ruleText, 'review', basis, 'No defined conversion exists for one or more Charpy criteria.');
    if (!basis) return resultRow('charpy', name, actualText, ruleText, 'review', '', (outside ? 'One or more criteria would not be satisfied, but ' : 'The numerical comparison is favorable, but ') + 'the controlled clause or source is missing.');
    return resultRow('charpy', name, actualText, ruleText, outside ? 'fail' : 'pass', basis, outside ? 'One or more Charpy criteria are not satisfied.' : 'All entered Charpy criteria are satisfied.');
  }

  function evaluateProcess(row) {
    const property = findProperty('process', row);
    const name = property ? property.label : String(row.name || '').trim();
    if (!name) return null;
    const basis = String(row.source || '').trim();
    const actual = row.evidence === 'yes' ? 'Yes' : row.evidence === 'no' ? 'No' : row.evidence === 'not-applicable' ? 'Not applicable' : 'Unknown';
    if (row.evidence === 'no') return resultRow('process', name, actual, 'Evidence must be present', 'fail', basis, basis ? 'Required evidence is explicitly absent.' : 'Required evidence is explicitly absent; the controlled clause or source is also missing.');
    if (row.evidence === 'unknown') return resultRow('process', name, actual, 'Evidence must be present', row.mandatory ? 'missing' : 'review', basis, 'Evidence has not been confirmed.');
    if (row.evidence === 'not-applicable') return resultRow('process', name, actual, 'Applicability must be justified', row.mandatory ? 'review' : 'pass', basis, row.mandatory ? 'Confirm and document why this mandatory evidence is not applicable.' : 'Evidence was marked not applicable.');
    if (!basis) return resultRow('process', name, actual, 'Evidence must be present', 'review', '', 'Evidence is present, but its controlled clause or evidence reference is missing.');
    return resultRow('process', name, actual, 'Evidence must be present', 'pass', basis, 'Required evidence is present.');
  }

  function evaluateState() {
    const selected = selectedSections();
    if (!selected.length) {
      return {
        rows: [], counts: {pass: 0, fail: 0, missing: 0, review: 0, invalid: 0},
        applicable: 0, assessed: 0, coverage: 0, status: 'not-assessed',
        message: 'Select at least one evidence section before running the checker.',
        evaluatedAt: new Date().toISOString()
      };
    }
    const rows = scopeRows();
    const derived = Engine.calculateDerived(currentActuals(), state.scope);
    selected.forEach(section => {
      const evaluated = (state.rows[section] || []).map(row => {
        if (DEF[section].type === 'q') return evaluateQuantitative(section, row, derived);
        if (DEF[section].type === 'c') return evaluateCharpy(row);
        return evaluateProcess(row);
      }).filter(Boolean);
      if (evaluated.length) rows.push(...evaluated);
      else rows.push(resultRow(section, 'Section configuration', 'No requirements entered', 'At least one requirement is needed', 'missing', 'Selected evidence section', 'Configure a requirement or remove this section from the applicable scope.'));
    });

    const counts = {pass: 0, fail: 0, missing: 0, review: 0, invalid: 0};
    rows.forEach(row => { counts[row.status] = (counts[row.status] || 0) + 1; });
    const applicable = rows.length;
    const assessed = counts.pass + counts.fail;
    const coverage = applicable ? Math.round(assessed / applicable * 100) : 0;
    let status = 'not-assessed';
    let message = selected.length ? 'No meaningful requirements were evaluated.' : 'Select at least one evidence section before running the checker.';
    if (applicable) {
      if (counts.invalid) {
        status = 'invalid-input';
        message = 'Invalid values or rule definitions must be corrected before a compliance verdict can be issued.';
      } else if (counts.fail) {
        status = 'fail';
        message = 'At least one controlled entered requirement is not satisfied.';
      } else if (counts.missing || counts.review) {
        status = 'conditional';
        message = 'No controlled failure was found, but mandatory evidence, traceability, or engineering review remains unresolved.';
      } else {
        status = 'pass';
        message = 'All configured requirements and release-gating scope checks are satisfied.';
      }
    }
    return {rows, counts, applicable, assessed, coverage, status, message, evaluatedAt: new Date().toISOString()};
  }

  function statusLabel(status) {
    const labels = {
      'not-assessed': 'Not assessed',
      'invalid-input': 'Invalid input',
      conditional: 'Conditional',
      fail: 'Fail',
      pass: 'Pass',
      invalid: 'Invalid'
    };
    return labels[status] || String(status || '').replace(/-/g, ' ').replace(/^./, character => character.toUpperCase());
  }

  function renderSummary(evaluation, message) {
    const current = evaluation || {
      status: 'not-assessed', message: message || 'Run the checker after entering requirements and actual results.',
      coverage: 0, assessed: 0, applicable: 0, counts: {pass: 0, fail: 0, missing: 0, review: 0, invalid: 0}
    };
    one('#summary').dataset.status = current.status;
    one('#overall').textContent = statusLabel(current.status);
    one('#message').textContent = message || current.message;
    one('#bar').style.width = current.coverage + '%';
    one('#coverage').textContent = current.assessed + ' of ' + current.applicable + ' applicable checks assessed';
    one('#heroStatus').textContent = statusLabel(current.status);
    one('#heroCoverage').textContent = current.coverage + '% evidence coverage';
    one('#metrics').innerHTML = [
      ['Pass', current.counts.pass || 0],
      ['Fail', current.counts.fail || 0],
      ['Missing', current.counts.missing || 0],
      ['Review / invalid', (current.counts.review || 0) + (current.counts.invalid || 0)]
    ].map(item => '<div class="metric"><span>' + esc(item[0]) + '</span><strong>' + item[1] + '</strong></div>').join('');
  }

  function renderResults(evaluation) {
    one('#results').innerHTML = evaluation && evaluation.rows.length ? evaluation.rows.map(row =>
      '<tr><td>' + esc(row.section) + '</td><td><strong>' + esc(row.name) + '</strong>' + (row.detail ? '<br><small>' + esc(row.detail) + '</small>' : '') +
      '</td><td>' + esc(row.actual) + '</td><td>' + esc(row.rule) + '</td><td><span class="badge ' + esc(row.status) + '">' + esc(statusLabel(row.status)) +
      '</span></td><td>' + esc(row.basis) + '</td></tr>'
    ).join('') : '<tr><td colspan="6" class="empty">No current assessment result. Run the checker after completing the inputs.</td></tr>';
  }

  function invalidate(message) {
    result = null;
    renderSummary(null, message || 'Inputs changed. Run the checker to update the decision.');
    renderResults(null);
  }

  function loadStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  function saveStore(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  function exportPayload() {
    return {
      app: 'UpSkill Sprint Material Specification Compliance Checker',
      version: EXPORT_VERSION,
      savedAt: new Date().toISOString(),
      state,
      result
    };
  }

  function normalizeImportedState(candidate) {
    if (!candidate || typeof candidate !== 'object' || !candidate.scope || !candidate.rows) throw new Error('The file is not a valid checker assessment.');
    const normalized = defaultState();
    Object.keys(normalized.scope).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(candidate.scope, key)) normalized.scope[key] = String(candidate.scope[key] == null ? '' : candidate.scope[key]).slice(0, 4000);
    });
    normalized.unitSystem = candidate.unitSystem === 'imperial' ? 'imperial' : 'metric';
    SECTION_KEYS.forEach(section => {
      normalized.selected[section] = typeof candidate.selected?.[section] === 'boolean' ? candidate.selected[section] : true;
      const sourceRows = Array.isArray(candidate.rows[section]) ? candidate.rows[section].slice(0, 250) : [];
      normalized.rows[section] = sourceRows.map(source => {
        const clean = newRow(section, normalized.unitSystem);
        Object.keys(clean).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(source || {}, key)) return;
          clean[key] = key === 'mandatory' ? Boolean(source[key]) : String(source[key] == null ? '' : source[key]).slice(0, 2000);
        });
        clean.id = /^[a-z0-9-]{3,80}$/i.test(String(source.id || '')) ? String(source.id) : uid();
        return clean;
      });
    });
    return normalized;
  }

  function loadPayload(payload) {
    if (!payload || !payload.state) throw new Error('The file is not a valid checker assessment.');
    const version = Number(payload.version || 2);
    if (![2, 3].includes(version)) throw new Error('This assessment version is not supported.');
    state = normalizeImportedState(payload.state);
    result = null;
    activeSection = selectedSections()[0] || '';
    fillScope();
    renderRows();
    renderSummary(null, 'Imported inputs require a fresh compliance check.');
    renderResults(null);
  }

  function renderSaved(selectedName) {
    const saved = loadStore();
    one('#saved').innerHTML = '<option value="">No saved assessment selected</option>' +
      Object.keys(saved).sort((left, right) => String(saved[right].savedAt || '').localeCompare(String(saved[left].savedAt || ''))).map(name =>
        '<option value="' + esc(name) + '"' + (name === selectedName ? ' selected' : '') + '>' + esc(name) + '</option>'
      ).join('');
  }

  function setStatus(message, error) {
    one('#status').textContent = message;
    one('#status').style.color = error ? 'var(--mc-fail)' : 'var(--muted)';
  }

  function workedExample() {
    state = defaultState();
    Object.assign(state.scope, {
      materialId: 'TRAINING-PIPE-001', heatNumber: 'TRAINING-HEAT-01', productForm: 'Line pipe',
      sourceOrg: 'Other', sourceStandard: 'Other / not listed', sourceGrade: 'Custom designation',
      sourceCustom: 'Illustrative HSLA line-pipe material', sourceEdition: 'Training dataset rev A',
      certificateRef: 'TRAINING-MTR-01', requirementStatus: 'working',
      targetOrg: 'Internal', targetStandard: 'Internal specification', targetGrade: 'Custom designation',
      targetCustom: 'Illustrative acceptance plan', targetEdition: 'Training rule set rev A',
      thickness: '12.7', width: '914.4',
      notes: 'Training example only. The limits are illustrative and are not taken from a published standard.'
    });
    state.rows.chemistry = [
      ['chem_carbon', 'Carbon (C)', '.075', '', '.12'],
      ['chem_manganese', 'Manganese (Mn)', '1.58', '', '1.70'],
      ['chem_phosphorus', 'Phosphorus (P)', '.014', '', '.025'],
      ['chem_pcm', 'Carbon equivalent (Pcm)', '.230', '', '.250']
    ].map(values => ({id: uid(), propertyCode: values[0], name: values[1], actual: values[2], aUnit: '%', min: values[3], max: values[4], rUnit: '%', source: 'Illustrative training rule — replace with a controlled clause', mandatory: true}));
    state.rows.mechanical = [
      {id: uid(), propertyCode: 'mech_yield_strength', name: 'Yield strength', actual: '510', aUnit: 'MPa', min: '485', max: '635', rUnit: 'MPa', source: 'Illustrative training rule', mandatory: true},
      {id: uid(), propertyCode: 'mech_tensile_strength', name: 'Tensile strength', actual: '610', aUnit: 'MPa', min: '570', max: '', rUnit: 'MPa', source: 'Illustrative training rule', mandatory: true},
      {id: uid(), propertyCode: 'mech_yt_ratio', name: 'Yield-to-tensile ratio', actual: '', aUnit: 'ratio', min: '', max: '.93', rUnit: 'ratio', source: 'Illustrative training rule', mandatory: true}
    ];
    state.rows.charpy = [{
      id: uid(), propertyCode: 'charpy_body_tl', name: 'Pipe body — T-L orientation',
      testTemp: '-20', tempUnit: '°C', specimenCount: '3', avg: '185', individual: '162', eUnit: 'J',
      reqTemp: '-20', reqTempUnit: '°C', reqSpecimenCount: '3', reqAvg: '120', reqIndividual: '90', reqUnit: 'J',
      source: 'Illustrative training rule', mandatory: true
    }];
    state.rows.dimensions = [
      {id: uid(), propertyCode: 'dim_wall_thickness', name: 'Wall thickness', actual: '12.68', aUnit: 'mm', min: '12.45', max: '12.95', rUnit: 'mm', source: 'Illustrative training tolerance', mandatory: true},
      {id: uid(), propertyCode: 'dim_outside_diameter', name: 'Outside diameter', actual: '914.5', aUnit: 'mm', min: '913.6', max: '915.2', rUnit: 'mm', source: 'Illustrative training tolerance', mandatory: true}
    ];
    state.rows.process = [
      {id: uid(), propertyCode: 'proc_mtr_available', name: 'Controlled MTR is available and traceable', evidence: 'yes', source: 'TRAINING-MTR-01', mandatory: true},
      {id: uid(), propertyCode: 'proc_spec_reviewed', name: 'Controlled target specification edition was reviewed', evidence: 'no', source: 'Training example requires replacement', mandatory: true},
      {id: uid(), propertyCode: 'proc_route_permitted', name: 'Manufacturing route is permitted', evidence: 'unknown', source: 'Training example requires verification', mandatory: true}
    ];
    activeSection = 'chemistry';
    fillScope();
    renderRows();
    invalidate('Training example loaded. Review it, replace every illustrative rule, and run the checker.');
    setStatus('Training example loaded. It is intentionally unresolved and cannot produce a production Pass.');
  }

  function updateScope(event) {
    const control = event.target.closest('[data-scope]');
    if (!control) return;
    const key = control.dataset.scope;
    state.scope[key] = control.value;
    const side = key.startsWith('source') ? 'source' : key.startsWith('target') ? 'target' : '';
    if (side && (key.endsWith('Org') || key.endsWith('Standard'))) {
      if (key.endsWith('Org')) state.scope[side + 'Standard'] = Object.keys(LIB[control.value] || LIB.Other)[0];
      const grades = (LIB[state.scope[side + 'Org']] || LIB.Other)[state.scope[side + 'Standard']] || ['Custom designation'];
      state.scope[side + 'Grade'] = grades[0];
      specificationOptions(side);
      all('[data-scope]').forEach(field => {
        if (field.dataset.scope.startsWith(side)) field.value = state.scope[field.dataset.scope] == null ? '' : state.scope[field.dataset.scope];
      });
    } else if (side && key.endsWith('Grade')) specificationOptions(side);
    invalidate();
  }

  function updateRow(event) {
    const control = event.target.closest('[data-f]');
    const rowElement = control && control.closest('[data-id]');
    if (!control || !rowElement) return;
    const section = rowElement.dataset.sec;
    const row = state.rows[section].find(item => item.id === rowElement.dataset.id);
    if (!row) return;
    const value = control.type === 'checkbox' ? control.checked : control.value;
    row[control.dataset.f] = value;
    if (control.dataset.f === 'propertyCode') {
      const property = (Config.PROPERTIES[section] || []).find(item => item.code === value);
      row.name = property ? property.label : '';
      if (property && property.units && property.units.length) {
        const hasNumbers = ['actual', 'min', 'max'].some(key => key in row && String(row[key] == null ? '' : row[key]).trim() !== '');
        if (!hasNumbers && 'aUnit' in row && !property.units.includes(row.aUnit)) row.aUnit = property.defaultUnit || property.units[0];
        if (!hasNumbers && 'rUnit' in row && !property.units.includes(row.rUnit)) row.rUnit = property.defaultUnit || property.units[0];
      }
    }
    invalidate();
  }

  function initializeEvents() {
    one('#scope').addEventListener('input', updateScope);
    one('#scope').addEventListener('change', updateScope);
    one('#selectors').addEventListener('change', event => {
      const input = event.target.closest('input');
      if (!input) return;
      state.selected[input.value] = input.checked;
      renderRows();
      invalidate();
    });
    one('#tabs').addEventListener('click', event => {
      const tab = event.target.closest('[data-tab]');
      if (!tab) return;
      activeSection = tab.dataset.tab;
      renderRows();
      one('#tab-' + activeSection)?.focus();
    });
    one('#tabs').addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = all('#tabs [role="tab"]');
      let index = tabs.indexOf(event.target);
      if (event.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (tabs[index]) {
        activeSection = tabs[index].dataset.tab;
        renderRows();
        one('#tab-' + activeSection)?.focus();
      }
      event.preventDefault();
    });
    one('#panels').addEventListener('click', event => {
      const add = event.target.closest('[data-add]');
      if (add) {
        state.rows[add.dataset.add].push(newRow(add.dataset.add, state.unitSystem));
        renderRows();
        invalidate();
        return;
      }
      const remove = event.target.closest('[data-remove]');
      if (!remove) return;
      const rowElement = remove.closest('[data-id]');
      state.rows[rowElement.dataset.sec] = state.rows[rowElement.dataset.sec].filter(row => row.id !== rowElement.dataset.id);
      renderRows();
      invalidate();
    });
    one('#panels').addEventListener('input', updateRow);
    one('#panels').addEventListener('change', updateRow);
    one('#unitSystem').addEventListener('change', event => {
      state.unitSystem = event.target.value;
      invalidate('Default units changed. Existing rows retain their row-level units.');
    });
    one('#selectAll').addEventListener('click', () => {
      SECTION_KEYS.forEach(section => { state.selected[section] = true; });
      fillScope();
      renderRows();
      invalidate();
    });
    one('#clearSections').addEventListener('click', () => {
      SECTION_KEYS.forEach(section => { state.selected[section] = false; });
      fillScope();
      renderRows();
      invalidate('No evidence sections are selected.');
    });
    one('#run').addEventListener('click', () => {
      result = evaluateState();
      renderSummary(result);
      renderResults(result);
      one('#overall').scrollIntoView({behavior: 'smooth', block: 'center'});
    });
    one('#example').addEventListener('click', workedExample);
    one('#clear').addEventListener('click', () => {
      if (!confirm('Clear all material information, requirements, and results?')) return;
      state = defaultState();
      activeSection = 'chemistry';
      result = null;
      fillScope();
      renderRows();
      renderSummary(null);
      renderResults(null);
      setStatus('Assessment cleared.');
    });
    one('#save').addEventListener('click', () => {
      const name = prompt('Name this saved assessment:', state.scope.materialId || state.scope.heatNumber || 'Material assessment');
      if (!name || !name.trim()) return;
      try {
        const saved = loadStore();
        const key = name.trim().slice(0, 120);
        if (saved[key] && !confirm('Replace the existing saved assessment “' + key + '”?')) return;
        saved[key] = exportPayload();
        saveStore(saved);
        renderSaved(key);
        setStatus('Assessment saved in this browser.');
      } catch (error) {
        setStatus('Unable to save: ' + error.message, true);
      }
    });
    one('#load').addEventListener('click', () => {
      const name = one('#saved').value;
      if (!name) return setStatus('Select a saved assessment first.', true);
      try {
        loadPayload(loadStore()[name]);
        setStatus('Loaded “' + name + '”. Rerun the checker before use.');
      } catch (error) {
        setStatus('Unable to load: ' + error.message, true);
      }
    });
    one('#delete').addEventListener('click', () => {
      const name = one('#saved').value;
      if (!name) return setStatus('Select a saved assessment first.', true);
      if (!confirm('Delete “' + name + '”?')) return;
      const saved = loadStore();
      delete saved[name];
      saveStore(saved);
      renderSaved('');
      setStatus('Deleted “' + name + '”.');
    });
    one('#export').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = (state.scope.materialId || state.scope.heatNumber || 'material-assessment').replace(/[^a-z0-9_-]+/gi, '-') + '.json';
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus('Assessment exported as JSON.');
    });
    one('#import').addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        setStatus('Unable to import: the assessment exceeds the 2 MB safety limit.', true);
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          loadPayload(JSON.parse(reader.result));
          setStatus('Assessment imported from ' + file.name + '. Rerun the checker before use.');
        } catch (error) {
          setStatus('Unable to import: ' + error.message, true);
        }
        event.target.value = '';
      };
      reader.readAsText(file);
    });
    one('#print').addEventListener('click', () => window.print());
  }

  fillScope();
  renderRows();
  renderSummary(null);
  renderResults(null);
  renderSaved('');
  initializeEvents();

  window.MaterialCheckerCore = {
    version: EXPORT_VERSION,
    evaluate: evaluateState,
    getState: () => JSON.parse(JSON.stringify(state)),
    getResult: () => result ? JSON.parse(JSON.stringify(result)) : null,
    load: loadPayload
  };
}());
