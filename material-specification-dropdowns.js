(function () {
  'use strict';

  const CHECKER_PATH = '/tools/material-specification-compliance-checker';

  const SPECIFICATIONS = {
    CSA: [
      {
        code: 'CSA G40.21',
        title: 'Structural quality steel',
        grades: [
          'Grade 260W',
          'Grade 260WT',
          'Grade 300W',
          'Grade 300WT',
          'Grade 350W',
          'Grade 350WT',
          'Grade 350A',
          'Grade 350AT',
          'Grade 380W',
          'Grade 380WT',
          'Grade 400W',
          'Grade 400WT',
          'Grade 480W',
          'Grade 480WT'
        ]
      },
      {
        code: 'CSA Z245.1',
        title: 'Steel pipe',
        grades: [
          'Grade 241 Category I',
          'Grade 241 Category II',
          'Grade 290 Category I',
          'Grade 290 Category II',
          'Grade 317 Category I',
          'Grade 317 Category II',
          'Grade 359 Category I',
          'Grade 359 Category II',
          'Grade 386 Category I',
          'Grade 386 Category II',
          'Grade 414 Category I',
          'Grade 414 Category II',
          'Grade 448 Category I',
          'Grade 448 Category II',
          'Grade 483 Category I',
          'Grade 483 Category II',
          'Grade 550 Category I',
          'Grade 550 Category II',
          'Grade 620 Category I',
          'Grade 620 Category II',
          'Grade 690 Category I',
          'Grade 690 Category II'
        ]
      }
    ],
    ASTM: [
      {
        code: 'ASTM A36/A36M',
        title: 'Carbon structural steel',
        grades: ['Grade 36']
      },
      {
        code: 'ASTM A283/A283M',
        title: 'Low and intermediate tensile strength carbon steel plate',
        grades: ['Grade A', 'Grade B', 'Grade C', 'Grade D']
      },
      {
        code: 'ASTM A514/A514M',
        title: 'High-yield-strength quenched and tempered alloy steel plate',
        grades: [
          'Grade A', 'Grade B', 'Grade C', 'Grade E', 'Grade F', 'Grade H',
          'Grade J', 'Grade K', 'Grade M', 'Grade P', 'Grade Q', 'Grade S', 'Grade T'
        ]
      },
      {
        code: 'ASTM A516/A516M',
        title: 'Pressure vessel carbon steel plate',
        grades: ['Grade 55', 'Grade 60', 'Grade 65', 'Grade 70']
      },
      {
        code: 'ASTM A537/A537M',
        title: 'Heat-treated pressure vessel carbon-manganese-silicon steel plate',
        grades: ['Class 1', 'Class 2', 'Class 3']
      },
      {
        code: 'ASTM A572/A572M',
        title: 'High-strength low-alloy columbium-vanadium structural steel',
        grades: ['Grade 42', 'Grade 50', 'Grade 55', 'Grade 60', 'Grade 65']
      },
      {
        code: 'ASTM A588/A588M',
        title: 'High-strength low-alloy structural steel with atmospheric corrosion resistance',
        grades: ['Grade A', 'Grade B', 'Grade C', 'Grade K']
      },
      {
        code: 'ASTM A709/A709M',
        title: 'Structural steel for bridges',
        grades: [
          'Grade 36', 'Grade 50', 'Grade 50S', 'Grade 50W',
          'Grade HPS 50W', 'Grade HPS 70W', 'Grade 100', 'Grade 100W'
        ]
      },
      {
        code: 'ASTM A1011/A1011M',
        title: 'Hot-rolled carbon, structural, HSLA, and improved-formability steel sheet and strip',
        grades: [
          'Commercial Steel Type A', 'Commercial Steel Type B', 'Commercial Steel Type C',
          'Drawing Steel Type A', 'Drawing Steel Type B',
          'Structural Steel Grade 30', 'Structural Steel Grade 33', 'Structural Steel Grade 36',
          'Structural Steel Grade 40', 'Structural Steel Grade 45', 'Structural Steel Grade 50',
          'Structural Steel Grade 55', 'Structural Steel Grade 60', 'Structural Steel Grade 65',
          'Structural Steel Grade 70', 'Structural Steel Grade 80',
          'HSLAS Grade 45', 'HSLAS Grade 50', 'HSLAS Grade 55', 'HSLAS Grade 60',
          'HSLAS Grade 65', 'HSLAS Grade 70', 'HSLAS Grade 80'
        ]
      },
      {
        code: 'ASTM A1018/A1018M',
        title: 'Hot-rolled heavy-thickness sheet and strip',
        grades: [
          'Commercial Steel', 'Drawing Steel',
          'Structural Steel Grade 30', 'Structural Steel Grade 33', 'Structural Steel Grade 36',
          'Structural Steel Grade 40', 'Structural Steel Grade 45', 'Structural Steel Grade 50',
          'Structural Steel Grade 55', 'Structural Steel Grade 60', 'Structural Steel Grade 65',
          'Structural Steel Grade 70', 'Structural Steel Grade 80',
          'HSLAS Grade 45', 'HSLAS Grade 50', 'HSLAS Grade 55', 'HSLAS Grade 60',
          'HSLAS Grade 65', 'HSLAS Grade 70', 'HSLAS Grade 80'
        ]
      }
    ]
  };

  const FIELD_LABELS = [
    'original certified specification',
    'target specification / grade'
  ];

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isCheckerPage() {
    const path = window.location.pathname.replace(/\.html$/i, '').replace(/\/+$/, '');
    return path.endsWith(CHECKER_PATH);
  }

  function addStyles() {
    if (document.getElementById('upskill-specification-dropdown-styles')) return;

    const style = document.createElement('style');
    style.id = 'upskill-specification-dropdown-styles';
    style.textContent = `
      .upskill-spec-selector {
        display: grid;
        gap: 9px;
        width: 100%;
      }
      .upskill-spec-selector-grid {
        display: grid;
        grid-template-columns: minmax(118px, .72fr) minmax(210px, 1.3fr) minmax(190px, 1fr);
        gap: 9px;
        width: 100%;
      }
      .upskill-spec-selector select,
      .upskill-spec-selector input[type="text"] {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 46px !important;
        margin: 0 !important;
        padding: 10px 38px 10px 13px !important;
        border: 1px solid var(--line, #cfd8e5) !important;
        border-radius: 9px !important;
        background-color: var(--surface, var(--card, #ffffff)) !important;
        color: var(--ink, #172033) !important;
        font: inherit !important;
        line-height: 1.25 !important;
      }
      .upskill-spec-selector input[type="text"] {
        padding-right: 13px !important;
      }
      .upskill-spec-selector select:focus,
      .upskill-spec-selector input[type="text"]:focus {
        border-color: var(--teal, #0e7490) !important;
        box-shadow: 0 0 0 3px rgba(14, 116, 144, .16) !important;
        outline: none !important;
      }
      .upskill-spec-selector select:disabled {
        cursor: not-allowed !important;
        opacity: .62 !important;
      }
      .upskill-spec-custom[hidden] {
        display: none !important;
      }
      .upskill-spec-summary {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-height: 22px;
        color: var(--muted, #5e6b7f);
        font-size: 12px;
        line-height: 1.45;
      }
      .upskill-spec-summary strong {
        color: var(--ink-soft, var(--ink, #172033));
        font-weight: 700;
      }
      .upskill-spec-hidden-source {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        margin: -1px !important;
        padding: 0 !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        clip-path: inset(50%) !important;
        border: 0 !important;
        white-space: nowrap !important;
      }
      html[data-theme="dark"] .upskill-spec-selector select,
      html[data-theme="dark"] .upskill-spec-selector input[type="text"] {
        background-color: var(--surface, var(--card, #111c2d)) !important;
        color: var(--ink, #f4f7fb) !important;
      }
      html[data-theme="dark"] .upskill-spec-selector option {
        background: #111c2d !important;
        color: #f4f7fb !important;
      }
      @media (max-width: 920px) {
        .upskill-spec-selector-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function findSourceInput(label) {
    const forId = label.getAttribute('for');
    if (forId) {
      const linked = document.getElementById(forId);
      if (linked instanceof HTMLInputElement) return linked;
    }

    const nested = label.querySelector('input');
    if (nested instanceof HTMLInputElement) return nested;

    let container = label.parentElement;
    for (let depth = 0; container && depth < 4; depth += 1, container = container.parentElement) {
      const input = container.querySelector('input[type="text"], input:not([type])');
      if (input instanceof HTMLInputElement) return input;
    }

    return null;
  }

  function createOption(value, text, disabled) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    option.disabled = Boolean(disabled);
    return option;
  }

  function populateSelect(select, placeholder, values, formatter) {
    select.replaceChildren();
    const blank = createOption('', placeholder, true);
    blank.selected = true;
    select.appendChild(blank);

    values.forEach(function (value) {
      const optionValue = typeof value === 'string' ? value : value.code;
      const optionText = formatter ? formatter(value) : optionValue;
      select.appendChild(createOption(optionValue, optionText, false));
    });

    select.appendChild(createOption('__other__', 'Other / not listed', false));
  }

  function findDefinition(organization, standardCode) {
    return (SPECIFICATIONS[organization] || []).find(function (item) {
      return item.code === standardCode;
    }) || null;
  }

  function parseExistingValue(value) {
    const clean = String(value || '').trim();
    if (!clean) return null;

    for (const organization of Object.keys(SPECIFICATIONS)) {
      for (const definition of SPECIFICATIONS[organization]) {
        if (clean === definition.code) {
          return { organization: organization, standard: definition.code, grade: '' };
        }
        if (clean.startsWith(definition.code + ' ')) {
          const grade = clean.slice(definition.code.length + 1).trim();
          if (definition.grades.includes(grade)) {
            return { organization: organization, standard: definition.code, grade: grade };
          }
        }
      }
    }

    return { organization: '__other__', standard: '__other__', grade: '', custom: clean };
  }

  function enhanceField(label, index) {
    if (label.dataset.upskillSpecificationEnhanced === 'true') return;

    const source = findSourceInput(label);
    if (!source) return;

    label.dataset.upskillSpecificationEnhanced = 'true';
    source.classList.add('upskill-spec-hidden-source');
    source.setAttribute('aria-hidden', 'true');
    source.tabIndex = -1;

    const fieldName = label.textContent.trim();
    const wrapper = document.createElement('div');
    wrapper.className = 'upskill-spec-selector';
    wrapper.dataset.specificationSelector = String(index);

    const grid = document.createElement('div');
    grid.className = 'upskill-spec-selector-grid';

    const organizationSelect = document.createElement('select');
    organizationSelect.setAttribute('aria-label', fieldName + ': standards organization');
    organizationSelect.appendChild(createOption('', 'Select CSA or ASTM', true));
    organizationSelect.appendChild(createOption('CSA', 'CSA', false));
    organizationSelect.appendChild(createOption('ASTM', 'ASTM', false));
    organizationSelect.appendChild(createOption('__other__', 'Other / not listed', false));

    const standardSelect = document.createElement('select');
    standardSelect.setAttribute('aria-label', fieldName + ': standard');
    standardSelect.disabled = true;
    populateSelect(standardSelect, 'Select standard', [], null);

    const gradeSelect = document.createElement('select');
    gradeSelect.setAttribute('aria-label', fieldName + ': grade');
    gradeSelect.disabled = true;
    populateSelect(gradeSelect, 'Select grade', [], null);

    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.className = 'upskill-spec-custom';
    customInput.placeholder = 'Enter the complete specification and grade';
    customInput.setAttribute('aria-label', fieldName + ': other specification');
    customInput.hidden = true;

    const summary = document.createElement('div');
    summary.className = 'upskill-spec-summary';
    summary.setAttribute('aria-live', 'polite');

    grid.append(organizationSelect, standardSelect, gradeSelect);
    wrapper.append(grid, customInput, summary);
    source.insertAdjacentElement('afterend', wrapper);

    let internalUpdate = false;
    let lastSourceValue = source.value;

    function updateSummary(value) {
      summary.replaceChildren();
      const prefix = document.createElement('strong');
      prefix.textContent = value ? 'Selected:' : 'Selection required:';
      const text = document.createElement('span');
      text.textContent = value || 'Choose an organization, standard, and grade.';
      summary.append(prefix, text);
    }

    function setSourceValue(value) {
      const clean = String(value || '').trim();
      if (source.value === clean) {
        updateSummary(clean);
        return;
      }

      internalUpdate = true;
      source.value = clean;
      lastSourceValue = clean;
      source.dispatchEvent(new Event('input', { bubbles: true }));
      source.dispatchEvent(new Event('change', { bubbles: true }));
      internalUpdate = false;
      updateSummary(clean);
    }

    function updateStandards() {
      const organization = organizationSelect.value;

      if (organization === '__other__') {
        standardSelect.disabled = true;
        gradeSelect.disabled = true;
        customInput.hidden = false;
        customInput.focus();
        setSourceValue(customInput.value);
        return;
      }

      customInput.hidden = true;
      customInput.value = '';
      gradeSelect.disabled = true;
      populateSelect(gradeSelect, 'Select grade', [], null);

      if (!organization || !SPECIFICATIONS[organization]) {
        standardSelect.disabled = true;
        populateSelect(standardSelect, 'Select standard', [], null);
        setSourceValue('');
        return;
      }

      standardSelect.disabled = false;
      populateSelect(
        standardSelect,
        'Select standard',
        SPECIFICATIONS[organization],
        function (item) { return item.code + ' — ' + item.title; }
      );
      setSourceValue('');
    }

    function updateGrades() {
      const organization = organizationSelect.value;
      const standardCode = standardSelect.value;

      if (standardCode === '__other__') {
        gradeSelect.disabled = true;
        customInput.hidden = false;
        customInput.focus();
        setSourceValue(customInput.value);
        return;
      }

      customInput.hidden = true;
      customInput.value = '';
      const definition = findDefinition(organization, standardCode);

      if (!definition) {
        gradeSelect.disabled = true;
        populateSelect(gradeSelect, 'Select grade', [], null);
        setSourceValue('');
        return;
      }

      gradeSelect.disabled = false;
      populateSelect(gradeSelect, 'Select grade', definition.grades, null);
      setSourceValue(definition.grades.length ? '' : definition.code);
    }

    function updateValueFromSelections() {
      if (organizationSelect.value === '__other__' || standardSelect.value === '__other__' || gradeSelect.value === '__other__') {
        customInput.hidden = false;
        setSourceValue(customInput.value);
        return;
      }

      const standardCode = standardSelect.value;
      const grade = gradeSelect.value;
      setSourceValue(standardCode && grade ? standardCode + ' ' + grade : standardCode || '');
    }

    function applyParsedValue(parsed) {
      if (!parsed) {
        organizationSelect.value = '';
        updateStandards();
        updateSummary('');
        return;
      }

      if (parsed.organization === '__other__') {
        organizationSelect.value = '__other__';
        updateStandards();
        customInput.value = parsed.custom || '';
        updateSummary(parsed.custom || '');
        return;
      }

      organizationSelect.value = parsed.organization;
      updateStandards();
      standardSelect.value = parsed.standard;
      updateGrades();
      if (parsed.grade) gradeSelect.value = parsed.grade;
      updateSummary(source.value);
    }

    organizationSelect.addEventListener('change', updateStandards);
    standardSelect.addEventListener('change', updateGrades);
    gradeSelect.addEventListener('change', updateValueFromSelections);
    customInput.addEventListener('input', function () {
      setSourceValue(customInput.value);
    });

    source.addEventListener('input', function () {
      if (internalUpdate) return;
      lastSourceValue = source.value;
      applyParsedValue(parseExistingValue(source.value));
    });
    source.addEventListener('change', function () {
      if (internalUpdate) return;
      lastSourceValue = source.value;
      applyParsedValue(parseExistingValue(source.value));
    });

    const form = source.closest('form');
    if (form) {
      form.addEventListener('reset', function () {
        window.setTimeout(function () {
          lastSourceValue = source.value;
          applyParsedValue(parseExistingValue(source.value));
        }, 0);
      });
    }

    // Import routines sometimes assign input.value without dispatching an event.
    // A lightweight check keeps the visible selectors synchronized with imported data.
    window.setInterval(function () {
      if (source.value !== lastSourceValue && !internalUpdate) {
        lastSourceValue = source.value;
        applyParsedValue(parseExistingValue(source.value));
      }
    }, 750);

    applyParsedValue(parseExistingValue(source.value));
  }

  function initialize() {
    if (!isCheckerPage()) return;
    addStyles();

    const labels = Array.from(document.querySelectorAll('label')).filter(function (label) {
      return FIELD_LABELS.includes(normalize(label.textContent));
    });

    labels.forEach(enhanceField);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
