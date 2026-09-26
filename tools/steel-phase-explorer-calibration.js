(function () {
  'use strict';

  /*
   * Steel Phase Explorer — plant-calibration engine
   *
   * This module deliberately contains no DOM or persistence code. Imported
   * rows remain in this module's in-memory session. A fitted correction is a
   * calibration candidate only; it never changes the generic property model
   * and never promotes itself to "Plant calibrated".
   */
  if (typeof window === 'undefined') return;
  window.__SPX = window.__SPX || {};
  if (window.__SPX.calibration) return;

  var CONTRACT_VERSION = '1.0';
  var GENERIC_MODEL_ID = 'spx-property-v1';
  var MAX_IMPORT_BYTES = 2 * 1024 * 1024;
  var MAX_ROWS = 5000;
  var MAX_COLUMNS = 64;
  var MAX_CELL_CHARS = 2000;
  var MAX_TEXT = 500;
  var MAX_DIAGNOSTICS = 200;
  var EWMA_LAMBDA = 0.2;
  var DANGEROUS_KEYS = Object.create(null);
  DANGEROUS_KEYS.__proto__ = true;
  DANGEROUS_KEYS.prototype = true;
  DANGEROUS_KEYS.constructor = true;
  var ROLES = ['calibration', 'validation', 'monitoring'];
  var GROUP_MODES = ['heat', 'batch'];
  var CHEMISTRY_KEYS = ['C', 'Mn', 'Si', 'Ni', 'Cr', 'Mo', 'V', 'Cu', 'B'];
  var SCOPE_TEXT_FIELDS = [
    'site', 'line', 'processRoute', 'productFamily', 'measurementLocation',
    'measurementBasis', 'coolingRateDefinition', 'coolingRateLocation'
  ];
  var CHEMISTRY_BOUNDS = {
    C: [0.02, 1.2],
    Mn: [0, 2],
    Si: [0, 0.6],
    Ni: [0, 1],
    Cr: [0, 1.5],
    Mo: [0, 0.6],
    V: [0, 0.15],
    Cu: [0, 0.6],
    B: [0, 0.003]
  };
  var SPEC_FORMS = ['PLATE', 'COIL', 'SEAMLESS', 'ERW_HFW', 'SAWL', 'SAWH'];
  var SPEC_PSLS = ['PSL1', 'PSL2'];
  var SPEC_CATEGORIES = ['CAT_I', 'CAT_II', 'CAT_III'];
  var TARGETS = {
    'hardness-hv': {
      label: 'Hardness',
      unit: 'model-HV',
      property: 'hv',
      scale: 1,
      actualMin: 1,
      actualMax: 2000
    },
    'yield-strength-mpa': {
      label: 'Yield strength',
      unit: 'MPa',
      property: 'ys',
      scale: 1,
      actualMin: 1,
      actualMax: 5000
    },
    'tensile-strength-mpa': {
      label: 'Tensile strength',
      unit: 'MPa',
      property: 'uts',
      scale: 1,
      actualMin: 1,
      actualMax: 5000
    },
    'elongation-pct': {
      label: 'Elongation',
      unit: '%',
      property: 'elong',
      scale: 1,
      actualMin: 0,
      actualMax: 100
    }
  };

  /*
   * Capture the current evaluator once. Calibration must remain a correction
   * of the frozen generic prediction, not a mutation or later replacement of
   * the source model.
   */
  var GENERIC_PREDICTOR = window.__SPX.release1 &&
    typeof window.__SPX.release1.propertyEstimate === 'function'
    ? window.__SPX.release1.propertyEstimate
    : null;
  var GOVERNANCE_EVALUATOR = window.__SPX.governance &&
    typeof window.__SPX.governance.evaluate === 'function'
    ? window.__SPX.governance.evaluate
    : null;
  var genericRegistryRecord = window.__SPX.governance &&
    typeof window.__SPX.governance.getModel === 'function'
    ? window.__SPX.governance.getModel(GENERIC_MODEL_ID)
    : null;
  var GENERIC_MODEL_VERSION = genericRegistryRecord &&
    typeof genericRegistryRecord.version === 'string'
    ? genericRegistryRecord.version
    : '1.0.0';

  function own(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function clone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function blankMap() {
    return Object.create(null);
  }

  function pushIssue(collection, code, path, message) {
    if (collection.length >= MAX_DIAGNOSTICS) return;
    if (collection.length === MAX_DIAGNOSTICS - 1) {
      collection.push({
        code: 'DIAGNOSTICS_TRUNCATED',
        path: '',
        message: 'Additional diagnostics were omitted after the bounded reporting limit.'
      });
      return;
    }
    collection.push({ code: code, path: path || '', message: message });
  }

  function pushIssueOnce(collection, code, path, message) {
    if (collection.some(function (item) { return item && item.code === code; })) return;
    pushIssue(collection, code, path, message);
  }

  function byteLength(value) {
    var text = String(value == null ? '' : value);
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
    try {
      return unescape(encodeURIComponent(text)).length;
    } catch (ignore) {
      return text.length * 2;
    }
  }

  function formulaLike(value) {
    if (typeof value !== 'string') return false;
    return /^\s*[=+\-@]/.test(value);
  }

  function hasControlCharacters(value) {
    return typeof value === 'string' && /[\u0000-\u001f\u007f]/.test(value);
  }

  function boundedDiagnostics(errors, warnings) {
    var safeErrors = Array.isArray(errors) ? errors.slice(0, MAX_DIAGNOSTICS) : [];
    var available = Math.max(0, MAX_DIAGNOSTICS - safeErrors.length);
    var sourceWarnings = Array.isArray(warnings) ? warnings : [];
    var safeWarnings = sourceWarnings.slice(0, available);
    if (sourceWarnings.length > available && available > 0) {
      safeWarnings[available - 1] = {
        code: 'DIAGNOSTICS_TRUNCATED',
        path: '',
        message: 'Additional diagnostics were omitted after the bounded reporting limit.'
      };
    }
    return { errors: safeErrors, warnings: safeWarnings };
  }

  function boundedResult(result) {
    var diagnostics = boundedDiagnostics(result.errors, result.warnings);
    result.errors = diagnostics.errors;
    result.warnings = diagnostics.warnings;
    return result;
  }

  function stableStringify(value) {
    var seen = [];
    function normalize(item) {
      if (item == null || typeof item !== 'object') {
        if (typeof item === 'number' && !isFinite(item)) {
          throw new TypeError('Cannot fingerprint a non-finite number.');
        }
        if (typeof item === 'function' || typeof item === 'symbol' || typeof item === 'bigint') {
          throw new TypeError('Cannot fingerprint an unsupported value.');
        }
        return item;
      }
      if (seen.indexOf(item) >= 0) throw new TypeError('Cannot fingerprint a cyclic value.');
      seen.push(item);
      var out;
      if (Array.isArray(item)) {
        out = item.map(normalize);
      } else {
        out = {};
        Object.keys(item).sort().forEach(function (key) {
          if (DANGEROUS_KEYS[key]) throw new TypeError('Unsafe object key: ' + key);
          out[key] = normalize(item[key]);
        });
      }
      seen.pop();
      return out;
    }
    return JSON.stringify(normalize(value));
  }

  function hashText(raw) {
    var hash = 2166136261;
    for (var i = 0; i < raw.length; i += 1) {
      hash ^= raw.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return 'SPXCAL-' + ('00000000' + (hash >>> 0).toString(16)).slice(-8) + '-' + raw.length;
  }

  function fingerprint(value) {
    if (arguments.length === 0) {
      return session.packageFingerprint || hashText('{}');
    }
    if (typeof value !== 'string') {
      var inspectionErrors = [];
      inspectInput(value, 'fingerprint', 0, [], inspectionErrors);
      if (inspectionErrors.length) {
        throw new TypeError(inspectionErrors[0].message);
      }
      value = snapshotInput(value, []);
    }
    return hashText(typeof value === 'string' ? value : stableStringify(value));
  }

  function matchesBuiltinPrototype(candidate, reference) {
    if (candidate === reference) return true;
    var constructorDescriptor = Object.getOwnPropertyDescriptor(candidate, 'constructor');
    if (!constructorDescriptor || constructorDescriptor.get || constructorDescriptor.set ||
      typeof constructorDescriptor.value !== 'function' ||
      constructorDescriptor.value.prototype !== candidate) return false;
    var candidateNames = Object.getOwnPropertyNames(candidate).sort();
    var referenceNames = Object.getOwnPropertyNames(reference).sort();
    if (candidateNames.length !== referenceNames.length) return false;
    for (var i = 0; i < referenceNames.length; i += 1) {
      if (candidateNames[i] !== referenceNames[i]) return false;
      var candidateDescriptor = Object.getOwnPropertyDescriptor(candidate, candidateNames[i]);
      var referenceDescriptor = Object.getOwnPropertyDescriptor(reference, referenceNames[i]);
      if (!candidateDescriptor || !referenceDescriptor ||
        Boolean(candidateDescriptor.get) !== Boolean(referenceDescriptor.get) ||
        Boolean(candidateDescriptor.set) !== Boolean(referenceDescriptor.set) ||
        own(candidateDescriptor, 'value') !== own(referenceDescriptor, 'value')) return false;
      ['get', 'set', 'value'].forEach(function (key) {
        var left = candidateDescriptor[key];
        var right = referenceDescriptor[key];
        if (typeof right === 'function') {
          if (typeof left !== 'function' ||
            Function.prototype.toString.call(left) !== Function.prototype.toString.call(right)) {
            candidateDescriptor = null;
          }
        } else if (typeof left !== typeof right) {
          candidateDescriptor = null;
        }
      });
      if (!candidateDescriptor) return false;
    }
    var candidateSymbols = typeof Object.getOwnPropertySymbols === 'function'
      ? Object.getOwnPropertySymbols(candidate) : [];
    var referenceSymbols = typeof Object.getOwnPropertySymbols === 'function'
      ? Object.getOwnPropertySymbols(reference) : [];
    if (candidateSymbols.length !== referenceSymbols.length) return false;
    return referenceSymbols.every(function (symbol) {
      return candidateSymbols.indexOf(symbol) >= 0;
    });
  }

  function snapshotInput(value, stack) {
    if (value == null || typeof value !== 'object') return value;
    if (stack.indexOf(value) >= 0) throw new TypeError('Cyclic input cannot be copied.');
    stack.push(value);
    var isArray = Array.isArray(value);
    var output = isArray ? [] : Object.create(null);
    var names = Object.getOwnPropertyNames(value);
    for (var i = 0; i < names.length; i += 1) {
      var key = names[i];
      if (isArray && key === 'length') continue;
      var descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || descriptor.get || descriptor.set) {
        throw new TypeError('Input properties must be own data properties.');
      }
      output[key] = snapshotInput(descriptor.value, stack);
    }
    stack.pop();
    return output;
  }

  function inspectInput(value, path, depth, stack, errors) {
    if (errors.length >= MAX_DIAGNOSTICS) return;
    if (depth > 24) {
      pushIssue(errors, 'MAX_DEPTH', path, 'Input nesting exceeds the supported depth.');
      return;
    }
    if (value == null) return;
    var type = typeof value;
    if (type === 'number' && !isFinite(value)) {
      pushIssue(errors, 'FINITE_NUMBER', path, 'Numbers must be finite.');
      return;
    }
    if (type === 'function' || type === 'symbol' || type === 'bigint') {
      pushIssue(errors, 'UNSUPPORTED_VALUE', path, 'Functions, symbols, and bigint values are not accepted.');
      return;
    }
    if (type !== 'object') return;
    var prototype;
    try {
      prototype = Object.getPrototypeOf(value);
    } catch (error) {
      pushIssue(errors, 'OBJECT_PROTOTYPE', path,
        'The input object prototype could not be inspected.');
      return;
    }
    var plainArray = false;
    var plainObject = false;
    try {
      plainArray = Array.isArray(value) && prototype &&
        matchesBuiltinPrototype(prototype, Array.prototype);
      plainObject = !Array.isArray(value) &&
        (prototype === null || matchesBuiltinPrototype(prototype, Object.prototype));
    } catch (error) {
      pushIssue(errors, 'OBJECT_PROTOTYPE', path,
        'The input object prototype chain could not be inspected.');
      return;
    }
    if (!plainArray && !plainObject) {
      pushIssue(errors, 'OBJECT_PROTOTYPE', path,
        'Only plain JSON objects and arrays are accepted; inherited payload fields are rejected.');
      return;
    }
    if (plainArray) {
      var lengthDescriptor;
      try {
        lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
      } catch (error) {
        lengthDescriptor = null;
      }
      if (!lengthDescriptor || lengthDescriptor.get || lengthDescriptor.set ||
        !isFinite(lengthDescriptor.value) || lengthDescriptor.value > MAX_ROWS) {
        pushIssue(errors, 'ARRAY_LIMIT', path,
          'Input arrays cannot exceed the ' + MAX_ROWS + '-item safety limit.');
        return;
      }
    }
    if (stack.indexOf(value) >= 0) {
      pushIssue(errors, 'CYCLIC_VALUE', path, 'Cyclic objects are not accepted.');
      return;
    }
    stack.push(value);
    var keys;
    try {
      keys = Object.getOwnPropertyNames(value);
      if (typeof Object.getOwnPropertySymbols === 'function' &&
        Object.getOwnPropertySymbols(value).length) {
        pushIssue(errors, 'SYMBOL_PROPERTY', path,
          'Symbol-keyed input properties are not accepted.');
      }
    } catch (error) {
      stack.pop();
      pushIssue(errors, 'OBJECT_KEYS', path,
        'The input object keys could not be inspected safely.');
      return;
    }
    keys.forEach(function (key) {
      if (DANGEROUS_KEYS[key]) {
        pushIssue(errors, 'UNSAFE_KEY', path ? path + '.' + key : key,
          'Prototype-related object keys are not accepted.');
        return;
      }
      var descriptor;
      try {
        descriptor = Object.getOwnPropertyDescriptor(value, key);
      } catch (error) {
        descriptor = null;
      }
      if (!descriptor) {
        pushIssue(errors, 'PROPERTY_DESCRIPTOR', path ? path + '.' + key : key,
          'The input property could not be inspected safely.');
        return;
      }
      if (descriptor && (descriptor.get || descriptor.set)) {
        pushIssue(errors, 'ACCESSOR_PROPERTY', path ? path + '.' + key : key,
          'Accessor properties are not accepted.');
        return;
      }
      if (descriptor && descriptor.enumerable === false &&
        !(Array.isArray(value) && key === 'length')) {
        pushIssue(errors, 'NON_ENUMERABLE_PROPERTY', path ? path + '.' + key : key,
          'Non-enumerable input properties are not accepted.');
        return;
      }
      inspectInput(descriptor.value,
        path ? path + '.' + key : key, depth + 1, stack, errors);
    });
    stack.pop();
  }

  function warnExtras(source, allowed, path, warnings) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) return;
    Object.keys(source).forEach(function (key) {
      if (allowed.indexOf(key) < 0) {
        pushIssue(warnings, 'EXTRA_FIELD', path ? path + '.*' : '*',
          'Unknown field was ignored for forward compatibility.');
      }
    });
  }

  function cleanText(value, path, errors, options) {
    options = options || {};
    if (value == null) {
      if (options.required) pushIssue(errors, 'REQUIRED', path, 'A value is required.');
      return '';
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      pushIssue(errors, 'TYPE', path, 'Expected text.');
      return '';
    }
    var sourceText = String(value);
    if (sourceText.trim() === '') {
      if (options.required) pushIssue(errors, 'REQUIRED', path, 'A value is required.');
      return '';
    }
    if (hasControlCharacters(sourceText)) {
      pushIssue(errors, 'CONTROL_CHARACTER', path, 'Control characters are not accepted.');
      return '';
    }
    if (formulaLike(sourceText)) {
      pushIssue(errors, 'FORMULA_LIKE_TEXT', path,
        'Formula-like spreadsheet text is not accepted.');
      return '';
    }
    var result = sourceText.trim();
    var max = options.max || MAX_TEXT;
    if (result.length > max) {
      pushIssue(errors, 'MAX_LENGTH', path, 'Text exceeds the ' + max + '-character limit.');
      return '';
    }
    if (options.stableId && !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(result)) {
      pushIssue(errors, 'STABLE_ID', path,
        'Use a stable identifier containing only letters, numbers, dot, underscore, colon, or hyphen.');
      return '';
    }
    return result;
  }

  function decimalNumber(value, path, errors, min, max) {
    var number;
    if (typeof value === 'string' && formulaLike(value)) {
      pushIssue(errors, 'FORMULA_LIKE_TEXT', path,
        'Formula-like spreadsheet values are not accepted.');
      return null;
    }
    if (typeof value === 'number') {
      number = value;
    } else if (typeof value === 'string' &&
      /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value.trim())) {
      number = Number(value);
    } else {
      pushIssue(errors, 'NUMBER', path, 'A finite decimal number is required.');
      return null;
    }
    if (!isFinite(number)) {
      pushIssue(errors, 'FINITE_NUMBER', path, 'A finite number is required.');
      return null;
    }
    if (number < min || number > max) {
      pushIssue(errors, 'RANGE', path,
        'Value must be between ' + min + ' and ' + max + '.');
      return null;
    }
    return number;
  }

  function majorVersion(value) {
    var match = String(value == null ? '' : value).trim().match(/^(\d+)(?:\.\d+)?(?:\.\d+)?$/);
    return match ? Number(match[1]) : null;
  }

  function isoTimestamp(value, path, errors, required) {
    if (value == null) {
      if (required) pushIssue(errors, 'REQUIRED_TIMESTAMP', path,
        'Every calibration, validation, and monitoring row requires an ISO-8601 timestamp.');
      return '';
    }
    var text = cleanText(value, path, errors, { required: true, max: 40 });
    if (!text) return '';
    var isoShape = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
    var dateParts = text.slice(0, 10).split('-').map(Number);
    var calendarDate = dateParts.length === 3
      ? new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])) : null;
    var calendarValid = calendarDate &&
      calendarDate.getUTCFullYear() === dateParts[0] &&
      calendarDate.getUTCMonth() === dateParts[1] - 1 &&
      calendarDate.getUTCDate() === dateParts[2];
    var timeMatch = text.match(/T(\d{2}):(\d{2})(?::(\d{2}))?/);
    var timeValid = !timeMatch ||
      (Number(timeMatch[1]) <= 23 && Number(timeMatch[2]) <= 59 &&
        (timeMatch[3] == null || Number(timeMatch[3]) <= 59));
    if (!isoShape.test(text) || !calendarValid || !timeValid || isNaN(Date.parse(text))) {
      pushIssue(errors, 'TIMESTAMP', path,
        'Timestamp must be an unambiguous ISO-8601 date or date-time.');
      return '';
    }
    return text;
  }

  function timestampMillis(value) {
    return value ? Date.parse(value) : NaN;
  }

  function normalizedIdentity(value) {
    return String(value || '').trim().toLowerCase();
  }

  function parseCsvMatrix(text, errors) {
    var rows = [];
    var row = [];
    var cell = '';
    var quoted = false;
    var closedQuote = false;
    var i = 0;
    while (i < text.length) {
      var character = text.charAt(i);
      if (!quoted && !closedQuote && !row.length && !cell.length && character === '#') {
        var commentEnd = i;
        while (commentEnd < text.length && text.charAt(commentEnd) !== '\n' &&
          text.charAt(commentEnd) !== '\r') commentEnd += 1;
        rows.push([text.slice(i, commentEnd)]);
        if (text.charAt(commentEnd) === '\r' && text.charAt(commentEnd + 1) === '\n') {
          commentEnd += 1;
        }
        i = commentEnd + 1;
        continue;
      }
      if (quoted) {
        if (character === '"') {
          if (text.charAt(i + 1) === '"') {
            cell += '"';
            i += 2;
            continue;
          }
          quoted = false;
          closedQuote = true;
        } else {
          cell += character;
        }
      } else if (closedQuote) {
        if (character === ',') {
          row.push(cell);
          cell = '';
          closedQuote = false;
        } else if (character === '\n' || character === '\r') {
          if (character === '\r' && text.charAt(i + 1) === '\n') i += 1;
          row.push(cell);
          cell = '';
          closedQuote = false;
          if (row.some(function (value) { return String(value).trim() !== ''; })) rows.push(row);
          row = [];
        } else {
          pushIssue(errors, 'CSV_QUOTE', 'csv',
            'Characters after a closing CSV quote must be a delimiter or line ending.');
          return [];
        }
      } else if (character === '"') {
        if (cell.length) {
          pushIssue(errors, 'CSV_QUOTE', 'csv',
            'A quoted CSV field must begin with a quote.');
          return [];
        }
        quoted = true;
      } else if (character === ',') {
        row.push(cell);
        cell = '';
      } else if (character === '\n' || character === '\r') {
        if (character === '\r' && text.charAt(i + 1) === '\n') i += 1;
        row.push(cell);
        cell = '';
        if (row.some(function (value) { return String(value).trim() !== ''; })) rows.push(row);
        row = [];
      } else {
        cell += character;
      }
      i += 1;
    }
    if (quoted) {
      pushIssue(errors, 'CSV_QUOTE', 'csv', 'CSV contains an unterminated quoted field.');
      return [];
    }
    row.push(cell);
    if (row.some(function (value) { return String(value).trim() !== ''; })) rows.push(row);
    if (rows.some(function (current) { return current.length > MAX_COLUMNS; })) {
      pushIssue(errors, 'CSV_COLUMNS', 'csv',
        'CSV exceeds the ' + MAX_COLUMNS + '-column limit.');
      return [];
    }
    if (rows.some(function (current) {
      return current.some(function (value) { return value.length > MAX_CELL_CHARS; });
    })) {
      pushIssue(errors, 'CSV_CELL_LENGTH', 'csv',
        'A CSV cell exceeds the ' + MAX_CELL_CHARS + '-character limit.');
      return [];
    }
    return rows;
  }

  function headerKey(value) {
    return String(value || '').trim().replace(/^\uFEFF/, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  var CSV_ROW_HEADERS = {
    recordid: 'recordId',
    role: 'role',
    heatid: 'heatId',
    batchid: 'batchId',
    c: 'C',
    carbon: 'C',
    mn: 'Mn',
    manganese: 'Mn',
    si: 'Si',
    silicon: 'Si',
    ni: 'Ni',
    nickel: 'Ni',
    cr: 'Cr',
    chromium: 'Cr',
    mo: 'Mo',
    molybdenum: 'Mo',
    v: 'V',
    vanadium: 'V',
    cu: 'Cu',
    copper: 'Cu',
    b: 'B',
    boron: 'B',
    coolingratecpers: 'coolingRateCPerS',
    coolingrate: 'coolingRateCPerS',
    actualvalue: 'actualValue',
    timestamp: 'timestamp'
  };

  var CSV_METADATA_HEADERS = {
    schemaversion: 'schemaVersion',
    contractversion: 'schemaVersion',
    id: 'id',
    packageid: 'id',
    calibrationid: 'id',
    revision: 'revision',
    title: 'title',
    sourcereference: 'sourceReference',
    measurementmethod: 'measurementMethod',
    site: 'site',
    line: 'line',
    processroute: 'processRoute',
    productfamily: 'productFamily',
    thicknessminmm: 'thicknessMinMm',
    thicknessmaxmm: 'thicknessMaxMm',
    measurementlocation: 'measurementLocation',
    measurementbasis: 'measurementBasis',
    coolingratedefinition: 'coolingRateDefinition',
    coolingratelocation: 'coolingRateLocation',
    groupby: 'groupBy',
    target: 'target'
  };

  function assignMetadata(target, key, value, path, errors) {
    if (value == null) return;
    if (typeof value !== 'string' && typeof value !== 'number') {
      pushIssue(errors, 'TYPE', path, 'CSV metadata values must be text or numbers.');
      return;
    }
    if (String(value).trim() === '') return;
    var clean = String(value);
    if (own(target, key) && String(target[key]).trim() !== clean.trim()) {
      pushIssue(errors, 'METADATA_CONFLICT', path,
        'CSV package metadata must be consistent on every row.');
      return;
    }
    target[key] = clean;
  }

  function assignStructuredMetadata(target, key, value, path, errors) {
    if (value == null) return;
    if (own(target, key) && suppliedMetadataValue(target[key]) &&
      !equivalentMetadataValue(target[key], value)) {
      pushIssue(errors, 'METADATA_CONFLICT', path,
        'CSV package metadata must be consistent across comments, columns, and import options.');
      return;
    }
    target[key] = value;
  }

  function parseCommentMetadata(text, metadata, errors, warnings) {
    var match = String(text || '').match(/^\s*#\s*([^:]+)\s*:\s*(.*)$/);
    if (!match) {
      pushIssue(warnings, 'CSV_COMMENT', 'csv',
        'Unrecognized CSV comment was ignored.');
      return;
    }
    var key = headerKey(match[1]);
    var value = match[2];
    var mapped = CSV_METADATA_HEADERS[key];
    if (mapped) {
      assignMetadata(metadata, mapped, value, 'csv.metadata.' + mapped, errors);
      return;
    }
    if (key === 'speccontext') {
      try {
        assignStructuredMetadata(metadata, 'specContext', JSON.parse(value),
          'csv.metadata.specContext', errors);
      } catch (error) {
        pushIssue(errors, 'SPEC_CONTEXT_JSON', 'csv.metadata.specContext',
          'CSV specContext metadata must contain valid JSON.');
      }
      return;
    }
    pushIssue(warnings, 'EXTRA_METADATA', 'csv.metadata.*',
      'Unknown CSV metadata was ignored.');
  }

  function csvToRawPackage(text, options, errors, warnings) {
    var matrix = parseCsvMatrix(text, errors);
    if (errors.length) return null;
    var metadata = {};
    var dataRows = [];
    matrix.forEach(function (row) {
      if (row.length === 1 && /^\s*#/.test(row[0])) {
        parseCommentMetadata(row[0], metadata, errors, warnings);
      } else {
        dataRows.push(row);
      }
    });
    if (!dataRows.length) {
      pushIssue(errors, 'CSV_EMPTY', 'csv', 'CSV does not contain a header row.');
      return null;
    }
    var headers = dataRows.shift();
    var canonical = blankMap();
    headers.forEach(function (header, index) {
      var normalized = headerKey(header);
      var literalHeader = String(header).trim();
      if (!normalized) {
        pushIssue(errors, 'CSV_HEADER', 'csv.headers[' + index + ']',
          'CSV headers cannot be blank.');
        return;
      }
      if (DANGEROUS_KEYS[literalHeader.toLowerCase()]) {
        pushIssue(errors, 'UNSAFE_KEY', 'csv.headers[' + index + ']',
          'Prototype-related CSV headers are not accepted.');
        return;
      }
      if (hasControlCharacters(String(header)) || formulaLike(String(header))) {
        pushIssue(errors, 'CSV_HEADER', 'csv.headers[' + index + ']',
          'CSV headers cannot contain control characters or formula-like text.');
        return;
      }
      var mapped = CSV_ROW_HEADERS[normalized] || CSV_METADATA_HEADERS[normalized] || literalHeader;
      if (own(canonical, mapped)) {
        pushIssue(errors, 'CSV_DUPLICATE_HEADER', 'csv.headers[' + index + ']',
          'CSV contains duplicate or equivalent headers.');
      } else {
        canonical[mapped] = index;
      }
    });
    if (errors.length) return null;
    if (dataRows.length > MAX_ROWS) {
      pushIssue(errors, 'ROW_LIMIT', 'rows',
        'Import exceeds the ' + MAX_ROWS + '-row limit.');
      return null;
    }
    var rawRows = dataRows.map(function (values, rowIndex) {
      var raw = {};
      if (values.length !== headers.length) {
        pushIssue(errors, 'CSV_WIDTH', 'csv.rows[' + rowIndex + ']',
          'Each CSV data row must have exactly ' + headers.length + ' fields.');
      }
      headers.forEach(function (header, columnIndex) {
        var normalized = headerKey(header);
        var key = CSV_ROW_HEADERS[normalized] || CSV_METADATA_HEADERS[normalized] ||
          String(header).trim();
        var value = values[columnIndex] == null ? '' : values[columnIndex];
        if (formulaLike(value) || hasControlCharacters(value)) {
          pushIssue(errors, 'FORMULA_LIKE_TEXT',
            'csv.rows[' + rowIndex + '].*',
            'Formula-like or control-prefixed spreadsheet text is not accepted.');
        }
        if (CSV_METADATA_HEADERS[normalized]) {
          assignMetadata(metadata, CSV_METADATA_HEADERS[normalized], value,
            'csv.rows[' + rowIndex + '].' + key, errors);
        } else {
          raw[key] = value;
        }
      });
      return raw;
    });

    var supplied = options && typeof options === 'object'
      ? (options.metadata && typeof options.metadata === 'object' ? options.metadata : options)
      : {};
    Object.keys(supplied).forEach(function (key) {
      if (key === 'filename' || key === 'format' || key === 'metadata') return;
      if (key === 'specContext') {
        assignStructuredMetadata(metadata, 'specContext', supplied.specContext,
          'options.specContext', errors);
      } else {
        assignMetadata(metadata, key, supplied[key], 'options.' + key, errors);
      }
    });
    metadata.rows = rawRows;
    return metadata;
  }

  function sanitizeSpecContext(raw, errors, warnings) {
    if (raw == null) return null;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      pushIssue(errors, 'TYPE', 'specContext', 'specContext must be an object.');
      return null;
    }
    raw = Object.assign({}, raw);
    var allowed = [
      'schemaVersion', 'specBody', 'gradeKey', 'displayName', 'specEdition',
      'psl', 'category', 'applicableForm', 'verification'
    ];
    warnExtras(raw, allowed, 'specContext', warnings);
    var version = cleanText(raw.schemaVersion, 'specContext.schemaVersion', errors,
      { required: true, max: 20 });
    if (version && majorVersion(version) !== 1) {
      pushIssue(errors, 'SCHEMA_MAJOR', 'specContext.schemaVersion',
        'specContext schema major version must be 1.');
    }
    var psl = raw.psl == null || raw.psl === '' ? null :
      cleanText(raw.psl, 'specContext.psl', errors, { max: 12 });
    if (psl && SPEC_PSLS.indexOf(psl) < 0) {
      pushIssue(errors, 'ENUM', 'specContext.psl', 'Unknown PSL value.');
      psl = null;
    }
    var category = raw.category == null || raw.category === '' ? null :
      cleanText(raw.category, 'specContext.category', errors, { max: 20 });
    if (category && SPEC_CATEGORIES.indexOf(category) < 0) {
      pushIssue(errors, 'ENUM', 'specContext.category', 'Unknown category value.');
      category = null;
    }
    var form = cleanText(raw.applicableForm, 'specContext.applicableForm', errors,
      { required: true, max: 20 });
    if (form && SPEC_FORMS.indexOf(form) < 0) {
      pushIssue(errors, 'ENUM', 'specContext.applicableForm',
        'Unknown applicable material form.');
      form = '';
    }
    var verificationRaw = raw.verification && typeof raw.verification === 'object' &&
      !Array.isArray(raw.verification) ? Object.assign({}, raw.verification) : {};
    warnExtras(verificationRaw, ['lastVerifiedBy', 'lastVerifiedDate', 'notes'],
      'specContext.verification', warnings);
    var verifier = cleanText(verificationRaw.lastVerifiedBy,
      'specContext.verification.lastVerifiedBy', errors, { max: 120 });
    var verifiedDate = cleanText(verificationRaw.lastVerifiedDate,
      'specContext.verification.lastVerifiedDate', errors, { max: 40 });
    var notes = cleanText(verificationRaw.notes,
      'specContext.verification.notes', errors, { max: 500 });
    if (Boolean(verifier) !== Boolean(verifiedDate)) {
      pushIssue(errors, 'VERIFICATION_PAIR', 'specContext.verification',
        'Specification verifier and verification date must be supplied together.');
    }
    if (verifiedDate && isNaN(Date.parse(verifiedDate))) {
      pushIssue(errors, 'VERIFICATION_DATE',
        'specContext.verification.lastVerifiedDate',
        'Specification verification date is invalid.');
    }
    if (!verifier || !verifiedDate) {
      pushIssue(warnings, 'SPEC_CONTEXT_UNVERIFIED', 'specContext',
        'Specification context is unverified and is retained for traceability only.');
    }
    pushIssue(warnings, 'SPEC_CONTEXT_TRACEABILITY_ONLY', 'specContext',
      'Specification context does not train, validate, approve, or authorize the calibration.');
    return {
      schemaVersion: version || CONTRACT_VERSION,
      specBody: cleanText(raw.specBody, 'specContext.specBody', errors,
        { required: true, stableId: true, max: 80 }),
      gradeKey: cleanText(raw.gradeKey, 'specContext.gradeKey', errors,
        { required: true, stableId: true, max: 100 }),
      displayName: cleanText(raw.displayName, 'specContext.displayName', errors,
        { required: true, max: 160 }),
      specEdition: cleanText(raw.specEdition, 'specContext.specEdition', errors,
        { required: true, max: 160 }),
      psl: psl,
      category: category,
      applicableForm: form,
      verification: {
        lastVerifiedBy: verifier || null,
        lastVerifiedDate: verifiedDate || null,
        notes: notes
      }
    };
  }

  function validateMeasurementBasis(target, basis, method, errors) {
    var controlledBasis = [basis, method].filter(Boolean).join(' · ');
    if (!controlledBasis) return;
    if (target === 'hardness-hv') {
      var incompatible = /\b(?:rockwell|brinell|hb(?:s|w)?|hr(?:[abcdfghkn]|(?:15|30|45)[ntwxy]))(?![A-Za-z])/i.test(controlledBasis);
      var pressureReported = /\b(?:MPa|GPa|kPa|Pa|ksi|psi)\b/i.test(controlledBasis);
      var identifiesVickers = /\bvickers\b/i.test(controlledBasis) ||
        /\bHV\s*\d/i.test(controlledBasis);
      var identifiesLoad = /\bHV\s*\d+(?:\.\d+)?\b/i.test(controlledBasis) ||
        /\b(?:test\s*)?load\b[^,;]{0,40}\d+(?:\.\d+)?\s*(?:kgf|gf|N)\b/i.test(controlledBasis) ||
        /\b\d+(?:\.\d+)?\s*(?:kgf|gf)\b/i.test(controlledBasis);
      if (incompatible || pressureReported || !identifiesVickers || !identifiesLoad) {
        pushIssue(errors, 'HARDNESS_BASIS', 'measurementBasis',
          'The combined measurementBasis and measurementMethod require an explicit Vickers scale and test load (for example, Vickers HV10). Rockwell, Brinell, and pressure-unit results are incompatible and are not converted to an HV number.');
      }
      return;
    }
    var identifiesTest = /\b(?:ASTM\s*(?:E8(?:\/E8M)?|A370)|ISO\s*6892|EN\s*10002|tensile|specimen|coupon|strip|round|flat)\b/i.test(controlledBasis);
    var identifiesOrientation = /\b(?:longitudinal|transverse|axial|circumferential|hoop|radial|rolling[- ]direction|cross[- ]direction)\b/i.test(controlledBasis) ||
      /(?:^|[,; ·]+)(?:0|45|90)\s*(?:deg|°)(?:$|[,; ·]+)/i.test(controlledBasis) ||
      /(?:^|[,; ·]+)(?:L|T|LT|TL|ST)(?:[- ]orientation)?(?:$|[,; ·]+)/i.test(controlledBasis);
    var identifiesGeometry = /\b(?:gauge|gage|diameter|width|full[- ]size|sub[- ]size|proportional|GL|L0)\b/i.test(controlledBasis);
    if (!identifiesTest || !identifiesOrientation || !identifiesGeometry) {
      pushIssue(errors, 'TENSILE_BASIS', 'measurementBasis',
        'Strength and elongation calibration requires a tensile test/specimen basis, specimen orientation, and gauge or specimen geometry.');
    }
    var identifiesTemperature = /\b(?:room|ambient)\s*(?:temperature)?\b/i.test(controlledBasis) ||
      /\b(?:test\s*)?temperature\b[^,;]{0,30}[-+]?\d+(?:\.\d+)?\s*°?\s*[CFK]\b/i.test(controlledBasis) ||
      /\b[-+]?\d+(?:\.\d+)?\s*°\s*[CF]\b/i.test(controlledBasis);
    if (!identifiesTemperature) {
      pushIssue(errors, 'TENSILE_TEMPERATURE', 'measurementBasis',
        'Strength and elongation calibration requires the tensile test temperature (for example, room temperature or 20 °C).');
    }
    if (target === 'yield-strength-mpa' || target === 'tensile-strength-mpa') {
      var identifiesIncompatibleStrengthUnit =
        /\b(?:ksi|psi|Pa|kPa|GPa)\b/i.test(controlledBasis) ||
        /\bkgf\s*\/\s*(?:mm|cm)(?:2|²|\^\s*2)\b/i.test(controlledBasis);
      if (identifiesIncompatibleStrengthUnit) {
        pushIssue(errors, 'STRENGTH_UNIT', 'measurementBasis',
          'Strength actualValue data is defined by the selected target as MPa. ksi, psi, Pa, kPa, GPa, and kgf-area units are incompatible and are not converted.');
      }
    }
    if (target === 'yield-strength-mpa') {
      var identifiesYieldDefinition = /\b(?:yield\s*point|upper\s*yield|lower\s*yield|proof\s*strength)\b/i.test(controlledBasis) ||
        /\b(?:R[pRe][eHL]?\s*)?0[.,]2\s*%?\s*(?:offset|proof)?\b/i.test(controlledBasis);
      if (!identifiesYieldDefinition) {
        pushIssue(errors, 'YIELD_DEFINITION', 'measurementBasis',
          'Yield-strength calibration requires the reported yield definition (for example, 0.2% offset, proof strength, or upper/lower yield point).');
      }
    }
    if (target === 'elongation-pct') {
      var incompatibleElongation = /\b(?:true|logarithmic)\s+strain\b/i.test(controlledBasis) ||
        /\b(?:decimal|fractional)\s+(?:strain|elongation)\b/i.test(controlledBasis) ||
        /\b(?:unitless|dimensionless)\s+(?:strain|elongation)\b/i.test(controlledBasis) ||
        /\b(?:mm\s*\/\s*mm|in(?:ch)?\s*\/\s*in(?:ch)?)\b/i.test(controlledBasis);
      if (incompatibleElongation) {
        pushIssue(errors, 'ELONGATION_UNIT', 'measurementBasis',
          'elongation-pct actualValue data is engineering elongation in percentage points. Fractional, unitless, true-strain, and logarithmic-strain values are incompatible and are not converted.');
      }
      var identifiesElongationGauge = /\b(?:gauge|gage)(?:\s*length)?\b[^,;]{0,30}\d+(?:\.\d+)?\s*(?:mm|cm|in(?:ch(?:es)?)?)\b/i.test(controlledBasis) ||
        /\b\d+(?:\.\d+)?\s*(?:mm|cm|in(?:ch(?:es)?)?)\b[^,;]{0,30}(?:gauge|gage)(?:\s*length)?\b/i.test(controlledBasis) ||
        /\b(?:proportional\s*(?:gauge|gage)|5[.,]65\s*(?:sqrt|√)|A(?:5|50|80))\b/i.test(controlledBasis);
      if (!identifiesElongationGauge) {
        pushIssue(errors, 'ELONGATION_GAUGE_BASIS', 'measurementBasis',
          'Elongation calibration requires a numeric gauge length or an explicit proportional-gauge basis.');
      }
    }
  }

  function validateCoolingRateDefinition(definition, errors) {
    if (!definition) return;
    var compatible = /(?:^|[^A-Za-z0-9])(?:°\s*|deg(?:ree)?s?\s*)?[CK]\s*(?:\/\s*(?:sec(?:ond)?s?|s)|per\s+(?:sec(?:ond)?s?|s))(?![A-Za-z0-9²³⁰¹⁴-⁹]|\s*(?:\^|\*\*)\s*[-+]?\d)/i.test(definition) ||
      /(?:^|[^A-Za-z0-9])(?:degrees?\s+)?(?:celsius|kelvin)\s*(?:\/\s*(?:sec(?:ond)?s?|s)|per\s+(?:sec(?:ond)?s?|s))(?![A-Za-z0-9²³⁰¹⁴-⁹]|\s*(?:\^|\*\*)\s*[-+]?\d)/i.test(definition) ||
      /(?:^|[^A-Za-z0-9])(?:°\s*)?[CK]\s+(?:sec(?:ond)?s?|s)\s*(?:\^\s*)?-1(?![A-Za-z0-9])/i.test(definition);
    var incompatible = /(?:°\s*)?[CK]\s*(?:\/|per\s+)(?:min(?:ute)?s?|h(?:r|our)?s?)\b/i.test(definition) ||
      /(?:°\s*)?F\s*(?:\/|per\s+)(?:s|sec(?:ond)?s?|min(?:ute)?s?|h(?:r|our)?s?)\b/i.test(definition) ||
      /\b(?:degrees?\s+)?(?:celsius|kelvin)\s+per\s+(?:min(?:ute)?s?|h(?:r|our)?s?)\b/i.test(definition) ||
      /\b(?:degrees?\s+)?fahrenheit\s+per\s+(?:s|sec(?:ond)?s?|min(?:ute)?s?|h(?:r|our)?s?)\b/i.test(definition);
    if (!compatible || incompatible) {
      pushIssue(errors, 'COOLING_RATE_UNIT', 'coolingRateDefinition',
        'coolingRateDefinition must explicitly declare °C/s or K/s for coolingRateCPerS. Per-minute, per-hour, and Fahrenheit rates are incompatible and are not converted.');
    }
  }

  function sanitizeScope(source, target, errors, measurementMethod) {
    var scope = {};
    SCOPE_TEXT_FIELDS.forEach(function (key) {
      scope[key] = cleanText(source[key], key, errors, {
        required: true,
        max: key === 'measurementBasis' || key === 'coolingRateDefinition' ? 500 : 240
      });
    });
    scope.thicknessMinMm = decimalNumber(source.thicknessMinMm,
      'thicknessMinMm', errors, 0.01, 5000);
    scope.thicknessMaxMm = decimalNumber(source.thicknessMaxMm,
      'thicknessMaxMm', errors, 0.01, 5000);
    if (scope.thicknessMinMm != null && scope.thicknessMaxMm != null &&
      scope.thicknessMaxMm < scope.thicknessMinMm) {
      pushIssue(errors, 'THICKNESS_ORDER', 'thicknessMaxMm',
        'thicknessMaxMm must be greater than or equal to thicknessMinMm.');
    }
    validateMeasurementBasis(target, scope.measurementBasis,
      measurementMethod, errors);
    validateCoolingRateDefinition(scope.coolingRateDefinition, errors);
    return scope;
  }

  function scopeRecord(pkg) {
    return {
      site: pkg.site,
      line: pkg.line,
      processRoute: pkg.processRoute,
      productFamily: pkg.productFamily,
      thicknessMinMm: pkg.thicknessMinMm,
      thicknessMaxMm: pkg.thicknessMaxMm,
      measurementLocation: pkg.measurementLocation,
      measurementBasis: pkg.measurementBasis,
      measurementMethod: pkg.measurementMethod,
      coolingRateDefinition: pkg.coolingRateDefinition,
      coolingRateLocation: pkg.coolingRateLocation,
      groupBy: pkg.groupBy,
      target: pkg.target
    };
  }

  function predictGeneric(chemistry, coolingRate, target, path, errors, warnings) {
    if (!GENERIC_PREDICTOR || !GOVERNANCE_EVALUATOR) {
      pushIssue(errors, 'GENERIC_MODEL_UNAVAILABLE', path,
        'The frozen generic property evaluator or its governance gate is unavailable.');
      return null;
    }
    var governance;
    var governedChemistry = clone(chemistry);
    /* Nb and Ti are absent from the frozen v1 calibration row contract. Zeroes
       are supplied only to the existing governance envelope evaluator; they
       are not predictor inputs, fitted variables, or inferred plant values. */
    governedChemistry.Nb = 0;
    governedChemistry.Ti = 0;
    try {
      governance = GOVERNANCE_EVALUATOR(GENERIC_MODEL_ID, {
        chemistry: governedChemistry,
        propertyRate: coolingRate,
        intendedUse: 'early-screening'
      });
    } catch (error) {
      governance = null;
    }
    var validity = governance && governance.validity ? governance.validity : {};
    if (!governance || governance.permitted !== true ||
      validity.state === 'Out of domain' || validity.state === 'Not evaluated') {
      pushIssue(errors, 'GENERIC_MODEL_DOMAIN', path,
        validity.reasons && validity.reasons.length
          ? validity.reasons.join(' ')
          : 'The governed generic model did not permit this row for early screening.');
      return null;
    }
    if (validity.state === 'Near boundary') {
      pushIssueOnce(warnings || [], 'GENERIC_MODEL_NEAR_BOUNDARY',
        'rows.genericPrediction',
        'The governed generic model classified one or more package rows Near boundary; candidate applicability is conditional and the base-model envelope requires review.');
    }
    if (governance.warnings && governance.warnings.length) {
      pushIssueOnce(warnings || [], 'GENERIC_MODEL_GOVERNANCE_WARNING',
        'rows.genericPrediction',
        'The generic-model governance gate returned one or more warnings; review the governed base-model limitations before using this candidate.');
    }
    var result;
    try {
      result = GENERIC_PREDICTOR(clone(chemistry), coolingRate);
    } catch (error) {
      result = null;
    }
    var definition = TARGETS[target];
    if (!result || result.valid !== true) {
      pushIssue(errors, 'GENERIC_MODEL_REJECTED', path,
        result && result.reason ? String(result.reason) :
          'The generic property model rejected this row.');
      return null;
    }
    var prediction = Number(result[definition.property]) * definition.scale;
    if (!isFinite(prediction)) {
      pushIssue(errors, 'GENERIC_MODEL_OUTPUT', path,
        'The generic property model returned a non-finite value.');
      return null;
    }
    return prediction;
  }

  function sanitizeRow(raw, index, metadata, errors, warnings) {
    var path = 'rows[' + index + ']';
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      pushIssue(errors, 'TYPE', path, 'Each row must be an object.');
      return null;
    }
    raw = Object.assign({}, raw);
    var allowed = [
      'recordId', 'role', 'heatId', 'batchId', 'chemistry',
      'C', 'Mn', 'Si', 'Ni', 'Cr', 'Mo', 'V', 'Cu', 'B',
      'coolingRateCPerS', 'actualValue', 'timestamp'
    ];
    warnExtras(raw, allowed, path, warnings);
    var recordId = cleanText(raw.recordId, path + '.recordId', errors,
      { required: true, stableId: true, max: 120 });
    var roleText = cleanText(raw.role, path + '.role', errors,
      { required: true, max: 20 }).toLowerCase();
    if (ROLES.indexOf(roleText) < 0) {
      pushIssue(errors, 'ENUM', path + '.role',
        'Role must be calibration, validation, or monitoring.');
      roleText = '';
    }
    var heatId = cleanText(raw.heatId, path + '.heatId', errors,
      { stableId: true, max: 120 });
    var batchId = cleanText(raw.batchId, path + '.batchId', errors,
      { stableId: true, max: 120 });
    var requiredGroup = metadata.groupBy === 'batch' ? batchId : heatId;
    if (!requiredGroup) {
      pushIssue(errors, 'GROUP_ID', path + '.' +
        (metadata.groupBy === 'batch' ? 'batchId' : 'heatId'),
      'The selected grouping identifier is required.');
    }

    var chemistryRaw = raw.chemistry && typeof raw.chemistry === 'object' &&
      !Array.isArray(raw.chemistry) ? Object.assign({}, raw.chemistry) : {};
    if (raw.chemistry != null &&
      (!raw.chemistry || typeof raw.chemistry !== 'object' || Array.isArray(raw.chemistry))) {
      pushIssue(errors, 'TYPE', path + '.chemistry', 'chemistry must be an object.');
    }
    warnExtras(chemistryRaw, CHEMISTRY_KEYS, path + '.chemistry', warnings);
    var chemistry = {};
    CHEMISTRY_KEYS.forEach(function (key) {
      var direct = own(raw, key) ? raw[key] : undefined;
      var nested = own(chemistryRaw, key) ? chemistryRaw[key] : undefined;
      if (direct !== undefined && nested !== undefined &&
        !equivalentMetadataValue(direct, nested)) {
        pushIssue(errors, 'CHEMISTRY_CONFLICT', path + '.' + key,
          'Flat and nested chemistry values conflict.');
      }
      chemistry[key] = decimalNumber(direct !== undefined ? direct : nested,
        path + '.chemistry.' + key, errors,
        CHEMISTRY_BOUNDS[key][0], CHEMISTRY_BOUNDS[key][1]);
    });
    var coolingRate = decimalNumber(raw.coolingRateCPerS,
      path + '.coolingRateCPerS', errors, 0.1, 1000);
    var target = TARGETS[metadata.target];
    var actual = decimalNumber(raw.actualValue, path + '.actualValue', errors,
      target.actualMin, target.actualMax);
    var timestamp = isoTimestamp(raw.timestamp, path + '.timestamp', errors, true);
    var genericValue = null;
    if (Object.keys(chemistry).every(function (key) { return chemistry[key] != null; }) &&
      coolingRate != null) {
      genericValue = predictGeneric(chemistry, coolingRate, metadata.target,
        path + '.genericPrediction', errors, warnings);
    }
    return {
      recordId: recordId,
      role: roleText,
      heatId: heatId || null,
      batchId: batchId || null,
      chemistry: chemistry,
      coolingRateCPerS: coolingRate,
      actualValue: actual,
      timestamp: timestamp || null,
      genericValue: genericValue
    };
  }

  function suppliedMetadataValue(value) {
    if (value == null) return false;
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value).trim() !== '';
    }
    return true;
  }

  function equivalentMetadataValue(left, right) {
    if (!suppliedMetadataValue(left) || !suppliedMetadataValue(right)) return true;
    var leftObject = left && typeof left === 'object';
    var rightObject = right && typeof right === 'object';
    if (leftObject !== rightObject) return false;
    if (leftObject && rightObject) {
      try {
        return stableStringify(left) === stableStringify(right);
      } catch (error) {
        return false;
      }
    }
    return String(left).trim() === String(right).trim();
  }

  function validatePackage(raw) {
    var errors = [];
    var warnings = [];
    inspectInput(raw, '', 0, [], errors);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      pushIssue(errors, 'TYPE', 'package', 'Calibration package must be an object.');
      return { ok: false, errors: errors, warnings: warnings, package: null, validation: null };
    }
    if (errors.length) {
      return { ok: false, errors: errors, warnings: warnings, package: null, validation: null };
    }
    try {
      raw = snapshotInput(raw, []);
    } catch (error) {
      pushIssue(errors, 'SAFE_SNAPSHOT', 'package',
        'Calibration input could not be copied into trusted data structures.');
      return { ok: false, errors: errors, warnings: warnings, package: null, validation: null };
    }
    var metadataRaw = own(raw, 'metadata') ? raw.metadata : null;
    if (metadataRaw != null &&
      (!metadataRaw || typeof metadataRaw !== 'object' || Array.isArray(metadataRaw))) {
      pushIssue(errors, 'TYPE', 'metadata', 'metadata must be a plain object when supplied.');
    }
    metadataRaw = metadataRaw && typeof metadataRaw === 'object' &&
      !Array.isArray(metadataRaw) ? metadataRaw : null;
    var recognizedMetadata = [
      'id', 'revision', 'title', 'sourceReference', 'measurementMethod',
      'groupBy', 'target', 'site', 'line', 'processRoute', 'productFamily',
      'thicknessMinMm', 'thicknessMaxMm', 'measurementLocation',
      'measurementBasis', 'coolingRateDefinition', 'coolingRateLocation',
      'specContext'
    ];
    if (metadataRaw) {
      recognizedMetadata.forEach(function (key) {
        if (own(raw, key) && own(metadataRaw, key) &&
          suppliedMetadataValue(raw[key]) && suppliedMetadataValue(metadataRaw[key]) &&
          !equivalentMetadataValue(raw[key], metadataRaw[key])) {
          pushIssue(errors, 'METADATA_CONFLICT', 'metadata.' + key,
            'Top-level and nested calibration metadata must agree.');
        }
      });
    }
    var versionCandidates = [];
    [raw, metadataRaw].forEach(function (container) {
      if (!container) return;
      ['schemaVersion', 'contractVersion'].forEach(function (key) {
        if (own(container, key) && suppliedMetadataValue(container[key])) {
          versionCandidates.push(container[key]);
        }
      });
    });
    if (versionCandidates.some(function (value) {
      return !equivalentMetadataValue(value, versionCandidates[0]);
    })) {
      pushIssue(errors, 'METADATA_CONFLICT', 'metadata.schemaVersion',
        'schemaVersion and contractVersion declarations must agree.');
    }
    var source = metadataRaw
      ? Object.assign({}, metadataRaw, raw)
      : Object.assign({}, raw);
    source.schemaVersion = versionCandidates.length ? versionCandidates[0] : undefined;
    source.specContext = own(raw, 'specContext') && raw.specContext != null
      ? raw.specContext : (metadataRaw ? metadataRaw.specContext : undefined);
    source.rows = own(raw, 'rows') ? raw.rows : undefined;
    warnExtras(raw, [
      'schemaVersion', 'contractVersion', 'metadata', 'id', 'revision', 'title',
      'sourceReference', 'measurementMethod', 'groupBy', 'target',
      'site', 'line', 'processRoute', 'productFamily', 'thicknessMinMm',
      'thicknessMaxMm', 'measurementLocation', 'measurementBasis',
      'coolingRateDefinition', 'coolingRateLocation', 'specContext', 'rows'
    ], '', warnings);
    if (metadataRaw) {
      warnExtras(metadataRaw, [
        'schemaVersion', 'contractVersion', 'id', 'revision', 'title',
        'sourceReference', 'measurementMethod', 'groupBy', 'target',
        'site', 'line', 'processRoute', 'productFamily', 'thicknessMinMm',
        'thicknessMaxMm', 'measurementLocation', 'measurementBasis',
        'coolingRateDefinition', 'coolingRateLocation', 'specContext'
      ], 'metadata', warnings);
    }

    var versionValue = source.schemaVersion != null ? source.schemaVersion :
      source.contractVersion;
    var version = cleanText(versionValue, 'schemaVersion', errors,
      { required: true, max: 20 });
    if (version && majorVersion(version) !== majorVersion(CONTRACT_VERSION)) {
      pushIssue(errors, 'SCHEMA_MAJOR', 'schemaVersion',
        'Calibration package schema major version must be ' +
        majorVersion(CONTRACT_VERSION) + '.');
    }
    var metadata = {
      schemaVersion: CONTRACT_VERSION,
      id: cleanText(source.id, 'id', errors,
        { required: true, stableId: true, max: 120 }),
      revision: cleanText(source.revision, 'revision', errors,
        { required: true, stableId: true, max: 60 }),
      title: cleanText(source.title, 'title', errors,
        { required: true, max: 180 }),
      sourceReference: cleanText(source.sourceReference, 'sourceReference', errors,
        { required: true, max: 240 }),
      measurementMethod: cleanText(source.measurementMethod, 'measurementMethod', errors,
        { required: true, max: 240 }),
      groupBy: cleanText(source.groupBy, 'groupBy', errors,
        { required: true, max: 20 }).toLowerCase(),
      target: cleanText(source.target, 'target', errors,
        { required: true, max: 40 }).toLowerCase()
    };
    var scope = sanitizeScope(source, metadata.target, errors,
      metadata.measurementMethod);
    if (GROUP_MODES.indexOf(metadata.groupBy) < 0) {
      pushIssue(errors, 'ENUM', 'groupBy', 'groupBy must be heat or batch.');
    }
    if (!own(TARGETS, metadata.target)) {
      pushIssue(errors, 'ENUM', 'target',
        'Unknown calibration target. Use one of: ' + Object.keys(TARGETS).join(', ') + '.');
    }
    var specContext = sanitizeSpecContext(source.specContext, errors, warnings);
    pushIssue(warnings, 'GOVERNANCE_CONTRACT_ALLOYS', 'rows.chemistry',
      'Nb and Ti are absent from calibration contract 1.0. Zero is supplied only to the existing governance envelope; neither element enters the frozen generic predictor or the fitted correction.');
    var rowsRaw = Array.isArray(source.rows) ? source.rows : [];
    if (!Array.isArray(source.rows)) {
      pushIssue(errors, 'TYPE', 'rows', 'rows must be an array.');
    }
    if (rowsRaw.length > MAX_ROWS) {
      pushIssue(errors, 'ROW_LIMIT', 'rows',
        'Import exceeds the ' + MAX_ROWS + '-row limit.');
      rowsRaw = [];
    }
    if (!own(TARGETS, metadata.target) || GROUP_MODES.indexOf(metadata.groupBy) < 0) {
      return { ok: false, errors: errors, warnings: warnings, package: null, validation: null };
    }
    var rows = rowsRaw.map(function (row, index) {
      return sanitizeRow(row, index, metadata, errors, warnings);
    }).filter(Boolean);

    var recordIds = blankMap();
    var heatRoles = blankMap();
    var batchRoles = blankMap();
    var roleCounts = { calibration: 0, validation: 0, monitoring: 0 };
    var roleGroups = {
      calibration: blankMap(),
      validation: blankMap(),
      monitoring: blankMap()
    };
    rows.forEach(function (row, index) {
      var recordKey = normalizedIdentity(row.recordId);
      if (recordKey && own(recordIds, recordKey)) {
        pushIssue(errors, 'DUPLICATE_RECORD', 'rows[' + index + '].recordId',
          'recordId values must be unique, including letter case variants.');
      } else if (recordKey) {
        recordIds[recordKey] = true;
      }
      if (!row.role) return;
      roleCounts[row.role] += 1;
      var heatKey = normalizedIdentity(row.heatId);
      var batchKey = normalizedIdentity(row.batchId);
      if (heatKey) {
        if (!heatRoles[heatKey]) heatRoles[heatKey] = blankMap();
        heatRoles[heatKey][row.role] = true;
      }
      if (batchKey) {
        if (!batchRoles[batchKey]) batchRoles[batchKey] = blankMap();
        batchRoles[batchKey][row.role] = true;
      }
      var groupValue = metadata.groupBy === 'batch' ? row.batchId : row.heatId;
      var groupKey = normalizedIdentity(groupValue);
      if (!groupKey) return;
      roleGroups[row.role][groupKey] = true;
    });
    [
      { label: 'heat', roles: heatRoles },
      { label: 'batch', roles: batchRoles }
    ].forEach(function (identity) {
      Object.keys(identity.roles).forEach(function (groupKey) {
        if (Object.keys(identity.roles[groupKey]).length > 1) {
          pushIssue(errors, 'GROUP_LEAKAGE', 'rows',
            'A supplied ' + identity.label +
            ' identifier cannot appear in more than one role, even when the other identifier is selected for weighting.');
        }
      });
    });

    var calibrationGroups = Object.keys(roleGroups.calibration).length;
    var validationGroups = Object.keys(roleGroups.validation).length;
    var monitoringGroups = Object.keys(roleGroups.monitoring).length;
    if (roleCounts.calibration < 5 || calibrationGroups < 3) {
      pushIssue(errors, 'CALIBRATION_MINIMUM', 'rows',
        'At least 5 calibration rows across at least 3 groups are required.');
    }
    if (roleCounts.validation < 3 || validationGroups < 2) {
      pushIssue(errors, 'VALIDATION_MINIMUM', 'rows',
        'At least 3 validation rows across at least 2 wholly disjoint groups are required.');
    }

    var monitoringRows = rows.filter(function (row) { return row.role === 'monitoring'; });
    var referenceRows = rows.filter(function (row) { return row.role !== 'monitoring'; });
    var referenceDates = referenceRows.map(function (row) {
      return timestampMillis(row.timestamp);
    });
    var chronologyVerified = monitoringRows.length === 0;
    if (monitoringRows.length) {
      var lastReference = Math.max.apply(null, referenceDates);
      var notLater = !isFinite(lastReference) || monitoringRows.some(function (row) {
        return !isFinite(timestampMillis(row.timestamp)) ||
          timestampMillis(row.timestamp) <= lastReference;
      });
      if (notLater) {
        pushIssue(errors, 'MONITORING_NOT_LATER', 'rows',
          'Every monitoring group timestamp must be provably later than all calibration and validation timestamps.');
      } else {
        chronologyVerified = true;
      }
    }

    var sanitized = {
      schemaVersion: CONTRACT_VERSION,
      id: metadata.id,
      revision: metadata.revision,
      title: metadata.title,
      sourceReference: metadata.sourceReference,
      measurementMethod: metadata.measurementMethod,
      site: scope.site,
      line: scope.line,
      processRoute: scope.processRoute,
      productFamily: scope.productFamily,
      thicknessMinMm: scope.thicknessMinMm,
      thicknessMaxMm: scope.thicknessMaxMm,
      measurementLocation: scope.measurementLocation,
      measurementBasis: scope.measurementBasis,
      coolingRateDefinition: scope.coolingRateDefinition,
      coolingRateLocation: scope.coolingRateLocation,
      groupBy: metadata.groupBy,
      target: metadata.target,
      specContext: specContext,
      rows: rows
    };
    sanitized.scopeFingerprint = fingerprint(scopeRecord(sanitized));
    var validation = {
      rowCount: rows.length,
      roleCounts: roleCounts,
      groupCounts: {
        calibration: calibrationGroups,
        validation: validationGroups,
        monitoring: monitoringGroups
      },
      groupsDisjoint: !errors.some(function (item) { return item.code === 'GROUP_LEAKAGE'; }),
      monitoringChronologyVerified: chronologyVerified,
      validationKind: 'internal group-separated validation',
      split: {
        groupSeparated: true,
        holdoutValidated: true,
        independentValidation: false,
        externalValidation: false
      }
    };
    return {
      ok: errors.length === 0,
      errors: errors,
      warnings: warnings,
      package: errors.length ? null : sanitized,
      validation: errors.length ? null : validation
    };
  }

  function parse(input, options) {
    var errors = [];
    var warnings = [];
    var raw = input;
    var safeOptions = options;
    var format = 'object';
    if (options != null) inspectInput(options, 'options', 0, [], errors);
    if (!errors.length && options != null) {
      try {
        safeOptions = snapshotInput(options, []);
      } catch (error) {
        pushIssue(errors, 'SAFE_SNAPSHOT', 'options',
          'Import options could not be copied into trusted data structures.');
      }
    }
    if (errors.length) {
      return boundedResult({
        ok: false, format: format, errors: clone(errors), warnings: [], package: null
      });
    }
    if (typeof input === 'string') {
      if (byteLength(input) > MAX_IMPORT_BYTES) {
        pushIssue(errors, 'IMPORT_SIZE', 'input',
          'Import exceeds the ' + MAX_IMPORT_BYTES + '-byte limit.');
        return boundedResult({
          ok: false, format: 'unknown', errors: errors, warnings: warnings, package: null
        });
      }
      var trimmed = input.replace(/^\uFEFF/, '').trim();
      if (!trimmed) {
        pushIssue(errors, 'EMPTY_IMPORT', 'input', 'Import is empty.');
        return boundedResult({
          ok: false, format: 'unknown', errors: errors, warnings: warnings, package: null
        });
      }
      if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
        format = 'json';
        try {
          raw = JSON.parse(trimmed);
        } catch (error) {
          pushIssue(errors, 'JSON_PARSE', 'input', 'Import is not valid JSON.');
        }
      } else {
        format = 'csv';
        var csvOptions = safeOptions && own(safeOptions, '__csvOptions')
          ? safeOptions.__csvOptions : safeOptions;
        raw = csvToRawPackage(trimmed, csvOptions || {}, errors, warnings);
      }
    } else {
      var serialized = '';
      inspectInput(input, '', 0, [], errors);
      if (!errors.length) {
        try {
          raw = snapshotInput(input, []);
          serialized = JSON.stringify(raw);
        } catch (error) {
          pushIssue(errors, 'SERIALIZE', 'input',
            'Input must be a finite, acyclic JSON-compatible object.');
        }
      }
      if (serialized && byteLength(serialized) > MAX_IMPORT_BYTES) {
        pushIssue(errors, 'IMPORT_SIZE', 'input',
          'Import exceeds the ' + MAX_IMPORT_BYTES + '-byte limit.');
      }
    }
    if (errors.length) {
      return boundedResult({
        ok: false, format: format, errors: clone(errors),
        warnings: clone(warnings), package: null
      });
    }
    var result = validatePackage(raw);
    result.format = format;
    result.warnings = warnings.concat(result.warnings);
    return clone(boundedResult(result));
  }

  function parseCsv(input, metadata) {
    if (typeof input !== 'string') {
      return {
        ok: false,
        format: 'csv',
        errors: [{ code: 'TYPE', path: 'input', message: 'CSV input must be text.' }],
        warnings: [],
        package: null
      };
    }
    return parse(input, {
      __csvOptions: metadata == null ? {} : metadata
    });
  }

  function parseJson(input) {
    if (typeof input !== 'string') {
      try {
        return parse(input);
      } catch (error) {
        return {
          ok: false,
          format: 'json',
          errors: [{ code: 'TYPE', path: 'input', message: 'JSON input is invalid.' }],
          warnings: [],
          package: null
        };
      }
    }
    var trimmed = input.replace(/^\uFEFF/, '').trim();
    if (trimmed.charAt(0) !== '{' && trimmed.charAt(0) !== '[') {
      return {
        ok: false,
        format: 'json',
        errors: [{ code: 'JSON_PARSE', path: 'input', message: 'Import is not valid JSON.' }],
        warnings: [],
        package: null
      };
    }
    return parse(input);
  }

  function freshSession() {
    return {
      contractVersion: CONTRACT_VERSION,
      status: 'empty',
      importedAt: null,
      analyzedAt: null,
      packageFingerprint: null,
      package: null,
      validation: null,
      warnings: [],
      analysis: null
    };
  }

  var session = freshSession();

  function importPackage(input, options) {
    var parsed = parse(input, options);
    if (!parsed.ok) {
      return clone({
        ok: false,
        errors: parsed.errors,
        warnings: parsed.warnings,
        priorSessionPreserved: true,
        audit: auditSummary()
      });
    }
    var importedAt = new Date().toISOString();
    var packageFingerprint = fingerprint(parsed.package);
    var pendingAnalysis;
    try {
      pendingAnalysis = analyzeValidatedPackage(
        parsed.package,
        parsed.validation,
        packageFingerprint,
        parsed.warnings
      );
    } catch (error) {
      return clone({
        ok: false,
        errors: [{
          code: 'ANALYSIS',
          path: 'analysis',
          message: 'Calibration analysis could not be completed.'
        }],
        warnings: parsed.warnings,
        priorSessionPreserved: true,
        audit: auditSummary()
      });
    }
    var candidate = {
      contractVersion: CONTRACT_VERSION,
      status: 'analyzed',
      importedAt: importedAt,
      analyzedAt: pendingAnalysis.analyzedAt,
      packageFingerprint: packageFingerprint,
      package: clone(parsed.package),
      validation: clone(parsed.validation),
      warnings: clone(parsed.warnings),
      analysis: clone(pendingAnalysis)
    };
    session = candidate;
    return clone({
      ok: true,
      status: session.status,
      fingerprint: packageFingerprint,
      analysis: pendingAnalysis,
      warnings: session.warnings,
      audit: auditSummary()
    });
  }

  function stableNumericSum(values) {
    var ordered = values.slice().sort(function (left, right) {
      var magnitudeOrder = Math.abs(left) - Math.abs(right);
      if (magnitudeOrder) return magnitudeOrder;
      return left < right ? -1 : (left > right ? 1 : 0);
    });
    var sum = 0;
    var compensation = 0;
    ordered.forEach(function (value) {
      var next = sum + value;
      if (Math.abs(sum) >= Math.abs(value)) {
        compensation += (sum - next) + value;
      } else {
        compensation += (value - next) + sum;
      }
      sum = next;
    });
    return sum + compensation;
  }

  function mean(values) {
    if (!values.length) return null;
    return stableNumericSum(values) / values.length;
  }

  function sampleStandardDeviation(values) {
    if (values.length < 2) return null;
    var average = mean(values);
    var sumSquares = stableNumericSum(values.map(function (value) {
      var difference = value - average;
      return difference * difference;
    }));
    return Math.sqrt(sumSquares / (values.length - 1));
  }

  function metricValues(rows, predictionKey) {
    var residuals = rows.map(function (row) {
      return row.actualValue - row[predictionKey];
    });
    var actuals = rows.map(function (row) { return row.actualValue; });
    var predictions = rows.map(function (row) { return row[predictionKey]; });
    var averageActual = mean(actuals);
    var sse = stableNumericSum(residuals.map(function (residual) {
      return residual * residual;
    }));
    var sst = stableNumericSum(actuals.map(function (actual) {
      var difference = actual - averageActual;
      return difference * difference;
    }));
    return {
      meanBias: mean(residuals),
      mae: mean(residuals.map(function (value) { return Math.abs(value); })),
      rmse: Math.sqrt(sse / residuals.length),
      r2: sst > 0 ? 1 - sse / sst : null,
      actualMean: averageActual,
      predictionMean: mean(predictions),
      residualSd: sampleStandardDeviation(residuals)
    };
  }

  function aggregateGroups(rows, groupBy) {
    var buckets = blankMap();
    rows.forEach(function (row) {
      var groupKey = normalizedIdentity(groupBy === 'batch' ? row.batchId : row.heatId);
      if (!buckets[groupKey]) {
        buckets[groupKey] = {
          role: row.role,
          rowCount: 0,
          actualValues: [],
          genericValues: [],
          calibratedValues: [],
          timestamp: row.timestamp
        };
      }
      var bucket = buckets[groupKey];
      bucket.rowCount += 1;
      bucket.actualValues.push(row.actualValue);
      bucket.genericValues.push(row.genericValue);
      if (isFinite(row.calibratedValue)) bucket.calibratedValues.push(row.calibratedValue);
      if (timestampMillis(row.timestamp) > timestampMillis(bucket.timestamp)) {
        bucket.timestamp = row.timestamp;
      }
    });
    return Object.keys(buckets).sort().map(function (key) {
      var bucket = buckets[key];
      return {
        _groupKey: key,
        role: bucket.role,
        rowCount: bucket.rowCount,
        actualValue: mean(bucket.actualValues),
        genericValue: mean(bucket.genericValues),
        calibratedValue: bucket.calibratedValues.length
          ? mean(bucket.calibratedValues) : null,
        timestamp: bucket.timestamp
      };
    });
  }

  function roleMetrics(rows, groupBy) {
    var groups = aggregateGroups(rows, groupBy);
    var generic = metricValues(groups, 'genericValue');
    var calibrated = metricValues(groups, 'calibratedValue');
    var rowGeneric = metricValues(rows, 'genericValue');
    var rowCalibrated = metricValues(rows, 'calibratedValue');
    return {
      n: rows.length,
      groups: groups.length,
      nRows: rows.length,
      nGroups: groups.length,
      primaryUnit: 'group means',
      generic: generic,
      calibrated: calibrated,
      meanBias: calibrated.meanBias,
      mae: calibrated.mae,
      rmse: calibrated.rmse,
      r2: calibrated.r2,
      rowLevel: {
        secondary: true,
        generic: rowGeneric,
        calibrated: rowCalibrated
      }
    };
  }

  function monitoringAnalysis(rows, groupBy, calibrationResidualSd,
    calibrationGroupSizes, chronologyVerified, numericPrecisionFloor) {
    calibrationGroupSizes = Array.isArray(calibrationGroupSizes)
      ? calibrationGroupSizes.slice() : [];
    var calibrationGroupCount = calibrationGroupSizes.length;
    var sigma = calibrationResidualSd;
    numericPrecisionFloor = Number.isFinite(numericPrecisionFloor) &&
      numericPrecisionFloor > 0 ? numericPrecisionFloor : 64 * Number.EPSILON;
    var numericVariationDegenerate = sigma != null &&
      sigma <= numericPrecisionFloor;
    var sigmaUsable = sigma != null && sigma > numericPrecisionFloor;
    var residualLimit = sigmaUsable ? 3 * sigma : null;
    var steadyEwmaSigma = sigmaUsable
      ? sigma * Math.sqrt(EWMA_LAMBDA / (2 - EWMA_LAMBDA))
      : null;
    var groups = aggregateGroups(rows, groupBy);
    var sorted = groups.slice().sort(function (left, right) {
      var timeOrder = timestampMillis(left.timestamp) - timestampMillis(right.timestamp);
      if (timeOrder) return timeOrder;
      return left._groupKey < right._groupKey ? -1 :
        (left._groupKey > right._groupKey ? 1 : 0);
    });
    var tiedGroupTimestamps = sorted.some(function (group, index) {
      return index > 0 && timestampMillis(group.timestamp) ===
        timestampMillis(sorted[index - 1].timestamp);
    });
    var monitoringOrderVerified = chronologyVerified && !tiedGroupTimestamps;
    var ewmaAvailable = monitoringOrderVerified && steadyEwmaSigma != null;
    var steadyEwmaLimit = ewmaAvailable ? 3 * steadyEwmaSigma : null;
    var distinctMonitoringSizes = blankMap();
    var distinctCalibrationSizes = blankMap();
    sorted.forEach(function (group) {
      distinctMonitoringSizes[group.rowCount] = true;
    });
    calibrationGroupSizes.forEach(function (size) {
      distinctCalibrationSizes[size] = true;
    });
    var monitoringSizes = Object.keys(distinctMonitoringSizes);
    var baselineSizes = Object.keys(distinctCalibrationSizes);
    var unequalGroupSizes = monitoringSizes.length > 1;
    var unequalCalibrationGroupSizes = baselineSizes.length > 1;
    var baselineGroupSize = baselineSizes.length === 1 ? Number(baselineSizes[0]) : null;
    var monitoringGroupSize = monitoringSizes.length === 1 ? Number(monitoringSizes[0]) : null;
    var subgroupSizeCompatible = groups.length
      ? !unequalCalibrationGroupSizes && !unequalGroupSizes &&
        baselineGroupSize != null && monitoringGroupSize === baselineGroupSize
      : null;
    var ewma = 0;
    var triggerCount = 0;
    var points = sorted.map(function (group, index) {
      var residual = group.actualValue - group.calibratedValue;
      if (ewmaAvailable) {
        ewma = EWMA_LAMBDA * residual + (1 - EWMA_LAMBDA) * ewma;
      }
      var t = index + 1;
      var timeFactor = Math.sqrt(EWMA_LAMBDA / (2 - EWMA_LAMBDA) *
        (1 - Math.pow(1 - EWMA_LAMBDA, 2 * t)));
      var currentEwmaLimit = ewmaAvailable
        ? 3 * sigma * timeFactor : null;
      var residualTrigger = residualLimit != null && Math.abs(residual) > residualLimit;
      var ewmaTrigger = currentEwmaLimit != null && Math.abs(ewma) > currentEwmaLimit;
      if (residualTrigger || ewmaTrigger) triggerCount += 1;
      return {
        sequence: t,
        timestamp: group.timestamp,
        nRows: group.rowCount,
        actual: group.actualValue,
        generic: group.genericValue,
        calibrated: group.calibratedValue,
        residual: residual,
        ewma: ewmaAvailable ? ewma : null,
        residualLower: residualLimit == null ? null : -residualLimit,
        residualUpper: residualLimit,
        ewmaLower: currentEwmaLimit == null ? null : -currentEwmaLimit,
        ewmaUpper: currentEwmaLimit,
        residualTrigger: residualTrigger,
        ewmaTrigger: ewmaTrigger
      };
    });
    var status = 'stable';
    var reasons = [];
    if (!groups.length) {
      status = 'insufficient';
      reasons.push('No monitoring groups were supplied.');
    } else if (!monitoringOrderVerified) {
      status = 'insufficient';
      reasons.push(tiedGroupTimestamps
        ? 'Two or more monitoring groups share the same group timestamp, so EWMA order is not established; identifier order has no statistical meaning. EWMA sequence, limits, and triggers are withheld while order-independent residual diagnostics remain visible.'
        : 'Later-in-time group separation from calibration and validation is not proven.');
    } else if (numericVariationDegenerate) {
      status = 'insufficient';
      reasons.push('Calibration group-mean residual variation is indistinguishable from numeric precision, so inferential screening limits and triggers are withheld.');
    } else if (residualLimit == null || steadyEwmaSigma == null) {
      status = 'insufficient';
      reasons.push('Calibration group-mean residual variation is zero or unavailable, so 3-sigma screening limits cannot be estimated.');
    } else if (!subgroupSizeCompatible) {
      status = 'insufficient';
      reasons.push(triggerCount
        ? 'A nominal screening limit was exceeded, but incompatible baseline and monitoring subgroup sizes make the unadjusted common limits insufficient for a drift classification.'
        : 'Baseline and monitoring subgroup sizes are incompatible with unadjusted common group-mean limits, so drift classification is insufficient.');
    } else if (calibrationGroupCount < 20) {
      status = 'insufficient';
      reasons.push(triggerCount
        ? 'A nominal screening limit was exceeded, but the Phase-I baseline has fewer than 20 calibration groups and cannot support a drift classification.'
        : 'The Phase-I baseline has fewer than 20 calibration groups and cannot support a stable drift classification.');
    } else if (triggerCount) {
      status = 'review-trigger';
      reasons.push('One or more group-mean residual or EWMA screening limits were exceeded.');
    } else {
      reasons.push('No group-mean residual or EWMA screening limit was exceeded; this is a provisional screen, not a pass decision.');
    }
    if (numericVariationDegenerate && !reasons.some(function (reason) {
      return /numeric precision/.test(reason);
    })) {
      reasons.push('Calibration group-mean residual variation is indistinguishable from numeric precision, so inferential screening limits and triggers are withheld.');
    }
    if (calibrationGroupCount < 20 && !reasons.some(function (reason) {
      return /Phase-I baseline/.test(reason);
    })) {
      reasons.push('The Phase-I baseline has fewer than 20 calibration groups; any nominal limits or triggers remain diagnostically visible, but drift classification is insufficient.');
    }
    if (unequalCalibrationGroupSizes) {
      reasons.push('Calibration baseline group sizes differ; fixed group-mean limits do not adjust for differing replicate counts.');
    }
    if (unequalGroupSizes) {
      reasons.push('Monitoring group sizes differ; fixed group-mean limits do not adjust for differing replicate counts.');
    }
    if (groups.length && !unequalCalibrationGroupSizes && !unequalGroupSizes &&
      baselineGroupSize !== monitoringGroupSize) {
      reasons.push('Monitoring groups contain ' + monitoringGroupSize +
        ' row(s) while calibration baseline groups contain ' + baselineGroupSize +
        '; the resulting group-mean precision is not comparable without adjusted limits.');
    }
    reasons.push('A drift signal is a review trigger, not a product nonconformance or acceptance decision.');
    return {
      status: status,
      n: rows.length,
      nRows: rows.length,
      nGroups: groups.length,
      lambda: EWMA_LAMBDA,
      limitSigma: 3,
      initialization: 'z0 = 0',
      chronologyVerified: monitoringOrderVerified,
      tiedGroupTimestamps: tiedGroupTimestamps,
      ewmaAvailable: ewmaAvailable,
      ewmaSuppressedReason: ewmaAvailable ? null :
        (!monitoringOrderVerified
          ? 'Monitoring order is not established.'
          : 'Calibration residual variation cannot support numeric limits.'),
      groupTimestampDefinition: 'latest row timestamp in each group',
      groupTimestampTiePolicy: 'equal timestamps force insufficient chronology; identifier order has no statistical meaning, so EWMA sequence, limits, and triggers are withheld while residual diagnostics remain visible',
      baselineGroups: calibrationGroupCount,
      baselineLimited: calibrationGroupCount < 20,
      baselineGroupSize: baselineGroupSize,
      monitoringGroupSize: monitoringGroupSize,
      subgroupSizeCompatible: subgroupSizeCompatible,
      unequalCalibrationGroupSizes: unequalCalibrationGroupSizes,
      unequalMonitoringGroupSizes: unequalGroupSizes,
      baselineResidualSd: sigma,
      numericPrecisionFloor: numericPrecisionFloor,
      residualLimits: residualLimit == null ? null :
        { lower: -residualLimit, upper: residualLimit, sigma: 3 },
      ewmaLimits: steadyEwmaLimit == null ? null : {
        method: 'time-varying 3-sigma from z0 = 0',
        steadyStateLower: -steadyEwmaLimit,
        steadyStateUpper: steadyEwmaLimit,
        sigma: 3
      },
      triggerCount: triggerCount,
      observedScreeningTrigger: triggerCount > 0,
      reasons: reasons,
      points: points
    };
  }

  function buildGovernance(pkg, validation, analysisWarnings, outputRangeValid) {
    var reasons = [
      'This is a browser-fitted additive-bias calibration candidate, not an approved Plant calibrated model.',
      'The holdout is internal group-separated validation from one package; it is neither external nor independent validation.',
      'The generic ' + GENERIC_MODEL_ID + ' v' + GENERIC_MODEL_VERSION +
        ' teaching model remains unchanged and is pinned as the calibration dependency.',
      'The physical-output gate covers only the imported evidence rows. No candidate applicability envelope or prediction-time gate is established, so applying the correction to new inputs is withheld.',
      'Qualified metallurgist review, verified measurement traceability, a controlled applicability scope, and change control are still required.',
      'Specification context, when supplied, is traceability metadata only and does not authorize acceptance use.'
    ];
    if (!validation.monitoringChronologyVerified &&
      validation.roleCounts.monitoring > 0) {
      reasons.push('Monitoring chronology is incomplete, so drift status remains insufficient.');
    }
    (analysisWarnings || []).forEach(function (warning) {
      reasons.push(warning.message);
    });
    return {
      status: 'calibration-candidate',
      label: 'Calibration candidate',
      classification: 'Engineering screening',
      plantCalibrated: false,
      independentValidation: false,
      externalValidation: false,
      approval: {
        status: 'pending-qualified-review',
        qualifiedMetallurgist: null,
        approvedAt: null,
        scope: null
      },
      baseModel: {
        id: GENERIC_MODEL_ID,
        version: GENERIC_MODEL_VERSION,
        frozen: true
      },
      candidateValidity: {
        state: outputRangeValid ? 'in-range' : 'out-of-range',
        outputRangeValid: outputRangeValid,
        evidenceComparisonRangeValid: outputRangeValid,
        evaluatedPopulation: 'imported-evidence-rows-only',
        applicabilityEnvelopeEstablished: false,
        predictionTimeGateEstablished: false
      },
      permittedForEvidenceComparison: outputRangeValid,
      permittedForScreening: false,
      permittedForApplication: false,
      permittedForAcceptance: false,
      specContextUsedForFit: false,
      scopeFingerprint: pkg.scopeFingerprint,
      groupSeparation: {
        groupBy: pkg.groupBy,
        disjoint: validation.groupsDisjoint,
        validationKind: 'internal group-separated validation',
        independentValidation: false,
        externalValidation: false,
        calibrationGroups: validation.groupCounts.calibration,
        validationGroups: validation.groupCounts.validation
      },
      reasons: reasons
    };
  }

  function analyzeValidatedPackage(pkg, validation, packageFingerprint, inheritedWarnings) {
    var calibrationRows = pkg.rows.filter(function (row) { return row.role === 'calibration'; });
    var validationRows = pkg.rows.filter(function (row) { return row.role === 'validation'; });
    var monitoringRows = pkg.rows.filter(function (row) { return row.role === 'monitoring'; });
    var calibrationFitGroups = aggregateGroups(calibrationRows, pkg.groupBy);
    var genericBiases = calibrationFitGroups.map(function (group) {
      return group.actualValue - group.genericValue;
    });
    var correction = mean(genericBiases);
    var allRows = pkg.rows.map(function (row) {
      var copy = clone(row);
      copy.calibratedValue = copy.genericValue + correction;
      return copy;
    });
    calibrationRows = allRows.filter(function (row) { return row.role === 'calibration'; });
    validationRows = allRows.filter(function (row) { return row.role === 'validation'; });
    monitoringRows = allRows.filter(function (row) { return row.role === 'monitoring'; });

    var warnings = [];
    var definition = TARGETS[pkg.target];
    var outputRangeValid = !allRows.some(function (row) {
      return row.calibratedValue < definition.actualMin ||
        row.calibratedValue > definition.actualMax;
    });
    if (!outputRangeValid) {
      pushIssue(warnings, 'CALIBRATED_OUTPUT_RANGE', 'analysis',
        'One or more un-clamped calibrated predictions on the imported evidence rows fall outside the physical target range; evidence comparison is withheld rather than silently clamping the output.');
    }
    (inheritedWarnings || []).forEach(function (warning) {
      warning = warning && typeof warning === 'object' ? warning : {};
      pushIssue(warnings, warning.code || 'IMPORT_WARNING', warning.path,
        warning.message || 'An import warning was recorded.');
    });
    var calibrationMetric = roleMetrics(calibrationRows, pkg.groupBy);
    var validationMetric = roleMetrics(validationRows, pkg.groupBy);
    if (calibrationMetric.generic.r2 == null || calibrationMetric.calibrated.r2 == null ||
      validationMetric.generic.r2 == null || validationMetric.calibrated.r2 == null) {
      pushIssue(warnings, 'R2_UNDEFINED', 'analysis.metrics',
        'R² is undefined where actual values have no variation; bias, MAE, and RMSE remain available.');
    }
    var monitoring = monitoringAnalysis(
      monitoringRows,
      pkg.groupBy,
      calibrationMetric.calibrated.residualSd,
      calibrationFitGroups.map(function (group) { return group.rowCount; }),
      validation.monitoringChronologyVerified,
      64 * Number.EPSILON * Math.max(1,
        Math.abs(definition.actualMin), Math.abs(definition.actualMax))
    );
    var comparisons = allRows.map(function (row, index) {
      return {
        sequence: index + 1,
        role: row.role,
        timestamp: row.timestamp,
        generic: row.genericValue,
        calibrated: row.calibratedValue,
        actual: row.actualValue,
        genericResidual: row.actualValue - row.genericValue,
        calibratedResidual: row.actualValue - row.calibratedValue
      };
    });
    var trainingRows = calibrationRows.map(function (row) {
      return {
        group: normalizedIdentity(pkg.groupBy === 'batch' ? row.batchId : row.heatId),
        chemistry: clone(row.chemistry),
        coolingRateCPerS: row.coolingRateCPerS,
        actualValue: row.actualValue,
        genericValue: row.genericValue
      };
    }).sort(function (left, right) {
      var a = stableStringify(left);
      var b = stableStringify(right);
      return a < b ? -1 : (a > b ? 1 : 0);
    });
    var trainingFingerprint = fingerprint({
      groupBy: pkg.groupBy,
      rows: trainingRows
    });
    var modelFingerprint = fingerprint({
      contractVersion: CONTRACT_VERSION,
      baseModel: GENERIC_MODEL_ID + '@' + GENERIC_MODEL_VERSION,
      target: pkg.target,
      correctionType: 'additive-bias',
      correction: correction,
      calibrationRows: calibrationRows.length,
      calibrationGroups: calibrationMetric.nGroups,
      trainingFingerprint: trainingFingerprint,
      scopeFingerprint: pkg.scopeFingerprint
    });
    var governance = buildGovernance(pkg, validation, warnings, outputRangeValid);
    return {
      contractVersion: CONTRACT_VERSION,
      analyzedAt: new Date().toISOString(),
      packageFingerprint: packageFingerprint,
      modelFingerprint: modelFingerprint,
      trainingFingerprint: trainingFingerprint,
      fingerprintMeaning: 'Deterministic change detector; not a security signature.',
      target: pkg.target,
      targetLabel: definition.label,
      unit: definition.unit,
      genericUnit: definition.unit,
      actualMeasurementBasis: pkg.measurementBasis,
      actualUnit: pkg.target === 'hardness-hv'
        ? 'Vickers hardness; see actualMeasurementBasis'
        : definition.unit,
      scopeFingerprint: pkg.scopeFingerprint,
      validationKind: 'internal group-separated validation',
      candidateValidity: clone(governance.candidateValidity),
      split: clone(validation.split),
      correction: {
        type: 'additive-bias',
        signConvention: 'bias = actual - generic',
        formula: 'calibrated = generic + unweighted mean of calibration-group mean(actual - generic)',
        value: correction,
        fittedRows: calibrationRows.length,
        fittedGroups: calibrationMetric.nGroups,
        baseModelId: GENERIC_MODEL_ID,
        baseModelVersion: GENERIC_MODEL_VERSION
      },
      metrics: {
        calibration: calibrationMetric,
        validation: validationMetric
      },
      monitoring: monitoring,
      comparisons: comparisons,
      warnings: warnings,
      governance: governance
    };
  }

  function analyze(input, options) {
    if (arguments.length > 0 && input != null) {
      var parsed = parse(input, options);
      if (!parsed.ok) {
        return clone({
          ok: false,
          errors: parsed.errors,
          warnings: parsed.warnings,
          priorSessionPreserved: true
        });
      }
      var pendingFingerprint = fingerprint(parsed.package);
      var pendingAnalysis;
      try {
        pendingAnalysis = analyzeValidatedPackage(
          parsed.package,
          parsed.validation,
          pendingFingerprint,
          parsed.warnings
        );
      } catch (error) {
        return {
          ok: false,
          errors: [{
            code: 'ANALYSIS',
            path: 'analysis',
            message: 'Calibration analysis could not be completed.'
          }],
          warnings: clone(parsed.warnings),
          priorSessionPreserved: true
        };
      }
      session = {
        contractVersion: CONTRACT_VERSION,
        status: 'analyzed',
        importedAt: new Date().toISOString(),
        analyzedAt: pendingAnalysis.analyzedAt,
        packageFingerprint: pendingFingerprint,
        package: clone(parsed.package),
        validation: clone(parsed.validation),
        warnings: clone(parsed.warnings),
        analysis: clone(pendingAnalysis)
      };
      var directResult = clone(pendingAnalysis);
      directResult.ok = true;
      return directResult;
    }
    if (!session.package) {
      return {
        ok: false,
        errors: [{
          code: 'NO_SESSION',
          path: 'session',
          message: 'Import a valid calibration package before analysis.'
        }],
        warnings: []
      };
    }
    var result;
    try {
      result = analyzeValidatedPackage(
        session.package,
        session.validation,
        session.packageFingerprint,
        session.warnings
      );
    } catch (error) {
      return {
        ok: false,
        errors: [{
          code: 'ANALYSIS',
          path: 'analysis',
          message: 'Calibration analysis could not be completed.'
        }],
        warnings: clone(session.warnings)
      };
    }
    session.status = 'analyzed';
    session.analyzedAt = result.analyzedAt;
    session.analysis = clone(result);
    var publicResult = clone(result);
    publicResult.ok = true;
    return publicResult;
  }

  function getSession() {
    return clone(session);
  }

  /*
   * Deliberately narrow bridge for the independent-validation engine. It
   * evaluates the already-frozen candidate without refitting or mutating the
   * calibration session. The result is diagnostic until the qualification
   * module has applied its separate protocol, scope, and approval gates.
   */
  function evaluateFrozenCandidateForValidation(chemistry, coolingRateCPerS) {
    if (!session.analysis || !session.package || session.status !== 'analyzed') {
      return {
        ok: false,
        errors: [{
          code: 'NO_FROZEN_CANDIDATE',
          path: 'candidate',
          message: 'Analyze a calibration candidate before independent validation.'
        }],
        warnings: []
      };
    }
    var errors = [];
    var warnings = [];
    var target = session.analysis.target;
    var generic = predictGeneric(
      chemistry,
      Number(coolingRateCPerS),
      target,
      'validationRow',
      errors,
      warnings
    );
    if (generic == null || errors.length) {
      return boundedResult({ ok: false, errors: errors, warnings: warnings });
    }
    var definition = TARGETS[target];
    var candidate = generic + session.analysis.correction.value;
    return boundedResult({
      ok: true,
      target: target,
      unit: session.analysis.actualUnit,
      genericUnit: session.analysis.genericUnit,
      genericValue: generic,
      candidateValue: candidate,
      physicalOutputRange: {
        min: definition.actualMin,
        max: definition.actualMax,
        valid: candidate >= definition.actualMin && candidate <= definition.actualMax
      },
      candidateModelFingerprint: session.analysis.modelFingerprint,
      trainingFingerprint: session.analysis.trainingFingerprint,
      scopeFingerprint: session.analysis.scopeFingerprint,
      errors: errors,
      warnings: warnings
    });
  }

  function clear() {
    if (session.package && Array.isArray(session.package.rows)) {
      session.package.rows.length = 0;
    }
    if (session.analysis && Array.isArray(session.analysis.comparisons)) {
      session.analysis.comparisons.length = 0;
    }
    if (session.analysis && session.analysis.monitoring &&
      Array.isArray(session.analysis.monitoring.points)) {
      session.analysis.monitoring.points.length = 0;
    }
    session = freshSession();
    return auditSummary();
  }

  function safeSpecSummary(specContext) {
    if (!specContext) return null;
    return {
      schemaVersion: specContext.schemaVersion,
      specBody: specContext.specBody,
      gradeKey: specContext.gradeKey,
      displayName: specContext.displayName,
      specEdition: specContext.specEdition,
      psl: specContext.psl,
      category: specContext.category,
      applicableForm: specContext.applicableForm,
      verification: {
        verified: Boolean(specContext.verification &&
          specContext.verification.lastVerifiedBy &&
          specContext.verification.lastVerifiedDate),
        lastVerifiedDate: specContext.verification ?
          specContext.verification.lastVerifiedDate : null
      },
      use: 'traceability-only'
    };
  }

  function auditSummary() {
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
        id: pkg.id,
        revision: pkg.revision,
        title: pkg.title,
        sourceReference: pkg.sourceReference,
        measurementMethod: pkg.measurementMethod,
        site: pkg.site,
        line: pkg.line,
        processRoute: pkg.processRoute,
        productFamily: pkg.productFamily,
        thicknessMinMm: pkg.thicknessMinMm,
        thicknessMaxMm: pkg.thicknessMaxMm,
        measurementLocation: pkg.measurementLocation,
        measurementBasis: pkg.measurementBasis,
        coolingRateDefinition: pkg.coolingRateDefinition,
        coolingRateLocation: pkg.coolingRateLocation,
        scopeFingerprint: pkg.scopeFingerprint,
        scope: scopeRecord(pkg),
        groupBy: pkg.groupBy,
        target: pkg.target,
        specContext: safeSpecSummary(pkg.specContext)
      } : null,
      dataSummary: session.validation ? {
        rowCount: session.validation.rowCount,
        roleCounts: clone(session.validation.roleCounts),
        groupCounts: clone(session.validation.groupCounts),
        groupsDisjoint: session.validation.groupsDisjoint,
        monitoringLaterThanReferenceVerified:
          session.validation.monitoringChronologyVerified,
        monitoringChronologyVerified: analysis
          ? analysis.monitoring.chronologyVerified
          : session.validation.monitoringChronologyVerified,
        validationKind: session.validation.validationKind,
        split: clone(session.validation.split)
      } : null,
      model: analysis ? {
        modelFingerprint: analysis.modelFingerprint,
        trainingFingerprint: analysis.trainingFingerprint,
        target: analysis.target,
        unit: analysis.unit,
        genericUnit: analysis.genericUnit,
        actualMeasurementBasis: analysis.actualMeasurementBasis,
        actualUnit: analysis.actualUnit,
        scopeFingerprint: analysis.scopeFingerprint,
        validationKind: analysis.validationKind,
        split: clone(analysis.split),
        correction: clone(analysis.correction),
        metrics: clone(analysis.metrics),
        monitoring: {
          status: analysis.monitoring.status,
          n: analysis.monitoring.n,
          nRows: analysis.monitoring.nRows,
          nGroups: analysis.monitoring.nGroups,
          lambda: analysis.monitoring.lambda,
          limitSigma: analysis.monitoring.limitSigma,
          initialization: analysis.monitoring.initialization,
          chronologyVerified: analysis.monitoring.chronologyVerified,
          tiedGroupTimestamps:
            analysis.monitoring.tiedGroupTimestamps,
          ewmaAvailable: analysis.monitoring.ewmaAvailable,
          ewmaSuppressedReason:
            analysis.monitoring.ewmaSuppressedReason,
          groupTimestampDefinition:
            analysis.monitoring.groupTimestampDefinition,
          groupTimestampTiePolicy:
            analysis.monitoring.groupTimestampTiePolicy,
          baselineGroups: analysis.monitoring.baselineGroups,
          baselineLimited: analysis.monitoring.baselineLimited,
          baselineGroupSize: analysis.monitoring.baselineGroupSize,
          monitoringGroupSize: analysis.monitoring.monitoringGroupSize,
          subgroupSizeCompatible:
            analysis.monitoring.subgroupSizeCompatible,
          unequalCalibrationGroupSizes:
            analysis.monitoring.unequalCalibrationGroupSizes,
          unequalMonitoringGroupSizes:
            analysis.monitoring.unequalMonitoringGroupSizes,
          baselineResidualSd: analysis.monitoring.baselineResidualSd,
          numericPrecisionFloor:
            analysis.monitoring.numericPrecisionFloor,
          residualLimits: clone(analysis.monitoring.residualLimits),
          ewmaLimits: clone(analysis.monitoring.ewmaLimits),
          triggerCount: analysis.monitoring.triggerCount,
          observedScreeningTrigger:
            analysis.monitoring.observedScreeningTrigger,
          reasons: clone(analysis.monitoring.reasons)
        },
        governance: clone(analysis.governance)
      } : null,
      warnings: analysis ? clone(analysis.warnings) : clone(session.warnings),
      privacy: {
        rawRowsPersisted: false,
        filenamesPersisted: false,
        groupIdentifiersPersisted: false,
        heatOrBatchIdentifiersIncluded: false,
        storage: 'module session memory only'
      }
    });
  }

  function template(format) {
    var value = {
      schemaVersion: CONTRACT_VERSION,
      id: 'plant-property-calibration-v1',
      revision: '1.0.0',
      title: 'Plant property calibration candidate',
      sourceReference: 'Controlled source reference',
      measurementMethod: 'Qualified measurement method and revision',
      site: 'Plant site',
      line: 'Heat-treatment line',
      processRoute: 'Documented process route',
      productFamily: 'Documented product family',
      thicknessMinMm: 8,
      thicknessMaxMm: 25,
      measurementLocation: 'Quarter-thickness and quarter-width',
      measurementBasis: 'Vickers HV10 (10 kgf load) per qualified procedure',
      coolingRateDefinition: 'Effective model cooling rate reported in °C/s per controlled plant method; not automatically equivalent to the Process Data 800–500 °C rate',
      coolingRateLocation: 'Quarter-thickness thermocouple location aligned to test sample',
      groupBy: 'heat',
      target: 'hardness-hv',
      specContext: null,
      rows: []
    };
    if (String(format || 'json').toLowerCase() !== 'csv') return clone(value);
    return [
      '# schemaVersion: ' + value.schemaVersion,
      '# id: ' + value.id,
      '# revision: ' + value.revision,
      '# title: ' + value.title,
      '# sourceReference: ' + value.sourceReference,
      '# measurementMethod: ' + value.measurementMethod,
      '# site: ' + value.site,
      '# line: ' + value.line,
      '# processRoute: ' + value.processRoute,
      '# productFamily: ' + value.productFamily,
      '# thicknessMinMm: ' + value.thicknessMinMm,
      '# thicknessMaxMm: ' + value.thicknessMaxMm,
      '# measurementLocation: ' + value.measurementLocation,
      '# measurementBasis: ' + value.measurementBasis,
      '# coolingRateDefinition: ' + value.coolingRateDefinition,
      '# coolingRateLocation: ' + value.coolingRateLocation,
      '# groupBy: ' + value.groupBy,
      '# target: ' + value.target,
      'recordId,role,heatId,batchId,C,Mn,Si,Ni,Cr,Mo,V,Cu,B,coolingRateCPerS,actualValue,timestamp'
    ].join('\n');
  }

  function demoChemistry(carbon, manganese) {
    return {
      C: carbon,
      Mn: manganese,
      Si: 0.22,
      Ni: 0.08,
      Cr: 0.12,
      Mo: 0.03,
      V: 0.01,
      Cu: 0.1,
      B: 0.0002
    };
  }

  function demoActual(chemistry, rate, offset) {
    var localErrors = [];
    var prediction = predictGeneric(chemistry, rate, 'hardness-hv',
      'demo', localErrors, []);
    return prediction == null ? 250 + offset : prediction + offset;
  }

  function demo(format) {
    var definitions = [
      ['CAL-001', 'calibration', 'H-C01', 0.18, 0.75, 4, 12, '2026-01-10T12:00:00Z'],
      ['CAL-002', 'calibration', 'H-C01', 0.19, 0.76, 6, 10, '2026-01-11T12:00:00Z'],
      ['CAL-003', 'calibration', 'H-C02', 0.22, 0.82, 8, 11, '2026-01-15T12:00:00Z'],
      ['CAL-004', 'calibration', 'H-C02', 0.23, 0.84, 10, 13, '2026-01-16T12:00:00Z'],
      ['CAL-005', 'calibration', 'H-C03', 0.27, 0.9, 12, 9, '2026-01-20T12:00:00Z'],
      ['CAL-006', 'calibration', 'H-C03', 0.28, 0.92, 15, 11, '2026-01-21T12:00:00Z'],
      ['VAL-001', 'validation', 'H-V01', 0.2, 0.78, 7, 10, '2026-02-05T12:00:00Z'],
      ['VAL-002', 'validation', 'H-V01', 0.21, 0.8, 9, 12, '2026-02-06T12:00:00Z'],
      ['VAL-003', 'validation', 'H-V02', 0.25, 0.88, 11, 9, '2026-02-10T12:00:00Z'],
      ['VAL-004', 'validation', 'H-V02', 0.26, 0.89, 13, 11, '2026-02-11T12:00:00Z'],
      ['MON-001A', 'monitoring', 'H-M01', 0.24, 0.86, 10, 12, '2026-03-01T12:00:00Z'],
      ['MON-001B', 'monitoring', 'H-M01', 0.24, 0.86, 10, 12, '2026-03-02T12:00:00Z'],
      ['MON-002A', 'monitoring', 'H-M02', 0.24, 0.87, 10, 28, '2026-03-08T12:00:00Z'],
      ['MON-002B', 'monitoring', 'H-M02', 0.24, 0.87, 10, 28, '2026-03-09T12:00:00Z']
    ];
    var value = {
      schemaVersion: CONTRACT_VERSION,
      id: 'spx-demo-hardness-calibration',
      revision: '1.0.0',
      title: 'Synthetic hardness calibration demonstration',
      sourceReference: 'Bundled synthetic demonstration — not plant evidence',
      measurementMethod: 'Synthetic values derived for workflow demonstration',
      site: 'Synthetic demonstration site',
      line: 'Synthetic heat-treatment line',
      processRoute: 'Synthetic austenitize and quench route',
      productFamily: 'Synthetic low-alloy plate',
      thicknessMinMm: 10,
      thicknessMaxMm: 20,
      measurementLocation: 'Synthetic quarter-thickness and quarter-width',
      measurementBasis: 'Vickers HV10 (10 kgf load) synthetic demonstration basis',
      coolingRateDefinition: 'Synthetic effective model cooling rate reported in °C/s; not a Process Data 800–500 °C derivation',
      coolingRateLocation: 'Synthetic quarter-thickness thermocouple location',
      groupBy: 'heat',
      target: 'hardness-hv',
      specContext: null,
      rows: definitions.map(function (item) {
        var chemistry = demoChemistry(item[3], item[4]);
        return {
          recordId: item[0],
          role: item[1],
          heatId: item[2],
          batchId: null,
          chemistry: chemistry,
          coolingRateCPerS: item[5],
          actualValue: demoActual(chemistry, item[5], item[6]),
          timestamp: item[7]
        };
      })
    };
    if (String(format || 'json').toLowerCase() !== 'csv') return clone(value);
    var lines = [
      '# schemaVersion: ' + value.schemaVersion,
      '# id: ' + value.id,
      '# revision: ' + value.revision,
      '# title: ' + value.title,
      '# sourceReference: ' + value.sourceReference,
      '# measurementMethod: ' + value.measurementMethod,
      '# site: ' + value.site,
      '# line: ' + value.line,
      '# processRoute: ' + value.processRoute,
      '# productFamily: ' + value.productFamily,
      '# thicknessMinMm: ' + value.thicknessMinMm,
      '# thicknessMaxMm: ' + value.thicknessMaxMm,
      '# measurementLocation: ' + value.measurementLocation,
      '# measurementBasis: ' + value.measurementBasis,
      '# coolingRateDefinition: ' + value.coolingRateDefinition,
      '# coolingRateLocation: ' + value.coolingRateLocation,
      '# groupBy: ' + value.groupBy,
      '# target: ' + value.target,
      'recordId,role,heatId,batchId,C,Mn,Si,Ni,Cr,Mo,V,Cu,B,coolingRateCPerS,actualValue,timestamp'
    ];
    value.rows.forEach(function (row) {
      lines.push([
        row.recordId, row.role, row.heatId, '',
        row.chemistry.C, row.chemistry.Mn, row.chemistry.Si,
        row.chemistry.Ni, row.chemistry.Cr, row.chemistry.Mo,
        row.chemistry.V, row.chemistry.Cu, row.chemistry.B,
        row.coolingRateCPerS, row.actualValue, row.timestamp
      ].join(','));
    });
    return lines.join('\n');
  }

  var publicTargets = {};
  Object.keys(TARGETS).forEach(function (key) {
    publicTargets[key] = {
      label: TARGETS[key].label,
      unit: TARGETS[key].unit,
      genericProperty: TARGETS[key].property
    };
  });

  var api = {
    contractVersion: CONTRACT_VERSION,
    fingerprintMeaning: 'Deterministic change detector; not a security signature.',
    targets: clone(publicTargets),
    limits: {
      maxImportBytes: MAX_IMPORT_BYTES,
      maxRows: MAX_ROWS,
      maxColumns: MAX_COLUMNS,
      maxCellCharacters: MAX_CELL_CHARS,
      maxDiagnostics: MAX_DIAGNOSTICS
    },
    parse: parse,
    parseCsv: parseCsv,
    parseJson: parseJson,
    importPackage: importPackage,
    analyze: analyze,
    getSession: getSession,
    clear: clear,
    template: template,
    demo: demo,
    audit: auditSummary,
    fingerprint: fingerprint,
    evaluateFrozenCandidateForValidation: evaluateFrozenCandidateForValidation
  };
  api['import'] = importPackage;
  Object.freeze(api.targets);
  Object.freeze(api.limits);
  Object.freeze(api);
  window.__SPX.calibration = api;
})();
