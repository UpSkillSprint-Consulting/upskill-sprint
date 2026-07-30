'use strict';

const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'test-bank-formulas.js');
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`Could not find patch target: ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`Patch target is not unique: ${label}`);
  source = source.slice(0, first) + after + source.slice(first + before.length);
}

replaceOnce(
`  function compactQuestionList(numbers) {
    if (!numbers.length) return '';
    var shown = numbers.slice(0, 12).map(function (number) { return 'Q' + number; });
    if (numbers.length > shown.length) shown.push('+' + (numbers.length - shown.length) + ' more');
    return shown.join(', ');
  }
`,
`  function compactQuestionList(numbers) {
    if (!numbers.length) return '';
    var shown = numbers.slice(0, 12).map(function (number) { return 'Q' + number; });
    if (numbers.length > shown.length) shown.push('+' + (numbers.length - shown.length) + ' more');
    return shown.join(', ');
  }

  function questionSearchLabel(numbers) {
    return numbers.map(function (number) { return 'Q' + number + ' Question ' + number; }).join(' ');
  }
`,
'full question-number search labels'
);

replaceOnce(
`      var label = used.length ? compactQuestionList(used) : '';
      return formulaSearchText(item, label).indexOf(q) >= 0;
`,
`      var label = used.length ? questionSearchLabel(used) : '';
      return formulaSearchText(item, label).indexOf(q) >= 0;
`,
'question search coverage'
);

replaceOnce(
`    var sectionCards = sectionFormulas.map(function (item) {
      var used = usedByQuestions(item, context);
      if (!include(item, used)) return '';
`,
`    var sectionCards = sectionFormulas.map(function (item) {
      if (!q && currentIds[item.id]) return '';
      var used = usedByQuestions(item, context);
      if (!include(item, used)) return '';
`,
'deduplicate current formulas'
);

replaceOnce(
`    if (sectionCards) {
      html += '<section class="tb-refgroup"><h4>' + (q ? 'Matching formulas in ' : 'All formulas for ') + esc(sectionName) + '</h4>' + sectionCards + '</section>';
    } else {
      html += '<p class="tb-refempty">No formula matches “' + esc(query || '') + '” in ' + esc(sectionName) + '.</p>';
    }
`,
`    if (sectionCards) {
      html += '<section class="tb-refgroup"><h4>' + (q ? 'Matching formulas in ' : 'Other formulas for ') + esc(sectionName) + '</h4>' + sectionCards + '</section>';
    } else if (q) {
      html += '<p class="tb-refempty">No formula matches “' + esc(query || '') + '” in ' + esc(sectionName) + '.</p>';
    } else {
      html += '<p class="tb-refempty">No additional formulas are required for this section.</p>';
    }
`,
'accurate remaining-formula heading and empty state'
);

replaceOnce(
`  function initialize(attempt) {
    attempt = attempt || 0;
    if (!window.__TB || !document.getElementById('tb-toollayer')) {
      if (attempt < 80) window.setTimeout(function () { initialize(attempt + 1); }, 25);
      return;
    }
    ensureStyles();
    installFallbackRefs();
    wireEvents();
  }
`,
`  var initialized = false;
  function initialize(attempt) {
    attempt = attempt || 0;
    if (initialized) return;
    if (!window.__TB) {
      if (attempt < 400) window.setTimeout(function () { initialize(attempt + 1); }, 25);
      return;
    }
    initialized = true;
    ensureStyles();
    installFallbackRefs();
    wireEvents();
  }
`,
'lazy tool-layer initialization defect'
);

fs.writeFileSync(file, source);
console.log('CQE formula pane hardening patch applied.');
