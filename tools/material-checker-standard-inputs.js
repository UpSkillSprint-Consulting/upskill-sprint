(function () {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const unknown = ['', 'Unknown / not recorded'];
  const yesNo = [unknown, [true, 'Yes'], [false, 'No']];
  let current;

  function field(group, key, label, choices, note) {
    const value = current.scope[group]?.[key] ?? (key === 'category' ? current.metadata.category : undefined);
    const attributes = ' data-standard-group="' + group + '" data-standard-key="' + key + '"';
    let control;
    if (choices) {
      const listed = choices.map(option => Array.isArray(option) ? option : [option, option]);
      const rendered = listed.some(option => String(option[0]) === String(value ?? '')) ? listed : [[value, String(value) + ' (imported value)']].concat(listed);
      control = '<select' + attributes + (choices === yesNo ? ' data-standard-boolean' : '') + '>' + rendered.map(option => '<option value="' + esc(option[0]) + '"' + (String(option[0]) === String(value ?? '') ? ' selected' : '') + '>' + esc(option[1]) + '</option>').join('') + '</select>';
    } else {
      control = '<input type="number" step="any"' + attributes + ' value="' + esc(value) + '">';
    }
    return '<label class="standard-field">' + esc(label) + control + (note ? '<small>' + esc(note) + '</small>' : '') + '</label>';
  }

  function context(key, label, choices, note) { return field('standardContext', key, label, choices, note); }
  function test(key, label, choices, note) { return field('standardTests', key, label, choices, note); }
  const pick = (...choices) => [unknown].concat(choices);

  function commonContext(family) {
    let content = context('analysisType', 'Chemistry analysis basis', pick(['HEAT', 'Heat analysis'], ['PRODUCT', 'Product analysis']));
    if (family === 'A36') content += context('unitBasis', 'ASTM normative unit basis', pick(['SI', 'SI (A36M)'], ['IMPERIAL', 'Inch–pound (A36)']), 'Select the ordered standard basis; row unit conversion does not change the standard limits.');
    if (family === 'G40') content += context('unitBasis', 'Assessment table basis', pick(['SI', 'SI table — units of record']), 'Attached G40 screening uses the SI table. Actual result units are selected on each input row.');
    if (family !== 'Z245') content += context('gaugeLengthMM', 'Actual tensile gauge length (mm)', null, family === 'A36' ? 'Record the measured gauge length, including 2 in = 50.8 mm or 8 in = 203.2 mm for inch–pound tests.' : 'Record the actual test gauge length.');
    return content;
  }

  function a36Context() {
    const shape = /shape/i.test(current.scope.productForm || '');
    const plate = /plate/i.test(current.scope.productForm || '');
    let content = commonContext('A36') + context('copperSpecified', 'Copper minimum specified on order', yesNo);
    if (plate) content += context('floorPlate', 'Raised-pattern floor plate', yesNo) +
      context('bearingUse', 'Bearing-plate application', pick(['NONE', 'Ordinary structural use'], ['NON_BRIDGE', 'Bearing plate, other than bridge'], ['BRIDGE', 'Bridge bearing plate']));
    if (plate && current.scope.standardContext?.bearingUse === 'NON_BRIDGE') content += context('manufacturerTestRequired', 'Manufacturer mechanical tests required by order', yesNo);
    if (shape) content += context('flangeThicknessMM', 'Actual flange thickness (mm)') + context('shapeDesignation', 'Shape designation', pick(['WIDE_FLANGE', 'Wide-flange shape'], ['OTHER', 'Other structural shape']));
    content += context('impactSupplement', 'Impact-test supplement ordered', yesNo, 'Ordered supplementary requirements require their controlled acceptance criteria.');
    return content;
  }

  function g40Context() {
    const shape = /shape/i.test(current.scope.productForm || '');
    let content = commonContext('G40') +
      context('productSubtype', 'Actual product subtype', pick(['PLATE', 'Plate'], ['FLOOR_PLATE', 'Floor plate'], ['SHEET', 'Sheet'], ['ROLLED_SHAPE', 'Rolled structural shape'], ['WELDED_SHAPE', 'Welded structural shape'], ['ANGLE', 'Angle'], ['SHEET_PILING', 'Sheet piling'], ['COLD_FORMED_CHANNEL', 'Cold-formed channel'], ['COLD_FORMED_Z', 'Cold-formed Z section'], ['BAR', 'Bar'], ['HSS', 'Hollow structural section'])) +
      context('tensileOrientation', 'Tensile specimen orientation', pick(['LONGITUDINAL', 'Longitudinal'], ['TRANSVERSE', 'Transverse'])) +
      context('tensileSpecimenType', 'Tensile specimen type', pick(['RECTANGULAR', 'Rectangular'], ['STRIP', 'Strip'], ['ROUND', 'Round'], ['FULL_SECTION', 'Full section'])) +
      context('supplyCondition', 'Actual supply / test condition', pick(['AS_ROLLED', 'As rolled'], ['NORMALIZED', 'Normalized'], ['CONTROLLED_ROLLED', 'Controlled rolled'], ['NORMALIZING_ROLLED', 'Normalizing rolled'], ['QT', 'Quenched and tempered']));
    if (shape || /SHAPE|ANGLE|SHEET_PILING/.test(current.scope.standardContext?.productSubtype || '')) content +=
      context('shapeGroup', 'Structural shape size group', pick(['1', 'Group 1'], ['2', 'Group 2'], ['3', 'Group 3'], ['4', 'Group 4'], ['5', 'Group 5'])) +
      context('shapeTestLocation', 'Structural shape tensile test location', pick(['FLANGE', 'Flange'], ['WEB', 'Web'])) + context('flangeThicknessMM', 'Flange thickness (mm)');
    if (/T\b|T\s*\//.test(current.scope.targetGrade || '')) content += context('impactCategory', 'Ordered impact category', pick(['1', 'Category 1'], ['2', 'Category 2'], ['3', 'Category 3'], ['4', 'Category 4'], ['5', 'Category 5 — agreed requirements']));
    return content;
  }

  function z245Context() {
    let content = commonContext('Z245') + context('category', 'Ordered pipe category', pick(['I', 'Category I'], ['II', 'Category II'], ['III', 'Category III'])) +
      context('odMM', 'Nominal outside diameter (mm)', null, 'Record the ordered nominal OD, independently of measured dimensional results.') +
      context('form', 'Pipe manufacturing method', pick(['SEAMLESS', 'Seamless'], ['ERW_HFW', 'Electric welded / HFW'], ['SAWL', 'Longitudinal submerged-arc welded'], ['SAWH', 'Helical submerged-arc welded'])) +
      context('supplyCondition', 'Supply / post-forming heat treatment', pick(['AS_MANUFACTURED', 'As manufactured'], ['HN', 'Normalized / normalized and tempered (HN)'], ['HQ', 'Quenched and tempered (HQ)'], ['HS', 'Subcritical stress relieved (HS)'], ['HA', 'Subcritical age / precipitation hardened (HA)'])) +
      context('serviceCondition', 'Ordered service condition', pick(['BASE', 'Base standard'], ['SOUR', 'Sour service'], ['ELEVATED', 'Elevated-temperature service'], ['STRAIN', 'Strain-based design']), 'Record additional annex selections below if more than one service requirement applies.') +
      '<label class="standard-field">Additional service annexes<select multiple data-standard-group="standardContext" data-standard-key="annexSelections" data-standard-array>' +
      [['SOUR','Sour service'],['ELEVATED','Elevated-temperature service'],['STRAIN','Strain-based design']].map(([value,label]) => '<option value="' + value + '"' + ((current.scope.standardContext?.annexSelections || []).includes(value) ? ' selected' : '') + '>' + label + '</option>').join('') + '</select><small>Use Ctrl / Command to select more than one.</small></label>' +
      context('tensileSpecimen', 'Tensile specimen type', pick(['FLATTENED_STRIP', 'Flattened strip'], ['UNFLATTENED_STRIP', 'Unflattened strip'], ['ROUND', 'Round'], ['FULL_SECTION', 'Full section'], ['OTHER', 'Other permitted specimen'])) +
      context('nominalAreaMM2', 'Nominal tensile specimen area (mm²)', null, 'Use the nominal specimen area, before the standard rounding and area cap.') +
      context('gaugeLengthMM', 'Actual elongation gauge length (mm)') + context('elongationConvertedTo50MM', 'Elongation converted to 50 mm basis', yesNo, 'Required where the recorded gauge differs; retain the controlled conversion record.') +
      context('toughnessTarget', 'Toughness test location', pick(['BODY', 'Pipe body'], ['SAW_WELD', 'SAW weld'], ['SAW_HAZ', 'SAW heat-affected zone'], ['EW_FUSION_LINE', 'EW fusion line'], ['EW_WELD_ZONE', 'EW weld zone'])) +
      context('orderTemperatureC', 'Ordered body toughness temperature (°C)') + context('orderedCvnEnergyJ', 'Additional ordered CVN average energy (J)', null, 'Leave blank when no additional energy minimum is ordered; mandatory standard requirements still apply.');
    const target = current.scope.standardContext?.toughnessTarget;
    if (target === 'EW_FUSION_LINE') content += context('fusionLineOrderTemperatureC', 'Ordered fusion-line temperature (°C)', null, 'The source default is resolved by the standard; enter a colder ordered value if applicable.');
    if (['SAW_WELD','SAW_HAZ'].includes(target)) content += context('sawWeldToughnessOrdered', 'SAW weld / HAZ toughness ordered', yesNo);
    if (target === 'EW_WELD_ZONE') content += context('ewFusionLineAtBodyTemperaturePassed', 'Fusion-line tests passed at ordered body temperature', yesNo, 'A claimed weld-zone waiver requires traceable fusion-line test evidence.');
    return content;
  }

  function specimenInputs(key, count, label) {
    const values = current.scope.standardTests?.[key] || [];
    return '<div class="standard-specimens"><span>' + esc(label) + '</span><div>' + Array.from({length: count}, (_, index) => '<label>Specimen ' + (index + 1) + '<input type="number" step="any" data-standard-group="standardTests" data-standard-key="' + key + '" data-standard-index="' + index + '" value="' + esc(values[index]) + '"></label>').join('') + '</div></div>';
  }

  function testInputs(family) {
    if (family === 'A36') return '<p class="standard-muted">The base A36 edition provides no mandatory Charpy acceptance limits. Enter ordered supplementary test criteria as additional requirements.</p>';
    if (family === 'G40' && !/T\b|T\s*\//.test(current.scope.targetGrade || '')) return '<p class="standard-muted">The selected base grade has no mandatory Charpy acceptance criteria. Ordered additional toughness requirements must be entered from their controlled source.</p>';
    let content = '<p class="standard-muted">Enter individual test results from the same certificate. The evaluator determines applicability, sample count, energy, shear and temperature criteria.</p><div class="standard-fields">' +
      test('cvnUnit', 'CVN energy unit', pick('J', 'ft-lb')) + (family === 'G40' ? test('cvnSize', 'CVN specimen size fraction', pick(['10x10', 'Full size'], '3/4 size','2/3 size','1/2 size','1/3 size','1/4 size'), 'Fractional sizes use the attached G40 table; actual specimen geometry follows the referenced test method.') : test('cvnSize', 'CVN specimen size (mm)', pick('10x10','10x7.5','10x6.7','10x5','10x3.3','10x2.5'))) +
      test('testTemperatureC', 'Actual CVN test temperature (°C)') + '</div>' + specimenInputs('cvnEnergies', 3, 'CVN absorbed energy');
    if (family === 'Z245') content += specimenInputs('cvnShears', 3, 'CVN shear area (%)') + '<div class="standard-fields">' +
      test('orderHeatCount', 'Number of heats supplied on this order') + test('orderAverageShear', 'Actual average shear across supplied heats (%)') + test('dwttTemperatureC', 'Actual DWTT test temperature (°C)') + '</div>' +
      specimenInputs('dwttShears', 2, 'DWTT shear area (%)') + '<div class="standard-fields">' +
      test('hydroPressureMPa', 'Actual hydrostatic pressure (MPa)') + test('hydroHoldSeconds', 'Actual hydrostatic hold time (s)') + '</div>';
    if (family === 'Z245' && (current.scope.standardContext?.serviceCondition === 'SOUR' || current.scope.standardContext?.annexSelections?.includes('SOUR'))) content += '<div class="standard-fields">' + test('hardnessHRC', 'Maximum sour-service hardness (HRC)') + test('hardnessHV10', 'Maximum macrohardness (HV10)') + test('microhardnessHV05', 'Maximum microhardness (HV0.5)') + '</div>';
    return content;
  }

  function documentaryInputs(metadata) {
    const checks = metadata.documentaryChecks || [];
    if (!checks.length) return '<p class="standard-muted">Applicable documentary checks appear after the product context is supplied.</p>';
    return checks.map(check => {
      const evidence = current.scope.standardEvidence?.[check.id] || {};
      const status = typeof evidence === 'string' ? evidence : evidence.value || evidence.status || 'unknown';
      return '<div class="standard-evidence"><div><strong>' + esc(check.label || check.id) + '</strong><p>' + esc(check.detail || '') + '</p><small>' + esc(check.basis || '') + '</small></div>' +
        '<label class="standard-field">Evidence status<select data-standard-evidence="' + esc(check.id) + '" data-evidence-field="value">' + [['unknown','Not verified'],['yes','Verified'],['no','Not satisfied']].map(([value,label]) => '<option value="' + value + '"' + (status === value ? ' selected' : '') + '>' + label + '</option>').join('') + '</select></label>' +
        '<label class="standard-field">Certificate / review reference<input data-standard-evidence="' + esc(check.id) + '" data-evidence-field="reference" value="' + esc(evidence.reference || evidence.source || '') + '"></label></div>';
    }).join('');
  }

  function render(config) {
    current = config;
    const container = document.getElementById('standardInputs');
    if (!container) return;
    const open = new Set(Array.from(container.querySelectorAll('details[open]')).map(node => node.dataset.standardDetails));
    const metadata = config.metadata || {};
    ['width', 'widthUnit'].forEach(key => {
      const label = document.querySelector('[data-scope="' + key + '"]')?.closest('label');
      if (label) label.hidden = metadata.supported && metadata.family === 'Z245';
    });
    container.hidden = !metadata.supported;
    if (!metadata.supported) { container.innerHTML = ''; return; }
    const family = metadata.family;
    const requirements = (metadata.catalogue || metadata.catalog || []);
    container.innerHTML = '<div class="standard-heading"><div><p class="kicker">Attached standard</p><h2>Standard requirements and test context</h2><p>' + esc(metadata.edition) + '</p></div><button type="button" class="btn outline" data-standard-load>Load standard input rows</button></div>' +
      '<p class="standard-muted">Applicable audited requirements are always checked. Supply the actual product, specimen and order details, then enter certificate results. Additional requirements below remain separate checks.</p>' +
      (metadata.editionMatches === false ? '<p class="standard-edition-alert">The target edition does not match the attached source. <button type="button" class="btn outline" data-standard-edition>Use attached edition</button></p>' : '') +
      '<details data-standard-details="context"' + (open.has('context') ? ' open' : '') + '><summary>Product, specimen and order context</summary><div class="standard-fields">' + (family === 'A36' ? a36Context() : family === 'G40' ? g40Context() : z245Context()) + '</div></details>' +
      '<details data-standard-details="tests"' + (open.has('tests') ? ' open' : '') + '><summary>Individual toughness and other test results</summary>' + testInputs(family) + '</details>' +
      '<details data-standard-details="evidence"' + (open.has('evidence') ? ' open' : '') + '><summary>Required documentary evidence</summary><p class="standard-muted">A verification must include a traceable report or review reference. Unknown evidence keeps the decision unresolved.</p>' + documentaryInputs(metadata) + '</details>' +
      '<details data-standard-details="source"' + (open.has('source') ? ' open' : '') + '><summary>Source identity and requirement catalogue</summary><p class="standard-muted">Source SHA-256: <code>' + esc(metadata.sourceHash) + '</code></p>' +
      requirements.map(item => '<div class="standard-catalogue-entry"><strong>' + esc(item.topic || item.label || '') + '</strong><p>' + esc(item.text || item.detail || '') + '</p><small>' + esc(item.clauseRef || item.basis || '') + '</small></div>').join('') + '</details>';
    if (!container.dataset.standardBound) {
      container.dataset.standardBound = 'true';
      container.addEventListener('click', event => {
        if (event.target.closest('[data-standard-load]')) current.onLoad();
        if (event.target.closest('[data-standard-edition]')) current.onEdition(current.metadata.edition);
      });
      const update = event => {
        const evidenceControl = event.target.closest('[data-standard-evidence]');
        if (evidenceControl) {
          const id = evidenceControl.dataset.standardEvidence;
          const existing = current.scope.standardEvidence?.[id];
          current.onChange('standardEvidence', id, Object.assign({}, typeof existing === 'object' ? existing : {}, {[evidenceControl.dataset.evidenceField]: evidenceControl.value}));
          return;
        }
        const control = event.target.closest('[data-standard-key]');
        if (!control) return;
        const group = control.dataset.standardGroup, key = control.dataset.standardKey;
        let value = control.value;
        if (control.hasAttribute('data-standard-boolean')) value = value === 'true' ? true : value === 'false' ? false : '';
        if (control.hasAttribute('data-standard-array')) value = Array.from(control.selectedOptions).map(option => option.value);
        if (control.hasAttribute('data-standard-index')) {
          value = (current.scope[group]?.[key] || []).slice();
          value[Number(control.dataset.standardIndex)] = control.value;
        }
        current.onChange(group, key, value);
        if (event.type === 'change') render(Object.assign({}, current, {metadata: window.MaterialCheckerStandards.inspect({scope: current.scope})}));
      };
      container.addEventListener('input', update);
      container.addEventListener('change', update);
    }
  }
  window.MaterialCheckerStandardInputs = {render};
}());
